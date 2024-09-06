import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import {useAuthContext} from "../../../../../services/useAuthContext";

const DatatablePstatus = () => {
	const [payments, setPayments] = useState([]);
	const [selectedPayment, setSelectedPayment] = useState(null);

	const [openDialog, setOpenDialog] = useState(false);
	const { USER } = useAuthContext();

	const fetchPayments = async () => {
		try {

			const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
			const userId = userResponse.data._id;

			const response = await axios.get(`http://localhost:3000/payment/getPaymentsByUser/${userId}`);
			setPayments(response.data);
		} catch (error) {
			console.error('Error fetching reservations:', error);
		}
	};

	useEffect(() => {
		fetchPayments();
	}, []);

	const handleViewDetails = (payment) => {
		setSelectedPayment(payment);
		setOpenDialog(true);
	};

	const dataTable = {
		columns: [
			{ label: 'User Email', field: 'email' },
			{ label: 'Buffet Name', field: 'buffetName' },
			{ label: 'Date', field: 'date' },
			{ label: 'Amount', field: 'amount' },
			{ label: 'Status', field: 'status' },
			{ label: 'Action', field: 'action' },
		],
		rows: payments.map((payment, index) => ({
			name: payment.name,
			email: payment.user ? payment.user.email : 'N/A',
			buffetName: payment.buffet ? payment.buffet.name : 'N/A',
			date: new Date(payment.paymentDate).toLocaleString(),
			amount: payment.amount,
			status: payment.payment_status === 'paid' ? (
				<span className="btn bgl-warning text-warning btn-sm w-100">Paid</span>
			) : (
				<span className="btn bgl-light btn-sm w-100">Unpaid</span>
			),
			action: (
				<div>
					<button
						className="btn btn-primary w-100 pb-2 pt-2"
						disabled={payment.payment_status !== 'paid'}
						onClick={() => handleViewDetails(payment)}
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

			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogContent>
					<div style={{
						marginLeft: '20%',
						marginBottom: '5%',
						fontWeight: 'bold',
						fontSize: '20px',
						color: 'red'
					}}>
						<b>Détails de la paiement</b>
					</div>
					{selectedPayment && (
						<div>
							<p><strong>Nom de
								l'utilisateur:</strong> {selectedPayment.user ? selectedPayment.user.fullname : 'N/A'}
							</p>

							<p><strong>Email de
								l'utilisateur:</strong> {selectedPayment.user ? selectedPayment.user.email : 'N/A'}
							</p>

							<p><strong>Nom du
								buffet:</strong> {selectedPayment.buffet ? selectedPayment.buffet.name : 'N/A'}
							</p>
							<p><strong>quantity du
								buffet:</strong> {selectedPayment.buffet ? selectedPayment.buffet.quantity : 'N/A'}
							</p>
							<p><strong>Price du
								buffet:</strong> {selectedPayment.buffet ? selectedPayment.buffet.price : 'N/A'}
							</p>
							<p>
								<strong>Promotion du buffet
									:</strong> {selectedPayment.buffet && selectedPayment.buffet.promotion
								? 'Oui'
								: 'Non'}
							</p>
							<p><strong>Price du Promotion
								buffet:</strong> {selectedPayment.buffet ? selectedPayment.buffet.pricePromotion : 'N/A'}
							</p>
							<p><strong>Date:</strong> {new Date(selectedPayment.paymentDate).toLocaleString()}</p>
							<p>
								<strong>Statut:</strong> {selectedPayment.payment_status === 'paid' ? 'paid' : 'unpaid'}
							</p>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button style={{width: '100%', backgroundColor: 'green', color: 'white'}}
							onClick={() => setOpenDialog(false)}>CLOSE</Button>
				</DialogActions>
			</Dialog>


		</Fragment>
	);
};

export default DatatablePstatus;
