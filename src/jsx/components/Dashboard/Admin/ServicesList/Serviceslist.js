import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';

const DatatablePstatus = () => {
    const [quittances, setQuittances] = useState([]);
    const [modal, setModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [selectedQuittanceId, setSelectedQuittanceId] = useState('');
    const [viewModal, setViewModal] = useState(false);
    const [selectedQuittance, setSelectedQuittance] = useState(null);

    const toggleModal = () => {
        setModal(!modal);
        setNewStatus('');
    };

    const toggleViewModal = () => {
        setViewModal(!viewModal);
    };

    const fetchQuittances = async () => {
        try {
            const response = await axios.get('/api/quittance/getAllQuittance');
            setQuittances(response.data);
        } catch (error) {
            console.error('Error fetching quittances:', error);
        }
    };

    useEffect(() => {
        fetchQuittances();
    }, []);

    const handleUpdateStatus = async () => {
        try {
            const response = await axios.put('/api/quittance/updateStatus', {
                quittanceId: selectedQuittanceId,
                newStatus: newStatus,
            });

            if (response.data && response.data.updatedQuittance) {
                const updatedQuittances = quittances.map((quittance) =>
                    quittance._id === response.data.updatedQuittance._id ? response.data.updatedQuittance : quittance
                );

                setQuittances(updatedQuittances);
            }

            const responsed = await axios.get('/api/quittance/getAllQuittance');
            setQuittances(responsed.data);
            setModal(false);

        } catch (error) {
            console.error('Error updating quittance status:', error);
        }
    };

    const handleView = (quittance) => {
        setSelectedQuittance(quittance);
        toggleViewModal();
    };

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    };

    const dataTable = {
        columns: [
            { label: 'Num Quittance', field: 'numQuittance' },
            { label: 'Num Police', field: 'numPolice' },
            { label: 'Code Agent', field: 'codeAgent' },
            { label: 'Date Mutation Début', field: 'dateMutDu' },
            { label: 'Date Mutation Fin', field: 'dateMutAu' },
            { label: 'Prime Totale', field: 'primeTotal' },
            { label: 'État Mouvement', field: 'EtatMvt' },
            { label: 'Action', field: 'Action' },
        ],
        rows: quittances.map((quittance) => ({
            numQuittance: quittance.numQuittance,
            numPolice: quittance.numPolice,
            codeAgent: quittance.codeAgent,
            dateMutDu: formatDate(quittance.dateMutDu),
            dateMutAu: formatDate(quittance.dateMutAu),
            primeTotal: quittance.primeTotal,
            EtatMvt: (
                <span className={`btn btn-sm ${quittance.EtatMvt === 'Règlé' ? 'bg-success text-white' : quittance.EtatMvt === 'Accompte' ? 'bg-warning text-dark' : 'bg-danger text-white'}`}>
                    {quittance.EtatMvt}
                </span>
            ),
            Action: (
                <div>
                    <button
                        className={`btn ${quittance.EtatMvt === 'Arrière' ? 'btn-success' : 'btn-danger'} w-100 pb-2 pt-2`}
                        onClick={() => {
                            setSelectedQuittanceId(quittance._id);
                            setModal(true);
                        }}
                    >
                        {quittance.EtatMvt === 'Arrière' ? 'Confirmer' : 'Modifier'}
                    </button>
                    <button
                        className="btn btn-info w-100 pb-2 pt-2 mt-2"
                        onClick={() => handleView(quittance)}
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

            {/* Modal pour changer le statut */}
            <MDBModal isOpen={modal} toggle={toggleModal} size="md">
                <MDBModalHeader toggle={toggleModal}>Changer le statut de la quittance</MDBModalHeader>
                <MDBModalBody>
                    <select
                        className="form-control"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="Arriere">Arrière</option>
                        <option value="Accompte">Accompte</option>
                        <option value="Règlé">Règlé</option>
                    </select>
                </MDBModalBody>
                <MDBModalFooter>
                    <button className="btn btn-success" onClick={handleUpdateStatus}>
                        Envoyer
                    </button>
                    <button className="btn btn-secondary" onClick={toggleModal}>
                        Modifier
                    </button>
                </MDBModalFooter>
            </MDBModal>

            {/* Modal pour voir les détails de la quittance */}
            <MDBModal isOpen={viewModal} toggle={toggleViewModal} size="md">
                <MDBModalHeader toggle={toggleViewModal}>Détails de la Quittance</MDBModalHeader>
                <MDBModalBody>
                    {selectedQuittance && (
                        <div>
                            <p><strong>Numéro de Quittance:</strong> {selectedQuittance.numQuittance}</p>
                            <p><strong>Numéro de Police:</strong> {selectedQuittance.numPolice}</p>
                            <p><strong>Code Agent:</strong> {selectedQuittance.codeAgent}</p>
                            <p><strong>Date Mutation Début:</strong> {formatDate(selectedQuittance.dateMutDu)}</p>
                            <p><strong>Date Mutation Fin:</strong> {formatDate(selectedQuittance.dateMutAu)}</p>
                            <p><strong>Prime Totale:</strong> {selectedQuittance.primeTotal}</p>
                            <p><strong>État Mouvement:</strong> {selectedQuittance.EtatMvt}</p>
                        </div>
                    )}
                </MDBModalBody>
                <MDBModalFooter>
                    <button className="btn btn-secondary" onClick={toggleViewModal}>
                        Fermer
                    </button>
                </MDBModalFooter>
            </MDBModal>
        </Fragment>
    );
};

export default DatatablePstatus;
