'use client';

import React, { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { AiOutlineMessage } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Set username from localStorage
    } else {
      const fetchUser = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        try {
          const response = await fetch('http://localhost:3000/api/auth/getuser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          setUsername(data.username);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      };

      fetchUser();
    }
  }, [router]);

  if (!username) {
    return null; // Hide Navbar if the user is not logged in
  }

  return (
    <section className='h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white'>
      <div className='font-extrabold text-2xl px-8 py-6 transition-transform transform hover:scale-105'>
        <Link href='/'>
          <h1 className='tracking-wider'>SyncWave</h1>
        </Link>
      </div>
      <div className='p-8'>
        <ul className='space-y-6'>
          <Link href='/messages'>
            <li className='flex items-center space-x-3 transition-transform transform hover:scale-105 hover:bg-red-700 hover:shadow-lg p-3 rounded-lg'>
              <AiOutlineMessage  /> <span className='text-lg'>Messages</span>
            </li>
          </Link>
          <Link href='/explore'>
            <li className='flex items-center space-x-3 transition-transform transform hover:scale-105 hover:bg-red-700 hover:shadow-lg p-3 rounded-lg'>
              <FaMagnifyingGlass  /> <span className='text-lg'>Explore</span>
            </li>
          </Link>
          <Link href={`/profile/${username}`}>
            <li className='flex items-center space-x-3 transition-transform transform hover:scale-105 hover:bg-red-700 hover:shadow-lg p-3 rounded-lg'>
              <CgProfile /> <span className='text-lg'>Profile</span>
            </li>
          </Link>
        </ul>
      </div>
    </section>
  );
};

export default Navbar;