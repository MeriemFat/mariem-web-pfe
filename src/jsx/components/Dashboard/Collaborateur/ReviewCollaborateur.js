import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {Dropdown, Form, InputGroup} from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import {toast} from "react-toastify";
import {useAuthContext} from "../../../../services/useAuthContext";
import PageTitle from "../../../layouts/PageTitle";
const ReviewCollaborateur = () => {
	const [feedbacks, setFeedbacks] = useState([]);
	const { USER } = useAuthContext();

	useEffect(() => {
		const fetchFeedbacks = async () => {
			try {
				const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
				const userId = userResponse.data._id;


				const response = await axios.get(`http://localhost:3000/feedback/getFeedbackUserID/${userId}`);

				setFeedbacks(response.data);
			} catch (error) {
				console.error('Error fetching feedbacks:', error);
			}
		};

		fetchFeedbacks();
	}, []);

	const formatDate = (date) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(date).toLocaleDateString('fr-FR', options);
	};

	const deleteFeedback = async (id) => {
		try {
			console.log('Deleting feedback:', id);
			const isConfirmed = window.confirm("Are you sure you want to delete this feedback?");
			if (!isConfirmed) return;

			const response = await axios.delete(`http://localhost:3000/feedback/delete/${id}`);
			toast(response.data.message, { type: 'success' });
			setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
		} catch (error) {
			console.error('Error deleting feedback:', error);
		}
	}



	const reviewTable = feedbacks.map((feedback, ind) => ({
		_id: feedback._id,
		image: feedback.buffet.logo,
		title: feedback.buffet.name,
		email: feedback.user.email,

		message: feedback.message,
		date: formatDate(feedback.date),
		rating: feedback.rating,
		status: feedback.status,
	}));

	return (
		<Fragment>

			<PageTitle activeMenu="Review" motherMenu="Home" />


			<div className="row">
				<div className="col-xl-12">
					<div className="card review-table p-0 border-0">
						{reviewTable.map((item, ind) => (
							<div className="row align-items-center p-4 border-bottom" key={ind}>
								<div className="col-xl-4 col-xxl-4 col-lg-5 col-md-12">
									<div className="media align-items-center">
										<div className="form-check custom-checkbox me-4">


										</div>
										<Link to="#">
											<img className="me-3 img-fluid" width="150"
												 style={{borderRadius: "25%"}}

												 src={item.image}
												 alt="Profile"/>
										</Link>
										<div className="card-body p-0">
											<h3 className="fs-20 text-black font-w600 mb-2">
												<p className="text-primary fs-14 mb-0">{item.email}</p>

												<Link to="/app-profile"
													  className="text-black">{item.title}</Link>
											</h3>

											<span className="text-dark">{item.date}</span>
										</div>
									</div>
								</div>
								<div className="col-xl-5 col-xxl-4 col-lg-7 col-md-12 mt-3 mt-lg-0">
									<p className="mb-0 text-dark">{item.message}</p>
								</div>
								<div
									className="col-xl-3 col-xxl-4 col-lg-7 col-md-12 offset-lg-5 offset-xl-0 media-footer mt-xl-0 mt-3">
									<div className="row">
										<div className="text-xl-center col-xl-7 col-sm-9 col-lg-8 col-6">
											<h2 className="text-black font-w600">{item.rating}</h2>

											{item.rating === 1.5 ? (

												<span className="star-review d-inline-block">

      <i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-gray"/>
      <i className="fa fa-star text-gray"/>
      <i className="fa fa-star text-gray"/>
      <i className="fa fa-star text-gray"/>
    </span>
											) : item.rating === 2 ? (
												<span className="star-review d-inline-block">
      <i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-gray"/>
      <i className="fa fa-star text-gray"/>
      <i className="fa fa-star text-gray"/>
    </span>
											) : item.rating === 3 ? (
												<span className="star-review d-inline-block">
      <i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-gray"/>
      <i className="fa fa-star text-gray"/>
    </span>
											) : item.rating === 4 ? (
												<span className="star-review d-inline-block">

      <i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-gray"/>
    </span>
											) : (
												<span className="star-review d-inline-block">
      <i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
													<i className="fa fa-star text-orange"/>{" "}
    </span>
											)}
										</div>

										<div className="edit ms-auto col-xl-5 col-sm-3 col-lg-4 col-6">
											{item.status === 'POSITIVE' ? (
												<Link to={"#"} className="me-4">

													<img
														src="https://www.freeiconspng.com/thumbs/smile-png/smile-png-photo-19.png														"
														alt="icon"
														style={{hight: "52px", width: "52px"}}
													/>

												</Link>
											) : (
												<Link to={"#"} className="me-4">

													<img
														src="https://static.vecteezy.com/system/resources/previews/007/062/958/original/smiley-emoticons-icon-negative-smile-icon-in-trendy-flat-style-isolated-on-white-background-sad-emoticon-vector.jpg"
														alt="icon"
														style={{hight: "52px", width: "52px"}}
													/>


												</Link>
											)}
											<Link to={"#"}>


												<i
													className="fa fa-trash text-danger"
													style={{fontSize: "24px"}}
													onClick={() => deleteFeedback(item._id)}
												/>


											</Link>
										</div>


									</div>

								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ReviewCollaborateur;
