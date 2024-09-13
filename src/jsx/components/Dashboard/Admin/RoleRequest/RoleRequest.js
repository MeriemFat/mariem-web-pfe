import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { useRoleRequest } from "../../../../../Hooks/useRoleRequest";
import { toast } from "react-toastify";
import axios from "axios";

const DatatablePstatus = () => {
    const [requests, setRequests] = useState([]);
    const { acceptRequest, rejectRequest } = useRoleRequest();

    // Fonction pour récupérer les demandes
    const fetchRequests = async () => {
        try {
            const response = await axios.get('api/User/requests');
            console.log(response.data); // Ajoutez cette ligne pour vérifier les données
            setRequests(response.data);
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
  
// Fonction pour envoyer une réponse par e-mail
const envoyerReponseEmail = async (item) => {
    try {
      
        await axios.post(`api/User/repondreAcceptParEmail/${item.user._id}`);
        toast.success(`Email envoyé avec succès à ${item.user.email}`);
    } catch (error) {
        console.error("Failed to send email:", error);
        toast.error("Failed to send email");
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
          
            { label: 'Requested Role', field: 'requestedRole' },
            { label: 'Action', field: 'action' },
        ],
        rows: requests.map((request) => ({
                            codeClient: request.user.codeClient,
                            codeAgent: request.user.codeAgent,
                            Nom: request.user.Nom,
                            prenom: request.user.prenom,
                            phone: request.user.phone,
                            adresse: request.user.adresse,
                            email: request.user.email,
                            cin: request.user.cin,
                            typePerson: request.user.typePerson,
                            ville: request.user.ville,
                            codePostal: request.user.codePostal,
                            typeIdentifiant: request.user.typeIdentifiant,
                            dateCreation: request.user.dateCreation,
                            dateDernierMiseAjour: request.user.dateDernierMiseAjour,
                            dateValidite: request.user.dateValidite,
                            roles: request.user.roles,
                            codeParent: request.user.codeParent,
                            avatar: request.user.avatar,
                           
            requestedRole: (
                <div>
                    <span className="badge badge-primary">
                        {request.user.requestedRole === 10 ? "CLIENT" :
                            request.user.requestedRole === 20 ? "AGENT" :
                             request.user.requestedRole === 30 ? "ADMIN" 
                              : "UNKNOWN"}
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
                      
                        <li>
                            <li><br></br></li>
                        <button className="btn btn-success pr-4" onClick={() => envoyerReponseEmail(request)}>
                         Envoyer 
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
