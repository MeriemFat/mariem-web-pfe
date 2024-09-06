import React, { Fragment, useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import axios from 'axios';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { toast } from "react-toastify";
import Alert from "sweetalert2";
import { FaCamera } from "react-icons/fa";

import {useAuthContext} from "../../../../../services/useAuthContext";
const DatatablePstatus = () => {
	const [buffets, setBuffets] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [editingBuffet, setEditingBuffet] = useState(null);



	const [updatedBuffet, setUpdatedBuffet] = useState({
		name: '',
		description: '',
		price: '',
		status: false,
		dateStart: '',
		promotion: false,
		entre: [],
		platPrincipale: [],
		suite: [],
		dessert: [],
		ingredient: [],
		pricePromotion: '',
		type: '',
		day: '',
	});


	useEffect(() => {
		const fetchBuffets = async () => {
			try {
				const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
				const userId = userResponse.data._id;

				const response = await axios.get(`http://localhost:3000/buffet/getbyuserId/${userId}`);
				setBuffets(response.data);
			} catch (error) {
				console.error('Error fetching buffets:', error);
			}
		};

		fetchBuffets();
	}, []);

	const formatDate = (date) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(date).toLocaleDateString('fr-FR', options);
	};

	const handleUpload = async (file, buffetId) => {
		try {
			const formData = new FormData();
			formData.append('buffet', file);

			await axios.put(`http://localhost:3000/buffet/avatar/${buffetId}`, formData);
			toast.success('Avatar uploaded successfully:')

			const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
			const userId = userResponse.data._id;

			const updatedBuffetList = await axios.get(`http://localhost:3000/buffet/getbyuserId/${userId}`);
			setBuffets(updatedBuffetList.data);
		} catch (error) {
			console.error('Error uploading buffet image:', error);
		}
	};

	const dataTable = {
		columns: [
			{ label: 'Logo', field: 'logo' },
			{ label: 'Nom', field: 'name' },
			{ label: 'Description', field: 'description' },
			{ label: 'Prix', field: 'price' },
			{ label: 'Status', field: 'status' },
			{ label: 'Start Date', field: 'dateStart' },
			{ label: 'Promotion', field: 'promotion' },
			{ label: 'Action', field: 'Action' },
		],
		rows: buffets.map(buffet => ({
			logo: (
				<div className="d-flex align-items-center">
					<div className="avatar avatar-image mx-2">
						<img
							src={buffet.logo}
							alt={buffet.name}
							style={{width: '150px', height: '150px', objectFit: 'cover'}}
						/>
					</div>
					<div className="mx-2">
						<InputGroup >
							<Form.Control
								id={`fileInput-${buffet._id}`}
								type="file"
								onChange={(e) => handleUpload(e.target.files[0], buffet._id)}
								style={{display: 'none'}}
							/>
							<InputGroup.Text  className="btn bgl-warning text-warning btn-sm" onClick={() => document.getElementById(`fileInput-${buffet._id}`).click()}>
								<FaCamera />
							</InputGroup.Text>
						</InputGroup>
					</div>
				</div>
			),
			name: buffet.name,
			description: buffet.description,
			price: buffet.price,
			status: buffet.status ? (
				<span className="btn bgl-warning text-warning btn-sm">Disponible</span>
			) : (
				<span className="btn bgl-light btn-sm">Non Disponible</span>
			),
			dateStart: formatDate(buffet.dateStart),
			promotion: buffet.promotion ? (
				<span className="btn bgl-warning text-warning btn-sm">Actif</span>
			) : (
				<span className="btn bgl-light btn-sm">Inactif</span>
			),
			Action: (
				<div>
					<ul>
						<li className='pb-2'>

							<button
								className="btn bg-blue-dark text-white w-100 pb-2 pt-2"
								disabled={buffet.status === false}
								//onClick={() => handleDelete(buffet._id)}
							>
								Consulter
							</button>
						</li>
						<li className='pb-2'>
							<button
								className="btn btn-success w-100 pb-2 pt-2"
								onClick={() => handleEdit(buffet)}
							>
								Modifier
							</button>
						</li>

						<li>
							<button
								className="btn btn-danger w-100 pb-2 pt-2"
								onClick={() => handleDelete(buffet._id)}
							>
								Supprimer
							</button>
						</li>

					</ul>
				</div>
			),
		})),
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this buffet?")) {
			try {
				await axios.delete(`http://localhost:3000/buffet/delete/${id}`);
				setBuffets(buffets.filter(buffet => buffet._id !== id));
			} catch (error) {
				console.error('Error deleting buffet:', error);
			}
		}
	};

	const handleEdit = (buffet) => {
		setEditingBuffet(buffet._id);
		setUpdatedBuffet({
			name: buffet.name,
			description: buffet.description,
			price: buffet.price,
			status: buffet.status,
			dateStart: buffet.dateStart,
			promotion: buffet.promotion,
			entre: buffet.entre || [],
			platPrincipale: buffet.platPrincipale || [],
			suite: buffet.suite || [],
			dessert: buffet.dessert || [],
			ingredient: buffet.ingredient || [],
			pricePromotion: buffet.pricePromotion,
			type: buffet.type,
			day: buffet.day
		});
		setShowModal(true);
	};

	const handleUpdate = async () => {
		const formData = new FormData();
		formData.append('name', updatedBuffet.name);
		formData.append('description', updatedBuffet.description);
		formData.append('price', updatedBuffet.price);
		formData.append('status', updatedBuffet.status);
		formData.append('dateStart', updatedBuffet.dateStart);
		formData.append('promotion', updatedBuffet.promotion);
		formData.append('entre', JSON.stringify(updatedBuffet.entre));
		formData.append('platPrincipale', JSON.stringify(updatedBuffet.platPrincipale));
		formData.append('suite', JSON.stringify(updatedBuffet.suite));
		formData.append('dessert', JSON.stringify(updatedBuffet.dessert));
		formData.append('ingredient', JSON.stringify(updatedBuffet.ingredient));
		formData.append('pricePromotion', updatedBuffet.pricePromotion);
		formData.append('type', updatedBuffet.type);
		formData.append('day', updatedBuffet.day);

		try {
			const response =await axios.put(`http://localhost:3000/buffet/update/${editingBuffet}`, updatedBuffet);

			setBuffets([...buffets, response.data]);
			toast.success("Buffet updated  successfully");

			const updatedBuffets = buffets.map(buffet =>
				buffet._id === editingBuffet ? { ...buffet, ...updatedBuffet } : buffet
			);
			setBuffets(updatedBuffets);
			setShowModal(false);
		} catch (error) {
			toast.error("Error updating buffet");


		}
	};
	const { USER } = useAuthContext();

	const previewImage = (event) => {
		const reader = new FileReader();
		reader.onload = function() {
			const output = document.getElementById('imagePreview');
			output.src = reader.result;
			output.style.display = 'block';
		};
		reader.readAsDataURL(event.target.files[0]);
	};

	const buffetClick = () => {
		Alert.fire({
			title: 'Add Buffet',
			html: `
             <input id="name" class="form-control" placeholder="Name"> <br>
              <b class="text-black font-w500"><u>Logo</u></b>
			<div class="image-placeholder">
				<div class="avatar-edit">
					<input type="file" 
					id="imageUpload" 
					accept="image/*"
					/>
					<label for="imageUpload" ></label>
				</div>
				<div class="avatar-preview">
					<div>
						<img id="imagePreview" 
						src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA+Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBkZWZhdWx0IHF1YWxpdHkK/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAeAB4AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9MooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAE3DcFyMkZApFkjZyiupZeoB5FVvKCamrhmJeJupyByvSo4Y0M8QgXKwZDyH+I4xj355NAF0SIzlFdSy9QDyKdWdAiiOxdeHfO5gOTlST+tPtJpp5ZI3cfuRscrj5m9fbgfnQBd3L83zD5evPSkWRHTejqy+oORVKKGNYbuN3byxLuZmOSRhScmmMu6KaQJ5cUrxqARgkbsEke+aANBHSRdyMrL6qcinVWhVUvZ1QAKURiB68j+QFWaACiiigAooooAKKKKACiiigBhjBmWXJ3BSo/HH+FQwWnkFds8zKvRWIx/KrNFAFdLNI3LKz99oJ4TPXFLFaRwsjIWBVdp5+8OvP4/zqeigCCS1SSOVNzjzGDkjGQRjp+QoFqPLeOSWSVXGPnI4+mAKnooAihgWHdhmdmOSzHJNS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//9k="
					     alt="Image Preview"
						 />
					</div>
				</div>
			</div> 
        
        <br>
        <textarea id="description" class="form-control" placeholder="Description"></textarea><br>
        <input id="dateStart" type="date" class="form-control" placeholder="Start Date"><br>
        <input id="price" type="number" class="form-control" placeholder="Price"><br>
        <input id="type" class="form-control" placeholder="Type"><br>
        <input id="day" class="form-control" placeholder="Day of week"><br>
        <input id="quantity" type="number" class="form-control" placeholder="Quantity"><br>
        <input id="status" type="checkbox" class="form-check-input"> Disponible <br><br>
        <textarea id="entre" class="form-control" placeholder="Entrées (comma-separated)"></textarea><br>
        <textarea id="platPrincipale" class="form-control" placeholder="Plat Principal (comma-separated)"></textarea><br>
        <textarea id="suite" class="form-control" placeholder="Suite (comma-separated)"></textarea><br>
        <textarea id="dessert" class="form-control" placeholder="Dessert (comma-separated)"></textarea><br>
        <textarea id="ingredient" class="form-control" placeholder="Ingredients (comma-separated)"></textarea><br>
        <input id="promotion" type="checkbox" class="form-check-input"> Promotion <br><br>
        <input id="pricePromotion" type="number" class="form-control" placeholder="Promotion Price"><br>
      `,
			showCancelButton: true,
			didOpen: () => {
				document.getElementById('imageUpload').addEventListener('change', previewImage);
			},
			preConfirm: () => {
				const name = document.getElementById('name').value;
				const description = document.getElementById('description').value;
				const dateStart = document.getElementById('dateStart').value;
				const price = document.getElementById('price').value;
				const type = document.getElementById('type').value;
				const quantity = document.getElementById('quantity').value;
				const status = document.getElementById('status').checked;
				const entre = document.getElementById('entre').value.split(',');
				const platPrincipale = document.getElementById('platPrincipale').value.split(',');
				const suite = document.getElementById('suite').value.split(',');
				const dessert = document.getElementById('dessert').value.split(',');
				const ingredient = document.getElementById('ingredient').value.split(',');
				const day = document.getElementById('day').value;
				const promotion = document.getElementById('promotion').checked;
				const pricePromotion = document.getElementById('pricePromotion').value;
				const logo = document.getElementById('imageUpload').files[0];

				if (!name || !description || !dateStart || !price || !type || !quantity || !day || !entre || !platPrincipale || !suite || !dessert || !ingredient || !logo) {
					Alert.showValidationMessage('Please fill all required fields');
					return false;
				}

				return {
					name,
					description,
					dateStart,
					price,
					type,
					quantity,
					status,
					entre,
					platPrincipale,
					suite,
					dessert,
					ingredient,
					promotion,
					pricePromotion,
					day,
					logo
				};
			}
		}).then(async (result) => {
			if (result.isConfirmed) {
				const newBuffet = result.value;

				try {
					const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
					const userId = userResponse.data._id;
					newBuffet.user = userId;

					const formData = new FormData();
					Object.keys(newBuffet).forEach(key => {
						if (key === 'logo') {
							formData.append('logo', newBuffet[key]);
						} else {
							formData.append(key, newBuffet[key]);
						}
					});

					const response = await axios.post('http://localhost:3000/buffet/add', formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					});

					setBuffets((prevBuffets) => [...prevBuffets, response.data]);
					toast.success('Buffet added successfully');

					const updatedBuffetList = await axios.get(`http://localhost:3000/buffet/getbyuserId/${userId}`);
					setBuffets(updatedBuffetList.data);
				} catch (error) {
					console.error('Error adding buffet:', error);
					toast.error('Error adding buffet');
				}
			}
		});
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<Fragment>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h4 className="fs-20 text-black"></h4>
				</div>
				<div>
					<button className="btn btn-primary ms-auto"  onClick={buffetClick}>+ Add Buffet
					</button>


				</div>
			</div>
			<div className="row">
				<div className="col-xl-12">
					<div className="table-responsive">
					<div className="display mb-4 dataTablesCard no-footer order-list-table">
							<MDBDataTable striped small data={dataTable}/>
						</div>
					</div>
				</div>
			</div>

			<Modal show={showModal} onHide={handleCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Buffet</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								value={updatedBuffet.name}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, name: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								value={updatedBuffet.description}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, description: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Price</Form.Label>
							<Form.Control
								type="number"
								value={updatedBuffet.price}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, price: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Check
								type="checkbox"
								label="Status"
								checked={updatedBuffet.status}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, status: e.target.checked})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Start Date</Form.Label>
							<Form.Control
								type="date"
								value={updatedBuffet.dateStart ? new Date(updatedBuffet.dateStart).toISOString().substr(0, 10) : ''}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, dateStart: e.target.value})}
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Day of Week</Form.Label>
							<Form.Control
								type="text"
								value={updatedBuffet.day}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, day: e.target.value})}
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label>Entrées</Form.Label>
							<Form.Control
								as="textarea"
								value={updatedBuffet.entre}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, entre: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Plats Principaux</Form.Label>
							<Form.Control
								as="textarea"
								value={updatedBuffet.platPrincipale}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, platPrincipale: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Suite</Form.Label>
							<Form.Control
								as="textarea"
								value={updatedBuffet.suite}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, suite: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Dessert</Form.Label>
							<Form.Control
								as="textarea"
								value={updatedBuffet.dessert}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, dessert: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Ingredients</Form.Label>
							<Form.Control
								as="textarea"
								value={updatedBuffet.ingredient}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, ingredient: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Type</Form.Label>
							<Form.Control
								type="text"
								value={updatedBuffet.type}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, type: e.target.value})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Check
								type="checkbox"
								label="Promotion"
								checked={updatedBuffet.promotion}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, promotion: e.target.checked})}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Price Promotion</Form.Label>
							<Form.Control
								type="number"
								value={updatedBuffet.pricePromotion}
								onChange={(e) => setUpdatedBuffet({...updatedBuffet, pricePromotion: e.target.value})}
							/>
						</Form.Group>

					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Close
					</Button>
					<Button variant="primary" onClick={handleUpdate}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</Fragment>
	);
};

export default DatatablePstatus;
