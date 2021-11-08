import React from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useHistory } from 'react-router-dom';

var uid = sessionStorage.getItem('logged')

export default function Logout() {
    const history = useHistory()
    function logOut() {

        console.log('logged')
        const auth = getAuth();

        signOut(auth)


        history.push("/")
        sessionStorage.removeItem('logged');
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('user')
        console.log(uid)


    }




    return (
        <span onClick={logOut}>Log Out</span>
    )
}
