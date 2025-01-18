import { useState, useEffect, useRef } from 'react';
import { useRoom } from '../../multiplayer/roomContext';

interface Message {
    sender: string;
    senderName: string;
    message: string;
}

const ChatUI = () => {
    const { room } = useRoom();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const messageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom of the messages
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Listen for incoming messages from the server
    useEffect(() => {
        if (!room) return;

        const onChat = (data: Message) => {
            console.log('Received chat message:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        room.onMessage('chat', onChat);

        return () => {
            (room as any).offMessage('chat', onChat);
        };
    }, [room]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle sending the message
    const sendMessage = () => {
        if (!room || !inputMessage.trim()) return;

        const message = inputMessage.trim();

        // Send the message to the server
        room.send('message', { message });

        // Add it to the local message list with the sender as "you"
        setMessages((prevMessages) => [...prevMessages, { sender: 'you', senderName: 'You', message }]);
        setInputMessage('');
    };

    return (
        <div className="chat-container" onClick={(e) => e.stopPropagation()}>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong style={{ color: msg.sender === 'system' ? 'red' : msg.sender === 'observer' ? 'yellow' : '#007bff', }}>
                            {msg.sender}:
                        </strong>{' '}
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    ref={messageInputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatUI;
