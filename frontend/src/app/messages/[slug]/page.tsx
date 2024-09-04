"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import SearchUser from '@/components/searchuser/page';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:9000', {
    reconnectionAttempts: 5,
    transports: ['websocket'],
    autoConnect: false
});

const Page = () => {
    const [messages, setMessages] = useState<{ text: string, isSender: boolean }[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');
    const [userWantToTalk, setUserWantToTalk] = useState<string>('');

    const sendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (messageInput.trim() === "") return;

        const messageData = { text: messageInput, isSender: true };
        
        socket.emit("user-message", messageInput);
        setMessages(prevMessages => [...prevMessages, messageData]);
        setMessageInput("");
    };

    const handleUserSelect = (user: string) => {
        setUserWantToTalk(user);
    };

    useEffect(() => {
        socket.connect();
    
        socket.on("connect", () => {
            console.log("Connected with Socket ID:", socket.id);
            socket.emit("welcome");
        });

        socket.on("message", (data: { text: string, socketId: string }) => {
            if (data.socketId !== socket.id) { // Only add messages not from the current client
                setMessages(prevMessages => [...prevMessages, { text: data.text, isSender: false }]);
            }
        });

        socket.on("disconnect", (reason) => {
            console.warn("Disconnected:", reason);
        });
    
        socket.on("connect_error", (err) => {
            console.error("Connection Error:", err.message);
        });
    
        return () => {
            socket.off("message");
            socket.disconnect();
        };
    }, []);

    return (
        <section className='flex flex-col h-screen bg-gray-100'>
            <SearchUser onUserSelect={handleUserSelect} />

            <div className='flex-1 p-4 overflow-auto'>
                <div className='flex flex-col space-y-4'>
                    {messages.map((msg, index) => (
                        <div key={index} 
                             className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                            <div 
                                className={`p-3 rounded-full shadow-md 
                                            ${msg.isSender ? 'bg-blue-200' : 'bg-white'}
                                            ${msg.isSender ? 'text-right' : 'text-left'}
                                            max-w-xs`}
                            >
                                <div className='text-gray-600'>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-white p-4 border-t flex items-center'>
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className='flex-1 p-2 border rounded-lg'
                />
                <button
                    onClick={sendMessage}
                    className='ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
                >
                    Send
                </button>
            </div>
        </section>
    );
};

export default Page;
