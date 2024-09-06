import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Typography,
    TextField,
    Autocomplete
} from '@mui/material';
import { toast } from 'react-toastify';

const DatatablePstatus = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSinistre, setSelectedSinistre] = useState(null);
    const [sinistres, setSinistres] = useState([]);
    const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [newGroupUsers, setNewGroupUsers] = useState([]);
    const [userDetailsMap, setUserDetailsMap] = useState({});

    const fetchSinistres = async () => {
        try {
            const response = await axios.get('/api/sinistres/getAllSinistre');
            setSinistres(response.data);
        } catch (error) {
            console.error('Error fetching sinistres:', error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/User/getall');
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3000/User/getbyId/${userId}`);
            return {
                _id: userId,
                fullname: response.data.fullname,
                email: response.data.email,
                avatar: response.data.avatar,
            };
        } catch (error) {
            console.error(`Error fetching user details for ${userId}:`, error);
            return {
                _id: userId,
                fullname: 'N/A',
                email: 'N/A',
                avatar: 'https://via.placeholder.com/150',
            };
        }
    };

    useEffect(() => {
        fetchSinistres();
        fetchAllUsers();
    }, []);

    const handleViewDetails = (sinistre) => {
        setSelectedSinistre(sinistre);
        setOpenDialog(true);
    };

    const handleUpdateSinistre = async () => {
        try {
            // Code pour mettre à jour les sinistres
        } catch (error) {
            console.error('Error updating sinistre:', error);
        }
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    };

    const dataTable = {
        columns: [
            { label: 'Numéro de Sinistre', field: 'numSinistre' },
            { label: 'Numéro de Police', field: 'numPolice' },
            { label: 'Code Client', field: 'codeClient' },
            { label: 'Code Agent', field: 'codeAgent' },
            { label: 'Date de Reste à Régler', field: 'restRegler' },
            { label: 'État du Sinistre', field: 'etatSinistre' },
            { label: 'Libellé Mouvement Sinistre', field: 'libellerMouvementSinistre' },
            { label: 'Action', field: 'action' },
        ],
        rows: sinistres.map((sinistre, index) => ({
            numSinistre: sinistre.numSinistre,
            numPolice: sinistre.numPolice,
            codeClient: sinistre.codeClient,
            codeAgent: sinistre.codeAgent,
            restRegler: formatDate(sinistre.restRegler),
            etatSinistre: sinistre.etatSinistre,
            libellerMouvementSinistre: sinistre.libellerMouvementSinistre,
            action: (
                <div>
                    <button
                        className="btn btn-primary w-100 pb-2 pt-2"
                        onClick={() => handleViewDetails(sinistre)}
                    >
                        Voir
                    </button>
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

            {/* Dialog for showing sinistre details */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent style={{ minWidth: '400px', maxWidth: '600px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Typography variant="h5" style={{ color: 'red' }}>
                            Détails du Sinistre
                        </Typography>
                    </div>
                    {selectedSinistre && (
                        <div>
                            <p><strong>Numéro de Sinistre:</strong> {selectedSinistre.numSinistre}</p>
                            <p><strong>Numéro de Police:</strong> {selectedSinistre.numPolice}</p>
                            <p><strong>Code Client:</strong> {selectedSinistre.codeClient}</p>
                            <p><strong>Code Agent:</strong> {selectedSinistre.codeAgent}</p>
                            <p><strong>Date de Reste à Régler:</strong> {formatDate(selectedSinistre.restRegler)}</p>
                            <p><strong>État du Sinistre:</strong> {selectedSinistre.etatSinistre}</p>
                            <p><strong>Libellé Mouvement Sinistre:</strong> {selectedSinistre.libellerMouvementSinistre}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button style={{ width: '100%', backgroundColor: 'green', color: 'white' }} onClick={() => setOpenDialog(false)}>
                        FERMER
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for updating sinistre details */}
            <Dialog open={openDialogUpdate} onClose={() => setOpenDialogUpdate(false)}>
                <DialogContent style={{ minWidth: '600px', maxWidth: '600px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Typography variant="h5" style={{ color: 'red' }}>
                            Mettre à jour le Sinistre
                        </Typography>
                    </div>
                    {selectedSinistre && (
                        <div>
                            {/* Formulaire pour mettre à jour les sinistres */}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button style={{ width: '100%', backgroundColor: 'green', color: 'white' }} onClick={handleUpdateSinistre}>
                        METTRE À JOUR
                    </Button>
                    <Button style={{ width: '100%', backgroundColor: 'red', color: 'white' }} onClick={() => setOpenDialogUpdate(false)}>
                        FERMER
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default DatatablePstatus;
