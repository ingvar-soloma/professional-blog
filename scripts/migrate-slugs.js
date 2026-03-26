import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const [key, value] = line.split("=");
  if (key && value) env[key.trim()] = value.trim();
});

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

async function migrate() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    console.log(`Found ${querySnapshot.size} posts. Checking for missing slugs...`);
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      if (!data.slug) {
        const newSlug = slugify(data.title);
        console.log(`Updating post "${data.title}" with slug "${newSlug}"`);
        await updateDoc(doc(db, "posts", docSnapshot.id), {
          slug: newSlug
        });
      }
    }
    console.log("Migration complete.");
  } catch (error) {
    console.error("Migration error:", error);
  }
  process.exit(0);
}

migrate();
