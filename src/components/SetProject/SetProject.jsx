import React, { useRef, useState } from 'react'
import { Form,Button,Card} from 'react-bootstrap'
import {  addDoc, collection,getFirestore  } from 'firebase/firestore'
import './SetProject.css'


export default function SetProject({users}) {
    const projectRef=useRef()
    const [targetUser,setTargetUser]=useState()
    console.log(targetUser)

    async function openProject(e){
       e.preventDefault()
        const db=getFirestore()
        const projectName=projectRef.current.value;
        const project=collection(db,"project","team",targetUser)
        const projectLister=collection(db,"project-list")
        try{
            const docRef=await addDoc(project,{
                projectName:projectName
            })
            const docRef1=await addDoc(projectLister,{
                project:projectName
            })
            console.log(docRef)
        }catch{

        }
        
    }

    return (
        <div>
            <Card className="setproject-card">
                <Form className="setproject-form" onSubmit={(e)=>openProject(e)}>
                    <Form.Group>
                        <Form.Label>Select User</Form.Label>
                        <Form.Select required  onChange={(e)=>setTargetUser(e.target.value) }>
                            <option value="">User</option>
                            {users.map((item)=>{
                                return <option key={item.id} value={item.id}>{item.name}</option>
                            })}
                        </Form.Select>
                        
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Enter Project Name</Form.Label>
                        <Form.Control placeholder="Project Name" required ref={projectRef}></Form.Control>
                    </Form.Group>
                    <Button type="submit">Open Project</Button>
                </Form>

            </Card>
            
        </div>
    )
}
