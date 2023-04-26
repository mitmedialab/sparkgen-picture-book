/* eslint-disable indent */
/* eslint-disable no-new */
import { initializeApp } from 'firebase/app'
import { getStorage, ref } from 'firebase/storage'
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

// init firestore service
const firebaseStorage = getStorage(app)
const imagesRef = ref(firebaseStorage, 'images')
export default imagesRef
