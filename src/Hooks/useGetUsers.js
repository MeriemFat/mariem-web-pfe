import { useState } from 'react'
import {toast} from "react-toastify";
import {useAuthContext} from "../services/useAuthContext";


export const useGetUsers = () => {
    const [error, setError] = useState('')
    const [activeUsers, setActiveUsers] = useState([])
    const [blockedUsers, setBlockedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const getUsers = async () => {
        setIsLoading(true)
        setError('')

        const response = await fetch(`api/User/getUserByCodeClient/{$codeClient}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

        })
        const json = await response.json()

        if (json.error) {

            if(json.error === "jwt expired"){
                toast.error("Your session has expired, Please re-sign in");
                localStorage.removeItem('token');
            }
            setError(json.error)
            setIsLoading(false)
        }
        if (!json.error) {


            json.forEach((item)=> {
                if (item.isBlocked) {
                    setBlockedUsers(prevBlockedUsers => [...prevBlockedUsers, item]);
                } else {
                    setActiveUsers(prevActiveUsers => [...prevActiveUsers, item]);
                }
            });
            setIsLoading(false)

        }
    }

    return { getUsers, isLoading, error,blockedUsers,setBlockedUsers,activeUsers,setActiveUsers}
}