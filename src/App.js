import React from 'react';


import Signup from '../src/components/Signup'
import Login from '../src/components/Login'
import AdminDashboard from '../src/components/AdminDashboard'
import UserDashboard from '../src/components/UserDasboard'
import { BrowserRouter as Router, Switch, Route, HashRouter, BrowserRouter } from "react-router-dom"












function App() {
  return (

    <HashRouter basename="/">
      <div className="app-container container-fluid"> 
        
          
            
              <Route exact path="/" component={Login} />
              <Route path="/dashboardadmin" component={AdminDashboard}/>
              <Route path="/dashboarduser" component={UserDashboard}/>
              <Route path="/signup" component={Signup} /> 
              
             
                
                
          
        

      </div>
      </HashRouter>
    


  )
}



export default App;
