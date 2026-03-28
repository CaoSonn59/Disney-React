import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

// Using Cursor & ChatGPT for help
// Read file JSON
const data = JSON.parse(fs.readFileSync("./continueWatching.json", "utf8"));

const firebaseConfig = {
  apiKey: "AIzaSyDnPodQCTHRl0ae1xuwpLsDGpFFFPmk7gQ",
  authDomain: "disneyplus-wad200-assessment3.firebaseapp.com",
  projectId: "disneyplus-wad200-assessment3",
  storageBucket: "disneyplus-wad200-assessment3.firebasestorage.app",
  messagingSenderId: "395218421267",
  appId: "1:395218421267:web:5dca2a942374715079e1e6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importContinueWatching() {
  try {
    console.log("Import continueWatching...");
    console.log(`Quantity: ${data.length}\n`);

    let success = 0,
      fail = 0;

    for (const item of data) {
      try {
        await setDoc(doc(db, "continueWatching", item.id), item, {
          merge: true,
        });
        console.log(`${item.title} (ID: ${item.id})`);
        success++;
      } catch (e) {
        console.error(`${item.title}: ${e.message}`);
        fail++;
      }
    }

    console.log(`\n✅ Success: ${success} | ❌ Errors: ${fail}`);
  } catch (e) {
    console.error("❌ Critical error:", e);
  }
}

importContinueWatching();
