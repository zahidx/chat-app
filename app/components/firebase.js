import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firestore
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase configuration (as before)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);  // Only initialize analytics in the client-side
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Fetch all users from Firestore
const fetchUsers = async () => {
  try {
    const usersCollection = collection(db, "users"); // Firestore collection
    const snapshot = await getDocs(usersCollection);
    const usersList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data.displayName || "Unnamed User",  // Ensure `displayName` exists
        photoURL: data.photoURL || "default-profile-pic.jpg",  // Default photo if none exists
      };
    });
    return usersList;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export { app, db, auth, onAuthStateChanged, fetchUsers, storage }; // Export storage
