/* eslint-disable indent */
/* eslint-disable no-new */
import { initializeApp } from 'firebase/app'
import { getStorage, ref } from 'firebase/storage'
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
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

// Authenticate user with firebase
if (store.state.userId) {
    const auth = getAuth(app)
    const credential = GoogleAuthProvider.credential(
        store.state.jwtCredentials
    )
    signInWithCredential(auth, credential)
}

// init firestore service
const firebaseStorage = getStorage(app)
const imagesRef = ref(firebaseStorage, 'images')
const jsonRef = ref(firebaseStorage, 'jsons')

export { imagesRef, jsonRef }
