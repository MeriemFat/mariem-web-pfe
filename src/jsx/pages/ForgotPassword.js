import React, { useState } from "react";
import { toast } from "react-toastify";
import loginbg from "../../images/bg-login.jpg";

const ForgotPassword = ({ history }) => {
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [email, setEmail] = useState("");

   const onSubmit = async (e) => {
      e.preventDefault();
      if (!email) {
         toast.error("Please enter an email address.");
         return;
      }

      try {
         setIsLoading(true);
         await resetPassword(email);
      } catch (error) {
         console.error("Error resetting password:", error);
         toast.error("Failed to reset password. Please try again later.");
      } finally {
         setIsLoading(false);
      }
   };

   const resetPassword = async (email) => {
      const response = await fetch("/api/User/reset", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email }),
      });

      const json = await response.json();

      if (json.error) {
         setError(json.error);
         toast.error(json.error);
      } else {
         toast.info(`New password was sent to ${email}`);
      }
   };

   return (
       <div  className="login-main-page" style={{ backgroundImage: `url(${loginbg})` ,width:"100%" ,height:"100%" }}>
          <div className="container h-100">
             <div className="row justify-content-center h-100 align-items-center">
                <div className="col-md-6">
                   <div className="authincation-content">
                      <div className="row no-gutters">
                         <div className="col-xl-12">
                            <div className="auth-form">
                               <h4 className="text-center mb-4">Forgot Password</h4>
                               <p>
                                  Enter your email address below and we'll send you a new
                                  password to log in with.
                               </p>

                               <form onSubmit={onSubmit}>
                                  <div className="form-group">
                                     <label>
                                        <strong>Email</strong>
                                     </label>
                                     <input
                                         type="email"
                                         className="form-control"
                                         value={email}
                                         defaultValue="hello@example.com"
                                         onChange={(e) => setEmail(e.target.value)}
                                         required
                                     />
                                  </div>
                                  <div className="text-center">
                                     <input
                                         type="submit"
                                         value={isLoading ? "SUBMITTING..." : "SUBMIT"}
                                         className="btn btn-primary btn-block"
                                         disabled={isLoading}
                                     />
                                  </div>
                               </form>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
   );
};

export default ForgotPassword;
