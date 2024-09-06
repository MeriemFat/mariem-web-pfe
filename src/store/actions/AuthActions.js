import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
} from '../../services/AuthService';
import {toast} from "react-toastify";
import { login as loginService } from '../../services/AuthService';



export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const TOGGLE_LOADING = 'TOGGLE_LOADING';



export function Logout(navigate) {
	localStorage.removeItem('userDetails');
    navigate('/login');
    
	return {
        type: LOGOUT_ACTION,
    };
}


const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
});

const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const loadingToggleAction2 = (isLoading) => ({
    type: TOGGLE_LOADING,
    payload: isLoading,
});


export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}
