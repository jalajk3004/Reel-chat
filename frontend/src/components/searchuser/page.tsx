"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from "react-icons/fa";
import { io, Socket } from 'socket.io-client';

interface SearchUserProps {
  onUserSelect: (user: string) => void;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:9000', {
    reconnectionAttempts: 5,
    transports: ['websocket'],
    autoConnect: false
});

const SearchUser: React.FC<SearchUserProps> = ({ onUserSelect }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userWantToTalk, setUserWantToTalk] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername);

    // Connect and register the user
    socket.connect();
    socket.emit('register-user', storedUsername);

    return () => {
      socket.disconnect();
    };
  }, []);

  const searchHandle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.GETUSERNAME || 'http://localhost:3000/api/auth/getusername'}?username=${encodeURIComponent(userWantToTalk)}`, { 
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        if (userWantToTalk) {
          onUserSelect(userWantToTalk);
          router.push(`/messages/${userWantToTalk}`);
        }
      } else {
        console.error('Failed to fetch user data');
        router.push('/accountnotfound');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className='bg-white shadow-md p-4 flex items-center justify-between border-b'>
      <div className='text-xl font-semibold text-gray-700'>
        {username ? username : 'No username found'}
      </div>

      <div className='flex items-center space-x-2 w-full max-w-xl'>
        <input 
          type="text" 
          placeholder="Search..." 
          value={userWantToTalk} 
          onChange={(e) => setUserWantToTalk(e.target.value)} 
          className='p-3 border rounded-full flex-1'
        />
        <button 
          onClick={searchHandle} 
          className='p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition'
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
