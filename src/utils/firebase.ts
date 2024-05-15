import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";

// The name of the database collection in Firebase
export const DB_COLLECTION = "games";

/**
 * Firebase configuration
 * API key can be public: https://firebase.google.com/docs/projects/api-keys
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

/**
 * Update existing game in Firebase
 *
 * @param gameId id of existing game
 * @param data (partial) game data
 * @returns Promise with gamedata
 */
export const updateGameInDatabase = async (
  gameId: string,
  data: Partial<Game>
) => await updateDoc(doc(db, DB_COLLECTION, gameId), data);

/**
 * Create new game in Firebase
 *
 * @param data (partial) game data
 * @returns Promise with generated id
 */
export const createGameInDatabase = async (data: Partial<Game>) =>
  await addDoc(collection(db, DB_COLLECTION), data).then((docRef) => docRef.id);
