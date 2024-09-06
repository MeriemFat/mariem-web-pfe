import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageTitle from '../../../layouts/PageTitle';
import { Modal, Button, Form } from 'react-bootstrap';

const Review = () => {
    const [demandes, setDemandes] = useState([]);
    const [emailForm, setEmailForm] = useState({ subject: '', text: '' });
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get('/api/demande/getAllDemande');
                const updatedDemandes = response.data.map(demande => ({
                    ...demande,
                    etatDemande: 'En Cours De Traitement'
                }));
                setDemandes(updatedDemandes);
            } catch (error) {
                console.error('Error fetching demandes:', error);
            }
        };

        fetchDemandes();
    }, []);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    };

    const deleteDemande = async (id) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to delete this demande?');
            if (!isConfirmed) return;

            const response = await axios.delete(`http://localhost:3000/demande/delete/${id}`);
            toast(response.data.message, { type: 'success' });
            setDemandes(demandes.filter((demande) => demande._id !== id));
        } catch (error) {
            console.error('Error deleting demande:', error);
        }
    };

    const handleResponseChange = (e) => {
        setEmailForm({
            ...emailForm,
            [e.target.name]: e.target.value
        });
    };

    const handleResponseSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDemande) {
            toast.error('Veuillez sélectionner une demande.');
            return;
        }
        try {
            const response = await axios.post(`/api/demande/repondreDemandeParEmail/${selectedDemande.codeClient}`, {
                subject: emailForm.subject,
                text: emailForm.text
            });
            toast(response.data.message, { type: 'success' });
            setEmailForm({ subject: '', text: '' }); // Réinitialiser le formulaire
            setShowModal(false); // Fermer le modal
            setSelectedDemande(null); // Réinitialiser la demande sélectionnée

            // Mettre à jour l'état local de la demande
            setDemandes(demandes.map(demande => 
                demande._id === selectedDemande._id ? { ...demande, etatDemande: 'Traité' } : demande
            ));
        } catch (error) {
            console.error('Error sending email:', error);
            toast('Error sending email', { type: 'error' });
        }
    };

    const demandeTable = demandes.map((demande, ind) => ({
        _id: demande._id,
        email: demande.email,
        description: demande.description,
        etatDemande: demande.etatDemande,
        TypeDemande: demande.TypeDemande,
        codeClient: demande.codeClient,
        codeAgent: demande.codeAgent,
        date: formatDate(demande.createdAt),
    }));

    return (
        <Fragment>
            <PageTitle activeMenu="Demandes" motherMenu="Home" />
            <div className="row">
                <div className="col-xl-12">
                    <div className="card demande-table p-0 border-0">
                        {demandeTable.map((item, ind) => (
                            <div className="row align-items-center p-4 border-bottom" key={ind}>
                                <div className="col-xl-4 col-xxl-4 col-lg-5 col-md-12">
                                    <div className="media align-items-center">
                                        <div className="form-check custom-checkbox me-4">
                                            <label className="form-check-label"
                                                   htmlFor={`customCheckBox${ind}`}></label>
                                        </div>
                                        <Link to="#">
                                            <div className="card-body p-0">
                                                <h3 className="fs-20 text-black font-w600 mb-2">
                                                    <p className="text-primary fs-14 mb-0">{item.email}</p>
                                                    <Link to="/app-profile" className="text-black">{item.codeClient}</Link>
                                                </h3>
                                                <span className="text-dark">{item.date}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-5 col-xxl-4 col-lg-7 col-md-12 mt-3 mt-lg-0">
                                    <p className="mb-0 text-dark">{item.description}</p>
                                </div>
                                <div className="col-xl-3 col-xxl-4 col-lg-7 col-md-12 offset-lg-5 offset-xl-0 media-footer mt-xl-0 mt-3">
                                    <div className="row">
                                        <div className="text-xl-center col-xl-7 col-sm-9 col-lg-8 col-6">
                                            <h2 className="text-black font-w600">{item.TypeDemande}</h2>
                                            <span className={`badge ${item.etatDemande === 'Traité' ? 'badge-traite' : 'badge-en-cours'}`} 
                                                  style={{ 
                                                      backgroundColor: item.etatDemande === 'Traité' ? '#28a745' : '#007bff', 
                                                      color: 'white'
                                                  }}>
                                                {item.etatDemande}
                                            </span>
                                        </div>
                                        <div className="edit ms-auto col-xl-5 col-sm-3 col-lg-4 col-6">
                                            <Link to={"#"}>
                                                <i className="fa fa-trash text-danger" style={{ fontSize: "24px" }} onClick={() => deleteDemande(item._id)} />
                                            </Link>
                                            <Button
                                                className="btn btn-primary ms-2"
                                                onClick={() => {
                                                    setSelectedDemande(item);
                                                    setEmailForm({ subject: '', text: '' }); // Réinitialiser le formulaire
                                                    setShowModal(true); // Ouvrir le modal
                                                }}
                                            >
                                                Répondre
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Répondre à la demande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleResponseSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject"
                                value={emailForm.subject}
                                onChange={handleResponseChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="text"
                                rows={3}
                                value={emailForm.text}
                                onChange={handleResponseChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send Response
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default Review;
