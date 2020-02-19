import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { updateLaunchBarItem } from './launchApp';
import { ROOTPATH } from './utils';

const window = vscode.window;

const CONFIG_FILE = path.join(ROOTPATH, 'fe-area-platform/config/path.js');

const PROXY = {
    'http://10.188.40.96:7300/mock/5e46a13daf8e11668378af44/kfc-area': 'Mock',
    'https://delivery.yumchina.com': 'Online',
    '10.188.60.150:8585': '李晨曦',
    '10.188.60.76:8020': 'QA',
};

interface CurrentProxy {
    currentProxyIP: string
    currentProxyName: string
}

const REG = new RegExp(/[^\/]proxy:['"](.*?)['"]/);
export function getCurrentProxy(): null | CurrentProxy {
    try {
        let fileContent = fs
            .readFileSync(CONFIG_FILE)
            .toString()
            .replace(/[ ]/gm, '');
        let result: null | RegExpExecArray = REG.exec(fileContent);
        let currentProxyIP = result[1];
        let currentProxyName = PROXY[currentProxyIP] || currentProxyIP;
        return {
            currentProxyIP,
            currentProxyName,
        };
    } catch(error) {
        return {
            currentProxyIP: '-',
            currentProxyName: '-',
        };
    }
}
function setCurrentProxy(proxyIP: string) {
    let fileContent = fs
        .readFileSync(CONFIG_FILE)
        .toString()
        .replace(/[ ]/gm, '');
    let result: null | RegExpExecArray;
    let newFileContent: string;
    if ((result = REG.exec(fileContent))) {
        let matched = result[0];
        let currentProxyIP = result[1];
        let replacedMatched = matched.replace(currentProxyIP, proxyIP);
        newFileContent = fileContent.replace(matched, replacedMatched);
    } else {
        newFileContent = fileContent.replace('{', `{\nproxy:'${proxyIP}',`);
    }
    fs.writeFileSync(CONFIG_FILE, newFileContent);
    updateLaunchBarItem();
    return newFileContent;
}

export function onCustomProxy() {
    let inputBox = window.createInputBox();
    inputBox.placeholder = '格式：10.188.60.150:8585';
    inputBox.onDidAccept(function() {
        let value = inputBox.value.replace(' ', '');
        if (/[\d]+\.[\d]+\.[\d]+\.[\d]+:[\d]+/.test(value)) {
            setCurrentProxy(inputBox.value);
            inputBox.dispose();
        } else {
            window.showWarningMessage('请输入正确的虚拟机地址格式');
        }
    });
    inputBox.prompt = '输入要连接的后端虚拟机 IP 及端口号';
    inputBox.show();
}

export function onSelectProxy() {
    let currentProxyIP = getCurrentProxy().currentProxyIP;
    let quickPick = window.createQuickPick();

    let selectedItem: vscode.QuickPickItem;
    let items = [
        {
            label: '$(gear) 自定义',
            detail: 'custom',
        },
    ].concat(
        Object.entries(PROXY).map(([proxyIP, proxyName]) => {
            let item = {
                label: `$(person-filled) ${proxyName}`,
                detail: proxyIP,
            };

            if (proxyIP === currentProxyIP) {
                selectedItem = item;
            }
            return item;
        }),
    );
    quickPick.items = items;
    quickPick.selectedItems = [selectedItem];
    quickPick.activeItems = [selectedItem];
    quickPick.onDidAccept(function() {
        let selectedItem = quickPick.activeItems[0];
        if (selectedItem.detail === 'custom') {
            onCustomProxy();
        } else {
            setCurrentProxy(selectedItem.detail);
        }
        quickPick.dispose();
    });

    quickPick.show();
}
