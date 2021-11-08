import React, { useEffect, useState } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import { collection, query, addDoc, getDocs, getFirestore } from 'firebase/firestore'
import { getAuth ,onAuthStateChanged} from '@firebase/auth'
import './ExpencesInputer.css'

const db=getFirestore()

var name=sessionStorage.getItem("username")
var userName ;
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        userName = user.email;
        // ...
    } else {
        // User is signed out
        // ...
    }
});


async function getProjects(){
    
    const q = query(collection(db,"project/team",userName));
    let arr=[]
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty !== true) {

        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            arr.push({ id: doc.id, project: doc.data().projectName })
            console.log(arr)





        })
    } else {

        arr.push({ id: 1, project: "No available Project" })

        console.log(arr)
    }



    return arr;

}



export default function ExpencesInputer() {
    const expenceOptions = [
        { id: 1, type: "Hotel" },
        { id: 2, type: "Fuel" },
        { id: 3, type: "City Tax" },
        { id: 4, type: "Flight Ticket" },
        { id: 5, type: "Public transport Ticket" },
        { id: 6, type: "Parking" },
        { id: 7, type: "Car Service" },
        { id: 8, type: "Toll|Road Tax" },
        { id: 9, type: "Daily Allowance" }
    ];

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
    ];

    const[selectedMonth,setSelectedMonth]=useState()
    const[selectedType,setSelectedType]=useState()
    const[selectedDate,setSelectedDate]=useState()
    
    const[docIssuer,setDocIssuer]=useState()
    const[docNumber,setDocNumber]=useState()
    const[selectedProject,setSelectedProject]=useState()
    const[projectList,setProjectList]=useState([])
    const [expenceValue,setExpenceValue]=useState()

    useEffect(()=>{
        getProjects()
        .then((arr)=>setProjectList(arr))
    },[])
    
    async function setExpences(e){
        e.preventDefault()

       

        const myExpences=collection(db,"expences",selectedMonth,userName)
        const projectExpences=collection(db,"project-expences/management",selectedProject)
        if(selectedProject==="No available Project"){
            alert("N0 Project No Expences");
            return
        }else{ 
       
            try{
                const docRef1=await addDoc(myExpences,{
                    date:selectedDate,
                    month:selectedMonth,
                    expenceType:selectedType,
                    docIssuer:docIssuer,
                    docNumber:docNumber,
                    value:Number(expenceValue),
                    project:selectedProject


                })
                console.log(docRef1)
                const docRef2=await addDoc(projectExpences,{
                    date:selectedDate,
                    month:selectedMonth,
                    expenceType:selectedType,
                    docIssuer:docIssuer,
                    docNumber:docNumber,
                    value:Number(expenceValue),
                    employee:name
                })
                console.log(docRef2)

                

            }catch{
                
            }

        }    
        e.target.reset()
    }

    
    
    return (
        <div className="expence-inputer-container container-fluid">
            <Card className="expence-inputer-card">
                <Form onSubmit={(e)=>setExpences(e)} className="expences-inputer-form">
                    <Form.Group>
                        <Form.Label>Choose Month</Form.Label>
                        <Form.Select required onChange={(e)=>setSelectedMonth(e.target.value)}>
                            <option value="null">Select Month</option>
                        {monthOptions.map((item)=>{
                            return <option key={item.id} value={item.month}>{item.month}</option>
                        })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                    <Form.Group>
                        <Form.Label>Choose Project</Form.Label>
                        <Form.Select required onChange={(e)=>setSelectedProject(e.target.value)} placeholder="Choose a Project">
                            <option value="No available Project">No available Project</option>
                        {projectList.map((item)=>{
                            return <option key={item.id} value={item.project}>{item.project}</option>
                        })}
                        </Form.Select>
                    </Form.Group>
                        <Form.Label>Choose Date</Form.Label>
                        <Form.Control type="date" required  onChange={(e)=>setSelectedDate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Expence Type</Form.Label>
                        <Form.Select required onChange={(e)=>setSelectedType(e.target.value)}>
                            <option value="null">Select Expence Type</option>
                            {expenceOptions.map((item)=>{
                                return <option key={item.id} value={item.type}>{item.type}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Document Issuer</Form.Label>
                        <Form.Control type="text" placeholder="EX..Hotels.com" onChange={(e)=>setDocIssuer(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Document Number</Form.Label>
                        <Form.Control type="text" placeholder="EX..BF.198627/2021" onChange={(e)=>setDocNumber(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Expence Value</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="Sum of the Expence" onChange={(e)=>setExpenceValue(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type="submit">Save Data</Button>
                </Form>
            </Card>
        </div>
    )
}
