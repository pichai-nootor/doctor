import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

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

async function migrate() {
  console.log("Starting migration...");
  const appointmentsRef = collection(db, 'appointments');
  const snapshot = await getDocs(appointmentsRef);
  
  let updatedCount = 0;
  
  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    let needsUpdate = false;
    
    // Check requiredDocuments
    if (data.requiredDocuments) {
      const newDocs = data.requiredDocuments.map(docStr => {
        if (typeof docStr === 'string' && docStr.includes("**ทิ้งหน้าที่ 3 ไป**")) {
          needsUpdate = true;
          return docStr.replace("**ทิ้งหน้าที่ 3 ไป**", "__ทิ้งหน้าที่ 3 ไป__");
        }
        return docStr;
      });
      if (needsUpdate) data.requiredDocuments = newDocs;
    }
    
    // Check preCathOrders
    if (data.preCathOrders) {
      const newOrders = data.preCathOrders.map(order => {
        if (typeof order === 'string' && order.includes("**ทิ้งหน้าที่ 3 ไป**")) {
          needsUpdate = true;
          return order.replace("**ทิ้งหน้าที่ 3 ไป**", "__ทิ้งหน้าที่ 3 ไป__");
        }
        return order;
      });
      if (needsUpdate) data.preCathOrders = newOrders;
    }
    
    if (needsUpdate) {
      console.log(`Updating document ${docSnapshot.id}...`);
      await updateDoc(doc(db, 'appointments', docSnapshot.id), data);
      updatedCount++;
    }
  }
  
  console.log(`Migration finished. Updated ${updatedCount} documents.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
