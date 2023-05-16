/* eslint-disable indent */
/* eslint-disable no-new */
import { initializeApp } from 'firebase/app'
import { getStorage, ref } from 'firebase/storage'
import { getAuth, GoogleAuthProvider, signInWithCredential, signInAnonymously } from 'firebase/auth'
import store from '../store.js'

const firebaseConfig = {
    apiKey: store.state.apiKeyFirebase,
    authDomain: store.state.authDomainFirebase,
    projectId: store.state.projectIdFirebase,
    storageBucket: store.state.storageBucketFirebase,
    messagingSenderId: store.state.messagingSenderIdFirebase,
    appId: store.state.appIdFirebase,
    measurementId: store.state.measurementIdFirebase
}
const app = initializeApp(firebaseConfig)

// Authenticate user with firebase - google login
if (store.state.jwtCredentials) {
    const auth = getAuth(app)
    const credential = GoogleAuthProvider.credential(store.state.jwtCredentials)
    signInWithCredential(auth, credential)
} else if (store.state.userId) {
    // Authenticate user with firebase - saved firebase credentials
    const auth = getAuth(app)
    signInAnonymously(auth)
}

// init firestore service
const firebaseStorage = getStorage(app)
const imagesRef = ref(firebaseStorage, 'images')
const jsonRef = ref(firebaseStorage, 'jsons')

export { imagesRef, jsonRef }
