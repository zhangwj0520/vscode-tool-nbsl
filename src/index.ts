import * as vscode from 'vscode';
import { addLaunchButton } from './launchApp';
import { addToolButton } from './tools';
import { addShareButton, addRssButton } from './teamshare';
import { ROOTPATH } from './utils';

export function activate(context: vscode.ExtensionContext) {
  // if (/.*[\/\\]fe-area-platform[\/\\]?$/.test(ROOTPATH)) {
  //     addLaunchButton(context);
  //     addToolButton(context);
  //   }else{
  //     addLaunchButton(context,true);
  //   }

  addLaunchButton(context);
   addToolButton(context);

  addShareButton(context);
  addRssButton(context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
