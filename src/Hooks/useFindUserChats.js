import {useEffect, useState} from 'react'
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {useAuthContext} from "../services/useAuthContext";
import {setChats} from "../features/chats/chatSlice";
import axios from "axios";

export const useFindUserChats = () => {
    const dispatchChat = useDispatch();
    const [error, setError] = useState('')
    const [userChats,setUserChats] = useState([]);
    const [messages,setMessages]= useState([]);
    const [selected,setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const getChats = async () => {
        try {
            setIsLoading(true);
            setError('');
    
            const response = await axios.get('/chat', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const json = response.data; // axios retourne directement les données ici, pas besoin de .json()
    console.log(json); 
            if (json.error) {
                if (json.error === "jwt expired") {
                    toast.error("Your session has expired, please re-sign in.");
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                    setIsLoading(false);
                    return;
                }
    
                setError(json.error);
                setIsLoading(false);
                return;
            }
    
            // Si pas d'erreur
            setUserChats(json);
            dispatchChat(setChats(json));
    
            if (json.length > 0) {
                setSelected(json[0]);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
            setError('An error occurred while fetching chats.');
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false); // Assure que le chargement est terminé, même en cas d'erreur
        }
    };
    



    useEffect(() => {
        async function fetchData() {
            await getChats();
        }
        fetchData();

    }, []);
    return { getChats, isLoading, error, userChats, setUserChats, messages, setMessages,selected,setSelected}
}