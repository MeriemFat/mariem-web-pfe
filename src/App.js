import React, {lazy, Suspense, useContext, useEffect} from 'react';

/// Components
import Index from "./jsx";
import { connect, useDispatch } from 'react-redux';
import {Outlet, Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
// action
import { checkAutoLogin } from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';
/// Style
import "./vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
impor  "./css/style.css";
import Home from "./jsx/components/Dashboard/Home/Home";
import ForgotPassword from "./jsx/pages/ForgotPassword";

import Review from "./jsx/components/Dashboard/Review/Review";

import AppProfile from "./jsx/components/AppsMenu/AppProfile/AppProfile";
import AdminProfile from "./jsx/components/AppsMenu/AdminProfile/AdminProfile";
import {ThemeContext} from "./context/ThemeContext";
import Nav from "./jsx/layouts/nav";
import Footer from "./jsx/layouts/Footer";
import Buffetlist from "./jsx/components/Dashboard/Fourniseur/BuffetList/Buffetlist";

import Userlist from "./jsx/components/Dashboard/Admin/UserList/Userlist";
import RoleRequest from "./jsx/components/Dashboard/Admin/RoleRequest/RoleRequest";
import Reservationlist from "./jsx/components/Dashboard/Fourniseur/ReservationList/Reservationlist";
import ReservationlistAdmin from "./jsx/components/Dashboard/Admin/ReservationListAdmin/ReservationlistAdmin";
import PaymentlistAdmin from "./jsx/components/Dashboard/Admin/PaymentList/ListPayment";
import Paymentlist from "./jsx/components/Dashboard/Fourniseur/PaymentList/Paymentlist";
import ListPayment from "./jsx/components/Dashboard/Admin/PaymentList/ListPayment";
import ReviewList from "./jsx/components/Dashboard/Fourniseur/Review/ReviewList";
import Promotion from "./jsx/components/Dashboard/Fourniseur/Promotion";
import Sinistre from "./jsx/components/Dashboard/Collaborateur/Task";
import Complaintlist from "./jsx/components/Dashboard/Admin/ComplaintList/Complaintlist";
import Complaint from "./jsx/components/Dashboard/Complaint";
import Chat from "./jsx/components/Dashboard/Chat/Chat";

import Slotlist from "./jsx/components/Dashboard/Admin/SlotList/Slotlist";
import Serviceslist from "./jsx/components/Dashboard/Admin/ServicesList/Serviceslist";
import Wizard from "./jsx/components/Forms/Wizard/Wizard";
import Contrats from "./jsx/components/AppsMenu/Shop/ProductList/ProductList";
import ReviewCollaborateur from "./jsx/components/Dashboard/Collaborateur/ReviewCollaborateur";
import WizardCollaborateur from "./jsx/components/Dashboard/Collaborateur/ServiceCollaborateur/Wizard/Wizard";
import ListServiceCollaborateur from "./jsx/components/Dashboard/Collaborateur/ServiceCollaborateur/ListServiceCollaborateur";
import PaymentListCollaborateur from "./jsx/components/Dashboard/Collaborateur/Payment/PaymentListCollaborateur";
import CatalogueProductsPage from './jsx/components/Dashboard/Collaborateur/Payment/CatalogueProductsPage';
import PaymentFlouci from "./jsx/components/Dashboard/Collaborateur/Payment/PaymentWithFlouci/PaymentFlouci";
import PaymentStripe from "./jsx/components/Dashboard/Collaborateur/Payment/PaymentWithStripe/PaymentStripe";
import PaymentPluxee from "./jsx/components/Dashboard/Collaborateur/Payment/PaymentWithPluxee/PaymentPluxee";
import SuccessPaymentFlouci
    from "./jsx/components/Dashboard/Collaborateur/Payment/PaymentWithFlouci/SuccessPaymentFlouci";
import CancelPaymentFlouci
    from "./jsx/components/Dashboard/Collaborateur/Payment/PaymentWithFlouci/CancelPaymentFlouci";

const SignUp = lazy(() => import('./jsx/pages/Registration'));
const  Login = lazy(() => import('./jsx/pages/Login'));
const SuccessPayment =lazy(() => import('./jsx/components/Dashboard/Collaborateur/Payment/PaymentWithStripe/SuccessPayment'));



function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }
  return ComponentWithRouterProp;
}

