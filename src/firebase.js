// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbUZn5QkTrZGMqBnYCFpU4yUJqfpqKbDI",
  authDomain: "threadify-5d618.firebaseapp.com",
  projectId: "threadify-5d618",
  storageBucket: "threadify-5d618.appspot.com",
  messagingSenderId: "597931841202",
  appId: "1:597931841202:web:6062f3a24a7e5831111bab",
  measurementId: "G-EK08NXJGWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
