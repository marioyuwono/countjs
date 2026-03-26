
import { cert, getApp, getApps, initializeApp, ServiceAccount } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getMessaging } from "firebase-admin/messaging"
import { JWT } from "google-auth-library"

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

export async function getAccessToken() {
	// https://firebase.google.com/docs/cloud-messaging/auth-server#node.js_1
	// https://github.com/googleapis/google-auth-library-nodejs?tab=readme-ov-file#installing-the-client-library
	// https://www.npmjs.com/package/google-auth-library
	const scopes = [
		'https://www.googleapis.com/auth/firebase.messaging',
	]
	// const auth = new GoogleAuth({
	// 	scopes,
	// })
	// const client = await auth.getClient()
	const client = new JWT({
		email: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
		key: process.env.FIREBASE_SERVICE_PRIVATE_KEY,
		scopes,
	})
	const accessToken = await client.getAccessToken()
	return accessToken.token
}
