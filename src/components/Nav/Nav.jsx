import React, { useState, useEffect } from 'react'
import Logout from '../Logout'
import './Nav.css'
import { getAuth } from '@firebase/auth'
import logo from '../../images/logo.png'
import { FaUserCircle } from 'react-icons/fa'
import { HiOutlineLogout } from 'react-icons/hi'



let uid;
let img;
let userName;



async function GetData() {
    const auth = getAuth();
    const user = auth.currentUser
    let arr=[]
    console.log(arr)
    if (user) {
        console.log(user.email)
        console.log(user.providerData)
        uid = user.uid
        img = user.photoURL
        userName = user.displayName
        console.log(user.photoURL)
        console.log(img)
        console.log(userName)
        console.log(uid);
        arr.push(uid,img,userName)
        
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
    } else {
        // No user is signed in.
    }

    return arr;

}



export default function Nav() {
    const [data, setData] = useState('');
    const [image,setImage]=useState()
    console.log(image)
    useEffect(() => {
        GetData()
            .then((arr) => {
                setData(arr[2])
                setImage(arr[1])
            })
    })    

        if (img === undefined || img === null) {
            return (
                <nav className="navbar navbar-expand-sm " >
                    <div className="container-fluid nav" >
                    <h1>Things made easy</h1>

                        <div className="d-flex">
                            <ul>


                                <li><FaUserCircle /> {data}</li>
                                <li><HiOutlineLogout /><Logout /></li>

                            </ul>

                        </div>

                    </div>
                </nav>



            )
        } else {
            return (
                <nav className="navbar navbar-expand-sm " >
                    <div className="container-fluid nav" >
                        <h1>Things made easy</h1>

                        <div className="d-flex">
                            <ul>
                                <div style={{ width: "50px" }}><img  className="avatar-container" src={image} alt="user" width="100%" /></div>

                                <li> {data}</li>
                                <li><HiOutlineLogout /><Logout /></li>

                            </ul>

                        </div>

                    </div>
                </nav>
            )
        }
}

