import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import path from "path";

const serviceAccountPath = path.join(
  __dirname,
  "../../serviceAccountKey.json"
);

const serviceAccount = require(serviceAccountPath) as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default db;
