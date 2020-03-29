import React, { useState, useEffect } from 'react';
// helps with retrieving data from url
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

let socket;



const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        
        socket.emit('join', { name, room }, () => {

        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            // adds new message to messages array
            setMessages([...messages, message]);
        })
    }, [messages])

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);
    
    return (
        <div>
            <div>
                <input value={message} onChange={(event) => setMessage(event.target.value)} 
                    onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null}/>
            </div>
        </div>
    )
}

export default Chat;