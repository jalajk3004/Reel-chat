"use client"
import SearchPost from "@/components/searchpost/page";
import { useState, useEffect } from "react";
import multer from "multer";

export default function Home() {
  const [posts, setPosts] = useState<string[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reels/fetchallposts', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          const post = data.files.filter((file: string) => file.endsWith('.jpg')|| file.endsWith('.png')||file.endsWith('.jpeg'));
          setPosts(post);
        } else {
          console.error("Failed to fetch posts");
          setError("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <SearchPost />
      <section className="p-5 justify-center mx-3 gap-2 columns-4 overflow-y-scroll">
        {posts.map((post, index) => (
          <div key={index} className="m-0 grid mb-3 break-inside-avoid grid-rows-1 relative group">
            <img
              className="w-full block transition duration-300 ease-in-out rounded-lg"
              src={post} // Using the fetched URL as the image source
              alt={`Post ${index + 1}`}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-300 ease-in-out rounded-lg"></div>
            <button className="absolute inset-0 flex items-end justify-end text-white opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              Button Text
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
