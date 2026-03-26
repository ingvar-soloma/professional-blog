import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
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

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
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
