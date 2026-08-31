
import { cert, getApp, getApps, initializeApp, ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getMessaging } from "firebase-admin/messaging"

const serviceAccount = {
	"type": process.env.FIREBASE_SERVICE_TYPE,
	"project_id": process.env.FIREBASE_PROJECTID || process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
	"private_key_id": process.env.FIREBASE_SERVICE_PRIVATE_KEY_ID,
	"private_key": process.env.FIREBASE_SERVICE_PRIVATE_KEY,
	"client_email": process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
	"client_id": process.env.FIREBASE_SERVICE_CLIENT_ID,
	"auth_uri": process.env.FIREBASE_SERVICE_AUTH_URI,
	"token_uri": process.env.FIREBASE_SERVICE_TOKEN_URI,
	"auth_provider_x509_cert_url": process.env.FIREBASE_SERVICE_AUTH_PROVIDER_X509_CERT_URL,
	"client_x509_cert_url": process.env.FIREBASE_SERVICE_CLIENT_X509_CERT_URL,
	"universe_domain": process.env.FIREBASE_SERVICE_UNVIVER_DOMAIN,
} as ServiceAccount

const firebaseConfig = {
	credential: cert(serviceAccount)
}

// Initialize Firebase
export const serverApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Auth with Firebase
export const serverAuth = getAuth(serverApp)

// Firestore db
export const serverDb = getFirestore(serverApp)

// FCM
export const messaging = getMessaging(serverApp)
