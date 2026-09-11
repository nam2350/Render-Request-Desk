import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { ConsultationData } from "../types";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "gen-lang-client-0808314661",
  appId: "1:130097924697:web:1db0397522832c8184bf48",
  apiKey: "AIzaSyBCY_6GgPP3OHKlOCsu35wo0RlnJO2mBT4",
  authDomain: "gen-lang-client-0808314661.firebaseapp.com",
  storageBucket: "gen-lang-client-0808314661.firebasestorage.app",
  messagingSenderId: "130097924697"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-renderrequestdes-c3daf66d-9103-4695-859e-067e9b4fccec");

export const saveConsultation = async (data: ConsultationData) => {
  try {
    const docRef = await addDoc(collection(db, "consultations"), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
