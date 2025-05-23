var admin = require('firebase-admin');
var dotenv = require('dotenv');

dotenv.config();

var serviceAccount = {
	type: process.env.FIREBASE_TYPE,
	project_id: process.env.FIREBASE_PROJECT_ID,
	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	client_email: process.env.FIREBASE_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_CLIENT_ID,
	auth_uri: process.env.FIREBASE_AUTH_URI,
	token_uri: process.env.FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
	client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	storageBucket: 'thaco-3149c.appspot.com',
});

var bucket = admin.storage().bucket();
var firestore = admin.firestore();

module.exports = { admin: admin, bucket: bucket, firestore: firestore };