import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./../style.css";
import PageTitle from "../../../../layouts/PageTitle";
import { useAuthContext } from "../../../../../services/useAuthContext";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PostPage = () => {
    const [catalogues, setCatalogues] = useState([]);
    const [visibleCatalogues, setVisibleCatalogues] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCatalogue, setSelectedCatalogue] = useState(null);
    const { USER } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCatalogues = async () => {
            try {
                const response = await axios.get('/api/categorie/getAllCatalogues');
                setCatalogues(response.data);
                setVisibleCatalogues(response.data.map(catalogue => catalogue._id)); // Initially, all catalogues are visible
            } catch (error) {
                console.error('Error fetching catalogues:', error);
            }
        };

        fetchCatalogues();
    }, []);

    const handleViewClick = (catalogue) => {
        setSelectedCatalogue(catalogue);
        setShowModal(true);
    };

    const handleCatalogueClick = (catalogue) => {
        navigate(`/catalogue/${catalogue.codeBranche}/products`, { state: { catalogue } });
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedCatalogue(null);
    };

    const handleHideCatalogue = (catalogueId) => {
        setVisibleCatalogues(prevVisibleCatalogues => prevVisibleCatalogues.filter(id => id !== catalogueId));
    };

    return (
        <>
            <PageTitle activeMenu="Catalogue List" motherMenu="Catalogue" />

            <div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head">
            </div>
            <div className="row">
                {catalogues.map((catalogue, index) => (
                    visibleCatalogues.includes(catalogue._id) && (
                        <div className="col-xl-3 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
                            <div className="card project-boxed" onClick={() => handleCatalogueClick(catalogue)}>
                                <div className="img-bx position-relative">
                                    <img
                                        src={catalogue.photo} alt="" className="me-3 card-list-img w-100" width="130" />
                                </div>
                                <div className="card-header align-items-start">
                                    <div>
                                        <div className="text-dark fs-14 text-nowrap">
                                            <label>Libeller Branche: </label>
                                            {catalogue.libellerBranche}
                                        </div>
                                    </div>

                                    <Dropdown className="">
                                        <Dropdown.Toggle variant="" as="div" className="btn-link i-false">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item className="text-success" onClick={() => handleViewClick(catalogue)}>Voir</Dropdown.Item>

                                            <Dropdown.Item className="text-danger" onClick={() => handleHideCatalogue(catalogue._id)}>
                                                Hide
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="card-body p-0 pb-3">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <span className="mb-0 title">Code Branche</span> :
                                            <span className="text-black ms-2">{catalogue.codeBranche}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Catalogue Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCatalogue && (
                        <>
                            <p><strong>Libeller Branche:</strong> {selectedCatalogue.libellerBranche}</p>
                            <p><strong>Code Branche:</strong> {selectedCatalogue.codeBranche}</p>
                            <img src={selectedCatalogue.photo} alt="Catalogue Photo" style={{ width: '100%' }} />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PostPage;
