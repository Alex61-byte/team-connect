import React,{useState,useRef} from 'react'
import { Card,Form } from 'react-bootstrap'
import './SetTodos.css'
import { getFirestore } from 'firebase/firestore'
import {  addDoc, collection,  } from 'firebase/firestore'
export default function SetTodos({users}) {

    const [userTodo,setUserTodo]=useState();
    console.log(userTodo)
    const titleRef=useRef();
    const textRef=useRef();
    const dateRef=useRef();

   

    async function SetTodoItem() {
        
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
       

    }


    return (
        <div className="container-fluid">
            <Card className="set-todo-card">
                
                
                <label htmlFor="user">Destinated User</label>
                <select name="user" id="users-list" onChange={(e)=>setUserTodo(e.target.value)}>
                    <option value="null">User</option>
                    {users.map((user) =>{
                        return <option key={user.id} value={user.id}>{user.name}</option>
                    })}
                    </select>   
                   
                <label htmlFor="Title">Todo Title</label>
                <input type="text" placeholder="Title" ref={titleRef}/>
                
                <label htmlFor="Description">Todo Description</label>
                <input type="text" placeholder="Description" ref={textRef}/>
                
                <label htmlFor="Due Date">Due Date</label>
                <input type="date" name="date" id="date" placeholder="Due Date" ref={dateRef}/>
                    	
                <button className="btn btn-secondary" type="submit" onClick={SetTodoItem} >Set Todo</button>
                
            </Card>
            
        </div>
    )
}
