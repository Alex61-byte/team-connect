import React, { useEffect, useState } from 'react'
import { Row, Col,Form,Button} from 'react-bootstrap'
import WorkTimeImputer from '../WorkTimeImputer'
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore'
import MonthRequestWorkingTime from '../MonthRequestWorkingTime'
import {  Card } from "react-bootstrap"
import Nav from '../Nav'
import WorkTimeRenderer from '../WorkTimeRenderer/WorkTimeRenderer';
import './AdminDashboard.css'
import SetTodos from '../SetTodos/SetTodos'
import Logo from '../../images/logo.png'
import AdminTodoViewer from '../AdminTodoViewer'
import SetProject from'../SetProject'
import {BsArrowReturnRight ,BsArrowBarUp} from 'react-icons/bs'
import {AiOutlineCloseCircle}from 'react-icons/ai'
import {FaBusinessTime} from 'react-icons/fa'
import{GiMoneyStack} from 'react-icons/gi'
import {FcTodoList} from 'react-icons/fc'
import {GrUserSettings} from 'react-icons/gr'
import ExpencesInputer from '../ExpencesInputer/ExpencesInputer'


const email=sessionStorage.getItem("user")
async function getUsers() {
    const db = getFirestore();
    const q = query(collection(db, "users"), where("email", "!=", email));
    let arr=[]
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        

        console.log(doc.id, " => ", doc.data());
        arr.push({name: doc.data().name, id:doc.data().email})

        
    });
    return arr;
}







