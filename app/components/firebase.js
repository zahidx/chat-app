import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
let analytics;

// Only initialize analytics in the client
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Fetch all users from Firestore (no image fetching)
const fetchUsers = async () => {
  try {
    const usersCollection = collection(db, "users"); // Reference Firestore collection
    const snapshot = await getDocs(usersCollection);

    const usersList = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data?.displayName || "Unnamed User", 
      };
    });

    return usersList;
  } catch (error) {
    console.error("🔥 Error fetching users:", error.message);
    throw new Error("Failed to fetch users"); // Ensure calling functions handle errors properly
  }
};

export { app, db, auth, onAuthStateChanged, fetchUsers, storage };
