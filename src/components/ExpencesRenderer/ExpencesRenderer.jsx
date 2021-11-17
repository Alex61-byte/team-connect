import React, { useState } from 'react'
import { getFirestore, getDocs, collection, } from '@firebase/firestore'
import { getAuth } from '@firebase/auth'
import { Form, Card, Button, Table } from 'react-bootstrap'
import './ExpencesRenderer.css'



const db = getFirestore()
let name;
let userEmail;

export default function ExpencesRenderer() {

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



    const [selectedMonth, setSelectedMonth] = useState()
    const [expences, setExpences] = useState([])
    
    const [totalExpences, setTotalExpences] = useState()


    async function GetExpences(e) {
        e.preventDefault();
        
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            userEmail= user.email;
            name=user.displayName;
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            // ...
        } else {
            // No user is signed in.
        }

        const querySnapshot = await getDocs(collection(db, "expences", selectedMonth, userEmail));
        let total = []
        let arr = [];
        let totalNumber = []
        if (querySnapshot.empty !== true) {

            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                arr.push({ id: doc.id, project: doc.data().project, month: doc.data().month, date: doc.data().date, issuer: doc.data().docIssuer, number: doc.data().docNumber, type: doc.data().expenceType, value: doc.data().value })
                console.log(arr)

                setExpences(arr)
                
               




                console.log(total)
                console.log(totalNumber)
                total.map((item) => item)
                let sum = 0;

                for (let i = 0; i < arr.length; i++) {
                    sum += arr[i].value;
                }
                console.log(sum);
                setTotalExpences(sum)


            })

        } else {

            arr.push({ id: 1, project: "No available Project", month: selectedMonth, date: "no information", issuer: "no information", number: "no information", type: "no information", value: 0 })
            setTotalExpences(0)
            setExpences(arr)
            console.log(arr)
        }
        e.target.reset()
        

        return arr;

    }
    return (
        <div>
            <div className="container-fluid renderer" >
                <Card className="workingtime-requester">
                    <Form onSubmit={(e) => GetExpences(e)} className="workingtime-requester-form">
                        <Form.Label>Select Month</Form.Label>
                        <Form.Select onChange={(e) => setSelectedMonth(e.target.value)} required>
                            <option value="">Select Month</option>
                            {monthOptions.map((item) => {
                                return <option key={item.id} value={item.month}>{item.month}</option>
                            })}
                        </Form.Select>
                        <Button type="submit">Show Data</Button>
                    </Form>
                </Card>

                <Table bordered >

                    <thead>
                        <tr>
                            <th>{userEmail}</th>
                            <th>{selectedMonth}</th>
                        </tr>
                        <tr>
                            <th>Month</th>
                            <th>Date</th>
                            <th>Project</th>
                            <th>Document Issuer</th>
                            <th>Document Number</th>
                            <th>Expence Type</th>
                            <th>Expence Value</th>

                        </tr>
                    </thead>
                    <tbody >
                        {expences.map((item) =>{
                            if(item.type==="Hotel"&&item.value>=150){
                            return<tr key={item.id} >
                                <td>{item.month}</td>
                                <td>{item.date}</td>
                                <td>{item.project}</td>
                                <td>{item.issuer}</td>
                                <td>{item.number}</td>
                                <td>{item.type}</td>
                                <td className="bg-danger">{item.value}</td>
                            </tr>
                            }else{
                                return<tr key={item.id} >
                                <td>{item.month}</td>
                                <td>{item.date}</td>
                                <td>{item.project}</td>
                                <td>{item.issuer}</td>
                                <td>{item.number}</td>
                                <td>{item.type}</td>
                                <td>{item.value}</td>
                            </tr>
                            }
                        })}
                    </tbody>
                    <thead>
                        <tr>
                            <th>{name}</th>
                            <th>Total Expences for {selectedMonth}</th>
                            <th>{totalExpences}</th>
                        </tr>
                    </thead>

                </Table>

            </div>

        </div>
    )
}
