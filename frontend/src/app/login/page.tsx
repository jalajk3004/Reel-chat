'use client';
import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [credential, setCredential] = useState({ username: '', password: '' });
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      try {
        const response = await fetch(process.env.LOGIN || 'http://localhost:3000/api/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credential.username,
          password: credential.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the error message from the response
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const json = await response.json();
      sessionStorage.setItem('token', json.token); // Save the token
      sessionStorage.setItem('username', credential.username);// Save the username
      setUsername(json.username);

      toast.success('Successfully Logged In!', {
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

      setTimeout(() => {
        router.push('/'); // Redirect to the home page
      }, 1000);

    } catch (error) {
      toast.error('Invalid Credentials or Failed to Fetch User Details!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error('Error during login:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };
  

  return (
    <section className="text-zinc-900 bg-white body-font overflow-x-hidden">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <ToastContainer />
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <img src='https://static.cdninstagram.com/images/instagram/xig/homepage/phones/home-phones.png?__makehaste_cache_breaker=HOgRclNOosk' alt="Phones" />
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-white border-1 bg-opacity-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-black text-lg font-bold title-font mb-5 flex justify-center">SyncWave</h2>

          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-zinc-700">Username</label>
              <input
                type="username"
                id="username"
                name="username"
                value={credential.username}
                onChange={handleChange}
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-zinc-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-zinc-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credential.password}
                onChange={handleChange}
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-zinc-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500  hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-white py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
            >
              Log In
            </button>
          </form>
          <p className="text-xs mt-3 flex justify-center">
            Create New Account <Link href="/signup" className="text-indigo-500 underline ml-1 hover:text-indigo-200">Signup?</Link> Or <Link href="/forget" className="text-indigo-500 underline ml-1 hover:text-indigo-200">Forget Password?</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
