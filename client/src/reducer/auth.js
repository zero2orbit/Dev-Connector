import { REGISTER_SUCCESS, REGISTER_FAIL } from '../action/type'

const intialstate = {
    token: localStorage.getItem('token'),
    isAuthenticate: null,
    loading: null,
    user:null
}

export default function (state = intialstate, action) {
    const { type, payload } = action
    switch(type){

        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticate: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticate: false,
                loading: false
            }

        default: 
            return state
    }
}