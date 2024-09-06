import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { useRoleRequest } from "../../../../../Hooks/useRoleRequest";
import { toast } from "react-toastify";
import axios from "axios";

const DatatablePstatus = () => {
    const [users, setUsers] = useState([]);
    const { acceptRequest, rejectRequest } = useRoleRequest();

    // Fonction pour récupérer les demandes
    const fetchRequests = async () => {
        try {
            const response = await axios.get('/api/User/requests');
            console.log(response.data); // Ajoutez cette ligne pour vérifier les données
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            toast.error("Failed to fetch requests");
        }
    };

    // Utilisez useEffect pour appeler fetchRequests lors du premier rendu
    useEffect(() => {
        fetchRequests();
    }, []);

    // Fonction pour accepter une demande
    const handleAccept = async (item) => {
        try {
            const updatedItem = {
                codeClient: item.codeClient,
                codeAgent: item.codeAgent,
                Nom: item.Nom,
                prenom: item.prenom,
                phone: item.phone,
                adresse: item.adresse,
                email: item.email,
                cin: item.cin,
                typePerson: item.typePerson,
                ville: item.ville,
                codePostal: item.codePostal,
                typeIdentifiant: item.typeIdentifiant,
                dateCreation: item.dateCreation,
            };
            await acceptRequest(updatedItem);
            toast.success("Request accepted successfully");
            fetchRequests(); // Rafraîchir les données après l'action
        } catch (error) {
            console.error("Failed to accept request:", error);
            toast.error("Failed to accept request");
        }
    };

    // Fonction pour rejeter une demande
    const handleReject = async (item) => {
        try {
            const updatedItem = {
                codeClient: item.codeClient,
                codeAgent: item.codeAgent,
                Nom: item.Nom,
                prenom: item.prenom,
                phone: item.phone,
                adresse: item.adresse,
                email: item.email,
                cin: item.cin,
                typePerson: item.typePerson,
                ville: item.ville,
                codePostal: item.codePostal,
                typeIdentifiant: item.typeIdentifiant,
                dateCreation: item.dateCreation,
            };
            await rejectRequest(updatedItem);
            toast.success("Request rejected successfully");
            fetchRequests(); // Rafraîchir les données après l'action
        } catch (error) {
            console.error("Failed to reject request:", error);
            toast.error("Failed to reject request");
        }
    };

    // Configuration du tableau de données
    const dataTable = {
        columns: [
            { label: 'Logo', field: 'logo' },
            { label: 'Full Name', field: 'fullname' },
            { label: 'Email', field: 'email' },
            { label: 'Code Client', field: 'codeClient' },
            { label: 'Code Agent', field: 'codeAgent' },
            { label: 'Phone', field: 'phone' },
            { label: 'Address', field: 'adresse' },
            { label: 'CIN', field: 'cin' },
            { label: 'Type Person', field: 'typePerson' },
            { label: 'City', field: 'ville' },
            { label: 'Postal Code', field: 'codePostal' },
            { label: 'Type Identifier', field: 'typeIdentifiant' },
            { label: 'Date of Creation', field: 'dateCreation' },
            { label: 'Requested Role', field: 'requestedRole' },
            { label: 'Action', field: 'action' },
        ],
        rows: users.map((request) => ({
            logo: (
                <div className="d-flex align-items-center">
                    <div className="avatar avatar-image mx-2">
                        <img src={request.avatar || '/default-avatar.png'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: "50%" }} alt="Avatar" />
                    </div>
                </div>
            ),
            fullname: `${request.Nom || 'Unknown'} ${request.prenom || ''}`,
            email: request.email || 'No Email',
            codeClient: request.codeClient || 'N/A',
            codeAgent: request.codeAgent || 'N/A',
            phone: request.phone || 'No Phone',
            adresse: request.adresse || 'No Address',
            cin: request.cin || 'No CIN',
            typePerson: request.typePerson || 'Unknown',
            ville: request.ville || 'No City',
            codePostal: request.codePostal || 'No Code',
            typeIdentifiant: request.typeIdentifiant || 'No Identifier',
            dateCreation: request.dateCreation || 'No Date',
            requestedRole: (
                <div>
                    <span className="badge badge-primary">
                        {request.requestedRole === 10 ? "Client" :
                            request.requestedRole === 20 ? "Agent" :
                                "UNKNOWN"}
                    </span>
                </div>
            ),
            action: (
                <div>
                    <ul>
                        <li className="pb-2">
                            <button className="btn btn-success pr-4" onClick={() => handleAccept(request)}>
                                Accept
                            </button>
                        </li>
                        <li>
                            <button className="btn btn-danger" onClick={() => handleReject(request)}>
                                Decline
                            </button>
                        </li>
                    </ul>
                </div>
            ),
        })),
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-xl-12">
                    <div className="table-responsive">
                        <div className="display mb-4 dataTablesCard no-footer order-list-table">
                            <MDBDataTable striped small data={dataTable} />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DatatablePstatus;
