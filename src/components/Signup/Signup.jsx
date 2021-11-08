import React, { useRef, useState } from "react"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth'
import { Form, Button, Card, Alert } from "react-bootstrap"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import './Signup.css'
import { doc, collection, setDoc, getFirestore } from 'firebase/firestore'

import { Link, useHistory } from "react-router-dom"
import { initializeApp } from 'firebase/app';

const firebaseApp = initializeApp({

    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,

});



const db = getFirestore()
const storage = getStorage()

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const nameRef = useRef()
    const[img,setImg]=useState("")
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const auth = getAuth();
    
    let userImg;
    console.log(userImg)
    console.log(file)
    const handleChange = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
       
        


    

    }
    function ulPhoto(){
        const storage = getStorage();
const storageRef = ref(storage, emailRef.current.value+"/"+file.name);

const uploadTask = uploadBytesResumable(storageRef, file);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      setImg(downloadURL)
    });
  }
);
    } 
    async function handleSubmit(e) {
        e.preventDefault()
        let user;
        const userEmail = emailRef.current.value
        
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

       





        try {
            setError("")
            setLoading(true)
            await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
                .then((cred) => { return user = cred.user.email })
            await updateProfile(auth.currentUser, {
                displayName: nameRef.current.value,
                photoURL: img,

            })
            await setDoc(doc(db, "users", user), {
                name: nameRef.current.value,
                email: emailRef.current.value,
            });

            




        } catch {
            setError("Failed to create an account")
        }
        if (userEmail === "alexandru.smarian@yahoo.com") {
            history.push("/dashboardadmin");
        } else {
            history.push("/dashboarduser");
        }


        setLoading(false)
    }





    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>

                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Form.Group id="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="Name" ref={nameRef} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <input type="file" onChange={handleChange} accept=".png, .jpg, .jpeg"></input>
                            <button onClick={ulPhoto} className="btn btn-info">Upload Photo</button>
                        </Form.Group>

                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/">Log In</Link>
            </div>
        </>
    )
}
