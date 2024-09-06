import React, { Fragment, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PageTitle from "../../../../../layouts/PageTitle";
import { useAuthContext } from "../../../../../../services/useAuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentPluxee = () => {
   const [reservations, setReservations] = useState([]);
   const [paymentLink, setPaymentLink] = useState("");
   const { USER } = useAuthContext();

   useEffect(() => {
      const fetchReservations = async () => {
         try {
            const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
            const userId = userResponse.data._id;

            const reservationResponse = await axios.get(`http://localhost:3000/reservation/getbyUserIdReservationEnAttente/${userId}`);
            setReservations(reservationResponse.data || []);
         } catch (error) {
            console.error("Error fetching reservations:", error);
         }
      };

      fetchReservations();
   }, [USER]);

   const handleSumbitPayment = async (event) => {
      event.preventDefault();

      try {
         const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
         const userId = userResponse.data._id;

         const payment = {
            userId: userId,
            buffetId: reservations[0].buffet._id,
         };

         const response = await axios.post(`http://localhost:3000/payment/create-checkout-session/`, payment);
         setPaymentLink(response.data.url);
         toast.success("Your details have been successfully saved! Please proceed with the payment process.");
         window.location.href =response.data.url;

      } catch (error) {
         console.error("Error submitting payment:", error);
      }
   };

   return (
       <Fragment>
          <PageTitle activeMenu="Payment Stripe" motherMenu="Payment" />

          <div className="row">
             <div className="col-xl-3"></div>
             <div className="col-xl-6">
                <div className="card">
                   <div className="card-body">
                      <div className="row">
                         <div className="col-md-12 order-md-1">
                            <h4 className="mb-3" style={{ marginLeft: "35%", paddingBottom: "30px" }}>Payment Information</h4>
                            <Form className="needs-validation" noValidate="" onSubmit={handleSumbitPayment}>
                               <div className="row">
                                  <div className="col-md-12 mb-3">
                                     <label htmlFor="fullname">Full name</label>
                                     <input
                                         type="text"
                                         className="form-control"
                                         id="fullname"
                                         value={USER.fullname}
                                         required
                                     />
                                     <div className="invalid-feedback">
                                        Valid full name is required.
                                     </div>
                                  </div>
                               </div>
                               <div className="mb-3">
                                  <label htmlFor="email">Email</label>
                                  <input
                                      type="email"
                                      className="form-control"
                                      id="email"
                                      value={USER.email}
                                  />
                                  <div className="invalid-feedback">
                                     Please enter a valid email address for shipping updates.
                                  </div>
                               </div>
                               <div className="mb-3">
                                  <label htmlFor="phone">Phone Number</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      id="phone"
                                      value={USER.phone}
                                  />
                                  <div className="invalid-feedback">
                                     Please enter your Phone number.
                                  </div>
                               </div>
                               <div className="row">
                                  <div className="col-md-6 mb-3">
                                     <label htmlFor="country">Country</label>
                                     <input
                                         type="text"
                                         className="form-control"
                                         id="country"
                                         value={USER.country}
                                     />
                                     <div className="invalid-feedback">
                                        Please provide a valid country.
                                     </div>
                                  </div>
                                  <div className="col-md-6 mb-3">
                                     <label htmlFor="city">City</label>
                                     <input
                                         type="text"
                                         className="form-control"
                                         id="city"
                                         value={USER.city}
                                     />
                                     <div className="invalid-feedback">
                                        Please provide a valid city.
                                     </div>
                                  </div>
                               </div>
                               <hr className="mb-4" style={{ border: "3px solid black" }} />
                               <div className="mb-3">
                                  <label htmlFor="buffet">Buffet</label>
                                  <select
                                      style={{ border: "3px solid #ced4da", borderRadius: "7%", width: "100%" }}
                                      className="form-control"
                                      id="buffet"
                                      required
                                  >
                                     <option value="">Choose Buffet ...</option>
                                     {reservations.map((reservation) => (
                                         <option key={reservation.buffet._id} value={reservation.buffet._id}>
                                            {reservation.buffet.name}
                                         </option>
                                     ))}
                                  </select>
                                  <div className="invalid-feedback">
                                     Please select a valid Buffet.
                                  </div>
                               </div>
                               <br />
                               <hr className="mb-4" style={{ border: "3px solid black" }} />
                               <div className="form-check custom-checkbox mb-2">
                                  <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="same-address"
                                  />
                                  <label
                                      className="form-check-label"
                                      htmlFor="same-address"
                                  >
                                     Shipping address is the same as my billing address
                                  </label>
                               </div>
                               <div className="form-check custom-checkbox mb-2">
                                  <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="save-info"
                                  />
                                  <label
                                      className="form-check-label"
                                      htmlFor="save-info"
                                  >
                                     Save this information for next time
                                  </label>
                               </div>
                               <hr className="mb-12" />
                               <button
                                   className="btn btn-primary btn-lg btn-block"
                                   type="submit"
                               >
                                  Continue to checkout
                               </button>
                            </Form>
                            {paymentLink && (
                                <div className="mt-3">
                                   <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                                      Click here to complete your payment
                                   </a>
                                </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </Fragment>
   );
};

export default PaymentPluxee;
