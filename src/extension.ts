import * as vscode from 'vscode';

let terminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "free-code-vscode" is now active!');

    let startDisposable = vscode.commands.registerCommand('freecode.start', () => {
        // Just launch the terminal and run free-code. The integrated terminal 
        // will load the user's shell profile (like ~/.bashrc or ~/.zshrc) 
        // which contains the bun/free-code path.
        launchTerminal('free-code');
        vscode.window.showInformationMessage('Launched Free Code in terminal. If it fails, run the "Free Code: Install / Update" command.');
    });

    let installDisposable = vscode.commands.registerCommand('freecode.install', () => {
        const installCmd = 'curl -fsSL https://raw.githubusercontent.com/paoloanzn/free-code/main/install.sh | bash';
        vscode.window.showInformationMessage('Starting free-code installation...');
        launchTerminal(installCmd);
    });

    context.subscriptions.push(startDisposable, installDisposable);
}

function launchTerminal(command: string) {
    if (!terminal || terminal.exitStatus !== undefined) {
        terminal = vscode.window.createTerminal('Free Code');
    }
    terminal.show();
    terminal.sendText(command);
}

export function deactivate() {
    if (terminal) {
        terminal.dispose();
    }
}
