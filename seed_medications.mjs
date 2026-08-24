import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

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

// รายชื่อยาที่ใช้บ่อยในห้อง Cath Lab
const medications = [
  // Antiplatelets
  { name: "ASA 81 mg" },
  { name: "ASA 300 mg" },
  { name: "Clopidogrel (Plavix) 75 mg" },
  { name: "Ticagrelor (बrilinta) 90 mg" },
  { name: "Prasugrel (Efient) 10 mg" },

  // Anticoagulants
  { name: "Warfarin" },
  { name: "Apixaban (Eliquis) 2.5 mg" },
  { name: "Apixaban (Eliquis) 5 mg" },
  { name: "Rivaroxaban (Xarelto) 10 mg" },
  { name: "Rivaroxaban (Xarelto) 15 mg" },
  { name: "Rivaroxaban (Xarelto) 20 mg" },
  { name: "Dabigatran (Pradaxa) 110 mg" },
  { name: "Dabigatran (Pradaxa) 150 mg" },
  { name: "Edoxaban (Lixiana) 30 mg" },
  { name: "Edoxaban (Lixiana) 60 mg" },

  // Beta-blockers
  { name: "Metoprolol (Betaloc) 25 mg" },
  { name: "Metoprolol (Betaloc) 50 mg" },
  { name: "Metoprolol (Betaloc ZOK) 47.5 mg" },
  { name: "Metoprolol (Betaloc ZOK) 95 mg" },
  { name: "Bisoprolol 1.25 mg" },
  { name: "Bisoprolol 2.5 mg" },
  { name: "Bisoprolol 5 mg" },
  { name: "Bisoprolol 10 mg" },
  { name: "Carvedilol 3.125 mg" },
  { name: "Carvedilol 6.25 mg" },
  { name: "Carvedilol 12.5 mg" },
  { name: "Atenolol 25 mg" },
  { name: "Atenolol 50 mg" },
  { name: "Atenolol 100 mg" },

  // ACEi / ARB
  { name: "Enalapril 5 mg" },
  { name: "Enalapril 10 mg" },
  { name: "Ramipril 2.5 mg" },
  { name: "Ramipril 5 mg" },
  { name: "Ramipril 10 mg" },
  { name: "Lisinopril 5 mg" },
  { name: "Lisinopril 10 mg" },
  { name: "Perindopril 4 mg" },
  { name: "Perindopril 8 mg" },
  { name: "Losartan 50 mg" },
  { name: "Losartan 100 mg" },
  { name: "Valsartan 80 mg" },
  { name: "Valsartan 160 mg" },
  { name: "Candesartan 8 mg" },
  { name: "Candesartan 16 mg" },
  { name: "Telmisartan 40 mg" },
  { name: "Telmisartan 80 mg" },
  { name: "Sacubitril/Valsartan (Entresto) 49/51 mg" },
  { name: "Sacubitril/Valsartan (Entresto) 97/103 mg" },

  // Statins
  { name: "Atorvastatin 10 mg" },
  { name: "Atorvastatin 20 mg" },
  { name: "Atorvastatin 40 mg" },
  { name: "Atorvastatin 80 mg" },
  { name: "Rosuvastatin 5 mg" },
  { name: "Rosuvastatin 10 mg" },
  { name: "Rosuvastatin 20 mg" },
  { name: "Rosuvastatin 40 mg" },
  { name: "Simvastatin 20 mg" },
  { name: "Simvastatin 40 mg" },

  // Nitrates
  { name: "Isosorbide mononitrate (Imdur) 30 mg" },
  { name: "Isosorbide mononitrate (Imdur) 60 mg" },
  { name: "Isosorbide dinitrate (Isordil) 5 mg" },
  { name: "Isosorbide dinitrate (Isordil) 10 mg" },

  // Calcium Channel Blockers
  { name: "Amlodipine 2.5 mg" },
  { name: "Amlodipine 5 mg" },
  { name: "Amlodipine 10 mg" },
  { name: "Diltiazem 30 mg" },
  { name: "Diltiazem 60 mg" },
  { name: "Nifedipine (Adalat) 10 mg" },
  { name: "Nifedipine CR 30 mg" },
  { name: "Nifedipine CR 60 mg" },
  { name: "Felodipine 5 mg" },
  { name: "Felodipine 10 mg" },
  { name: "Verapamil 40 mg" },
  { name: "Verapamil 80 mg" },

  // Diuretics
  { name: "Furosemide 20 mg" },
  { name: "Furosemide 40 mg" },
  { name: "Spironolactone 25 mg" },
  { name: "Spironolactone 50 mg" },
  { name: "Hydrochlorothiazide 12.5 mg" },
  { name: "Hydrochlorothiazide 25 mg" },
  { name: "Eplerenone 25 mg" },
  { name: "Eplerenone 50 mg" },
  { name: "Torsemide 5 mg" },
  { name: "Torsemide 10 mg" },

  // Antidiabetics (SGLT2i / GLP-1)
  { name: "Empagliflozin (Jardiance) 10 mg" },
  { name: "Empagliflozin (Jardiance) 25 mg" },
  { name: "Dapagliflozin (Forxiga) 5 mg" },
  { name: "Dapagliflozin (Forxiga) 10 mg" },
  { name: "Canagliflozin (Invokana) 100 mg" },
  { name: "Canagliflozin (Invokana) 300 mg" },
  { name: "Semaglutide (Ozempic) 0.25 mg/dose" },
  { name: "Semaglutide (Ozempic) 0.5 mg/dose" },
  { name: "Semaglutide (Ozempic) 1 mg/dose" },

  // Antidiabetics (oral)
  { name: "Metformin 500 mg" },
  { name: "Metformin 850 mg" },
  { name: "Metformin 1000 mg" },
  { name: "Sitagliptin (Januvia) 100 mg" },
  { name: "Vildagliptin (Galvus) 50 mg" },

  // Others
  { name: "Digoxin 0.0625 mg" },
  { name: "Digoxin 0.125 mg" },
  { name: "Digoxin 0.25 mg" },
  { name: "Ivabradine (Coralan) 5 mg" },
  { name: "Ivabradine (Coralan) 7.5 mg" },
  { name: "Allopurinol 100 mg" },
  { name: "Allopurinol 300 mg" },
  { name: "Febuxostat 40 mg" },
  { name: "Febuxostat 80 mg" },
  { name: "Omeprazole 20 mg" },
  { name: "Omeprazole 40 mg" },
  { name: "Pantoprazole 40 mg" },
  { name: "Esomeprazole (Nexium) 40 mg" },
  { name: "Colchicine 0.6 mg" },
  { name: "Colchicine 1 mg" },
  { name: "Ezetimibe (Ezetrol) 10 mg" },
  { name: "Evolocumab (Repatha) 140 mg" },
  { name: "Alirocumab (Praluent) 75 mg" },
];

async function seed() {
  console.log("Starting medication seed...");
  const medicationsRef = collection(db, 'medications');

  // Check existing docs to avoid duplicates
  const snapshot = await getDocs(medicationsRef);
  const existingNames = new Set(snapshot.docs.map(d => d.data().name));

  let added = 0;
  let skipped = 0;

  for (const med of medications) {
    if (existingNames.has(med.name)) {
      console.log(`  SKIP (already exists): ${med.name}`);
      skipped++;
    } else {
      await addDoc(medicationsRef, med);
      console.log(`  ADDED: ${med.name}`);
      added++;
    }
  }

  console.log(`\nDone! Added: ${added}, Skipped (duplicates): ${skipped}`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
