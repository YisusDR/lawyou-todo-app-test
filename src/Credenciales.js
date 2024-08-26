import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAjk9fooNgq5HvRCN12LN_17PB-pNcz0Ts",
  authDomain: "lowyou-todo-app.firebaseapp.com",
  projectId: "lowyou-todo-app",
  storageBucket: "lowyou-todo-app.appspot.com",
  messagingSenderId: "169370381642",
  appId: "1:169370381642:web:7b2d9722f4e0b77715a5b3",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
