import React, {useEffect, useState} from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../../layouts/PageTitle";
import {useAuthContext} from "../../../../../services/useAuthContext";
import axios from "axios";

const ListServiceCollaborateur = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const { USER } = useAuthContext();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
        const userId = userResponse.data._id;

        const reservationResponse = await axios.get(`http://localhost:3000/service/getServiceByUserId/${userId}`);
        setServices(reservationResponse.data || []);
        setFilteredServices(reservationResponse.data || []);

      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchServices();
  }, [USER]);

  useEffect(() => {
    let updatedServices = [...services];

    if (searchTerm) {
      updatedServices = updatedServices.filter(service =>
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.nombrePersonne.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatDate(service.startDate).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    if (sortOrder === "Latest") {
      updatedServices.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortOrder === "Oldest") {
      updatedServices.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }

    setFilteredServices(updatedServices);
  }, [searchTerm, sortOrder, services]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };

  return (
      <div className="h-80">
        <PageTitle activeMenu="Service List" motherMenu="Services" />
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body " style={{ padding: "1.25rem" }}>
                <div className="table-responsive">
                  <div className="row">
                    <div className="col-md-6">
                        <input
                            style={{borderRadius: "30px",boxShadow: "0 8px 10px rgba(0, 0, 0, 0.1)",padding: "0.375rem 0.75rem",border:"1.5px solid #DD2F6E"}}
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-end">
                        <div className="form-group">
                          <select
                              style={{borderRadius: "30px",boxShadow: "0 8px 10px rgba(0, 0, 0, 0.1)",border:"1.5px solid #DD2F6E"}}

                              className="form-select"
                              value={sortOrder}
                              onChange={(e) => setSortOrder(e.target.value)}
                          >
                            <option value="">Sort by</option>
                            <option value="Latest">Latest</option>
                            <option value="Oldest">Oldest</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <table className="table table-sm mb-0 table-responsive-lg text-black">
                    <thead>
                    <tr>
                      <th className="align-middle"><strong></strong></th>
                      <th className="align-middle"><strong>Description</strong></th>
                      <th className="align-middle"><strong>Nombre </strong></th>
                      <th className="align-middle pr-7"><strong>Date</strong></th>
                      <th className="align-middle minw200"><strong>Location</strong></th>
                      <th className="align-middle text-end"><strong>Status</strong></th>
                      <th className="align-middle text-end"><strong>Type</strong></th>
                      <th className="no-sort"/>
                    </tr>
                    </thead>
                    <tbody id="orders">
                    {filteredServices.map((service) => (
                        <tr className="btn-reveal-trigger" key={service._id}>
                          <td className="py-2"><span>*</span></td>
                          <td className="py-2"><span>{service.description}</span></td>
                          <td className="py-2"><span>{service.nombrePersonne}</span></td>
                          <td className="py-2">{formatDate(service.startDate)}</td>
                          <td className="py-2"><p className="mb-0 text-500">{service.lieu}</p></td>
                          <td className="py-2 text-end">
                            {service.status === "CONFIRMER" ? (
                                <span className="badge badge-success">Confirmer<span className="ms-1 fa fa-check"/></span>
                            ) : (
                                <span className="badge badge-primary">En Attente<span className="ms-1 fa fa-redo"/></span>
                            )}
                          </td>
                          <td className="py-2 text-end">
                            {service.type === "EVENT" ? (
                                <span className="btn bgl-primary text-primary btn-sm" style={{width: "100%"}}>{service.type}</span>
                            ) : service.type === "BIRTHDAY" ? (
                                <span className="btn bgl-success text-success btn-sm" style={{width: "100%"}}>{service.type}</span>
                            ) : (
                                <span className="btn bgl-warning text-warning btn-sm" style={{width: "100%"}}>{service.type}</span>
                            )}
                          </td>
                          <td className="py-2 text-end">
                            <Dropdown className="dropdown text-sans-serif">
                              <Dropdown.Toggle
                                  variant=""
                                  className="btn btn-primary i-false tp-btn-light sharp"
                                  type="button"
                                  id="order-dropdown-0"
                                  data-toggle="dropdown"
                                  data-boundary="viewport"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                              >
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                                  <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                    <rect x={0} y={0} width={24} height={24}/>
                                    <circle fill="#000000" cx={5} cy={12} r={2}/>
                                    <circle fill="#000000" cx={12} cy={12} r={2}/>
                                    <circle fill="#000000" cx={19} cy={12} r={2}/>
                                  </g>
                                </svg>
                              </span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="dropdown-menu border py-0" align="end" aria-labelledby="order-dropdown-0">
                                <div className="py-2">
                                  <Link className="dropdown-item" to="/ecom-product-order">Update</Link>
                                  <div className="dropdown-divider"/>
                                  <Link className="dropdown-item text-danger" to="/ecom-product-order">Delete</Link>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ListServiceCollaborateur;
