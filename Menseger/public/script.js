document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const responseSendBtn = document.getElementById('sendResponseBtn');
    const messageInput = document.getElementById('message');
    const responseMessageInput = document.getElementById('responseMessage');
    const messageHistory = document.getElementById('messageHistory');

    function updateMessageHistory() {
        fetch('http://localhost:3000/messages')
            .then(response => response.json())
            .then(data => {
                messageHistory.innerHTML = '';
                data.forEach(msg => {
                    const messageBubble = document.createElement('div');
                    messageBubble.classList.add('message');
                    messageBubble.classList.add(msg.sender === 'sender' ? 'sent-message' : 'received-message');
                    messageBubble.innerHTML = `
                        ${msg.message}
                        <div class="timestamp">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    `;
                    messageHistory.appendChild(messageBubble);
                });
                // Scroll to the bottom of the message history
                messageHistory.scrollTop = messageHistory.scrollHeight;
            })
            .catch(error => console.error('Error:', error));
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, sender: 'sender' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageInput.value = '';
                    updateMessageHistory();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function sendResponse() {
        const responseMessage = responseMessageInput.value.trim();
        if (responseMessage) {
            fetch('http://localhost:3000/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: responseMessage, sender: 'receiver' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    responseMessageInput.value = '';
                    updateMessageHistory();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevents newline on Enter
                sendMessage();
            }
        });
    }

    if (responseSendBtn) {
        responseSendBtn.addEventListener('click', sendResponse);
        responseMessageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevents newline on Enter
                sendResponse();
            }
        });
    }

    // Update message history when page loads and periodically
    updateMessageHistory();
    setInterval(updateMessageHistory, 5000); // Update message history every 5 seconds
});
