

(function(){

    const vscode = acquireVsCodeApi();
    const cahtid = document.getElementById('chat-id');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    const elementId = cahtid.textContent;

    function addMessage(message, sender) {

        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = 'message ' + (sender === 'me' ? 'sent' : 'received');
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendButton.addEventListener('click', (event) => {
        event.preventDefault();
        const message = elementId +':'+messageInput.value.trim() ;
        if (message) {
            vscode.postMessage({ id:elementId ,text: message });
            addMessage(message, 'me');
            messageInput.value = '';
        }
    });
    window.addEventListener('message', event => {
        const message = event.data;
        if(message.id===elementId){
            addMessage(message.text, 'me');
        }else{
            addMessage(message.text, 'other');
        }
      
    });


}());