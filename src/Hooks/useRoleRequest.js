import { useState} from 'react'
import {toast} from "react-toastify";
import {useAuthContext} from "../services/useAuthContext";

export const useRoleRequest = () => {

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(null)
    const [fetching, setFetching] = useState(null)
    const [request,setRequest] = useState({});
    const [requests,setRequests] = useState([]);
    const {dispatch}= useAuthContext()

    const submitRequest = async (requestedRole) => {
        setIsLoading(true);
        setError('');

        const response = await fetch(`/api/User/request/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ requestedRole })
        });

        const json = await response.json();

        if (json.error) {
            if (json.error === 'jwt expired') {
                localStorage.removeItem('token');
                toast.dark('Please, re-sign in');
                setIsLoading(false);
            }
            setError(json.error);
            setIsLoading(false);
            toast.error(json.error);
            return;
        }

        toast.success('Your request is successfully emitted and pending an admin reply!');
        setIsLoading(false);
    };
    const checkRequest = async ()=> {
        setFetching(true);
        const response = await fetch(`/api/User/check-request`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        const json = await response.json()

        if (json.error) {
            if(json.error==='jwt expired'){
                localStorage.removeItem('token');
                toast.dark('Please, re-sign in');
                setFetching(false);
            }
            setError(json.error)
            setFetching(false);
            toast.error(json.error);
        }
        if (!json.error) {
            if(json.request){
                setRequest(json.request);
            }
        }
        setFetching(false);
    }

    const fetchRequests = async ()=> {
        setIsLoading(true);
        const response = await fetch(`/api/User/requests`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        const json = await response.json()

        if (json.error) {
            if(json.error==='jwt expired'){
                localStorage.removeItem('token');
                toast.dark('Please, re-sign in');
                dispatch({type:'LOGOUT'})
                setIsLoading(false);
            }
            setError(json.error)
            setIsLoading(false);
            toast.error(json.error);
        }
        if (!json.error) {
            setRequests(json);
        }
        setIsLoading(false);
    }
    const acceptRequest = async (request)=> {
        setFetching(true);
        const response = await fetch(`/api/User/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify(request)
        })
        const json = await response.json()

        if (json.error) {
            if(json.error==='jwt expired'){
                localStorage.removeItem('token');
                toast.dark('Please, re-sign in');
                dispatch({type:'LOGOUT'})
                setFetching(false);
            }
            setError(json.error)
            setFetching(false);
            toast.error(json.error);
        }

        setFetching(false);
    }
    const rejectRequest = async (request)=> {
        setFetching(true);
        const response = await fetch(`/api/User/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body:JSON.stringify(request)
        })
        const json = await response.json()

        if (json.error) {
            if(json.error==='jwt expired'){
                localStorage.removeItem('token');
                toast.dark('Please, re-sign in');
                dispatch({type:'LOGOUT'})
                setFetching(false);
            }
            setError(json.error)
            setFetching(false);
            toast.error(json.error);
        }
        if (!json.error) {
            toast.success('Request rejected successfully');
        }
        setFetching(false);
    }



    return { submitRequest, checkRequest, fetchRequests, acceptRequest, rejectRequest, isLoading, error,requests, request, fetching}
}