'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { storage, db } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const SModal = ({ isOpen, onClose, userId }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // Upload progress tracking

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      setImage(file);
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

    const storageRef = ref(storage, `profile_images/${userId}/profile.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload Error:', error);
        setError('Failed to upload image. Please try again.');
        toast.error('Failed to upload image. Please try again.');
        setLoading(false);
      },
      async () => {
        try {
          const imageUrl = await getDownloadURL(storageRef);
          await updateDoc(doc(db, 'users', userId), { profileImage: imageUrl });

          toast.success('Image uploaded successfully!');
          setImage(null);
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
      }
    );
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-96 max-w-md border dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Upload Profile Picture
        </h2>

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" 
          aria-describedby="image-error"
          disabled={loading}
        />

        {progress > 0 && loading && (
          <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Uploading: {Math.round(progress)}%
          </div>
        )}

        {error && (
          <p id="image-error" role="alert" className="text-red-500 text-sm mt-2">
            {error}
          </p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSkip}
            className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-all"
            disabled={loading}
            aria-label="Skip image upload"
          >
            {loading ? 'Skipping...' : 'Skip'}
          </button>
          <button
            onClick={handleUpload}
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center transition-all"
            disabled={loading}
            aria-label="Upload image"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" loading={loading} /> : 'Upload'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SModal;
