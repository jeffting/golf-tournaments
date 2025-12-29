import { db } from "./src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function verifyConnection() {
    try {
        console.log("Attempting to connect to Firestore...");
        const colRef = collection(db, "tournaments");
        const snapshot = await getDocs(colRef);
        console.log("Connection successful!");
        console.log(`Found ${snapshot.size} documents in 'tournaments'.`);
    } catch (e) {
        console.error("Connection failed:", e);
    }
}

// verifyConnection(); 
// Note: Running this directly in node might be tricky due to ES modules/browser env. 
// Easier to verify via a temporary UI component or believing the config is correct.