function App (props) {
    const dispatch = useDispatch();
	  const navigate = useNavigate();
    useEffect(() => {
       checkAutoLogin(dispatch, navigate);
    }, []);

    const allroutes = [
        /// Dashboard
        { url: "", component: <Home /> },

        { url: "home", component: <Home /> },

       //admin
        { url: "payment-admin", component: <ListPayment/> },
        { url: "Gestion_des_Demandes", component: <Review/> },
        { url: "Gestion_des_Contrats", component: <ReservationlistAdmin/> },
    
        { url: "role-request", component: <RoleRequest/> },
        { url: "Gestion_Utilisateures", component: <Userlist/> },
        { url: "Gestion_des_Sinistres", component: <Slotlist/> },
        { url: "Gestion_des_Quittances", component: <Serviceslist/> },
        { url: 'adminProfile', component: <AdminProfile/> },





//Fourniseur
        { url: "Gestion_Des_Demande", component: <ReviewList/> },
        { url: "Quittance", component: <Reservationlist/> },
        { url: "payment-list", component: <Paymentlist/> },
        { url: "buffet-list", component: <Buffetlist/> },
        { url: 'promotion-list', component: <Promotion/> },


//collaborateur
     
        { url: 'Sinistre', component: <Sinistre/> },
        { url: 'chat', component: <Chat/> },
        { url: 'profile', component: <Complaint/> },
        { url: 'Contrats', component: <Contrats/> },
     
        { url: 'review', component: <ReviewCollaborateur/> },
   
    
        { url: 'catalogue', component: <PaymentListCollaborateur/> },
        {url:'/catalogue/:codeBranche/products' ,component:<CatalogueProductsPage />}, 
        { url: 'payment-flouci', component: <PaymentFlouci/> },
        { url: 'payment-stripe', component: <PaymentStripe/> },
        { url: 'payment-pluxee', component: <PaymentPluxee/> },



       



// Simple user
        {url: 'request-Role',  component: <Wizard/>  },
    ]


    function MainLayout(){
        const { menuToggle, sidebariconHover } = useContext(ThemeContext);
        return (
            <>
                <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle": ""} ${ menuToggle ? "" : "menu-toggle"}`}>
                    <Nav />
                    <div className="content-body" style={{ minHeight: window.screen.height - 45 }}>
                        <div className="container-fluid">
                            <Outlet />
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        )
    };
    let routeblog = (
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path="/checkout-success" element={<SuccessPayment />} />
          <Route path="/payment-success" element={<SuccessPaymentFlouci />} />
          <Route path="/checkout-cancel" element={<CancelPaymentFlouci />} />

          <Route  element={<MainLayout />} >
              {allroutes.map((data, i) => (
                  <Route
                      key={i}
                      exact
                      path={`${data.url}`}
                      element={data.component}
                  />
              ))}
          </Route>
      </Routes>
    );
    if (props.isAuthenticated) {
		return (
			<>
          <Suspense fallback={
              <div id="preloader">
                  <div className="sk-three-bounce">
                      <div className="sk-child sk-bounce1"></div>
                      <div className="sk-child sk-bounce2"></div>
                      <div className="sk-child sk-bounce3"></div>
                  </div>
              </div>
            }
          >
            <Index />
          </Suspense>
      </>
  );

	}else{
		return (
			<div className="vh-100">
            <Suspense fallback={
                <div id="preloader">
                    <div className="sk-three-bounce">
                        <div className="sk-child sk-bounce1"></div>
                        <div className="sk-child sk-bounce2"></div>
                        <div className="sk-child sk-bounce3"></div>
                    </div>
                </div>
              }
            >
              {routeblog}
            </Suspense>
			</div>
		);
	}
};


const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
    };
};

export default withRouter(connect(mapStateToProps)(App));

