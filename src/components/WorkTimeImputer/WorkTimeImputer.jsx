import React, { useEffect,  useState, } from 'react'
import { getAuth, } from '@firebase/auth';
import 'react-datepicker/dist/react-datepicker.css'

import { getFirestore } from 'firebase/firestore'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { Button, Form, Card } from 'react-bootstrap'

import './WorkTimeImputer.css'


const db = getFirestore()







var userName;


async function GetProjects() {


    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        userName = user.email;
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
    } else {
        // No user is signed in.
    }

    const querySnapshot = await getDocs(collection(db, "project", "team", userName));

    let arr = [];
    if (querySnapshot.empty !== true) {

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data().project);
            arr.push({ id: doc.id, project: doc.data().projectName })
            console.log(arr)





        })
    } else {

        arr.push({ id: 1, project: "No available Project" })

        console.log(arr)
    }



    return arr;

}





const uid = sessionStorage.getItem('user');



console.log(uid);
export default function WorkTimeImputer() {
    const monthOptions = [
        { id: 1, month: "January" },
        { id: 2, month: "February" },
        { id: 3, month: "March" },
        { id: 4, month: "April" },
        { id: 5, month: "May" },
        { id: 6, month: "June" },
        { id: 7, month: "July" },
        { id: 8, month: "August" },
        { id: 9, month: "September" },
        { id: 10, month: "October" },
        { id: 11, month: "November" },
        { id: 12, month: "December" }
    ]

    const [openProject, setOpenProject] = useState([])
    console.log(openProject)

    useEffect(() => {
        GetProjects()
            .then((arr) => setOpenProject(arr))
    },[])



    const [actualMonth, setActualMonth] = useState()
    console.log(actualMonth)
    const [project, setProject] = useState()

   
    const [date, setdate] = useState()
    console.log(date)
    const [time, setTime] = useState()







    async function handleWorkingTimeSubmit(e) {
        e.preventDefault()
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            userName = user.email;
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            // ...
        } else {
            // No user is signed in.
        }



        const workingTime = collection(db, "working-hours", actualMonth, userName);


        console.log(date)

        if(project==="No available Project"){
            alert("NO Project No Hours")
            return
        }else{

        try {

            const docRef = await addDoc(workingTime, {
                month: { actualMonth },
                project: { project },
                date: { date },
                time: { time }
            });


            console.log(docRef)
        } catch {
            console.error("wrong aproach", date, project, time);
        }
    }
    e.target.reset()
    }
    return (
        <div className="container-fluid inputer">
            <Card className="set-todo-card">
                
                <Form onSubmit={(e) => handleWorkingTimeSubmit(e)} className="work-imputer-form">
                    <Form.Group>
                        <Form.Label required >Month</Form.Label>
                        <Form.Select onChange={(e) => setActualMonth(e.target.value)}>
                            <option value="">Select Month</option>
                            {monthOptions.map((item) => {
                                return <option key={item.id} value={item.month}>{item.month}</option>

                            })
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Project</Form.Label>
                        <Form.Select onChange={(e) => setProject(e.target.value)} required>
                            <option value="">Select a Project</option>
                            {openProject.map((item) => {
                                return <option key={item.id} value={item.project}>{item.project}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control type="date" dateformat="dd/MM/yyyy" required onChange={(e) => setdate(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>hours</Form.Label>
                        <Form.Control type="number" max="9" min="0" required onChange={(e) => setTime(e.target.value)} />
                    </Form.Group>
                    <Button type="submit">Set working hours</Button>
                </Form>
            </Card>
        </div>
    )
}
