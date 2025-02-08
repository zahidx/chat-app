'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from './firebase'; // Assuming db is already configured
import { updateDoc, doc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion'; // For animation

const SModal = ({ isOpen, onClose, userId }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.warn('Please select an image.');
      return;
    }

    if (!userId) {
      toast.error('User ID missing. Please sign in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Store the base64 image string in Firestore
      await updateDoc(doc(db, 'users', userId), {
        profileImage: imagePreview, // Store the base64 string
      });

      toast.success('Profile uploaded successfully!');
      setImage(null);
      setImagePreview(null);
      onClose();

      setTimeout(() => {
        window.location.href = '/chatroom';
      }, 2000);
    } catch (error) {
      console.error('Firestore Update Error:', error);
      setError('Failed to update profile image in database.');
      toast.error('Failed to update profile image.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!userId) {
      toast.error('User ID missing. Please sign in again.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), { profileImage: null });
      toast.success('Signup complete, no image uploaded.');
      onClose();

      setTimeout(() => {
        window.location.href = '/chatroom';
      }, 2000);
    } catch (error) {
      console.error('Skip Error:', error);
      setError('Failed to skip image upload.');
      toast.error('Failed to skip image upload.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-900 p-12 rounded-2xl shadow-2xl w-full md:w-1/2 lg:w-3/4 xl:w-2/3 max-w-4xl border dark:border-gray-700 relative flex flex-col items-center" 
        initial={{ scale: 0.8 }} 
        animate={{ scale: 1 }} 
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Upload Profile Picture
        </h2>
  
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          aria-describedby="image-error"
          disabled={loading}
        />
  
        {imagePreview && (
          <div className="mt-6 flex justify-center w-1/2 overflow-auto max-h-60">
            <img
              src={imagePreview}  // Display the base64 string as the image
              alt="Preview"
              className="max-w-full h-auto rounded-xl shadow-xl border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-all"
            />
          </div>
        )}
  
        {progress > 0 && loading && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Uploading: {Math.round(progress)}%
          </div>
        )}
  
        {error && (
          <p id="image-error" role="alert" className="text-red-500 text-sm mt-4">
            {error}
          </p>
        )}
  
        <div className="flex justify-between mt-8 w-full pt-36">
          <button
            onClick={handleUpload}
            className=" ml-8 absolute bottom-4 left-4 w-40 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center transition-all"
            disabled={loading}
            aria-label="Upload image"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" loading={loading} /> : 'Upload'}
          </button>
        </div>
  
        {/* Skip button positioned at the bottom-right corner */}
        <button
          onClick={handleSkip}
          className="absolute bottom-4 right-4 w-40 mr-8 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-all"
          disabled={loading}
          aria-label="Skip image upload"
        >
          {loading ? 'Skipping...' : 'Skip'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SModal;