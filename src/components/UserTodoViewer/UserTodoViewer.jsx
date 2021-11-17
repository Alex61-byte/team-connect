import React, { useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import './UserTodoViewer.css'





export default function UserTodoViewer({ todos,userName }) {

    const [todoList, setTodoList] = useState([])
    const [id, setId] = useState()
    const [done,setDone]=useState()
    console.log(id)
    console.log(todoList)


    function handelChange(id) {
        const newData = [...todos];
        const todo = newData.find(todo => todo.id === id)
        todo.done = !todo.done
        setTodoList(newData)
        setId(todo.id)
        setDone(todo.done)
        
        //setId(id)
        console.log(newData)
    }
    useEffect(() => {
        setTodoList(todos)
    }, [todos])

    async function updateTodo(id) {
        
        
        const db=getFirestore()
        const todoRef = doc(db, "todo/team",userName,id);

        // Set the "capital" field of the city 'DC'
        await updateDoc(todoRef, {
            todoDone:done
        });
    }

    return (

       <div className="todolist-container">
            
            {todoList.map((item) => {
                return <Card key={item.id} className="todo-card">
                    <Card.Header> <h1>{item.title}</h1> </Card.Header>
                    <Card.Body>
                        <h3>{item.text}</h3>
                        <h5>{item.date}</h5>
                        <input type="checkbox" name="todo" id={item.id} checked={item.done} onChange={(e) => handelChange(e.target.id)}
                        />
                    </Card.Body>
                    <Card.Footer><Button id={item.id} onClick={(e)=>updateTodo(e.target.id)}>Update</Button></Card.Footer>
                </Card>
            })}
        </div>
    )
}
