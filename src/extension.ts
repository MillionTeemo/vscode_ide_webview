// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { eventNames } from 'process';
import * as vscode from 'vscode';
import express from 'express';

import * as http from 'http';
import * as path from 'path';


let server: http.Server | undefined;

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "new4" is now active!');

	let disposable = vscode.commands.registerCommand('new4.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from new4!');
	});


	
	context.subscriptions.push(disposable);



	let pranle  = vscode.window.createWebviewPanel('A','A',vscode.ViewColumn.One,{
		enableScripts:true
	});
	
	let pranle2 = vscode.window.createWebviewPanel('B','B',vscode.ViewColumn.Two,{
		enableScripts:true
	});
	const scriptUri = pranle.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'index.js'));
	const scriptUri2= pranle2.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'index.js'));

	pranle.webview.onDidReceiveMessage(message=>{
			console.log('A=========',message.text);
            pranle2.webview.postMessage({id:'A',text:message.text});
            if(message.text==="A:calc"){
                const panellocal = createPanelLocal( context,'calc', 'calc', 'calc',getLocalWebViewContent('calc','CM'));
                context.subscriptions.push(panellocal);
             }
	});


	pranle2.webview.onDidReceiveMessage(message=>{
				console.log('B=========',message.text);
                pranle.webview.postMessage({id:'B',text:message.text});
                if(message.text==="B:calc"){
                    const panellocal = createPanelLocal( context,'calc', 'calc', 'calc',getLocalWebViewContent('calc','CM'));
                    context.subscriptions.push(panellocal);
                 }
	});
	pranle.webview.html = getHtml(scriptUri,'A');
	pranle2.webview.html = getHtml(scriptUri2,'B');
	context.subscriptions.push(pranle,pranle2);


//--------------------------------------------------------------------------------------------------

	
}

function getHtml(scriptUri:vscode.Uri,value:string){
	
	
	return `
	<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>chat window</title>
    <style>
        /* This add CSS style */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        #chat-container {
            width: 300px;
            height: 400px;
            border: 1px solid #ccc;
            display: flex;
            flex-direction: column;
        }
        #message {
            margin: 5px 0;
        }
        #message.sender {
            text-align: right;
        
        }
        #message.receiver {
            text-align: left;
        
        }
        #chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            display: flex;
            flex-direction: row;
        }
        #send-form {
            display: flex;
            padding: 5px;
        }
        #message-input {
            flex: 1;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px;
        }
        #send-button {
            background-color: #4CAF50;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
            padding: 5px 10px;
        }
        .message {
            margin: 5px;
            padding: 5px;
            border-radius: 5px;
        }
        .received {
            background-color: #f1f1f1;
            float: left;
        }
        .sent {
            background-color: #4CAF50;
            color: white;
            float: right;
        }
    </style>
</head>
<body>
    <div  id="chat-id">${value}</div>
    <div id="chat-container" style="overflow-y: scroll; height: 400px;">
        <div id="chat-messages"></div>
        <form id="send-form">
            <input type="text" id="message-input" placeholder="input message...">
            <button type="submit"  id="send-button">send</button>
        </form>
    </div>
    <!-- This add JavaScript codes -->
    <script src="${scriptUri}">
    </script>
</body>
</html>
	`;
}

















function createPanelLocal(context:vscode.ExtensionContext,title: string, viewTitle: string,childpath:string,html: string): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(title, viewTitle, vscode.ViewColumn.Active, // Editor column to show the webview panel in
    {
      retainContextWhenHidden: true,
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath,childpath ))]
    });
   panel.webview.html = html
   console.log("===================",context.extensionPath)
   const paoku_path = context.extensionPath+`\${childpath}`
   serveHTMLProject(context.extensionPath);
 return panel;
}

function getLocalWebViewContent(path: string, filename: string): string {
    // Return the URL of the server to load in the webview
    return `<iframe src="http://localhost:3000/${path}/${filename}.html" width="800" height="800"></iframe>`;
}
function serveHTMLProject(extensionPath: string) {

    const app = express();
    
    const port = 3000; // Choose a suitable port
  
    app.use(express.static(extensionPath));
  
    // Start the server
    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
  }


// This method is called when your extension is deactivated
export function deactivate() {}
