import { UserRanking, User } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'rankings';
const CURRENT_USER_KEY = 'disney_current_user';

// --- FIRESTORE (Shared Data) ---

// Listen to real-time updates for all rankings
export const subscribeToRankings = (callback: (rankings: UserRanking[]) => void) => {
  const q = collection(db, COLLECTION_NAME);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const rankings: UserRanking[] = [];
    querySnapshot.forEach((doc) => {
      rankings.push(doc.data() as UserRanking);
    });
    callback(rankings);
  });

  return unsubscribe;
};

// Fetch single user ranking once
export const getUserRanking = async (userName: string): Promise<UserRanking | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserRanking;
    }
    return null;
  } catch (e) {
    console.error("Error fetching user ranking:", e);
    return null;
  }
};

// Save ranking to cloud
export const saveRanking = async (ranking: UserRanking) => {
  try {
    // Use userName as the document ID to ensure one entry per user
    await setDoc(doc(db, COLLECTION_NAME, ranking.userName), ranking);
  } catch (e) {
    console.error("Error saving ranking:", e);
    throw e;
  }
};

// ADMIN: Reset all rankings
export const resetAllRankings = async () => {
  try {
    const q = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(q);
    // Delete all documents in parallel
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (e) {
    console.error("Error resetting rankings:", e);
    throw e;
  }
};

// --- LOCAL STORAGE (Session Auth Only) ---

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const loginUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};