export default function AdminDashboard() {
    const months=[{id:1,name:"January"},{id:2,name:"February"},{id:3,name:"March"},{id:4,name:"April"},{id:5,name:"May"},{id:6,name:"June"},{id:7,name:"July"},{id:8,name:"August"},{id:9,name:"September"},{id:10,name:"October"},{id:11,name:"November"},{id:12,name:"December"}]
    const[showHours,setShowHours]=useState(false)
    const[showSetTodos,setShowSetTodos]=useState(false)
    console.log(showHours)
    const[showExpences,setShowExpences]=useState(false)
    const [otherUsersWorkingHours,setOtherUsersWorkingHours]=useState(false)
    const [users,setUsers]=useState([]);
    console.log(users)
    const [month,setMonth]=useState()
    const [user,setUser]=useState()
   
    console.log(user)
    console.log(month)
    const [dataHours, setDataHours] = useState([])
    console.log(dataHours)
    const [time, setTime] = useState([])
    const [showTodoViewer,setShowTodoViewer]=useState(false)
    const [todo,setTodo]=useState([])
    console.log(todo)
    const [userTodo,setUserTodo]=useState()
    console.log(userTodo)
    const [showSetProject,setShowSetProject]=useState(false)
    console.log(showSetProject)
    const[showTableWorkingHours,setShowTableWorkingHors]=useState(false)
    const[showImputer,setShowImputer]=useState(false)
    const[showExpencesTable,setShowExpencesTable]=useState(false)
    const[showExpencesInputer,setShowExpencesInputer]=useState(false)
    const[showExpencesSorter,setShowExpencesSorter]=useState(false)


    useEffect(()=>{
        getUsers()
        .then((arr)=>{
            setUsers(arr)
            
        })

    },[])
   
    async function ShowData(e) {
       e.preventDefault()
        const db = getFirestore();


        const querySnapshot = await getDocs(collection(db, "working-hours", month, user));
        console.log(querySnapshot)
        let arr = [];
        let times = [];

        if (querySnapshot.empty!==true){
        
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            arr.push({ id: doc.id, time: doc.data().time, date:doc.data().date, project:doc.data().project })
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
            arr.push({ id:1,date:{date:month},project:{project:"no info"},time:{time:"no data available"}})
            setDataHours(arr)
            console.log(arr)
        }
       
        
        
        


    }

    async function GetTodoStatus(){
        const db=getFirestore()
        const querySnapshot = await getDocs(collection(db, "todo","team", userTodo));
        console.log(querySnapshot)
        let arr=[]
        if (querySnapshot.empty!==true){
            
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                arr.push({ id: doc.id, todoDone: doc.data().todoDone, todoDueDate:doc.data().todoDueDate, todoText:doc.data().todoText,todoTitle:doc.data().todoTitle })
                console.log(arr)
              
               
               
                
                
                
                
                console.log(arr)
                
                
               
    
            })}else{
               
                arr.push({ id:1,date:{date:month},project:{project:"no info"},time:{time:"no data available"}})
                setTodo(arr)
                console.log(arr)
            }
           
            
            setTodo(arr)
            
    
    }

    function handelShowHours(){
        setShowHours(!showHours)
        setShowExpences(false)
        setOtherUsersWorkingHours(false)
        setShowSetTodos(false)
        
    }

    function handelShowExpences() {
        setShowHours(false);
        setShowExpences(!showExpences)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowTodoViewer(false)
        setShowSetProject(false)
    }

    function handelOtherUsersWorkingHours(){
        setOtherUsersWorkingHours(!otherUsersWorkingHours)
        setShowHours(false);
        setShowExpences(false);
        setShowSetTodos(false);
        setShowSetProject(false)
        setShowTodoViewer(false)
        setShowExpencesInputer(false)
        setShowExpencesTable(false)
    }
    function handelShowSetTodos(){
        setShowSetTodos(!showSetTodos);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowExpences(false);
        setShowTodoViewer(false)
        setShowSetProject(false)
    }

    function handelShowTodoViewer(){
        setShowTodoViewer(!showTodoViewer)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowExpences(false);
        setShowSetProject(false)
    }
   
    function handelShowSetProject(){
        setShowSetProject(!showSetProject)
        setShowTodoViewer(false)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowExpences(false);
    }
    function handelShowTableWorkingHours(){
        setShowTableWorkingHors(!showTableWorkingHours)
        setShowImputer(false)
    }
    
    function handelshowImputer(){
        setShowImputer(!showImputer)
        setShowTableWorkingHors(false)
    }

    function handelHideWorkingTime(){
        setShowImputer(false)
        setShowTableWorkingHors(false)
        setShowHours(false)
    }

    function handelHideExpences(){
        setShowExpencesTable(false)
        setShowExpencesInputer(false)
        setShowExpences(false)

        
    }

    function handelShowTableExpences(){
        setShowExpencesTable(!showExpencesTable)
        setShowExpencesInputer(false)
    }
    function handelShowExpencesInputer(){
        setShowExpencesInputer(!showExpencesInputer)
        setShowExpencesTable(false)
    }

    function handelExpenceSorterShow(){
        setShowExpencesSorter(!showExpencesSorter)
        setShowExpencesInputer(false)
    }


    return (

        <div className="dashoard" style={{backgroundImage:Logo,backgroundSize:"cover"}}>
            <Row >
                <Nav />
                <Col sm={2}>
                    <button className="btn btn-primary"  onClick={handelShowHours}><FaBusinessTime className="hours-icon"/> My Working Hours</button>
                    {showHours&&  <div><BsArrowReturnRight className="arrow-right" /><Button className="btn btn-secondary" onClick={handelShowTableWorkingHours}>View Working Hours</Button></div>}
                    {showHours&&  <div><BsArrowReturnRight className="arrow-right"/><Button className="btn btn-secondary" onClick={handelshowImputer}>Add working Hours</Button></div>}
                    {showHours&&  <div><BsArrowBarUp className="arrow-right"/> <AiOutlineCloseCircle onClick={handelHideWorkingTime} className="close-btn"/></div> }
                    <button className="btn btn-primary" onClick={handelShowExpences}><GiMoneyStack className="expences-icon"/>My expences</button>
                    {showExpences&&<div><BsArrowReturnRight className="arrow-right" /><Button className="btn btn-secondary" onClick={handelExpenceSorterShow}>View Expences</Button></div>}
                    {showExpences&&<div><BsArrowReturnRight className="arrow-right" /><Button className="btn btn-secondary" onClick={handelShowExpencesInputer}>Add expences</Button></div>}
                    {showExpences&&  <div><BsArrowBarUp className="arrow-right"/> <AiOutlineCloseCircle onClick={handelHideExpences} className="close-btn"/></div> }
                    <button className="btn btn-info" onClick={handelOtherUsersWorkingHours}><FaBusinessTime className="hours-icon"/>Other Users Working Hours</button>
                    {otherUsersWorkingHours&&<Card className="admin-card">
                        <Card.Body>
                        <Form className="working-form" onSubmit={(e)=>ShowData(e)}>
                            <Form.Group>
                        <Form.Label>Select User</Form.Label>
                        <br />
                        <Form.Select onChange={(e)=>setUser(e.target.value)} required>
                        
                            <option value="none">User</option>
                            {users.map((use)=>{
                                return <option key={use.name} id={use.name} value={use.id} >{use.name}</option>
                                
                            })}
                            
                            </Form.Select>    
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label>Select Month</Form.Label>
                            <Form.Select onChange={(e)=>setMonth(e.target.value)} required>
                            <option value="none">Month</option>
                            {months.map((mon)=>{
                                return <option key={mon.id} value={mon.name}>{mon.name}</option>
                            })}
                            </Form.Select>
                        </Form.Group>
                       
                        <br />
                        <Button type="submit">Get Data</Button>
                        </Form>
                    </Card.Body>
                    </Card>}
                    <button className="btn btn-info" type="submit" onClick={handelShowSetTodos}><FcTodoList className="todo-viewer-icon"/>Set Todos</button>
                    <br />
                    <button className="btn btn-info" onClick={handelShowTodoViewer}><FcTodoList className="todo-viewer-icon"/>View Todo Status</button>
                    {showTodoViewer&& <Card className="todo-card-inputer">
                        <Card.Body>
                            <label htmlFor="User" >Select User</label>
                            <br />
                            <select name="user" id="user" className="user-todo" onChange={(e)=>setUserTodo(e.target.value)}>
                                <option value="none">Select User</option>
                            {users.map((use)=>{
                                return <option key={use.name} id={use.name} value={use.id} >{use.name}</option>
                                
                            })}
                            </select>
                            <br />
                            <button className="btn btn-secondary" onClick={GetTodoStatus}>Get Todos</button>
                        </Card.Body>
                    </Card>
                    }
                    <Button onClick={handelShowSetProject}><GrUserSettings className="project-icon"/>Open Project</Button>
                </Col>
                <Col sm={10}>
                  {showTableWorkingHours &&  <WorkTimeRenderer/>}
                  {showImputer && <WorkTimeImputer/>}
                  {otherUsersWorkingHours&& <MonthRequestWorkingTime data={dataHours} time={time} month={month}/> }
                  
                  {showSetTodos&&<SetTodos users={users}/>}
                  {showTodoViewer&&<AdminTodoViewer data={todo} user={userTodo}/>}
                  {showSetProject&&<SetProject users={users}/>}
                  {showExpencesInputer&& <ExpencesInputer/> }
                  {showExpencesTable&& <p>table</p> }
                </Col>
            </Row>

        </div>

    )
}
