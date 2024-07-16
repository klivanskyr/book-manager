import { applicationDefault, initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp;

if (!getApps().some(app => app.name === 'admin')) {
    adminApp = initializeApp({
        credential: applicationDefault(),
        databaseURL: "https://book-manager-3fe0f-default-rtdb.firebaseio.com",
    }, 'admin');
} else {
    adminApp = getApps().find(app => app.name === 'admin');
}

const adminAuth = getAuth(adminApp);

export { adminApp, adminAuth };