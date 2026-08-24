// setup_permissions.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Replace these with your actual Firebase config values
// You can find them in your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ----------------------------------------------------------------------
// ⚠️ EDIT THIS PART: Put the exact email you use to login to Firebase
const TARGET_EMAIL = "salapoulzaa@gmail.com"; 
// ----------------------------------------------------------------------

async function setupPermissions() {
  if (!TARGET_EMAIL || TARGET_EMAIL === "your.email@example.com") {
    console.error("❌ ERROR: Please edit TARGET_EMAIL in this file before running.");
    process.exit(1);
  }

  try {
    console.log(`Setting up permissions for: ${TARGET_EMAIL}...`);
    
    // Create/Update document in 'users' collection with the email as ID
    const userRef = doc(db, 'users', TARGET_EMAIL);
    
    await setDoc(userRef, {
      email: TARGET_EMAIL,
      permissions: {
        dashboard: true,
        cathLab: true,
        appointments: true,
        postCath: true,
        masterData: true // Grants access to Medications & Dosages
      },
      updatedAt: new Date().toISOString()
    }, { merge: true }); // Merge ensures we don't accidentally wipe out other fields if they exist

    console.log("✅ Successfully created/updated permissions in Firestore!");
    console.log("-> You can now refresh your web app. All menus should be visible.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error setting up permissions:", error);
    process.exit(1);
  }
}

setupPermissions();
