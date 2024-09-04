"use client";
import React, { useState } from 'react';
import SearchUser from '@/components/searchuser/page';
import { MdOutlineAccountCircle } from "react-icons/md";
const Page = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleUserSelect = (user: string) => {
    setSelectedUser(user);
    console.log(`User selected: ${user}`);
    // Implement any additional logic when a user is selected
  };

  return (
    <section className='flex flex-col h-screen bg-gray-100'>
      <SearchUser onUserSelect={handleUserSelect} />

      <div className='flex-1 p-4 overflow-auto'>
        <div className='flex justify-center items-center text-center'>
          <div className='font-bold text-9xl '>
          <MdOutlineAccountCircle />
          </div>

          <div className='p-4 justify-center items-center text-center'>
            <h1 className='font-bold text-2xl'>User Not exist</h1>
            <h3 className='font-normal'>Search Correctly</h3>
            <p>Account Not Found</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
