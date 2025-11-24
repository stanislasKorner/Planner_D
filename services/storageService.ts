import { UserRanking, User, AttractionConfig, AppConfig } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'rankings';
const CONFIG_COLLECTION = 'attractions_config';
const APP_SETTINGS_COLLECTION = 'app_settings'; // Nouvelle collection
const CURRENT_USER_KEY = 'disney_current_user';

// --- RANKINGS ---

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

export const getUserRanking = async (userName: string): Promise<UserRanking | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data() as UserRanking;
    return null;
  } catch (e) {
    console.error("Error fetching user ranking:", e);
    return null;
  }
};

export const saveRanking = async (ranking: UserRanking) => {
  try {
    await setDoc(doc(db, COLLECTION_NAME, ranking.userName), ranking);
  } catch (e) {
    console.error("Error saving ranking:", e);
    throw e;
  }
};

export const resetAllRankings = async () => {
  try {
    const q = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (e) {
    console.error("Error resetting rankings:", e);
    throw e;
  }
};

// --- ADMIN CONFIG (IMAGES ATTRACTIONS) ---

export const subscribeToAttractionConfigs = (callback: (configs: AttractionConfig[]) => void) => {
  const q = collection(db, CONFIG_COLLECTION);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const configs: AttractionConfig[] = [];
    querySnapshot.forEach((doc) => {
      configs.push(doc.data() as AttractionConfig);
    });
    callback(configs);
  });
  return unsubscribe;
};

export const saveAttractionConfig = async (config: AttractionConfig) => {
  try {
    await setDoc(doc(db, CONFIG_COLLECTION, config.attractionId), config);
  } catch (e) {
    console.error("Error saving attraction config:", e);
    throw e;
  }
};

// --- APP SETTINGS (NOM & LOGO) ---

export const subscribeToAppConfig = (callback: (config: AppConfig | null) => void) => {
  const docRef = doc(db, APP_SETTINGS_COLLECTION, 'general');
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AppConfig);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
};

export const saveAppConfig = async (config: AppConfig) => {
  try {
    await setDoc(doc(db, APP_SETTINGS_COLLECTION, 'general'), config);
  } catch (e) {
    console.error("Error saving app config:", e);
    throw e;
  }
};

// --- LOCAL STORAGE ---

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