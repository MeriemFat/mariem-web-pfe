import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const DatatablePstatus = () => {
	const [contrats, setContrats] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedContrat, setSelectedContrat] = useState(null);

	const fetchContrats = async () => {
		try {
			const response = await axios.get('/api/contrat/getAllContrats');
			setContrats(response.data);
		} catch (error) {
			console.error('Error fetching contrats:', error);
		}
	};

	useEffect(() => {
		fetchContrats();
	}, []);

	const handleViewDetails = (contrat) => {
		setSelectedContrat(contrat);
		setOpenDialog(true);
	};

	const dataTable = {
		columns: [
			{ label: 'Numéro de Police', field: 'numPolice' },
			{ label: 'Code Client', field: 'codeClient' },
			{ label: 'Code Agent', field: 'codeAgent' },
			{ label: 'Branche', field: 'libelle_branche' },
			{ label: 'Sous-Branche', field: 'libelle_sous_branche' },
			{ label: 'Date Échéance Prochaine', field: 'date_echeance_prochaine' },
			{ label: 'Type de Personne', field: 'type_personne' },
			{ label: 'Action', field: 'action' },
		],
		rows: contrats.map((contrat) => ({
			numPolice: contrat.numPolice,
			codeClient: contrat.codeClient,
			codeAgent: contrat.codeAgent,
			libelle_branche: contrat.libelle_branche,
			libelle_sous_branche: contrat.libelle_sous_branche,
			date_echeance_prochaine: new Date(contrat.date_echeance_prochaine).toLocaleDateString(),
			type_personne: contrat.type_personne,
			action: (
				<div>
					<button
						className="btn btn-primary w-100 pb-2 pt-2"
						onClick={() => handleViewDetails(contrat)}
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

			{/* Dialog for showing contrat details */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogContent>
					<div style={{
						marginLeft: '20%',
						marginBottom: '5%',
						fontWeight: 'bold',
						fontSize: '20px',
						color: 'red'
					}}>
						<b>Détails du Contrat</b>
					</div>
					{selectedContrat && (
						<div>
							<p><strong>Numéro de Police:</strong> {selectedContrat.numPolice}</p>
							<p><strong>Code Client:</strong> {selectedContrat.codeClient}</p>
							<p><strong>Code Agent:</strong> {selectedContrat.codeAgent}</p>
							<p><strong>Branche:</strong> {selectedContrat.libelle_branche}</p>
							<p><strong>Sous-Branche:</strong> {selectedContrat.libelle_sous_branche}</p>
							<p><strong>Date Échéance Prochaine:</strong> {new Date(selectedContrat.date_echeance_prochaine).toLocaleDateString()}</p>
							<p><strong>Type de Personne:</strong> {selectedContrat.type_personne}</p>
							<p><strong>Numéro de Sinistre:</strong> {selectedContrat.numSinistre || 'N/A'}</p>
							<p><strong>Numéro de Contrat:</strong> {selectedContrat.numContrat || 'N/A'}</p>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button style={{ width: '100%', backgroundColor: 'green', color: 'white' }} onClick={() => setOpenDialog(false)}>
						CLOSE
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

export default DatatablePstatus;
