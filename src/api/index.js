import {getApps,getApp,initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import images from "../json/image.json";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APPID
  };
  const app_length=getApps().length>0;
  const app = app_length?getApp():initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const imagesCollection = collection(db, "images");

  export const feedImages = async () => {
    // DELETE ALL EXISTING DOCS
    const querySnapshot = await getDocs(imagesCollection);
    querySnapshot.forEach(async (image) => {
      await deleteDoc(doc(db, "images", image.id));
    });
    // ADD NEW DOCS
    images.forEach(async (image) => {
      const docRef = await doc(imagesCollection);
      await setDoc(docRef, { ...image, id: docRef.id, name: image.name.toUpperCase() });
    });
  };


  export const getImages = async () => {
    let querySnapshot = await getDocs(imagesCollection);
  
    // Convert the query to a json array.
    let result = [];
    querySnapshot.forEach(async (image) => {
      await result.push(image.data());
    });
    console.log({ result });
    return result;
  };

  export const getImageById = async ({ queryKey }) => {
    const [id] = queryKey;
    const docRef = await doc(db, "images", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  export const getImagesByName = async ({ queryKey }) => {
    const [name] = queryKey;
    const q = await query(
      imagesCollection,
      where("name", "==", name.toUpperCase())
    );
    let querySnapshot = await getDocs(q);
    // Convert the query to a json array.
    let result = [];
    querySnapshot.forEach(async (name) => {
      await result.push(name.data());
    });
    return result;
  };