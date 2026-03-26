import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get env variable from process.env or .env file
const getEnv = (key) => {
  if (process.env[key]) return process.env[key];
  
  try {
    const envPath = path.resolve(__dirname, "../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");
      for (const line of lines) {
        const [k, v] = line.split("=");
        if (k && k.trim() === key) return v ? v.trim() : "";
      }
    }
  } catch (err) {
    // Ignore errors
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID")
};

async function getRoutes() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  const staticRoutes = ["/", "/blog", "/admin"];
  const dynamicRoutes = [];

  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.is_hidden) {
        const slug = data.slug || doc.id;
        dynamicRoutes.push(`/blog/${slug}`);
      }
    });
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }


  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  fs.writeFileSync(
    path.resolve(__dirname, "../sitemap-routes.json"),
    JSON.stringify(allRoutes, null, 2)
  );
  console.log(`Generated ${allRoutes.length} routes for sitemap.`);
  process.exit(0);
}

getRoutes();
