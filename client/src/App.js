import React, { Fragment} from 'react';
import { BrowserRouter , Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar'
import LandingPage from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

const App = () => {
  return(
    <BrowserRouter>
    <Fragment>
    <Navbar />
    <Route exact  path="/" component={LandingPage} />  
    <section className='container'>
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </section>
  </Fragment>
  </BrowserRouter>
  )
    
}

export default App;
