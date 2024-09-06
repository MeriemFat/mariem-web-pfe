import React, {Fragment, useEffect, useReducer, useState} from "react";
import {Button, Dropdown, Modal, Tab, Nav, NavLink} from "react-bootstrap";
import { Link } from "react-router-dom";
import LightGallery from 'lightgallery/react';
// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { useForm } from 'react-hook-form';
import Truncate from 'react-truncate';
import {useEffectOnce} from "react-use";

//** Import Image */
//** Import Image */
import profile01 from "../../../../images/profile/1.jpg";
import profile02 from "../../../../images/profile/2.jpg";
import profile03 from "../../../../images/profile/3.jpg";
import profile04 from "../../../../images/profile/4.jpg";
import profile05 from "../../../../images/profile/5.jpg";
import profile06 from "../../../../images/profile/6.jpg";
import profile07 from "../../../../images/profile/7.jpg";
import profile08 from "../../../../images/profile/8.jpg";
import profile09 from "../../../../images/profile/9.jpg";
import profile from "../../../../images/profile/profile.png";
import PageTitle from "../../../layouts/PageTitle";
import {useAuthContext} from "../../../../services/useAuthContext";
import {useUpdateProfile} from "../../../../Hooks/useUpdateProfile";
import {usePassword} from "../../../../Hooks/usePassword";
import {useRoleRequest} from "../../../../Hooks/useRoleRequest";
import useMeasure from "react-use-measure";
import {useBlockUser} from "../../../../Hooks/useBlockUser";
import {useGetUsers} from "../../../../Hooks/useGetUsers";
import Unauthorized from "../../../pages/Unauthorized";

const galleryBlog = [
	{image: profile03}, {image: profile04},
	{image: profile02}, {image: profile04},
	{image: profile03}, {image: profile02},
];
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

const AdminProfile = () => {
	const onInit = () => {
		//console.log('lightGallery has been initialized');
	};
	const { USER } = useAuthContext();
	const { update, isLoading: isUpdating } = useUpdateProfile();
	const { changePassword, error: passwordError } = usePassword();

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

	const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, watch: watchPassword } = useForm({
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
					  <img src={USER.avatar} className="img-fluid rounded-circle" alt="profile"/>
					</div>
					<div className="profile-details">
						<div className="profile-name px-3 pt-2">
							<h4 className="text-primary mb-0">{USER.fullname}</h4>
							<p >Admin</p>

						</div>
						<div className="profile-email px-2 pt-2">
							<h4 className="text-muted mb-0">{USER.email}</h4>
						<p>Email</p>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		  <div className="row">

			  <div className="col-xl-12">
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
											  <div className="profile-personal-info mb-5 mt-5 p-4 border rounded shadow-sm bg-white">
												  <h4 className="text-primary mb-4">
													  Personal Information
												  </h4>
												  {[
													  { label: "Name", value: USER.fullname },
													  { label: "Email", value: USER.email },
													  { label: "Country", value: USER.country },
													  { label: "City", value: USER.city },
													  { label: "Phone Number", value: USER.phone },
													  { label: "Allergie", value: USER.allergie.label }
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
										<div className="settings-form">
											<h4 className="text-primary">Account Setting</h4>
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
													<button className="btn btn-secondary mt-3" type="reset" onClick={() => resetProfile()}>Cancel</button>
												</div>
											</form>										</div>
									</div>
								</Tab.Pane>
								<Tab.Pane id="profile-settings-password" eventKey='Password'>
									<div className="pt-3">
										<div className="settings-form">
											<h4 className="text-primary">Change Password</h4>
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
													<button className="btn btn-secondary mt-3" type="reset" onClick={() => resetPassword()}>Cancel</button>
												</div>
											</form>										</div>
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

export default AdminProfile;
