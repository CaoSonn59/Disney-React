import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import App from "./App";

// Initialize Firebase (compat)
const firebaseConfig = {
  apiKey: "AIzaSyDnPodQCTHRl0ae1xuwpLsDGpFFFPmk7gQ",
  authDomain: "disneyplus-wad200-assessment3.firebaseapp.com",
  projectId: "disneyplus-wad200-assessment3",
  storageBucket: "disneyplus-wad200-assessment3.firebasestorage.app",
  messagingSenderId: "395218421267",
  appId: "1:395218421267:web:5dca2a942374715079e1e6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
