import React, { useContext } from 'react'
/// React router dom
import {Routes, Route, Outlet } from 'react-router-dom'
/// Css
import './index.css'
import './step.css'

/// Layout
import Nav from './layouts/nav'
import Footer from './layouts/Footer'

/// Dashboard
import Home from "./components/Dashboard/Home/Home";


import Review from "./components/Dashboard/Review/Review";
import Order from "./components/Dashboard/Order/Order";
import Orderlist from "./components/Dashboard/Orderlist/Orderlist";
import Customerlist from "./components/Dashboard/Customerlist/Customerlist";
import Task from './components/Dashboard/Fourniseur/Promotion';

/// App
import AppProfile from './components/AppsMenu/AppProfile/AppProfile'
import PostDetails from './components/AppsMenu/AppProfile/PostDetails'
import Compose from './components/AppsMenu/Email/Compose/Compose'
import Inbox from './components/AppsMenu/Email/Inbox/Inbox'
import Read from './components/AppsMenu/Email/Read/Read'

/// Product List
import ProductList from './components/AppsMenu/Shop/ProductList/ProductList'
import Checkout from './components/AppsMenu/Shop/Checkout/Checkout'
import Invoice from './components/AppsMenu/Shop/Invoice/Invoice'
import EcomCustomers from './components/AppsMenu/Shop/Customers/Customers'
/// Bootstrap
import UiAlert from './components/bootstrap/Alert'
import UiAccordion from './components/bootstrap/Accordion'
import UiBadge from './components/bootstrap/Badge'
import UiButton from './components/bootstrap/Button'
import UiModal from './components/bootstrap/Modal'
import UiButtonGroup from './components/bootstrap/ButtonGroup'
import UiListGroup from './components/bootstrap/ListGroup'
import UiCards from './components/bootstrap/Cards'
import UiCarousel from './components/bootstrap/Carousel'
import UiDropDown from './components/bootstrap/DropDown'
import UiPopOver from './components/bootstrap/PopOver'
import UiProgressBar from './components/bootstrap/ProgressBar'
import UiTab from './components/bootstrap/Tab'
import UiPagination from './components/bootstrap/Pagination'
import UiGrid from './components/bootstrap/Grid'
import UiTypography from './components/bootstrap/Typography'

/// Plugins
import Select2 from './components/PluginsMenu/Select2/Select2'
import Nestable from './components/PluginsMenu/Nestable/Nestable'
import MainSweetAlert from './components/PluginsMenu/SweetAlert/SweetAlert'
import Toastr from './components/PluginsMenu/Toastr/Toastr'
import JqvMap from './components/PluginsMenu/JqvMap/JqvMap'
import Lightgallery from './components/PluginsMenu/Lightgallery/Lightgallery'


/// Widget
import Widget from './pages/Widget'

/// Table
import DataTable from './components/table/DataTable'
import BootstrapTable from './components/table/BootstrapTable'
import SortingTable from "./components/table/SortingTable/SortingTable";
import FilteringTable from "./components/table/FilteringTable/FilteringTable";


/// Form
import Element from './components/Forms/Element/Element'
import Wizard from './components/Forms/Wizard/Wizard'
import CkEditor from './components/Forms/CkEditor/CkEditor'
import FormValidation from './components/Forms/FormValidation/FormValidation'

/// Pages
import LockScreen from './pages/LockScreen'
import Error400 from './pages/Error400'
import Error403 from './pages/Error403'
import Error404 from './pages/Error404'
import Error500 from './pages/Error500'
import Error503 from './pages/Error503'
import Todo from './pages/Todo';

import { ThemeContext } from "../context/ThemeContext";
//Scroll To Top
import ScrollToTop from './layouts/ScrollToTop';

const Markup = () => {
  
  const allroutes = [
    /// Dashboard
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> },
    // { url: "companies", component: <Companies/> },
    
    { url: "review", component: <Review/> },
    { url: "order", component: <Order/> },
    { url: "order-list", component: <Orderlist/> },
    { url: "customer-list", component: <Customerlist/> },
    { url: 'task', component: <Task/> },

    /// Apps
    { url: 'app-profile', component: <AppProfile/> },
    { url: 'post-details', component: <PostDetails/> },
    { url: 'email-compose', component: <Compose/> },
    { url: 'email-inbox', component: <Inbox/> },
    { url: 'email-read', component: <Read/> },

    



    /// Bootstrap
    { url: 'ui-alert', component: <UiAlert/> },
    { url: 'ui-badge', component: <UiBadge/> },
    { url: 'ui-button', component: <UiButton/> },
    { url: 'ui-modal', component: <UiModal/> },
    { url: 'ui-button-group', component: <UiButtonGroup/> },
    { url: 'ui-accordion', component: <UiAccordion/> },
    { url: 'ui-list-group', component: <UiListGroup/> },
    { url: 'ui-card', component: <UiCards/> },
    { url: 'ui-carousel', component: <UiCarousel/> },
    { url: 'ui-dropdown', component: <UiDropDown/> },
    { url: 'ui-popover', component: <UiPopOver/> },
    { url: 'ui-progressbar', component: <UiProgressBar/> },
    { url: 'ui-tab', component: <UiTab/> },
    { url: 'ui-pagination', component: <UiPagination/> },
    { url: 'ui-typography', component: <UiTypography/> },
    { url: 'ui-grid', component: <UiGrid/> },

    /// Plugin
    { url: 'uc-select2', component: <Select2/> },
    { url: 'uc-nestable', component: <Nestable/> },
    { url: 'uc-sweetalert', component: <MainSweetAlert/> },
    { url: 'uc-toastr', component: <Toastr/> },
    { url: 'map-jqvmap', component: <JqvMap/> },
    { url: 'uc-lightgallery', component: <Lightgallery/> },


    /// Widget
    { url: 'widget-basic', component: <Widget/> },

    /// Shop
    { url: 'ecom-product-list', component: <ProductList/> },
    { url: 'ecom-checkout', component: <Checkout/> },
    { url: 'ecom-invoice', component: <Invoice/> },
    { url: 'ecom-customers', component: <EcomCustomers/> },

    /// Form
    
       
    { url: 'form-element', component: <Element/> },
    { url: 'form-wizard', component: <Wizard/> },
    { url: 'form-ckeditor', component: <CkEditor/> },
    { url: 'form-validation', component: <FormValidation/> },

    /// table
    { url: 'table-datatable-basic', component: <DataTable/> },
    { url: 'table-bootstrap-basic', component: <BootstrapTable/> },
    { url: 'table-filtering', component: <FilteringTable/> },
    { url: 'table-sorting', component: <SortingTable/> },

    /// pages
    { url: 'page-lock-screen', component: <LockScreen/> },  
    { url: 'todo', component: Todo },
  ]

  return (
       <>          
          <Routes>
            <Route path='/page-lock-screen' element= {<LockScreen />} />
            <Route path='/page-error-400' element={<Error400/>} />
            <Route path='/page-error-403' element={<Error403/>} />
            <Route path='/page-error-404' element={<Error404/>} />
            <Route path='/page-error-500' element={<Error500/>} />
            <Route path='/page-error-503' element={<Error503/>} />
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
         <ScrollToTop />
       </>
  )
}

function MainLayout(){  
  const { menuToggle, sidebariconHover } = useContext(ThemeContext);
  return (
    <>
      <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle": ""} ${ menuToggle ? "menu-toggle" : ""}`}>  
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
export default Markup
