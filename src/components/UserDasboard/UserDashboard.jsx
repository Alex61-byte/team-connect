import React,{useEffect, useState} from 'react';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { getFirestore,getDocs,collection,query } from '@firebase/firestore'
import 'react-datepicker/dist/react-datepicker.css'
import { Row, Col ,Button} from 'react-bootstrap'
import WorkTimeImputer from '../WorkTimeImputer'
import logo from '../../images/logo.png'
import './UserDashboard.css'
import Nav from '../Nav'
import WorkTimeRenderer from '../WorkTimeRenderer/WorkTimeRenderer';
import {BsArrowReturnRight ,BsArrowBarUp} from 'react-icons/bs'
import {AiOutlineCloseCircle}from 'react-icons/ai'
import UserTodoViewer from '../UserTodoViewer/UserTodoViewer';
import ExpencesInputer from '../ExpencesInputer/ExpencesInputer';
import ExpencesRenderer from '../ExpencesRenderer/ExpencesRenderer';
import UserProfile from '../UserProfile/UserProfile';
import{FaBusinessTime, FaUserCog } from'react-icons/fa' 
import {GrUserSettings} from'react-icons/gr'
import { GiMoneyStack } from 'react-icons/gi';
import { FcTodoList } from 'react-icons/fc';


var userName = sessionStorage.getItem('user')
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


async function getTodos() {
    const db = getFirestore();
    const q = query(collection(db, "todo/team",userName));
    let arr=[]
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        

        console.log(doc.id, " => ", doc.data());
        arr.push({id:doc.id,title:doc.data().todoTitle,text:doc.data().todoText,date:doc.data().todoDueDate,done:doc.data().todoDone})

        
    });
    return arr;
}

export default function UserDashboard() {
    const[showHours,setShowHours]=useState(false)
    console.log(showHours)
    const[showExpences,setShowExpences]=useState(false)
    const[showLogo,setShowLogo]=useState(true)
    const[showTableWorkingHours,setShowTableWorkingHors]=useState(false)
    const[showImputer,setShowImputer]=useState(false)
    const[showTodos,setShowTodos]=useState(false)
    const[todos,setTodos]=useState([])
    const[showExpencesTable,setShowExpencesTable]=useState(false)
    const[showExpencesInputer,setShowExpencesInputer]=useState(false)
    const[showExpencesSorter,setShowExpencesSorter]=useState(false)
    const[showProfile,setShowProfile]=useState(false)

    useEffect(()=>{
        getTodos()
        .then((arr)=>setTodos(arr))
    },[])

    function handelShowHours(){
        setShowHours(!showHours)
        setShowExpences(false)
        setShowLogo(false)
        setShowTodos(false)
        setShowImputer(false)
        setShowTableWorkingHors(false)
        setShowExpencesSorter(false)
       
        setShowExpences(false)
        setShowProfile(false)
        
        
    }

    function handelShowExpences() {
        setShowHours(false);
        setShowExpences(!showExpences)
        setShowLogo(false);
        setShowTodos(false)
        setShowImputer(false)
        setShowTableWorkingHors(false)
        setShowHours(false)
        setShowProfile(false)
        
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

    function handelViewTodos(){
        setShowTodos(!showTodos)
        setShowImputer(false)
        setShowTableWorkingHors(false)
        setShowHours(false)
        setShowExpences(false)
        setShowLogo(false)
        setShowExpencesInputer(false)
        setShowExpencesSorter(false)
        setShowExpencesTable(false)
        setShowProfile(false)
    }

    function handelHideExpences(){
        setShowExpencesTable(false)
        setShowExpencesInputer(false)
        setShowExpences(false)
        setShowExpencesTable(false)
        setShowExpencesSorter(false)
        
        
    }

    function handelProfile(){
        setShowProfile(!showProfile)
        setShowTodos(false)
        setShowImputer(false)
        setShowTableWorkingHors(false)
        setShowHours(false)
        setShowExpences(false)
        setShowLogo(false)
        setShowExpencesTable(false)
        setShowExpencesSorter(false)
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
    
    function closeProfile(){
        setShowProfile(false)
    }

    return (
        <div>
            <Row>
                <Nav />
                <Col sm={2}>
                    <button className="btn btn-primary" onClick={handelProfile}><FaUserCog style={{color:"white",fontSize:"20px"}}/> Update Profile</button>
                    <button className="btn btn-primary"  onClick={handelShowHours}><FaBusinessTime className="hours-icon"/> Working Hours</button>
                    {showHours&&  <div><BsArrowReturnRight className="arrow-right" /><Button className="btn btn-secondary" onClick={handelShowTableWorkingHours}>View Working Hours</Button></div>}
                    {showHours&&  <div><BsArrowReturnRight className="arrow-right"/><Button className="btn btn-secondary" onClick={handelshowImputer}>Add working Hours</Button></div>}
                    {showHours&&  <div><BsArrowBarUp className="arrow-right"/> <AiOutlineCloseCircle onClick={handelHideWorkingTime} className="close-btn"/></div> }
                    <br />
                    <button className="btn btn-primary" onClick={handelShowExpences}><GiMoneyStack style={{fontSize:"25px"}}/> Travel Expences</button>
                    {showExpences&&<div><BsArrowReturnRight className="arrow-right" /><Button className="btn btn-secondary" onClick={handelExpenceSorterShow}>View Expences</Button></div>}
                    {showExpences&&<div><BsArrowReturnRight className="arrow-right" /><Button className="btn btn-secondary" onClick={handelShowExpencesInputer}>Add expences</Button></div>}
                    {showExpences&&  <div><BsArrowBarUp className="arrow-right"/> <AiOutlineCloseCircle onClick={handelHideExpences} className="close-btn"/></div> }
                    <Button onClick={handelViewTodos}><FcTodoList style={{fontSize:"25px"}}/> View Todos</Button>
                    <div className="img-container"><img src={logo} alt="logo" width="100%" /></div>
                </Col>
                <Col sm={10}>
                 {showProfile&& <UserProfile close={closeProfile}/>}   
                 {showTableWorkingHours && <WorkTimeRenderer  />}   
                 {showImputer &&  <WorkTimeImputer  />}
                {showExpencesInputer&& <ExpencesInputer/>}
                {showExpencesSorter&&<ExpencesRenderer/>}
                 {showLogo && <div className="container"><img src={logo} alt="Logo" /></div> }
                 {showTodos&& <UserTodoViewer todos={todos} userName={userName}/>}
                </Col>
            </Row>

        </div>
    )
}
