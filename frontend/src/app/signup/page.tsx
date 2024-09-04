'use client';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const SignUp: React.FC = () => {
  const [credential, setCredential] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleSign = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, email, password } = credential;
      const response = await fetch("http://localhost:3000/api/auth/register" || process.env.SIGNIN, { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the error message from the response
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const json = await response.json();
      toast.success('Account Created!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log(json);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      toast.error('Fill all the fields correctly!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error('Error during signup:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  return (
    <section className="text-zinc-900 bg-white body-font overflow-x-hidden">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
        <Image 
            src='https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png?__makehaste_cache_breaker=HOgRclNOosk'
            alt="Phones"
            width={500} 
            height={500} 
            />
        </div>
        <form onSubmit={handleSign} className="lg:w-2/6 md:w-1/2 bg-white bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-black text-lg font-bold title-font mb-5 flex justify-center">SyncWave</h2>
          <div className="relative mb-4">
            <label htmlFor="username" className="leading-7 text-sm text-zinc-800">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credential.username}
              onChange={handleChange}
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-zinc-800">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credential.email}
              onChange={handleChange}
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-zinc-800">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credential.password}
              onChange={handleChange}
              className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-black py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button type="submit" className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Sign Up</button>
          <p className="text-xs mt-3 flex justify-center">Already have an account? <Link href='/login' className="text-indigo-500 underline ml-1 hover:text-indigo-200">Log In</Link></p>
        </form>
      </div>
      <ToastContainer /> {/* Ensure ToastContainer is rendered here */}
    </section>
  );
};

export default SignUp;
