// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9liUsQHTt-r-__Hl59rxqwV7j5ZWMFfc",
//   authDomain: "tic-tac-toe-66d25.firebaseapp.com",
//   databaseURL:
//     "https://tic-tac-toe-66d25-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "tic-tac-toe-66d25",
//   storageBucket: "tic-tac-toe-66d25.appspot.com",
//   messagingSenderId: "805447723465",
//   appId: "1:805447723465:web:d8453fd007681625de2018",
// };
const firebaseConfig = {
  apiKey: "AIzaSyB-s_NpdUzkZcKe_V3kW6j7x6RVPtVPOmE",
  authDomain: "game-dev-b6652.firebaseapp.com",
  projectId: "game-dev-b6652",
  storageBucket: "game-dev-b6652.appspot.com",
  messagingSenderId: "820409525706",
  appId: "1:820409525706:web:0610c3139b54d1e4075b33",
  databaseURL:
    "https://game-dev-b6652-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const auth = getAuth();

export const provider = new GoogleAuthProvider();
export const gameListRef = ref(db, "Game/");
