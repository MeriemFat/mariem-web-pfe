// components
import {toast} from 'react-toastify';

// hooks
import {useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {useAuthContext} from "../services/useAuthContext";

const useFileReader = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message,setMessage] = useState('')
    const {dispatch} = useAuthContext()
    // define a function that handles the file upload event
    const handleFile = (id) => {
        // get the file object from the event
        const file = id.target.files[0];

        // check if a file was selected; if not, exit the function
        if (!file) {
            toast.error("Please select a file")
            return;
        }
        // check if the file type is supported (JPEG, PNG, or WEBP); if not, show an error message and exit the function
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
            toast.error("File type not supported")
            return;
        }
        // create a new FileReader object
        const reader = new FileReader();
        // read the file as a data URL
        reader.readAsDataURL(file);
        // set up an error handler for the reader
        reader.onerror = () => {
            toast.error('Something went wrong. Please try again.');
        }
        // set up a loading indicator while the file is being loaded
        reader.onloadstart = () => setLoading(true);
        // when the file is finished loading, set the file state and turn off the loading indicator
        const formData = new FormData();
        formData.append('avatar', file);

        reader.onloadend = async () => {
            try {
                const resp = await fetch('http://localhost:3000/buffet/avatar/' + id,{
                    method: 'PUT',
                    body: formData,
                });
                const json = await resp.json();
                if(json.error){
                    setMessage(json.error)
                    toast.error(json.error);
                }
                if(!json.error){
                    toast.success('Your avatar is successfully updated!')
                }
                setLoading(false);
            } catch (error) {
                   if(error.message === "LOGIN AGAIN!"){
                }
                console.error('Error uploading avatar:', error.message);
            }
        };
    }

    return {file, setFile, handleFile, loading,message};
}

export default useFileReader