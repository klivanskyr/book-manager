import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp;

const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.NEXT_PULBIC_FIREBASE_CLIENT_EMAIL,
};

if (!getApps().some(app => app.name === 'admin')) {
    adminApp = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://book-manager-3fe0f-default-rtdb.firebaseio.com",
    }, 'admin');
} else {
    adminApp = getApps().find(app => app.name === 'admin');
}

const adminAuth = getAuth(adminApp);

export { adminApp, adminAuth };