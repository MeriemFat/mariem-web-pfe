import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileImg from "../../../images/avatar/1.jpg";
import axios from "axios";
import { useAuthContext } from "../../../services/useAuthContext";
import { toast } from "react-toastify";
import Unauthorized from "../../pages/Unauthorized";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Complaint = () => {
    const { USER } = useAuthContext();
    const [userData, setUserData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        codeClient: "",
        codeAgent: "",
        Nom: "",
        prenom: "",
        phone: "",
        adresse: "",
        email: "",
        cin: "",
        typePerson: "",
        ville: "",
        codePostal: "",
        typeIdentifiant: "",
        dateCreation: "",
        dateDernierMiseAjour: "",
        dateValidite: "",
        roles: [],
        codeParent: "",
        avatar: "",
      
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/User/getProfile`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                        'Content-Type': 'application/json' 
                    }
                });
                const data = response.data;
                setUserData(data);
                setFormData({
                    codeClient: data.codeClient,
                    codeAgent: data.codeAgent,
                    Nom: data.Nom,
                    prenom: data.prenom,
                    phone: data.phone,
                    adresse: data.adresse,
                    email: data.email,
                    cin: data.cin,
                    typePerson: data.typePerson,
                    ville: data.ville,
                    codePostal: data.codePostal,
                    typeIdentifiant: data.typeIdentifiant,
                    dateCreation: data.dateCreation,
                    dateDernierMiseAjour: data.dateDernierMiseAjour,
                    dateValidite: data.dateValidite,
                    roles: data.roles,
                    codeParent: data.codeParent,
                    avatar: data.avatar,
                  

                });
            } catch (error) {
                toast.error("Error fetching user data");
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put('/api/User/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assurez-vous que `yourToken` est défini et correctement initialisé
                    'Content-Type': 'application/json' // Spécifiez le type de contenu si nécessaire
                }
            });
    
            if (response.status === 200) {
                toast.success("Profile updated successfully");
                setUserData(formData);
                setShowModal(false); // Close modal after save
            } else {
                // Gérez les autres codes de statut HTTP si nécessaire
                toast.error(`Error updating profile: ${response.status}`);
            }
        } catch (error) {
            // Affichez des erreurs détaillées
            console.error('Error updating profile:', error);
            toast.error(`Error updating profile: ${error.response?.data?.message || 'Server error'}`);
        }
    };
    
    return (
       
            <Fragment>
                <div className="row">
                    <div className="col-xl-9 col-xxl-8 col-lg-8">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card profile-card">
                                    <div className="card-header flex-wrap border-0 pb-0">
                                        <h3 className="fs-24 text-black font-w600 me-auto mb-2 pr-3">
                                            User Profile
                                        </h3>
                                        {!editMode && (
                                            <Button
                                                variant="dark"
                                                className="light btn-rounded me-3 mb-2"
                                                onClick={() => setShowModal(true)}
                                            >
                                                Edit Profile
                                            </Button>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        {!editMode && (
                                            <div>
                                                <div className="mb-5">
                                                    <div className="title mb-4">
                                                        <span className="fs-18 text-black font-w600">General Information</span>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Full Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={`${userData.Nom} ${userData.prenom}`}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Email</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.email}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Phone Number</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.phone}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Address</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.adresse}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>CIN</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.cin}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Type Person</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.typePerson}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>City</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.ville}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-sm-6">
                                                            <div className="form-group">
                                                                <label>Postal Code</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={userData.codePostal}
                                                                    disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-xxl-8 col-lg-8">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card flex-lg-column flex-md-row">
                                    <div className="card-body text-center border-bottom profile-bx">
                                        <div className="profile-image mb-4">
                                            <img
                                                src={userData.avatar ? userData.avatar : profileImg}
                                                className="rounded-circle"
                                                alt=""
                                            />
                                        </div>
                                        <h4 className="fs-22 text-black mb-1">{userData.Nom} {userData.prenom}</h4>
                                        <p className="mb-4">
                                            {USER?.roles?.includes(20) ? (
                                                <p>AGENT</p>
                                            ) : USER?.roles?.includes(30) ? (
                                                <p>ADMIN</p>
                                            ) : USER?.roles?.includes(10) ? (
                                                <p>Client</p>
                                            ) : (
                                                <p>USER</p>
                                            )}
                                        </p>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="border rounded p-2">
                                                    <h4 className="fs-22 text-black font-w600">
                                                        {userData.ville}
                                                    </h4>
                                                    <span className="text-black">City</span>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="border rounded p-2">
                                                    <h4 className="fs-22 text-black font-w600">
                                                        {userData.codePostal}
                                                    </h4>
                                                    <span className="text-black">Postal Code</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formCodeClient">
                                <Form.Label>Code Client</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codeClient"
                                    value={formData.codeClient}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCodeAgent">
                                <Form.Label>Code Agent</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codeAgent"
                                    value={formData.codeAgent}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formNom">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nom"
                                    value={formData.Nom}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPrenom">
                                <Form.Label>Prenom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAdresse">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCin">
                                <Form.Label>CIN</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formTypePerson">
                                <Form.Label>Type Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="typePerson"
                                    value={formData.typePerson}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formVille">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ville"
                                    value={formData.ville}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCodePostal">
                                <Form.Label>Postal Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codePostal"
                                    value={formData.codePostal}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formTypeIdentifiant">
                                <Form.Label>Type Identifiant</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="typeIdentifiant"
                                    value={formData.typeIdentifiant}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDateCreation">
                                <Form.Label>Date Creation</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateCreation"
                                    value={formData.dateCreation}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDateDernierMiseAjour">
                                <Form.Label>Date Dernier Mise Ajour</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateDernierMiseAjour"
                                    value={formData.dateDernierMiseAjour}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDateValidite">
                                <Form.Label>Date Validite</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateValidite"
                                    value={formData.dateValidite}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formRoles">
                                <Form.Label>Roles</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="roles"
                                    value={formData.roles.join(', ')}
                                    onChange={(e) => setFormData({ ...formData, roles: e.target.value.split(', ') })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCodeParent">
                                <Form.Label>Code Parent</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codeParent"
                                    value={formData.codeParent}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formAvatar">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                           
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        
    );
};

export default Complaint;
