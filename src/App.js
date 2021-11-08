import React from 'react';


import Signup from '../src/components/Signup'
import Login from '../src/components/Login'
import AdminDashboard from '../src/components/AdminDashboard'
import UserDashboard from '../src/components/UserDasboard'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"












function App() {
  return (

    
      <div className="app-container container-fluid"> 
        <Router>
          <Switch>
            
              <Route exact path="/" component={Login} />
              <Route path="/dashboardadmin" component={AdminDashboard}/>
              <Route path="/dashboarduser" component={UserDashboard}/>
              <Route path="/signup" component={Signup} /> 
              
             
                
                
          </Switch>
        </Router>
      </div>
    


  )
}



export default App;
