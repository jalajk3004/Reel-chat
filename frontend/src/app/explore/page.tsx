'use client';
import React, { useEffect, useState, useRef } from 'react';

const Explore = () => {
  const [posts, setPosts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentReel, setCurrentReel] = useState(0);
  const isScrolling = useRef<boolean>(false); // To prevent multiple scrolls

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reels/fetchallposts', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          const mp4Posts = data.files.filter((file: string) => file.endsWith('.mp4') || file.endsWith('.MOV'));
          setPosts(mp4Posts);
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
  }, []);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (isScrolling.current) return; // Prevent handling if already scrolling

      if (event.deltaY > 0 && currentReel < posts.length - 1) {
        isScrolling.current = true;
        setCurrentReel((prev) => prev + 1);
      } else if (event.deltaY < 0 && currentReel > 0) {
        isScrolling.current = true;
        setCurrentReel((prev) => prev - 1);
      }

      setTimeout(() => {
        isScrolling.current = false; // Allow scrolling again after some time
      }, 500); // Adjust this value for debounce
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, [currentReel, posts]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentReel) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }, [currentReel]);

  return (
    <section className="flex justify-center items-center w-full h-screen bg-black">
      <div
        ref={containerRef}
        className="relative w-1/3 h-4/5 flex justify-center items-center overflow-hidden bg-white"
      >
        {loading ? (
          <p className="text-white">Loading posts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          <div
            className="absolute inset-0 transition-transform duration-500"
            style={{ transform: `translateY(-${currentReel * 100}%)` }}
          >
            {posts.map((post, index) => (
              <div key={index} className="flex justify-center items-center h-full w-full bg-black">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-contain border rounded"
                  playsInline
                >
                  <source src={post} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white">No Reels available.</p>
        )}
      </div>
    </section>
  );
};

export default Explore;
