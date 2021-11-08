import React, { useState, useEffect } from 'react'
import Logout from '../Logout'
import './Nav.css'
import { getAuth } from '@firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import logo from '../../images/logo.png'
import { FaUserCircle } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'
import { getStorage,ref,getDownloadURL } from '@firebase/storage'

var userName;

var uid;

var img;


async function GetData() {
    const auth = getAuth();
    const user = auth.currentUser
    const db = getFirestore()

    if (user) {
        console.log(user.email)
        console.log(user.providerData)
        uid = user.email
        img=user.photoURL
        userName=user.displayName
        console.log(user.photoURL)
        console.log(userName)
        console.log(uid);

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
    } else {
        // No user is signed in.
    }

    const docRef = doc(db, "users/" + uid);
    console.log(docRef);
    const docSnap = await getDoc(docRef)


    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().name);
        sessionStorage.setItem('username', docSnap.data().name)
        userName = docSnap.data().name;





    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }

}



export default function Nav() {
    const [data, setData] = useState('');
    
    useEffect(() => {
        GetData().then(doc => setData(userName))
    })
   


    return (
        <nav className="navbar navbar-expand-sm " >
            <div className="container-fluid nav" >
                <div className="img-container"><img src={logo} alt="logo" width="90%" /></div>

                <form className="d-flex">
                    <ul>
                        <div style={{width:"50px"}}><img src={img} alt="user" width="100%"/></div>
                        <li><FaUserCircle /> {data}</li>
                        <li><HiOutlineLogout /><Logout /></li>
                    </ul>

                </form>

            </div>
        </nav>



    )
}
