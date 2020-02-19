import * as vscode from 'vscode';
import { onSelectProxy, onCustomProxy } from './proxyConfig';
import { onSelectStartModules } from './startModules';

const window = vscode.window;

let toolBarItem: vscode.StatusBarItem;
export function addToolButton(context: vscode.ExtensionContext) {
    toolBarItem = window.createStatusBarItem(vscode.StatusBarAlignment.Right, 101);
    toolBarItem.text = `$(tools) 工具`;
    toolBarItem.command = 'nbslTools.selectTools';
    toolBarItem.show();

    context.subscriptions.push(toolBarItem);
    context.subscriptions.push(
        vscode.commands.registerCommand('nbslTools.selectTools', onSelectTools),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('nbslTools.selectProxy', onSelectProxy),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('nbslTools.customProxy', onCustomProxy),
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('nbslTools.selectStartModules', onSelectStartModules),
    );
}

function onSelectTools() {
    let quickPick = window.createQuickPick();

    quickPick.items = [
        {
            label: '$(package) 选择默认启动模块',
            detail: 'modules',
        },
        {
            label: '$(device-desktop) 选择后端虚拟机',
            detail: 'proxy',
        },
    ];
    quickPick.onDidAccept(function() {
        let selectedItem = quickPick.activeItems[0];
        if (selectedItem) {
            if (selectedItem.detail === 'format') {
                // onManualFormat();
                quickPick.dispose();
            } else if (selectedItem.detail === 'proxy') {
                onSelectProxy();
                quickPick.dispose();
            } else if (selectedItem.detail === 'modules') {
                onSelectStartModules();
                quickPick.dispose();
            }
        }
    });

    quickPick.show();
}
