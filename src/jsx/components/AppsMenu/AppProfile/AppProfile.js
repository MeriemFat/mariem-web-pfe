import React, {Fragment, useEffect, useReducer, useState} from "react";
import {Button, Dropdown, Modal, Tab, Nav, InputGroup, Form} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import { useForm } from 'react-hook-form';




import PageTitle from "../../../layouts/PageTitle";
import {useAuthContext} from "../../../../services/useAuthContext";
import {useUpdateProfile} from "../../../../Hooks/useUpdateProfile";
import {usePassword} from "../../../../Hooks/usePassword";
import axios from "axios";
import {toast} from "react-toastify";
import Unauthorized from "../../../pages/Unauthorized";

const initialState = false;
const reducer = (state, action) =>{
	switch (action.type){
		case 'sendMessage':
			return { ...state, sendMessage: !state.sendMessage }		
		case 'postModal':
			return { ...state, post: !state.post }
		case 'linkModal':
			return { ...state, link: !state.link }		
		case 'cameraModal':
			return { ...state, camera: !state.camera }		
		case 'replyModal':
			return { ...state, reply: !state.reply }
		default:
			return state	
	}	
}

const AppProfile = () => {
	const { USER } = useAuthContext();
	const { update } = useUpdateProfile();
	const { changePassword } = usePassword();
	const loggedInUser = USER;

	const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile } = useForm({
		defaultValues: {
			fullname: USER?.fullname || '',
			email: USER?.email || '',
			phone: USER?.phone || '',
			country: USER?.country || '',
			city: USER?.city || '',
			allergies: USER?.allergies || '',
		}
	});

	const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm({
		defaultValues: {
			passwordOld: '',
			passwordNew: '',
			passwordConfirm: ''
		}
	});

	const onSubmitProfile = async (data) => {
		const user = {
			fullname: data.fullname,
			email: USER.email,
			phone: data.phone,
			country: data.country,
			city: data.city,
			allergies: data.allergies,
		};
		await update(user);
		resetProfile(data);
	};

	const onSubmitPassword = async (data) => {
		if (data.passwordNew !== data.passwordConfirm) {
			console.error("New Password and Confirm Password do not match");
			return;
		}
		await changePassword(data.passwordOld, data.passwordNew);
		resetPassword();
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const [userID, setUserID] = useState('');
	const [avatar, setAvatar] = useState(USER ? USER.avatar : null);


	const handleUpload = async (file) => {
		try {
			const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
			const userId = userResponse.data._id;
			setUserID(userId);

			const formData = new FormData();
			formData.append('avatar', file);

			const response = await axios.put(`http://localhost:3000/User/avatar/${userId}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.status === 200) {
				setAvatar(response.data.avatar);
				toast.success('Avatar uploaded successfully');
			} else {
				toast.error('Failed to upload avatar');
			}
		} catch (error) {
			console.error('Error uploading avatar:', error);
			toast.error('Error uploading avatar');
		}
	};

	const [feedbacks, setFeedbacks] = useState([]);
	const [feedbacksCount, setFeedbacksCount] = useState(0);
	const [reservationCount, setReservationsCount] = useState(0);
	const [buffetsCount, setBuffetsCount] = useState(0);
	const [reservation, setReservations] = useState(0);
	const [reservationNumber, setReservationsNumber] = useState(0);


	useEffect(() => {



		const fetchGroupeReservation = async () => {
			try {
				const response = await axios.get('http://localhost:3000/reservation/getBygroupe/');
				const buffetData = response.data;
				const Databuffet =buffetData.buffetDetails;
				setReservations(Databuffet)
				setReservationsNumber(buffetData.totalReservations)

			} catch (error) {
				console.error('Error fetching buffets:', error);
			}
		};






		const fetchBuffets = async () => {
			try {
				const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
				const userId = userResponse.data._id;

				const response = await axios.get(`http://localhost:3000/buffet/getbyuserId/${userId}`);
				const buffetData = response.data;
				const buffetCount = buffetData.length;
				setBuffetsCount(buffetCount);
			} catch (error) {
				console.error('Error fetching buffets:', error);
			}
		};

		const fetchReservations = async () => {
			try {
				const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
				const userId = userResponse.data._id;

				const response = await axios.get(`http://localhost:3000/Reservation/getreservation/${userId}`);
				const reservationData = response.data;
				const reservationCount = reservationData.length;
				setReservationsCount(reservationCount);

			} catch (error) {
				console.error('Error fetching reservations:', error);
			}
		};


		const fetchFeedbacks = async () => {
			try {
				const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
				const userId = userResponse.data._id;

				const response = await axios.get(`http://localhost:3000/feedback/getFeedbackByUser/${userId}`);
				setFeedbacks(response.data);
				const feedbacksData = response.data;
				// Counting the number of feedbacks
				const feedbacksCount = feedbacksData.length;
				setFeedbacksCount(feedbacksCount);

			} catch (error) {
				console.error('Error fetching feedbacks:', error);
			}
		};

		fetchFeedbacks();
		fetchReservations();
		fetchBuffets();
		fetchGroupeReservation()
	}, [USER]);



	const formatDate = (date) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(date).toLocaleDateString('fr-FR', options);
	};
	const navigate = useNavigate();


	const reviewTable = feedbacks.map((feedback) => ({
		image: feedback.user.avatar,
		title: feedback.user.fullname,
		email: feedback.user.email,
		name: feedback.buffet.name,

		message: feedback.message,
		date: formatDate(feedback.date),
		rating: feedback.rating,
		status: feedback.status,
	}));

	const goTomChat= ()=>{
		navigate('/chat')
	}

	return (
		USER ?


			<Fragment>
		  <PageTitle activeMenu="Profile" motherMenu="App" />
	
		  <div className="row">
			<div className="col-lg-12">
			  <div className="profile card card-body px-3 pt-3 pb-0">
				<div className="profile-head">
				  <div className="photo-content ">
					<div className="cover-photo rounded"></div>
				  </div>
				  <div className="profile-info">
					  <div className="profile-photo">
						  <img src={avatar} className="img-fluid rounded-circle" alt="profile"/>
						  <div className="mx-2">
							  <InputGroup>
								  <Form.Control
									  id={`fileInput-${userID}`}
									  type="file"
									  onChange={(e) => handleUpload(e.target.files[0])}
									  style={{ display: 'none' }}
								  />
								  <InputGroup.Text
									  style={{ borderRadius:"20%" ,marginLeft:"50px" ,marginTop:"-30px" }}
									  className="btn btn-primary "  data-target="#cameraModal"
									  onClick={() => document.getElementById(`fileInput-${userID}`).click()}
								  >
										  <i className="fa fa-camera m-0" />
								  </InputGroup.Text>
							  </InputGroup>
						  </div>
					  </div>
					  <div className="profile-details">
						  <div className="profile-name px-3 pt-2">
							  <h4 className="text-primary mb-0">{USER.fullname}</h4>
							  {USER.roles.includes(20) ? (
								  <p>Fournisseur</p>
							  ) : USER.roles.includes(30) ? (
								  <p>Collaborateur</p>
							  ) : USER.roles.includes(10) ? (
								  <p>Admin</p>
							  ) : (
								  <p>Client</p>
							  )
							  }

						  </div>
						  <div className="profile-email px-2 pt-2">
							  <h4 className="text-muted mb-0">{USER.email}</h4>
							  <p>Email</p>
						  </div>
						  {
							  USER.email === loggedInUser.email ? (
								  < >
									  <button style={{marginLeft: "62%" ,marginBottom:"30px"}}
											  className="btn btn-primary  "
											  onClick={goTomChat}
									> Send</button>
								</>
							) : (
								<Dropdown className="dropdown ms-auto">
									<Dropdown.Toggle
										variant="primary"
										className="btn btn-primary light sharp i-false"
										data-toggle="dropdown"
										aria-expanded="true"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18px"
											height="18px"
											viewBox="0 0 24 24"
											version="1.1"
										>
											<g
												stroke="none"
												strokeWidth="1"
												fill="none"
												fillRule="evenodd"
											>
												<rect x="0" y="0" width="24" height="24"></rect>
												<circle fill="#000000" cx="5" cy="12" r="2"></circle>
												<circle fill="#000000" cx="12" cy="12" r="2"></circle>
												<circle fill="#000000" cx="19" cy="12" r="2"></circle>
											</g>
										</svg>
									</Dropdown.Toggle>
									<Dropdown.Menu className="dropdown-menu" align="end">
										<Dropdown.Item className="dropdown-item">
											<i className="fa fa-user-circle text-primary me-2" />
											View profile
										</Dropdown.Item>
										<Dropdown.Item className="dropdown-item">
											<i className="fa fa-users text-primary me-2" />
											Add to close friends
										</Dropdown.Item>
										<Dropdown.Item className="dropdown-item">
											<i className="fa fa-plus text-primary me-2" />
											Add to group
										</Dropdown.Item>
										<Dropdown.Item className="dropdown-item">
											<i className="fa fa-ban text-primary me-2" />
											Block
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							)
						}
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		  <div className="row">
			<div className="col-xl-4">
				<div className="row">
					<div className="col-lg-12">

						{
							USER.roles.includes(20) ? (


								<>
									<div className="col-lg-12">

										<div className="card">
											<div className="card-body">
												<div className="profile-statistics">
													<div className="text-center">
														<div className="row">
															<div className="col">
																<h3 className="m-b-0">{buffetsCount}</h3>
																<Link to="/buffet-list" className="text-black">
																	<span>Buffet</span>

																</Link>
															</div>
															<div className="col">
																<h3 className="m-b-0">{reservationCount}</h3>
																<Link to="/reservation-list" className="text-black">
																	<span>Réservation</span>
																</Link>

															</div>
															<div className="col">
																<h3 className="m-b-0">{feedbacksCount}</h3>
																<Link to="/review-list" className="text-black">
																	<span>
																Feedbacks
																</span>
																</Link>

															</div>
														</div>

													</div>

												</div>
											</div>
										</div>
										<div className="card">
											<div className="card-header border-0 pb-0">
												<h5 className="text-primary">Our Latest Feedbacks</h5>
											</div>
											{reviewTable.map((item) => (

												<div className="card-body pt-3">
												<div className="profile-news">
													<div className="media pt-3 pb-3">
														<img src={item.image} alt="" className="me-3 rounded" width={75}/>
														<div className="media-body">
															<h5 className="m-b-5">
																<Link to="/review-list" className="text-black" >
																	{item.email}
																</Link>
															</h5>
															<h5 className="m-b-5">
																<Link to="/review-list"  style={{color:"blue"}} >
																	<u>{item.name}</u>
																</Link>
															</h5>
															<p className="mb-0">
																{item.message}
															</p>
															<p style={{paddingLeft:"250px",color:"red"}}>
																{item.date}
															</p>
														</div>
													</div>


												</div>
												</div>
											))}


										</div>
									</div>

								</>
							) : (

								<>
								<div className="col-lg-12">
							<div className="card">
								<div className="card-header border-0 pb-0">
									<h5 className="text-primary">Today Highlights Reservation </h5>
									<h5 className="text-primary">( {reservationNumber} ) </h5>

								</div>
								<div className="card-body pt-3">
									<div className="profile-blog ">


										<div className="img-bx position-relative">
											{reservation.promotion && (
												<div
													style={{

														top: "100px",
														left: "10px",
														backgroundColor: "rgba(255, 0, 0, 0.8)",
														color: "white",
														paddingLeft:"150px",

														padding: "5px 10px",
														fontWeight: "bold",
														borderRadius: "5px"
													}}
												>En promotion</div>
											)}
											<img src={reservation.logo} alt="profile" className="img-fluid  mb-4 w-100 "/>

										</div>

					                     <Link to="/post-details"><h4>{reservation.name}</h4></Link>
										<p className="mb-0">
											{reservation.description}
										</p>
				</div>
			</div>
		  </div>
		</div>

</>

						)}

					</div>
				</div>
			</div>
			  <div className="col-xl-8">
				  <div className="card">
					  <div className="card-body">
						  <div className="profile-tab">
							  <div className="custom-tab-1">
								  <Tab.Container defaultActiveKey='About'>
									  <Nav as='ul' className="nav nav-tabs">

										  <Nav.Item as='li' className="nav-item">
											  <Nav.Link to="#about-me" eventKey='About'>About Me</Nav.Link>
										  </Nav.Item>
										  <Nav.Item as='li' className="nav-item">
											  <Nav.Link to="#profile-settings" eventKey='Setting'>Setting</Nav.Link>
										  </Nav.Item>
										  <Nav.Item as='li' className="nav-item">
											  <Nav.Link to="#profile-settings-password"
														eventKey='Password'>Password</Nav.Link>
										  </Nav.Item>
									  </Nav>
									  <Tab.Content>
										  <Tab.Pane id="about-me" eventKey='About'>
											  <h4 className="text-primary mb-4 pt-3">
												  Personal Information
											  </h4>
											  <div
												  className="profile-personal-info mb-5 mt-5 p-4 border rounded shadow-sm bg-white">

												  {[
													  {label: "Name", value: USER.fullname},
													  {label: "Email", value: USER.email},
													  {label: "Country", value: USER.country},
													  {label: "City", value: USER.city},
													  {label: "Phone Number", value: USER.phone},
													  {label: "Allergie", value: USER.allergie.label}
												  ].map((info, index) => (
													  <div className="row mb-3 align-items-center" key={index}>
														  <div className="col-4 col-md-3">
															  <h6 className="f-w-500">{info.label}:</h6>
														  </div>
														  <div className="col-8 col-md-9">
															  <span className="text-secondary">{info.value}</span>
												</div>
											</div>
										))}
									</div>
								</Tab.Pane>
								<Tab.Pane id="profile-settings" eventKey='Setting'>
									<div className="pt-3">
										<h4 className="text-primary pt-3">Account Setting</h4>

										<div
											className="profile-personal-info mb-5 mt-5 p-4 border rounded shadow-sm bg-white">
											<form onSubmit={handleSubmitProfile(onSubmitProfile)}>
												<div className="row">
													<div className="form-group mb-3 col-md-6">
														<label className="form-label">Full Name</label>
														<input
															type="text"
															placeholder="Full Name"
															className="form-control"
															{...registerProfile('fullname', {required: true})}
														/>
													</div>
													<div className="form-group mb-3 col-md-6">
														<label className="form-label">Email</label>
														<input
															type="email"
															placeholder="Email"
															className="form-control"
															{...registerProfile('email', {required: true})}
															disabled
														/>
													</div>
												</div>
												<div className="form-group mb-3">
													<label className="form-label">Phone Number</label>
													<input
														type="text"
														className="form-control"
														{...registerProfile('phone', {required: true})}
													/>
												</div>
												<div className="form-group mb-3">
													<label className="form-label">Country</label>
													<input
														type="text"
														className="form-control"
														{...registerProfile('country', {required: true})}
													/>
												</div>
												<div className="form-group mb-3">
													<label className="form-label">City</label>
													<input
														type="text"
														className="form-control"
														{...registerProfile('city', {required: true})}
													/>
												</div>
												<div className="form-group mb-3">
													<label className="form-label">Allergies</label>
													<input
														type="text"
														className="form-control"
														{...registerProfile('allergies')}
													/>
												</div>
												<div className="row p-5 pt-3">
													<button className="btn btn-primary" type="submit">Update</button>
													<button className="btn btn-secondary mt-3" type="reset"
															onClick={() => resetProfile()}>Cancel
													</button>
												</div>
											</form>
										</div>
									</div>
								</Tab.Pane>
								<Tab.Pane id="profile-settings-password" eventKey='Password'>
									<div className="pt-3">
										<h4 className="text-primary pt-3">Change Password</h4>

										<div
											className="profile-personal-info mb-5 mt-5 p-4 border rounded shadow-sm bg-white">
											<form onSubmit={handleSubmitPassword(onSubmitPassword)}>
												<div className="row">
													<div className="form-group mb-3 col-md-6">
														<label className="form-label">Current Password</label>
														<input
															type="password"
															placeholder="Current Password"
															className="form-control"
															{...registerPassword('passwordOld', {required: true})}
														/>
													</div>
													<div className="form-group mb-3 col-md-6">
														<label className="form-label">New Password</label>
														<input
															type="password"
															placeholder="New Password"
															className="form-control"
															{...registerPassword('passwordNew', {required: true})}
														/>
													</div>
												</div>
												<div className="form-group mb-3">
													<label className="form-label">Confirm Password</label>
													<input
														type="password"
														placeholder="Confirm Password"
														className="form-control"
														{...registerPassword('passwordConfirm', {required: true})}
													/>
												</div>
												<div className="row p-5 pt-3">
													<button className="btn btn-primary" type="submit">Update</button>
													<button className="btn btn-secondary mt-3" type="reset"
															onClick={() => resetPassword()}>Cancel
													</button>
												</div>
											</form>
										</div>
									</div>
								</Tab.Pane>
							</Tab.Content>
						</Tab.Container>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
			<Modal className="modal fade" show={state.sendMessage} onHide={() => dispatch({type: 'sendMessage'})}
				   centered>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Send Message</h5>
						<Button variant="" type="button" className="btn-close" data-dismiss="modal"
								onClick={() => dispatch({type: 'sendMessage'})}>

						</Button>
					</div>
					<div className="modal-body">
						<form className="comment-form" onSubmit={(e) => {
							e.preventDefault();
							dispatch({type: 'sendMessage'});
						}}>
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group mb-3">
										<label htmlFor="author" className="text-black font-w600"> Name <span
											className="required">*</span> </label>
										<input type="text" className="form-control" defaultValue="Author" name="Author"
											   placeholder="Author"/>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group mb-3">
										<label htmlFor="email" className="text-black font-w600"> Email <span
											className="required">*</span></label>
										<input type="text" className="form-control" defaultValue="Email"
											   placeholder="Email" name="Email"/>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="form-group mb-3">
										<label htmlFor="comment" className="text-black font-w600">Comment</label>
										<textarea rows={4} className="form-control" name="comment" placeholder="Comment"
												  defaultValue={""}/>
									</div>
								</div>
								<div className="col-lg-12">
									<div className="form-group mb-3">
										<input type="submit" value="Post Comment" className="submit btn btn-primary"
											   name="submit"/>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</Modal>
			  <Modal show={state.post} className="modal fade" id="postModal" onHide={() => dispatch({type:'postModal'})} centered>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Post</h5>
						<Button variant=""  type="button" className="close" data-dismiss="modal" onClick={() => dispatch({type:'postModal'})} >
							<span>×</span>
						</Button>
						
					</div>
					<div className="modal-body">
						<textarea name="textarea" id="textarea" cols={30} rows={5} className="form-control mb-2 bg-transparent" placeholder="Please type what you want...." defaultValue={""}/>
						<Link className="btn btn-primary btn-rounded mt-1" to="/app-profile">Post</Link>
					</div>
				</div>
			</Modal>
			  <Modal show={state.link}  className="modal fade post-input" id="linkModal" onHide={() => dispatch({type:'linkModal'})} centered>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Social Links</h5>
						<button type="button" className="btn-close" data-dismiss="modal" onClick={() => dispatch({type:'linkModal'})}>
						</button>
					</div>
					<div className="modal-body">
						<Link className="btn-social me-1 facebook" to="/app-profile"><i className="fab fa-facebook-f" /></Link>
						<Link className="btn-social me-1 google-plus" to="/app-profile"> <i className="fab fa-google-plus" /></Link>
						<Link className="btn-social me-1 linkedin" to="/app-profile"><i className="fab fa-linkedin-in" /></Link>
						<Link className="btn-social me-1 instagram" to="/app-profile"> <i className="fab fa-instagram" /></Link>
						<Link className="btn-social me-1 twitter" to="/app-profile"><i className="fab fa-twitter" /></Link>
						<Link className="btn-social me-1 youtube" to="/app-profile"><i className="fab fa-youtube" /></Link>
						<Link className="btn-social whatsapp" to="/app-profile"><i className="fab fa-whatsapp" /></Link>
					</div>
				</div>
			</Modal>
			  <Modal show={state.camera}  className="modal fade" id="cameraModal" onHide={() => dispatch({type:'cameraModal'})} centered>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Upload images</h5>
						<button type="button" className="btn-close" data-dismiss="modal" onClick={() => dispatch({type:'cameraModal'})}>
						</button>
					</div>
					<div className="modal-body">
						
						<div className="input-group custom_file_input mb-3">
							<span className="input-group-text">Upload</span>
							<div className="form-file">
								<input type="file" className="form-file-input form-control" />
							</div>
						</div>
					</div>
				</div>
			</Modal>
			  <Modal   show={state.reply}  className="modal fade" id="replyModal" onHide={()=>dispatch({type:'replyModal'})} centered>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Post Reply</h5>
						<button type="button" className="btn-close"  onClick={() => dispatch({type:'replyModal'})}></button>
					</div>
					<div className="modal-body">
						<form>
							<textarea className="form-control" rows="4">Message</textarea>
						</form>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-danger light"  onClick={() => dispatch({type:'replyModal'})}>Close</button>
						<button type="button" className="btn btn-primary">Reply</button>
					</div>
				</div>
			</Modal>
		</Fragment>
				: (
			<div>
				<>
					<Unauthorized/>
				</>
			</div>
		)
	  );
};

export default AppProfile;
