import React,{useState,useRef} from 'react'
import { Card,Form,Button,Alert } from 'react-bootstrap'
import './SetTodos.css'
import { getFirestore } from 'firebase/firestore'
import {  addDoc, collection,  } from 'firebase/firestore'


export default function SetTodos({users}) {
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")
    const [userTodo,setUserTodo]=useState(null);
    console.log(userTodo)
    const titleRef=useRef();
    const textRef=useRef();
    const dateRef=useRef();

   

    async function SetTodoItem(e) {
      
        if(userTodo===null){
            e.preventDefault()
            setError("Please Select A User")
            setTimeout(()=>setError(""),2000)
        }else{
            e.preventDefault()
        const title=titleRef.current.value;
        const text=textRef.current.value;
        const date=dateRef.current.value;
        const db=getFirestore();
        const todoItem=collection(db,"todo","team",userTodo)
        try{
            const docRef=await addDoc(todoItem,{
                todoTitle:title,
                todoText:text,
                todoDueDate:date,
                todoDone:false,
            })
            console.log(docRef)
        }catch{

        }
        setSuccess("Todo Set Successfull")
        setTimeout(()=>setSuccess(""),2000)
       e.target.reset()
    }
    }


    return (
        <div className="container-fluid">
            <Card className="set-todo-card">
                {error&& <Alert variant="danger">{error}</Alert>}
                {success&&<Alert variant="success">{success}</Alert>}
                <Form onSubmit={SetTodoItem}>
                    <Form.Group>
                        <Form.Label>Destinated User</Form.Label>
                        <Form.Select onChange={(e)=>setUserTodo(e.target.value)}>
                        <option value="null">Select User </option>
                    {users.map((user) =>{
                        return <option key={user.id} value={user.id}>{user.name}
                        </option>})}
                   
                      
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Todo Title</Form.Label>
                        <Form.Control type="text" ref={titleRef} placeholder="Title" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Todo Description</Form.Label>
                        <Form.Control type="text" ref={textRef} placeholder="Description" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control type="date" required ref={dateRef}></Form.Control>
                    </Form.Group>
                    <Button type="submit">Set Todo</Button>
                </Form>
                
                
            </Card>
            
        </div>
    )
}
