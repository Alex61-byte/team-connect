import React, { useEffect, useState } from 'react'
import { Row, Col,Form,Button,Alert} from 'react-bootstrap'
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
import UserProfile from '../UserProfile/UserProfile'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ExpencesRenderer from '../ExpencesRenderer/ExpencesRenderer'
import logo from '../../images/logo.png'
import UserExpences from '../UserExpences/UserExpences'



let name;
async function getUsers() {
  

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
   
    name=user.displayName
    // ...
  } else {
    // User is signed out
    // ...
  }
});
    const db = getFirestore();
    const q = query(collection(db, "users"));
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
    const [month,setMonth]=useState(null)
    const [user,setUser]=useState(null)
    const[showProfile,setShowProfile]=useState(false)
   
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
    const[showTableWorkingHours,setShowTableWorkingHours]=useState(false)
    const[showImputer,setShowImputer]=useState(false)
    const[showExpencesTable,setShowExpencesTable]=useState(false)
    const[showExpencesInputer,setShowExpencesInputer]=useState(false)
    const[showExpencesSorter,setShowExpencesSorter]=useState(false)
    const[othersExpences,setOthersExpences]=useState(false)
    const[alert,setAlert]=useState(false)
    const[alertText,setAlertText]=useState("")
    const[userExpence,setUserEpence]=useState([])
    const[total,setTotal]=useState(null)
    const [todoAlert,setTodoAlert]=useState(false)
    const[todoAlertText,setTodoAlertText]=useState("")
    useEffect(()=>{
        getUsers()
        .then((arr)=>{
            setUsers(arr)
            
        })

    },[])
   
    async function ShowData(e) {
       e.preventDefault()
        const db = getFirestore();

        if(month===null||user===null){
            
            return
        }else{
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
            arr.push({ id:1,date:month,project:{project:"no info"},time:{time:"no data available"}})
            setDataHours(arr)
            console.log(arr)
        }
       
    }
     e.target.reset()   
        


    }

    async function GetTodoStatus(){

        if(userTodo===null||userTodo===undefined){
            setTodoAlert(true)
            setTodoAlertText("User not Selected")
            return
        }else{

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
               
                arr.push(null)
                setTodo(arr)
                console.log(arr)
            }
           
            
            setTodo(arr)
            setUserTodo(null)
            setTodoAlert(false)
        }  
    }

    async function GetOtherUsersEpences(e){
        e.preventDefault()
       
        if(user===null||user===undefined){
            setAlert(true)
            setAlertText("user not selected")
            return
        }else if(month===null||month===undefined){
            setAlert(true)
            setAlertText("month not selected")
            return
        }else{
            const db=getFirestore()
            const querysnapshot= await getDocs(collection(db,"expences",month,user))
            let arr=[]
            
            if (querysnapshot.empty!==true){
            
                querysnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    arr.push({ id: doc.id, date:doc.data().date,issuer:doc.data().docIssuer,docNr:doc.data().docNumber,type:doc.data().expenceType,month:doc.data().month,project:doc.data().project,value:doc.data().value})
                    console.log(arr)
                  
                   
                   
                    
                    
                    
                    
                    console.log(arr)
                    
                    let sum = 0;

                for (let i = 0; i < arr.length; i++) {
                    sum += arr[i].value;
                }
                   setTotal(sum)
                   setUserEpence(arr)
        
                })}else{
                   
                    arr.push(null)
                    setUserEpence(arr)
                    console.log(arr)
                }
            
        }
        
        setAlert(false)
        

        e.target.reset()
    }

    function handelShowHours(){
        setShowHours(!showHours)
        setShowExpences(false)
        setOtherUsersWorkingHours(false)
        setShowSetTodos(false)
        setShowSetProject(false)
        setShowTodoViewer(false)
        setShowExpencesInputer(false)
        setShowExpencesTable(false)
        setShowProfile(false)
        setShowExpencesSorter(false)
        setOthersExpences(false)
        
    }

    function handelShowExpences() {
        setShowHours(false);
        setShowExpences(!showExpences)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowTodoViewer(false)
        setShowSetProject(false)
        setShowTableWorkingHours(false)
        setShowImputer(false)
        setShowTableWorkingHours(false)
        setShowImputer(false)
        setShowProfile(false)
        setOthersExpences(false)
        
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
        setShowProfile(false)
        setShowExpencesSorter(false)
        setShowTableWorkingHours(false)
        setOthersExpences(false)
        
        
    }
    function handelShowSetTodos(){
        setShowSetTodos(!showSetTodos);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowExpences(false);
        setShowTodoViewer(false)
        setShowSetProject(false)
        setShowProfile(false)
        setShowImputer(false)
        setShowTableWorkingHours(false)
        setShowExpencesSorter(false)
        setShowExpencesInputer(false)
        setOthersExpences(false)
    }

    function handelShowTodoViewer(){
        setShowTodoViewer(!showTodoViewer)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowExpences(false);
        setShowSetProject(false)
        setShowProfile(false)
        setShowTableWorkingHours(false)
        setShowExpencesInputer(false)
        setShowExpencesSorter(false)
        setShowImputer(false)
        setOthersExpences(false)
    }
   
    function handelShowSetProject(){
        setShowSetProject(!showSetProject)
        setShowTodoViewer(false)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowImputer(false)
        setShowProfile(false)
        setShowTableWorkingHours(false)
        setShowExpencesSorter(false)
        setShowExpencesInputer(false)
        setShowExpences(false)
        setOthersExpences(false)
    }
    function handelShowTableWorkingHours(){
        setShowTableWorkingHours(!showTableWorkingHours)
        setShowImputer(false)
    }
    
    function handelshowImputer(){
        setShowImputer(!showImputer)
        setShowTableWorkingHours(false)
    }

    function handelHideWorkingTime(){
        setShowImputer(false)
        setShowTableWorkingHours(false)
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
        setShowImputer(false)
        setShowTableWorkingHours(false)
        setShowHours(false)
        setShowProfile(false)
    }

    function handelExpenceSorterShow(){
        setShowExpencesSorter(!showExpencesSorter)
        setShowExpencesInputer(false)
        setShowProfile(false)
        setShowSetProject(false)
        setShowTodoViewer(false)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowImputer(false)
        setShowTableWorkingHours(false)
        setShowHours(false)
        
    }

    function handelShowProfile(){
        setShowProfile(!showProfile)
        setShowSetProject(false)
        setShowTodoViewer(false)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowExpences(false);
        setShowImputer(false);
        setShowTableWorkingHours(false)
        setOthersExpences(false)
        setShowExpencesSorter(false)
       

    }
    function handelShowOthersExpences(){
        setOthersExpences(!othersExpences)
        setShowSetProject(false)
        setShowTodoViewer(false)
        setShowSetTodos(false);
        setOtherUsersWorkingHours(false)
        setShowHours(false);
        setShowImputer(false)
        setShowProfile(false)
        setShowTableWorkingHours(false)
        setShowExpencesSorter(false)
        setShowExpencesInputer(false)
        setShowExpences(false)
    }

    function handelCloseProfile(){
        setShowProfile(false)
    }
    function handelCloseOtherUsersWorkingHours(){
        setOtherUsersWorkingHours(false)
    }
    function handelCloseOthersExpences(){
        setOthersExpences(false)
    }

    return (

        <div className="dashoard" style={{backgroundImage:Logo,backgroundSize:"cover"}}>
            <Row >
                <Nav />
                <Col sm={2}>
                    <button className="btn btn-primary" onClick={handelShowProfile}> Update Profile</button>
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
                        <Form.Select onChange={(e)=>setUser(e.target.value)} required >
                        
                            <option value="">User</option>
                            {users.map((use)=>{
                                return <option key={use.name} id={use.name} value={use.id} >{use.name}</option>
                                
                            })}
                            
                            </Form.Select>    
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label>Select Month</Form.Label>
                            <Form.Select onChange={(e)=>setMonth(e.target.value)}  required >
                                <option value="">Month</option>
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
                    <button className="btn btn-info" onClick={handelShowOthersExpences}><GiMoneyStack className="expences-icon"/> Other Users Expences</button>
                    {othersExpences&& <Card className="admin-card">
                        <Card.Body>
                         {alert &&  <Alert variant="danger">{alertText}</Alert>}
                        <Form onSubmit={(e)=>GetOtherUsersEpences(e)}>
                            <Form.Group>
                            <Form.Label>Select User</Form.Label>
                            <Form.Select onChange={(e)=>setUser(e.target.value)}>
                                <option value="">Select User</option>
                                {users.map((user)=>{
                                    return <option key={user.name} value={user.id}>{user.name}</option>
                                })}
                            </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Month</Form.Label>
                                <Form.Select onChange={(e)=>setMonth(e.target.value)}>
                                    <option value="">Month</option>
                                    {months.map((month)=>{
                                       return <option key={month.id} value={month.name}>{month.name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                            <Button type="submit">Get Data</Button>
                        </Form>
                        </Card.Body>
                    </Card> }
                    
                    <button className="btn btn-info" type="submit" onClick={handelShowSetTodos}><FcTodoList className="todo-viewer-icon"/>Set Todos</button>
                    <br />
                    <button className="btn btn-info" onClick={handelShowTodoViewer}><FcTodoList className="todo-viewer-icon"/>View Todo Status</button>
                    {showTodoViewer&& <Card className="todo-card-inputer">
                        <Card.Body>
                            {todoAlert&&<Alert variant="danger">{todoAlertText}</Alert>}
                            <Form onSubmit={GetTodoStatus}>
                                <Form.Group>
                                    <Form.Label>Select User</Form.Label>
                                    <Form.Select  onChange={(e)=>setUserTodo(e.target.value)} >
                                        <option value=""></option>
                                        {users.map((user)=>{
                                            return <option key={user.name} value={user.id}>{user.name}</option>
                                        })}
                                    </Form.Select>
                                </Form.Group>
                                   <Button type="submit">View Status</Button>     
                            </Form>
                           
                            
                        </Card.Body>
                    </Card>
                    }
                    <Button onClick={handelShowSetProject}><GrUserSettings className="project-icon"/>Open Project</Button>
                    <div className="img-container"><img src={logo} alt="logo" width="100%" /></div>
                </Col>
                <Col sm={10}>
                  {showTableWorkingHours &&  <WorkTimeRenderer/>}
                  {showImputer && <WorkTimeImputer/>}
                  {otherUsersWorkingHours&& <MonthRequestWorkingTime data={dataHours} time={time} month={month} close={handelCloseOtherUsersWorkingHours}/> }
                  {showProfile&&<UserProfile close={handelCloseProfile}/>}
                  {showSetTodos&&<SetTodos users={users}/>}
                  {showTodoViewer&&<AdminTodoViewer data={todo} user={userTodo}/>}
                  {showSetProject&&<SetProject users={users}/>}
                  {showExpencesInputer&& <ExpencesInputer/> }
                  {showExpencesSorter&&<ExpencesRenderer name={name}/>}
                  {othersExpences&&<UserExpences data={userExpence} total={total} month={month} user={user} close={handelCloseOthersExpences}/>}  
                </Col>
            </Row>

        </div>

    )
}
