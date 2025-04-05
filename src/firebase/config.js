import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
// Replace this with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkh83CmzcwjpiJi9DsfQ1eU-EFPTwCmxQ",
    authDomain: "e-learning-1c6c2.firebaseapp.com",
    projectId: "e-learning-1c6c2",
    storageBucket: "e-learning-1c6c2.firebasestorage.app",
    messagingSenderId: "588621944296",
    appId: "1:588621944296:web:ad287cf4511872430e005d",
    measurementId: "G-862TLKR3DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db, storage };
