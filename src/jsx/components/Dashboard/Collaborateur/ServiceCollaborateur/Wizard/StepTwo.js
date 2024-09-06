import React from "react";
import {useAuthContext} from "../../../../../../services/useAuthContext";




const StepTwo = () => {
   const {USER} = useAuthContext()

   return (
      <section>
         <div className="row">
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label"> full Name*</label>
                  <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      placeholder={USER.fullname}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Email Address*</label>
                  <input
                      type="email"
                      className="form-control"
                      id="emial1"
                      placeholder={USER.email}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Phone Number*</label>
                  <input
                      type="text"
                      name="phoneNumber"
                      className="form-control"
                      placeholder={USER.phone}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">
                     Your Country*
                  </label>
                  <input
                      type="text"
                      name="place"
                      className="form-control"
                      placeholder={USER.country}
                  />
               </div>
            </div>
            <div className="col-lg-12 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">
                     Your Country*
                  </label>
                  <input
                      type="text"
                      name="place"
                      className="form-control"
                      placeholder={USER.city}
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default StepTwo;
