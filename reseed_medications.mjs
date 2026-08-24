import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

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

// ชื่อยาเดียว ไม่มีขนาดยา
const medications = [
  // Antiplatelets
  { name: "ASA" },
  { name: "Clopidogrel" },
  { name: "Ticagrelor" },
  { name: "Prasugrel" },

  // Anticoagulants
  { name: "Warfarin" },
  { name: "Apixaban" },
  { name: "Rivaroxaban" },
  { name: "Dabigatran" },
  { name: "Edoxaban" },
  { name: "Heparin" },
  { name: "Enoxaparin" },

  // Beta-blockers
  { name: "Metoprolol" },
  { name: "Bisoprolol" },
  { name: "Carvedilol" },
  { name: "Atenolol" },
  { name: "Propranolol" },

  // ACEi
  { name: "Enalapril" },
  { name: "Ramipril" },
  { name: "Lisinopril" },
  { name: "Perindopril" },
  { name: "Captopril" },

  // ARB
  { name: "Losartan" },
  { name: "Valsartan" },
  { name: "Candesartan" },
  { name: "Telmisartan" },
  { name: "Irbesartan" },
  { name: "Olmesartan" },

  // ARNI
  { name: "Sacubitril/Valsartan" },

  // Statins
  { name: "Atorvastatin" },
  { name: "Rosuvastatin" },
  { name: "Simvastatin" },
  { name: "Pitavastatin" },
  { name: "Pravastatin" },
  { name: "Lovastatin" },
  { name: "Fluvastatin" },

  // Nitrates
  { name: "Isosorbide mononitrate" },
  { name: "Isosorbide dinitrate" },
  { name: "Nitroglycerin" },

  // Calcium Channel Blockers
  { name: "Amlodipine" },
  { name: "Diltiazem" },
  { name: "Nifedipine" },
  { name: "Felodipine" },
  { name: "Verapamil" },
  { name: "Lercanidipine" },

  // Diuretics
  { name: "Furosemide" },
  { name: "Spironolactone" },
  { name: "Hydrochlorothiazide" },
  { name: "Eplerenone" },
  { name: "Torsemide" },
  { name: "Chlorthalidone" },
  { name: "Indapamide" },

  // SGLT2 inhibitors
  { name: "Empagliflozin" },
  { name: "Dapagliflozin" },
  { name: "Canagliflozin" },

  // GLP-1
  { name: "Semaglutide" },
  { name: "Liraglutide" },
  { name: "Dulaglutide" },

  // Antidiabetics (oral)
  { name: "Metformin" },
  { name: "Sitagliptin" },
  { name: "Vildagliptin" },
  { name: "Saxagliptin" },
  { name: "Glipizide" },
  { name: "Gliclazide" },
  { name: "Glibenclamide" },
  { name: "Pioglitazone" },
  { name: "Acarbose" },

  // Insulin
  { name: "Insulin Glargine" },
  { name: "Insulin Aspart" },
  { name: "Insulin NPH" },
  { name: "Insulin Regular" },

  // Lipid-lowering others
  { name: "Ezetimibe" },
  { name: "Evolocumab" },
  { name: "Alirocumab" },
  { name: "Fenofibrate" },
  { name: "Gemfibrozil" },

  // Heart failure / Cardiac
  { name: "Digoxin" },
  { name: "Ivabradine" },
  { name: "Hydralazine" },
  { name: "Amiodarone" },
  { name: "Dronedarone" },

  // Antihypertensives (other)
  { name: "Doxazosin" },
  { name: "Prazosin" },
  { name: "Clonidine" },
  { name: "Methyldopa" },

  // Gout / Uric acid
  { name: "Allopurinol" },
  { name: "Febuxostat" },
  { name: "Colchicine" },
  { name: "Benzbromarone" },

  // GI / Gastroprotection
  { name: "Omeprazole" },
  { name: "Pantoprazole" },
  { name: "Esomeprazole" },
  { name: "Rabeprazole" },
  { name: "Lansoprazole" },

  // Others
  { name: "Aspirin + Clopidogrel (DAPT)" },
  { name: "Aspirin + Ticagrelor (DAPT)" },
];

async function reseed() {
  console.log("Deleting existing medications...");
  const medicationsRef = collection(db, 'medications');
  const snapshot = await getDocs(medicationsRef);
  
  for (const docSnapshot of snapshot.docs) {
    await deleteDoc(doc(db, 'medications', docSnapshot.id));
    console.log(`  DELETED: ${docSnapshot.data().name}`);
  }

  console.log(`\nDeleted ${snapshot.size} existing medications.\n`);
  console.log("Seeding new medications...");

  let added = 0;
  for (const med of medications) {
    await addDoc(medicationsRef, med);
    console.log(`  ADDED: ${med.name}`);
    added++;
  }

  console.log(`\nDone! Added ${added} medications.`);
  process.exit(0);
}

reseed().catch(err => {
  console.error(err);
  process.exit(1);
});
