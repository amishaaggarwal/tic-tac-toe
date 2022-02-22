// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase ,ref} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9liUsQHTt-r-__Hl59rxqwV7j5ZWMFfc",
  authDomain: "tic-tac-toe-66d25.firebaseapp.com",
  databaseURL:
    "https://tic-tac-toe-66d25-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tic-tac-toe-66d25",
  storageBucket: "tic-tac-toe-66d25.appspot.com",
  messagingSenderId: "805447723465",
  appId: "1:805447723465:web:d8453fd007681625de2018",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const gameListRef = ref(db, "Game");