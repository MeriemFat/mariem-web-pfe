import { useState } from 'react';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from "../services/useAuthContext";

export const useLogin = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const login = async (email, password) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/User/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();

            if (json.error) {
                setError(json.error);
                toast.error(json.error);
            } else {
                const token = json.accessToken;
                localStorage.setItem('token', token);

                const user = jwtDecode(token);
                localStorage.setItem('user', JSON.stringify(user));
                 console.log(user)
                if (!user.isBlocked) {
                    dispatch({ type: 'LOGIN', payload: user });
                    toast.success('Login successful');
                    navigate(from, { replace: true });
                } else {
                    setError('Your account has been suspended by an admin');
                    toast.error('Your account has been suspended by an admin');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again later.');
            toast.error('An unexpected error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
