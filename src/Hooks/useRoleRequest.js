import { useState} from 'react'
import {toast} from "react-toastify";
import {useAuthContext} from "../services/useAuthContext";
import axios from "axios";
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

   const checkRequest = async () => {
    setFetching(true);
    const token = localStorage.getItem('token'); // Récupérer le token JWT

    if (!token) {
        console.error('Token missing! Please log in again.');
        toast.error('Please log in to check your request.');
        setFetching(false);
        return;
    }
    
   
    try {
        // Effectue une requête GET avec Axios
        const response = await axios.get('/api/User/check-request', {
            headers: {
                'Authorization': `Bearer ${token}` // Ajout du token dans l'en-tête
            }
        });
    
        // Les données sont directement dans response.data avec Axios
        const data = response.data;
    
        // Vérifie si le statut HTTP est une erreur (Axios renvoie automatiquement une erreur pour les statuts non 2xx)
        console.log('Role request data:', data);
    
    } catch (error) {
        // Gère les erreurs de requête réseau ou les erreurs serveur
        console.error('Error checking request:', error.message);
        toast.error('Error fetching the role request.');
    } finally {
        // Désactive l'état de chargement ou de traitement
        setFetching(false);
    }
    return { submitRequest };
}
    

    const fetchRequests = async ()=> {
        setIsLoading(true);
        const token = localStorage.getItem('token'); // Récupérer le token JWT
        if (!token) {
            console.error('Token missing! Please log in again.');
            toast.error('Please log in to check your request.');
            setIsLoading(false);
            return;
        }
    
        const response = await axios.get(`/api/User/requests`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // Ajoutez le token dans l'en-tête
                // Bien que non nécessaire pour GET, c'est correct
            }})
            const json = response.data;

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
    const acceptRequest = async (request) => {
        setFetching(true); // Active l'état de chargement
    
        try {
            // Effectue la requête PUT avec axios
            const response = await axios.put('/api/User/accept', request, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
    
            // Le résultat de la requête est directement dans `response.data` avec axios
            const json = response.data;
    
            // Gérer les erreurs si elles existent
            if (json.error) {
                if (json.error === 'jwt expired') {
                    localStorage.removeItem('token');
                    toast.dark('Please, re-sign in');
                    dispatch({ type: 'LOGOUT' });
                }
                setError(json.error);
                toast.error(json.error);
            } else {
                // Si tout va bien, traiter la réponse ici si nécessaire
                toast.success('Request accepted successfully');
            }
        } catch (error) {
            // Gérer les erreurs de requête, telles que les erreurs réseau ou serveur
            setError(error.message);
            toast.error('An error occurred: ' + error.message);
        } finally {
            // Désactive l'état de chargement
            setFetching(false);
        }
    };
    
    const rejectRequest = async (request)=> {
        setFetching(true);
        const response = await axios.put(`/api/User/reject`,request, {
            method: 'PUT',
            headers: {
              
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          
        })  ; 
        const json = response.data;

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