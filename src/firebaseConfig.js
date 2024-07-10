// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBL8wBPPehhNV7I9k3YNvYHpK070Pjoc-0",
    authDomain: "siskae-c93d0.firebaseapp.com",
    projectId: "siskae-c93d0",
    storageBucket: "siskae-c93d0.appspot.com",
    messagingSenderId: "496306815328",
    appId: "1:496306815328:web:be2128498a35aa8d341e05"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup };
