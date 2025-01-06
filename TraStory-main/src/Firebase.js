import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"


const app = firebase.initializeApp({
  apiKey: "AIzaSyAJ3dkpFhfBo5BJwjycdDZ9kpGyf4DzgcA",
  authDomain: "tracetory-4340e.firebaseapp.com",
  projectId: "tracetory-4340e",
  storageBucket: "tracetory-4340e.appspot.com",
  messagingSenderId: "628717194814",
  appId: "1:628717194814:web:016c6a3be539b88dc44b6f",
  measurementId: "G-09YT4YQKFK"
})

// firebase.initializeApp(firebaseConfig)

export const auth = app.auth()

const storage = firebase.storage();
const firestore = firebase.firestore(); 


export { storage, firebase as default, firestore };


