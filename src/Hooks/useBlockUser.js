import { useState } from 'react';
import { toast } from 'react-toastify';

export const useBlockUser = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // renamed Loading to loading for consistency

    const toggleBlock = async (_id) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/User/toggle-block', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id })
            });

            const json = await response.json();

            if (response.ok) {
                toast.success(json.message);
            } else {
                throw new Error(json.error || 'Failed to toggle block');
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { toggleBlock, loading, error };
};
