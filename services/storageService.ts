import { UserRanking, User, AttractionConfig, AppConfig } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'rankings';
const CONFIG_COLLECTION = 'attractions_config';
const APP_SETTINGS_COLLECTION = 'app_settings';
const CURRENT_USER_KEY = 'disney_current_user';

// --- RANKINGS ---
export const subscribeToRankings = (callback: (rankings: UserRanking[]) => void) => {
  const q = collection(db, COLLECTION_NAME);
  return onSnapshot(q, (snapshot) => {
    const rankings: UserRanking[] = [];
    snapshot.forEach((doc) => rankings.push(doc.data() as UserRanking));
    callback(rankings);
  });
};

export const getUserRanking = async (userName: string): Promise<UserRanking | null> => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, userName));
    return docSnap.exists() ? (docSnap.data() as UserRanking) : null;
  } catch (e) { console.error(e); return null; }
};

export const saveRanking = async (ranking: UserRanking) => {
  await setDoc(doc(db, COLLECTION_NAME, ranking.userName), ranking);
};

export const resetAllRankings = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
};

// --- ADMIN CONFIG (IMAGES) ---
export const subscribeToAttractionConfigs = (callback: (configs: AttractionConfig[]) => void) => {
  return onSnapshot(collection(db, CONFIG_COLLECTION), (snapshot) => {
    const configs: AttractionConfig[] = [];
    snapshot.forEach((doc) => configs.push(doc.data() as AttractionConfig));
    callback(configs);
  });
};

export const saveAttractionConfig = async (config: AttractionConfig) => {
  await setDoc(doc(db, CONFIG_COLLECTION, config.attractionId), config);
};

// --- APP SETTINGS (NOM & LOGO) ---
export const subscribeToAppConfig = (callback: (config: AppConfig | null) => void) => {
  return onSnapshot(doc(db, APP_SETTINGS_COLLECTION, 'general'), (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as AppConfig) : null);
  });
};

export const saveAppConfig = async (config: AppConfig) => {
  await setDoc(doc(db, APP_SETTINGS_COLLECTION, 'general'), config);
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