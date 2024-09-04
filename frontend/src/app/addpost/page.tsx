"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';


const AddPost: React.FC = () => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(event.target.value);
  };

  const handlePost = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('post', selectedFile);
    formData.append('caption', caption);

    try {
      const response = await fetch('http://localhost:3000/api/reels/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      router.push("/");
      // Handle the response as needed (e.g., clear form, show a success message, etc.)
    } catch (error) {
      console.error('Error uploading post:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-5 text-center">Upload Your Post</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="file-upload">
          Select Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {image && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
          <img src={image as string} alt="Preview" className="w-full h-auto rounded-lg" />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="caption">
          Caption
        </label>
        <input
          id="caption"
          type="text"
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption..."
          className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        type="button"
        onClick={handlePost}
      >
        Post
      </button>
    </div>
  );
};

export default AddPost;
