import React from "react";
import { useAuthContext } from "../../../../services/useAuthContext";

const StepTwo = () => {
   const { USER } = useAuthContext();

   return (
      <section>
         <div className="row">
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Nom*</label>
                  <input
                      type="text"
                      name="Nom"
                      className="form-control"
                      placeholder={USER.Nom}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Prénom*</label>
                  <input
                      type="text"
                      name="prenom"
                      className="form-control"
                      placeholder={USER.prenom}
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
                      id="email1"
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
                      name="phone"
                      className="form-control"
                      placeholder={USER.phone}
                      required
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Adresse*</label>
                  <input
                      type="text"
                      name="adresse"
                      className="form-control"
                      placeholder={USER.adresse}
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Ville*</label>
                  <input
                      type="text"
                      name="ville"
                      className="form-control"
                      placeholder={USER.ville}
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Code Postal*</label>
                  <input
                      type="text"
                      name="codePostal"
                      className="form-control"
                      placeholder={USER.codePostal}
                  />
               </div>
            </div>
            <div className="col-lg-6 mb-2">
               <div className="form-group mb-3">
                  <label className="text-label">Type d'Identifiant*</label>
                  <input
                      type="text"
                      name="typeIdentifiant"
                      className="form-control"
                      placeholder={USER.typeIdentifiant}
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default StepTwo;
