import Link from 'next/link';
import React from 'react';
import { CiSquarePlus } from 'react-icons/ci';

const SearchForm: React.FC = () => {
  return (
    <section className="w-full bg-gray-900 ">
      <div className=" bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <form className="relative flex-grow flex items-center">
            <input
              type="search"
              id="default-search"
              className="block w-2/3 p-3 pl-10 text-sm text-gray-900 rounded-l-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search genre..."
              required
            />
            <button
              type="submit"
              className=" top-auto  flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white rounded-r-md text-sm px-3 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-5 h-5 text-gray-200 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </form>
          <button
            type="button"
            className="ml-4 flex items-center justify-center  text-white rounded-lg text-sm px-2 py-2 "
          >
            <Link href='/addpost'><span className="text-3xl font-bold hover:text-gray-400"><CiSquarePlus /></span></Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchForm;
