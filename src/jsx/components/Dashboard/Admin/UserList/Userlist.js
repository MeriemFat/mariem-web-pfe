import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { useBlockUser } from '../../../../../Hooks/useBlockUser';
import 'bootstrap/dist/css/bootstrap.min.css';

const DatatablePstatus = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [codeClient, setCodeClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const { toggleBlock } = useBlockUser();

    const handleBlock = async (userId, isBlocked) => {
        try {
            await toggleBlock(userId);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isBlocked: !isBlocked } : user
            ));
        } catch (err) {
            console.error('Error blocking user:', err);
            setError('Erreur lors du blocage de l\'utilisateur. Veuillez réessayer.');
        }
    };

    const fetchUsers = async () => {
        if (!codeClient) {
            console.error('codeClient is not defined');
            return;
        }
        try {
            const response = await axios.get(`/api/User/getAllusers`);
            console.log('API response:', response); // Vérifiez la réponse de l'API
            if (Array.isArray(response.data)) {
                setUsers(response.data);
                setError(null);
            } else {
                console.error('Fetched data is not an array:', response.data);
                setError('Les données récupérées ne sont pas dans le format attendu.');
            }
        } catch (error) {
            console.error('Error fetching users:', error.response ? error.response.data : error.message);
            setError('Erreur lors de la récupération des utilisateurs. Veuillez vérifier la console pour plus de détails.');
        }
    };

    useEffect(() => {
        const storedCodeClient = localStorage.getItem('codeClient');
        console.log('Stored codeClient:', storedCodeClient); // Vérifiez le codeClient
        if (storedCodeClient) {
            setCodeClient(storedCodeClient);
        } else {
            console.warn('Aucun codeClient trouvé dans le localStorage');
        }
    }, []);

    useEffect(() => {
        if (codeClient) {
            fetchUsers();
        }
    }, [codeClient]);

    const columnStyle = {
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    };

    const avatarStyle = {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '50%',
    };

    const btnStyle = {
        fontSize: '0.8rem',
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const dataTable = {
        columns: [
            { label: 'Code Client', field: 'codeClient', sort: 'asc', width: 150 },
            { label: 'Code Agent', field: 'codeAgent', sort: 'asc', width: 150 },
            { label: 'Nom', field: 'Nom', width: 200 },
            { label: 'Prénom', field: 'prenom', width: 200 },
            { label: 'Téléphone', field: 'phone', width: 150 },
            { label: 'Rôles', field: 'roles', width: 200 },
            { label: 'Bloqué', field: 'isBlocked', width: 100 },
            { label: 'Action', field: 'Action', width: 150 },
        ],
        rows: users.map((user) => {
            return {
                codeClient: <div style={columnStyle} onClick={() => handleRowClick(user)}>{user.codeClient || 'N/A'}</div>,
                codeAgent: <div style={columnStyle} onClick={() => handleRowClick(user)}>{user.codeAgent || 'N/A'}</div>,
                Nom: <div style={columnStyle} onClick={() => handleRowClick(user)}>{user.Nom || 'N/A'}</div>,
                prenom: <div style={columnStyle} onClick={() => handleRowClick(user)}>{user.prenom || 'N/A'}</div>,
                phone: <div style={columnStyle} onClick={() => handleRowClick(user)}>{user.phone || 'N/A'}</div>,
                roles: (
                    <span onClick={() => handleRowClick(user)}>
                        {user.roles && user.roles.length > 0 ? user.roles.map((role) => {
                            let roleLabel = '';
                            switch (role) {
                                case 30:
                                    roleLabel = 'Admin';
                                    break;
                                case 10:
                                    roleLabel = 'Client';
                                    break;
                                case 1:
                                    roleLabel = 'USER';
                                    break;
                                case 20:
                                    roleLabel = 'AGENT';
                                    break;
                                default:
                                    roleLabel = role.toString();
                                    break;
                            }
                            return (
                                <span key={role} className="btn bgl-warning text-warning btn-sm w-100 mb-2" style={btnStyle}>
                                    {roleLabel}
                                </span>
                            );
                        }) : 'Aucun rôle'}
                    </span>
                ),
                isBlocked: user.isBlocked ? (
                    <span className="btn bgl-warning text-warning btn-sm" onClick={() => handleRowClick(user)}>Actif</span>
                ) : (
                    <span className="btn bgl-light btn-sm" onClick={() => handleRowClick(user)}>Inactif</span>
                ),
                Action: (
                    <div>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li className="pb-2">
                                {user.isBlocked ? (
                                    <button className="btn bg-success text-white w-100 pb-2 pt-2" onClick={() => handleBlock(user._id, user.isBlocked)}>
                                        Débloquer
                                    </button>
                                ) : (
                                    <button className="btn btn-danger w-100 pb-2 pt-2" onClick={() => handleBlock(user._id, user.isBlocked)}>
                                        Bloquer
                                    </button>
                                )}
                            </li>
                        </ul>
                    </div>
                ),
            };
        }),
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-xl-12">
                    <div className="table-responsive">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="display mb-4 dataTablesCard no-footer order-list-table">
                            <MDBDataTable
                                striped
                                small
                                data={dataTable}
                                searching={true}
                                paging={true}
                                sortable={true}
                                noBottomColumns
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'utilisateur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p><strong>Code Client:</strong> {selectedUser.codeClient}</p>
                            <p><strong>Code Agent:</strong> {selectedUser.codeAgent}</p>
                            <p><strong>Nom:</strong> {selectedUser.Nom}</p>
                            <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
                            <p><strong>Téléphone:</strong> {selectedUser.phone}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Adresse:</strong> {selectedUser.adresse}</p>
                            <p><strong>CIN:</strong> {selectedUser.cin}</p>
                            <p><strong>Type de Personne:</strong> {selectedUser.typePerson ? selectedUser.typePerson.join(', ') : 'N/A'}</p>
                            <p><strong>Ville:</strong> {selectedUser.ville}</p>
                            <p><strong>Code Postal:</strong> {selectedUser.codePostal}</p>
                            <p><strong>Type d'Identifiant:</strong> {selectedUser.typeIdentifiant}</p>
                            <p><strong>Date de Création:</strong> {selectedUser.dateCreation ? new Date(selectedUser.dateCreation).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Dernière Mise à Jour:</strong> {selectedUser.dateDernierMiseAjour ? new Date(selectedUser.dateDernierMiseAjour).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Date de Validité:</strong> {selectedUser.dateValidite ? new Date(selectedUser.dateValidite).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Code Parent:</strong> {selectedUser.codeParent}</p>
                            <p><strong>Numéro d'Inscription:</strong> {selectedUser.numInscription}</p>
                            <p><strong>Matricule:</strong> {selectedUser.matricule}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default DatatablePstatus;
