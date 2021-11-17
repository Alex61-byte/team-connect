import React, { useState } from 'react';

import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { collection, getDocs, orderBy } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { Table, Button, Form ,Card} from 'react-bootstrap';
import './WorkTimeRenderer.css'




var userEmail = sessionStorage.getItem('user')
let name;
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        userEmail = user.email;
        name=user.displayName
    } else {
        // User is signed out
        // ...
    }
});











const refreshList = () => {
    window.location.reload()
}




export default function WorkTimeRenderer() {

    const [showTable, setShowTable] = useState(false)
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
    const[time,setTime]=useState()
    const[dataHours,setDataHours]=useState([])

    async function ShowData(e) {
        e.preventDefault()
         const db = getFirestore();
 
 
         const querySnapshot = await getDocs(collection(db, "working-hours", selectedMonth, userEmail));
         console.log(querySnapshot)
         let arr = [];
         let times = [];
 
         if (querySnapshot.empty!==true){
         
         querySnapshot.forEach((doc) => {
             // doc.data() is never undefined for query doc snapshots
             console.log(doc.id, " => ", doc.data());
             arr.push({ id: doc.id, time: doc.data().time, date:doc.data().date, project:doc.data().project,emplyee:doc.data().name })
             console.log(arr)
           
             times.push(parseInt(Object.values(doc.data().time)))
             times.map((item)=>item)
             let sum = 0;
            
             for (let i = 0; i < times.length; i++) {
                 sum += times[i];
             }
             console.log(sum);
             setTime(sum)
             setDataHours(arr)
             console.log(arr)
             
             
            
 
         })}else{
             setTime(0)
             arr.push({ id:1,date:selectedMonth,project:{project:"no info"},time:{time:"no data available"}})
             setDataHours(arr)
             console.log(arr)
         }
         e.target.reset()
         setShowTable(true)
         
         
 
 
     }


    return (
        <div className="container-fluid renderer" >
            <Card className="workingtime-requester">
            <Form  onSubmit={ShowData} className="workingtime-requester-form">
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

            {showTable && <Table bordered >

                <thead>
                    <tr>
                        <th>{userEmail}</th>
                        <th>{selectedMonth}</th>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Project</th>
                        <th>Working Time</th>
                        <th>Employee</th>

                    </tr>
                </thead>
                <tbody >
                    {dataHours.map((item)=>{
                      return  <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.project.project}</td>
                                <td>{item.time.time}</td>
                                <td>{item.emplyee}</td>                                
                        </tr>
                    })}
                </tbody>
                <thead>
                    <tr>
                        <th>{name}</th>
                        <th>Total hours for {selectedMonth}</th>
                        <th>{time}</th>
                    </tr>
                </thead>

            </Table>}

        </div>
    )

}


