const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "gen-lang-client-0808314661",
  appId: "1:130097924697:web:1db0397522832c8184bf48",
  apiKey: "AIzaSyBCY_6GgPP3OHKlOCsu35wo0RlnJO2mBT4",
  authDomain: "gen-lang-client-0808314661.firebaseapp.com",
  storageBucket: "gen-lang-client-0808314661.firebasestorage.app",
  messagingSenderId: "130097924697"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-renderrequestdes-c3daf66d-9103-4695-859e-067e9b4fccec");

async function main() {
  const querySnapshot = await getDocs(collection(db, "consultations"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());
  });
  console.log(`Total records: ${querySnapshot.size}`);
}
main().catch(console.error);
