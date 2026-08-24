import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMfSj2ZnNXOotONfDMsKHnAMEHE3hAlHM",
  authDomain: "doctor-7bf04.firebaseapp.com",
  projectId: "doctor-7bf04",
  storageBucket: "doctor-7bf04.firebasestorage.app",
  messagingSenderId: "65042320568",
  appId: "1:65042320568:web:1aaac21f7b5516c5d1b84d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUsers() {
  console.log("Fetching users from Firestore...");
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  if (snapshot.empty) {
    console.log("No user records found in Firestore.");
    return;
  }
  
  console.log("\n--- Registered Users & Permissions ---");
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`Email: ${doc.id}`);
    console.log(`Permissions:`, JSON.stringify(data.permissions, null, 2));
    console.log(`------------------------------------`);
  });
}

checkUsers().catch(console.error);
