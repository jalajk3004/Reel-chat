"use client";
import React, { useEffect, useState } from 'react';
import { IoIosSettings } from "react-icons/io";
import { useRouter } from 'next/navigation'; // Use `next/navigation` for client-side navigation

const Page = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to manage dialog visibility
  const [isRotated, setIsRotated] = useState<boolean>(false); // State to manage rotation
  const router = useRouter(); // Initialize the router for navigation

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageSrc(base64String);
        localStorage.setItem('uploadedImage', base64String); // Save the image in localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Fetch the username from localStorage
    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername);

    // Fetch the image from localStorage
    const storedImage = sessionStorage.getItem('uploadedImage');
    if (storedImage) {
      setImageSrc(storedImage);
    }
  }, []);

  const toggleDialog = () => {
    setIsDialogOpen(prevState => !prevState);
    setIsRotated(prevState => !prevState); // Toggle rotation state
  };

  const logout = () => {
    // Clear local storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('uploadedImage');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <section className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
      <div className='relative w-full max-w-4xl flex flex-col items-center justify-center bg-white shadow-md rounded-lg p-8'>
        <div className='flex flex-col items-center'>
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Uploaded" 
              className='h-32 w-32 rounded-full object-cover mb-4 cursor-pointer border-4 border-gray-200'
              onClick={() => document.getElementById('fileInput')?.click()} 
            />
          ) : (
            <button 
              className='bg-slate-600 h-32 w-32 rounded-full mb-4 flex items-center justify-center text-white text-center font-semibold hover:bg-slate-700 transition'
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Upload your pic
            </button>
          )}
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className='text-gray-800 mt-4 flex items-center font-bold text-3xl'>
          {username ? username : 'No username found'}
          <button 
            className={`ml-2 relative transition-transform duration-300 ${isRotated ? 'rotate-45' : ''}`}
            onClick={toggleDialog}
          >
            <IoIosSettings />
          </button>

          {isDialogOpen && (
            <div className='flex flex-col absolute left-1/2 text-base transform -translate-x-1/2 mt-36 bg-white border border-gray-300 rounded-md shadow-lg p-4'>
              <button onClick={logout} className='text-gray-700 hover:bg-slate-200 rounded-md px-2'>LogOut</button>
              <button onClick={toggleDialog} className='mt-2 text-sm text-blue-500 hover:underline'>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
