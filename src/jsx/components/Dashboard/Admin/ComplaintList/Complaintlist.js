import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import { useBlockUser } from '../../../../../Hooks/useBlockUser';

const DatatablePstatus = () => {
	const [complaints, setComplaints] = useState([]);
	const [modal, setModal] = useState(false);
	const [responseText, setResponseText] = useState('');
	const [selectedComplaintId, setSelectedComplaintId] = useState('');
	const [viewModal, setViewModal] = useState(false);
	const [selectedComplaint, setSelectedComplaint] = useState(null);

	const toggleModal = () => {
		setModal(!modal);
		setResponseText('');
	};

	const toggleViewModal = () => {
		setViewModal(!viewModal);
	};

	const fetchComplaints = async () => {
		try {
			const response = await axios.get('http://localhost:3000/complaint/allComplaints');
			setComplaints(response.data);
		} catch (error) {
			console.error('Error fetching complaints:', error);
		}
	};

	useEffect(() => {
		fetchComplaints();
	}, []);

	const handleRespond = async () => {
		try {
			const response = await axios.put('http://localhost:3000/complaint/respondToComplaint', {
				complaintId: selectedComplaintId,
				response: responseText,
			});

			if (response.data && response.data.complaint) {
				const updatedComplaints = complaints.map((complaint) =>
					complaint._id === response.data.complaint._id ? response.data.complaint : complaint
				);
				setComplaints(updatedComplaints);
				toggleModal(); // Ferme la boîte de dialogue après avoir répondu avec succès
			}
		} catch (error) {
			console.error('Error responding to complaint:', error);
		}
	};

	const handleDelete = async (complaintId) => {
		try {
			const response = await axios.delete(`http://localhost:3000/complaint/delete/${complaintId}`);
			if (response.status === 200) {
				const updatedComplaints = complaints.filter(complaint => complaint._id !== complaintId);
				setComplaints(updatedComplaints);
			}
		} catch (error) {
			console.error('Error deleting complaint:', error);
		}
	};

	const handleView = (complaint) => {
		setSelectedComplaint(complaint);
		toggleViewModal();
	};

	const dataTable = {
		columns: [
			{ label: 'Logo', field: 'logo' },
			{ label: 'User Name', field: 'fullname' },
			{ label: 'Email', field: 'email' },
			{ label: 'Title', field: 'title' },
			{ label: 'Description', field: 'description' },
			{ label: 'Status', field: 'status' },
			{ label: 'Action', field: 'Action' },
		],
		rows: complaints.map((complaint) => ({
			logo: (
				<div className="d-flex align-items-center">
					<div className="avatar avatar-image mx-2">
						<img
							src={complaint.user.avatar}
							style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
							alt="Avatar"
						/>
					</div>
				</div>
			),
			fullname: complaint.user.fullname,
			email: complaint.user.email,
			title: complaint.title,
			description: complaint.description,
			status: (
				<span>
					{complaint.status === 'ANSWERED' ? (
						<span className="btn bgl-warning text-warning btn-sm">Answered</span>
					) : (
						<span className="btn bgl-light btn-sm">In Progress</span>
					)}
				</span>
			),
			Action: (
				<div>
					<ul>
						<li className="pb-2">
							{complaint.adminResponse === '' ? (
								<button
									className="btn bg-success text-white w-100 pb-2 pt-2"
									onClick={() => {
										setSelectedComplaintId(complaint._id);
										toggleModal();
									}}
								>
									Respond
								</button>
							) : (
								<button className="btn btn-danger w-100 pb-2 pt-2" onClick={() => handleDelete(complaint._id)}>
									Delete
								</button>
							)}
						</li>
						<li className="pb-2">
							<button className="btn bg-blue-dark text-white w-100 pb-2 pt-2" onClick={() => handleView(complaint)}>
								View
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

			{/* Modal pour la réponse */}
			<MDBModal isOpen={modal} toggle={toggleModal} size="md">
				<MDBModalHeader toggle={toggleModal}>Respond to Complaint</MDBModalHeader>
				<MDBModalBody>
					<textarea
						className="form-control"
						rows="5"
						placeholder="Write your response here..."
						value={responseText}
						onChange={(e) => setResponseText(e.target.value)}
					/>
				</MDBModalBody>
				<MDBModalFooter>
					<button className="btn btn-success" onClick={handleRespond}>
						Send Response
					</button>
					<button className="btn btn-secondary" onClick={toggleModal}>
						Cancel
					</button>
				</MDBModalFooter>
			</MDBModal>

			{/* Modal pour voir les détails de la plainte */}
			<MDBModal isOpen={viewModal} toggle={toggleViewModal} size="md">
				<MDBModalHeader toggle={toggleViewModal}>Complaint Details</MDBModalHeader>
				<MDBModalBody>
					{selectedComplaint && (
						<div>
							<p><strong>User Name:</strong> {selectedComplaint.user.fullname}</p>
							<p><strong>Email:</strong> {selectedComplaint.user.email}</p>
							<p><strong>Title:</strong> {selectedComplaint.title}</p>
							<p><strong>Description:</strong> {selectedComplaint.description}</p>
							<p><strong>Status:</strong> {selectedComplaint.status}</p>
							<p><strong>Admin Response:</strong> {selectedComplaint.adminResponse}</p>
						</div>
					)}
				</MDBModalBody>
				<MDBModalFooter>
					<button className="btn btn-secondary" onClick={toggleViewModal}>
						Close
					</button>
				</MDBModalFooter>
			</MDBModal>
		</Fragment>
	);
};

export default DatatablePstatus;
