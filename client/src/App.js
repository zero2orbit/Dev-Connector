import React, { Fragment} from 'react';
import { BrowserRouter , Route, Switch } from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar'
import LandingPage from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
//Redux
import { Provider } from 'react-redux'
import store from './store'

const App = () => {
  return(
    <Provider store={store}>
    <BrowserRouter>
    <Fragment>
    <Navbar />
    <Route exact  path="/" component={LandingPage} />  
    <section className='container'>
    <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </section>
  </Fragment>
  </BrowserRouter>
  </Provider>
  )
    
}

export default App;
