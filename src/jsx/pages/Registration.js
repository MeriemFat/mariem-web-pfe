import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import logo from '../../images/avatar.gif';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useForm, setError as formSetError } from "react-hook-form";
import loginbg from "../../images/bg-registrer.jpeg";
import './styles.css';

function Register({ errorMessage, successMessage }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors }, setError } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (formData) => {
        let errorObj = {};

        if (!formData.codeClient) errorObj.codeClient = 'Code Client is required';
        if (!formData.codeAgent) errorObj.codeAgent = 'Code Agent is required';
        if (!formData.Nom) errorObj.Nom = 'Nom is required';
        if (!formData.prenom) errorObj.prenom = 'Prénom is required';
        if (!formData.phone) errorObj.phone = 'Téléphone is required';
        if (!formData.adresse) errorObj.adresse = 'Adresse is required';
        if (!formData.email) {
            errorObj.email = 'Email is required';
        } else if (!/^\S+@\S+$/i.test(formData.email)) {
            errorObj.email = 'Invalid email address';
        }
        if (!formData.cin) errorObj.cin = 'CIN is required';
        if (!formData.ville) errorObj.ville = 'Ville is required';
        if (!formData.codePostal) errorObj.codePostal = 'Code Postal is required';
        if (!formData.typeIdentifiant) errorObj.typeIdentifiant = 'Type Identifiant is required';
        if (!formData.password) errorObj.password = 'Password is required';
        if (!formData.confirmPassword) errorObj.confirmPassword = 'Confirm Password is required';
        if (formData.password !== formData.confirmPassword) errorObj.confirmPassword = 'Passwords do not match';

        // Applique les erreurs au formulaire
        for (const [key, message] of Object.entries(errorObj)) {
            setError(key, { type: 'manual', message });
        }

        return errorObj;
    };

    const checkEmailExists = async (email) => {
        const response = await fetch(`/api/User/checkEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const json = await response.json();
        return json.exists;
    };

    const onSignUp = async (formData) => {
        const errorObj = validateForm(formData);
        if (Object.keys(errorObj).length > 0) {
            return; // Les erreurs ont déjà été gérées par setError
        }

        setIsLoading(true);

        const emailExists = await checkEmailExists(formData.email);

        if (emailExists) {
            setIsLoading(false);
            setError('email', { type: 'manual', message: 'Email already in use' });
            toast.error('Email already in use');
            return;
        }

        const response = await fetch('/api/User/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const json = await response.json();
        setIsLoading(false);

        if (json.error) {
            setError('server', { type: 'manual', message: json.error });
            toast.error(json.error);
        } else {
            localStorage.setItem('token', json.accessToken);
            const user = jwtDecode(json.accessToken.toString()).user;
            dispatch({ type: 'LOGIN', payload: user });
            toast.success(`Account created! Please check your email ${json.email} to confirm your account.`);
            navigate("/login");
        }
    };
    return (
        <div className='top'>
            <div className=''>
                <div className='container h-100'>
                    <div className='row justify-content-center h-100 align-items-center'>
                        <div className='col-md-6'>
                            <div className='authincation-content'>
                                <div className='row no-gutters'>
                                    <div className='col-xl-12'>
                                        <div className='auth-form'>
                                            <div className='text-center mb-3'>
                                                <img src={logo} alt="" />
                                            </div>
                                            <h4 className='text-center mb-4'>Inscrivez-vous votre compte</h4>
                                            {errorMessage && (
                                                <div className='bg-red-300 text-danger border border-red-900 p-1 my-2'>
                                                    {errorMessage}
                                                </div>
                                            )}
                                            {successMessage && (
                                                <div className='bg-green-300 text-danger text-green-900 p-1 my-2'>
                                                    {successMessage}
                                                </div>
                                            )}
       <form onSubmit={handleSubmit(onSignUp)}>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Code Client</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Code Client'
                                                           {...register('codeClient', { required: 'Code Client is required' })} />
                                                    {errors.codeClient && <div className="text-danger fs-12">{errors.codeClient.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Code Agent</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Code Agent'
                                                           {...register('codeAgent', { required: 'Code Agent is required' })} />
                                                    {errors.codeAgent && <div className="text-danger fs-12">{errors.codeAgent.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Nom</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Nom'
                                                           {...register('Nom', { required: 'Nom is required' })} />
                                                    {errors.Nom && <div className="text-danger fs-12">{errors.Nom.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Prénom</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Prénom'
                                                           {...register('prenom', { required: 'Prénom is required' })} />
                                                    {errors.prenom && <div className="text-danger fs-12">{errors.prenom.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Téléphone</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Téléphone'
                                                           {...register('phone', { required: 'Téléphone is required' })} />
                                                    {errors.phone && <div className="text-danger fs-12">{errors.phone.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Adresse</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Adresse'
                                                           {...register('adresse', { required: 'Adresse is required' })} />
                                                    {errors.adresse && <div className="text-danger fs-12">{errors.adresse.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Email</strong>
                                                    </label>
                                                    <input type="email" className="form-control"
                                                           {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} />
                                                    {errors.email && <div className="text-danger fs-12">{errors.email.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>CIN</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='CIN'
                                                           {...register('cin', { required: 'CIN is required' })} />
                                                    {errors.cin && <div className="text-danger fs-12">{errors.cin.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Ville</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Ville'
                                                           {...register('ville', { required: 'Ville is required' })} />
                                                    {errors.ville && <div className="text-danger fs-12">{errors.ville.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Code Postal</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Code Postal'
                                                           {...register('codePostal', { required: 'Code Postal is required' })} />
                                                    {errors.codePostal && <div className="text-danger fs-12">{errors.codePostal.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Type Identifiant</strong>
                                                    </label>
                                                    <input type='text' className='form-control' placeholder='Type Identifiant'
                                                           {...register('typeIdentifiant', { required: 'Type Identifiant is required' })} />
                                                    {errors.typeIdentifiant && <div className="text-danger fs-12">{errors.typeIdentifiant.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Mot de Passe</strong>
                                                    </label>
                                                    <input type='password' className='form-control' placeholder='Mot de Passe'
                                                           {...register('password', { required: 'Password is required' })} />
                                                    {errors.password && <div className="text-danger fs-12">{errors.password.message}</div>}
                                                </div>
                                                <div className='form-group'>
                                                    <label className='mb-1'>
                                                        <strong>Confirmez Mot de Passe</strong>
                                                    </label>
                                                    <input type='password' className='form-control' placeholder='Confirmez Mot de Passe'
                                                           {...register('confirmPassword', { required: 'Confirm Password is required' })} />
                                                    {errors.confirmPassword && <div className="text-danger fs-12">{errors.confirmPassword.message}</div>}
                                                </div>
                                                <div className='text-center'>
                                                     <button type='submit' className='btn btn-primary btn-block' style={{ backgroundColor: '#a72720' }}
                        disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Sign Up'}
                </button>
                                                </div>
                                            </form>
 <div className='new-account mt-3' >
   <p>
     Already have an account?{' '}
      <Link className='text-primary' to='/login'>
        Sign in
         </Link>
  </p>
    </div>
   </div>
   </div>
     </div>
   </div>
   </div>
   </div>
</div>
  </div>
</div>
    );
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};

export default connect(mapStateToProps)(Register);
