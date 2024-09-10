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
            const response = await axios.get('api/User/requests');
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
            item.user = item.user._id; // Utilisation de user._id
            await acceptRequest(item);
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
            item.user = item.user._id; // Utilisation de user._id
            await rejectRequest(item);
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
            { label: 'codeClient', field: 'codeClient' },
            { label: 'codeAgent', field: 'codeAgent' },
            { label: 'Nom', field: 'Nom' },
            { label: 'prenom', field: 'prenom' },
            { label: 'Code Agent', field: 'codeAgent' },
            { label: 'phone', field: 'phone' },
            { label: 'adresse', field: 'adresse' },
            { label: 'email', field: 'email' },
            { label: 'cin', field: 'cin' },
            { label: 'typePerson', field: 'typePerson' },
            { label: 'ville', field: 'ville' },
            { label: 'codePostal', field: 'codePostal' },
            { label: 'typeIdentifiant', field: 'typeIdentifiant' },
            { label: 'dateCreation', field: 'dateCreation' },
            { label: 'dateDernierMiseAjour', field: 'dateDernierMiseAjour' },
            { label: 'dateValidite', field: 'dateValidite' },
            { label: 'roles', field: 'roles' },
            { label: 'codeParent', field: 'codeParent' },
            { label: 'identifiant', field: 'identifiant' },
            { label: 'Requested Role', field: 'requestedRole' },
            { label: 'Action', field: 'action' },
        ],
        rows: users.map((request) => ({
                           codeClient: request.codeClient,
                            codeAgent: request.codeAgent,
                            Nom: request.Nom,
                            prenom: request.prenom,
                            phone: request.phone,
                            adresse: request.adresse,
                            email: request.email,
                            cin: request.cin,
                            typePerson: request.typePerson,
                            ville: request.ville,
                            codePostal: request.codePostal,
                            typeIdentifiant: request.typeIdentifiant,
                            dateCreation: request.dateCreation,
                            dateDernierMiseAjour: request.dateDernierMiseAjour,
                            dateValidite: request.dateValidite,
                            roles: request.roles,
                            codeParent: request.codeParent,
                            avatar: request.avatar,
                            identifiant: request.identifiant,
            requestedRole: (
                <div>
                    <span className="badge badge-primary">
                        {request.requestedRole === 10 ? "CLIENT" :
                            request.requestedRole === 20 ? "AGENT" :
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
