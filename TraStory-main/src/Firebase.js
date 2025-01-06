import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"


const app = firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
})

// firebase.initializeApp(firebaseConfig)

export const auth = app.auth()

const storage = firebase.storage();
const firestore = firebase.firestore(); 


export { storage, firebase as default, firestore };


