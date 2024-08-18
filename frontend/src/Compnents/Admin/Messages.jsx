import React, { useState, useContext } from 'react';
import { MessagesContext } from './FetchMessage';
import './Messages.css';

const Messages = () => {
    const { messages } = useContext(MessagesContext);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleClick = (message) => {
        setSelectedMessage(message);
        setIsReplying(false);
    };

    const handleClose = () => {
        setSelectedMessage(null);
        setIsReplying(false);
    };

    const handleReply = () => {
        setIsReplying(true);
    };

    const handleSendReply = async () => {
        const replyData = {
            text: replyText,
            email: selectedMessage.email,
            name: selectedMessage.name
        };

        try {
            await fetch('http://localhost:5000/reply-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(replyData),
            });
            setReplyText('');
            setIsReplying(false);
            alert('Reply sent successfully');
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    return (
        <div className="messages-container">
            {selectedMessage ? (
                <div className="message-details">
                    <button className="close-button" onClick={handleClose}>X</button>
                    <div className="message-header">
                        <span className="message-sender">{selectedMessage.name}</span>
                        <span className="message-time">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="message-title">{selectedMessage.title}</div>
                    <div className="message-email">Email: {selectedMessage.email}</div>
                    <div className="message-description">{selectedMessage.description}</div>
                    <button className="reply-button" onClick={handleReply}>
                        <i className="fas fa-reply"></i> Reply
                    </button>
                    {isReplying && (
                        <div className="reply-editor">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your reply here..."
                            />
                            <button className="send-button" onClick={handleSendReply}>Send</button>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div className="message-box" key={index} onClick={() => handleClick(message)}>
                                <div className="message-header">
                                    <span className="message-sender">{message.name}</span>
                                    <span className="message-time">{new Date(message.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="message-title">{message.title}</div>
                                <button className="reply-button" onClick={(e) => {
                                    e.stopPropagation();
                                    handleReply();
                                }}>
                                    <i className="fas fa-reply"></i> Reply
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No messages available</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Messages;
