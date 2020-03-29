import React from 'react';
import Message from '../Message/Message.js';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Messages.css';

const Messages = ({ messages, name }) => (

        <ScrollToBottom className="messages">
            {messages.map((message, index) => <div key={index}><Message message={message} name={name}/></div>)}
        </ScrollToBottom>
    
)

export default Messages;