import * as vscode from 'vscode';
import { quickPickItems } from './startModules';
import { getCurrentProxy } from './proxyConfig';

const window = vscode.window;

const NPM_TREMINAL_NAME = 'KFC运营平台';

let launchBarItem: vscode.StatusBarItem;
export function addLaunchButton(context: vscode.ExtensionContext,isNornal?:boolean) {
    launchBarItem = window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    updateLaunchBarItem();
    launchBarItem.command = 'nbslTools.launchApp';
    launchBarItem.show();

    vscode.workspace.onDidChangeConfiguration(function (event) {
        if (event.affectsConfiguration('NBSL-Tools.modules')) {
            updateLaunchBarItem();
        }
    });

    context.subscriptions.push(launchBarItem);
    context.subscriptions.push(vscode.commands.registerCommand('nbslTools.launchApp', onLaunchApp));
    if(isNornal){
        launchBarItem.text = `$(rocket) 启动`;
    }
}

function onLaunchApp() {
    let ternimalCommand = 'yarn start';
    let modulesSetting = vscode.workspace.getConfiguration('NBSL-Tools').get('modules');
    if (!(modulesSetting === 'all')) {
        ternimalCommand += ' -- modules=' + modulesSetting;
    }
    let terminal = showTerminal(NPM_TREMINAL_NAME);
    terminal.sendText(ternimalCommand);
}

function showTerminal(terminalName: string) {
    let mainTerminal = window.terminals.filter((terminal) => terminal.name === terminalName)[0];
    if (mainTerminal) {
        mainTerminal.dispose();
    }
    mainTerminal = window.createTerminal(terminalName);
    mainTerminal.show();
    return mainTerminal;
}

export function updateLaunchBarItem(currentSelectedModules?: string) {
    if (!currentSelectedModules) {
        let modulesSetting: string = vscode.workspace.getConfiguration('NBSL-Tools').get('modules');
        currentSelectedModules = quickPickItems
            .filter((item) => modulesSetting.includes(item.description))
            .map((item) => item.label)
            .join(',');
    }
    let currentProxyName = getCurrentProxy().currentProxyName;
    let currentProxyIP = getCurrentProxy().currentProxyIP;
    launchBarItem.text = `$(rocket) 启动(${currentSelectedModules} : ${currentProxyName})`;
    launchBarItem.tooltip = currentProxyIP;
}
