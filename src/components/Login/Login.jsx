import React, { useRef, useState } from 'react'

import { getAuth, signInWithEmailAndPassword, } from '@firebase/auth'
import { Form, Button, Card, Alert } from "react-bootstrap"

import { Link, useHistory } from "react-router-dom"






export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const auth = getAuth();



    async function handleSubmit(e) {
        e.preventDefault()


        try {
            setError("")
            setLoading(true)

            await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
                .then(sessionStorage.setItem('user', emailRef.current.value))
            const userName = sessionStorage.getItem('user');
            console.log(userName);
            if (userName === "alexandru.smarian@yahoo.com" || userName === "admin@team-connect.com") {
                history.push("/dashboardadmin");
            } else {
                history.push("/dashboarduser");
            }



        } catch {
            setError("Email or Password not Valid!!!")
        }

        try{


        }catch{

        }



        setLoading(false)
    }


    return (
        <div>
            <Alert variant="warning" style={{textAlign:'center'}}><p style={{marginTop:'3px',fontSize:"24px"}}> This Is a Demo App !!! for Admin Rights please Log In with admin@team-connect.com password:123456 , for user rights you can Sign-up with email and password </p></Alert>
            <Card>
                <Card.Body>
                    
                    <h2 className="text-center mb-4">Sign In</h2>
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

                        <Button disabled={loading} className="w-100" type="submit">
                            Sign In
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                You don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}


