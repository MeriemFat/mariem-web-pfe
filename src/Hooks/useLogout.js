import {toast} from "react-toastify";
import {useAuthContext} from "../services/useAuthContext";

export const useLogout = ()=>{
    const {dispatch} = useAuthContext();

    const logout= () =>{

        localStorage.removeItem('token');
        toast.dark('See you next time!');
        dispatch({type:'LOGOUT'})
    }

    return {logout}
}