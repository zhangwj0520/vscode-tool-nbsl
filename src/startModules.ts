import * as vscode from 'vscode';
// import { updateLaunchBarItem } from './launchApp';

const window = vscode.window;

export const quickPickItems = [
    {
        label: '完整启动',
        detail: '启动所有模块',
        description: 'all',
    },
    {
        label: '商圈',
        detail: '启动商圈规划模块',
        description: 'maps',
    },
    {
        label: '账号',
        detail: '启动账号权限模块',
        description: 'user',
    },
];

export function onSelectStartModules() {
    let misSetting = vscode.workspace.getConfiguration('NBSL-Tools');
    let modulesSetting: string = misSetting.get('modules');

    let quickPick = window.createQuickPick();

    quickPick.canSelectMany = true;

    quickPick.items = quickPickItems;

    let currentSelectedItems = quickPick.items.filter((item) =>
        modulesSetting.includes(item.description),
    );
    quickPick.selectedItems = currentSelectedItems;

    quickPick.onDidChangeSelection(function(items) {
        if (
            // 选中所有
            !currentSelectedItems.some((item) => item.description === 'all') &&
            items.some((item) => item.description === 'all')
        ) {
            quickPick.selectedItems = quickPickItems.slice(0, 1);
        } else if (
            currentSelectedItems.some((item) => item.description === 'all') &&
            items.some((item) => item.description === 'all') &&
            items.length > 1
        ) {
            quickPick.selectedItems = items.filter((item) => item.description !== 'all');
        }

        currentSelectedItems = items;
    });
    quickPick.onDidAccept(function() {
        let misSetting = vscode.workspace.getConfiguration('NBSL-Tools');
        const selectedItems = quickPick.selectedItems;
        const selectedModules = selectedItems
            .map((selectedItem) => selectedItem.description)
            .join(',');
        misSetting.update('modules', selectedModules, true);

        quickPick.dispose();
    });

    quickPick.show();
}
