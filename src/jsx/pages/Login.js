import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../Hooks/useLogin';
import logo from '../../images/logo.png';
import loginv from "../../images/bg-login2.jpg";
import {toast} from "react-toastify";
import'./styles.css';
function Login(props) {
    const [open, setOpen] = useState(false);
    const { login, error, isLoading } = useLogin();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    const onSubmit = async (data) => {
        await login(data.email, data.password);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit(onSubmit)();
            }
        };

        const formElement = document.querySelector('form');
        if (formElement) {
            formElement.addEventListener('keypress', handleKeyPress);
        }

        return () => {
            if (formElement) {
                formElement.removeEventListener('keypress', handleKeyPress);
            }
        };
    }, [handleSubmit, onSubmit]);

    return (
        <div className="login-main-page top">
            <div className="login-wrapper">
                <div className="login-aside-left" style={{ backgroundImage: `url(${loginv})`}}>
                    <Link to="/dashboard" className="login-logo" >
                        <img src={logo} alt="logo" className="me-2" style={{width:70 , height:70 , margin:-35 , marginLeft:-35}} />
                    </Link>
                    <div className="login-description" style={{margin : 2}}>
                        <ul className="social-icons mt-4">
                            <li><Link to="https://www.facebook.com/Assurancesattakafulia?ref=hl"><i className="fab fa-facebook-f"></i></Link></li>
                            <li><Link to="https://twitter.com/Attakafulia"><i className="fab fa-twitter"></i></Link></li>
                            <li><Link to="http://tn.linkedin.com/company/assurances-attakafulia?trk=ppro_cprof"><i className="fab fa-linkedin-in"></i></Link></li>
                        </ul>
                      
                    </div>
                </div>
                <div className="login-aside-right" style={{ backgroundColor: '#a72720' }}>
                    <div className="row m-0 justify-content-center h-100 align-items-center">
                        <div className="col-xl-9 col-xxl-9">
                            <div className="authincation-content">
                                <div className="row no-gutters">
                                    <div className="col-xl-12">
                                        <div className="auth-form-1">
                                            <div className="mb-4">
                                                <h3 className="text-white mb-1">Bienvenu chez AlTakafolia </h3>
                                                <p className="text-white">Connectez-vous en saisissant les informations ci-dessous</p>
                                            </div>
                                            {props.errorMessage && (
                                                <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                                                    {props.errorMessage}
                                                </div>
                                            )}
                                            {props.successMessage && (
                                                <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                                                    {props.successMessage}
                                                </div>
                                            )}
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="form-group">
                                                    <label className="mb-2 ">
                                                        <strong className="text-white">Email</strong>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                                                    />
                                                    {errors.email && (
                                                        <div className="text-danger fs-12">{errors.email.message}</div>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label className="mb-2 ">
                                                        <strong className="text-white">Mod De Passe</strong>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        {...register('password', { required: 'Password is required' })}
                                                    />
                                                    {errors.password && (
                                                        <div className="text-danger fs-12">{errors.password.message}</div>
                                                    )}
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <label className="mb-2">
                                                        <strong className="text-white text-decoration-underline">
                                                            <Link className="text-white" to="/forgotPassword">
                                                                Mot De Passe oublier 
                                                            </Link>
                                                        </strong>
                                                    </label>
                                                </div>
                                                <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                                    <div className="form-group">
                                                        <div className="form-check custom-checkbox ms-1 " > 
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id="basic_checkbox_1" 
                                                                style={{ backgroundColor: 'gray', borderColor: 'white' }}
                                                            />
                                                            <label
                                                                className="form-check-label text-white"
                                                                htmlFor="basic_checkbox_1" 
                                                            >
                                                                Rappelez-vous ma préférence
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <button
                                                        type="submit"
                                                        className="btn bg-white text-primary btn-block"
                                                        style={{ color: 'red' }}
                                                    >
                                                      Se connecter
                                                    </button>
                                                </div>
                                            </form>
                                            <div className="new-account mt-2">
                                                <p className="text-white">
                                                    Vous n'avez pas un compte?{" "}
                                                    <Link className="text-white" to="/register">
                                                        Registrer Votre Compte
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

const mapStateToProps = (state) => ({
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
});

export default connect(mapStateToProps)(Login);
