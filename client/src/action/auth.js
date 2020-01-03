import axios from 'axios'
import { REGISTER_FAIL,REGISTER_SUCCESS} from './type'
import { setAlert } from './alert_action'


//Register User
export const register = ({ name, email, password }) => async dispatch =>{
    const config = {
       headers:{
        'Content-Type': 'application/json'
       }
    }
    const body = JSON.stringify({ name , email, password})

    try {
        
        const registration = await axios.post('/api/user', body, config)
        dispatch({
            type:REGISTER_SUCCESS,
            payload:registration.data
        })

    } catch (err) {
        const errors = err.response.data.errors;
    
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
    
        dispatch({
          type: REGISTER_FAIL
        });
      }

}

