import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./../style.css";
import PageTitle from "../../../../layouts/PageTitle";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const CatalogueProductPage = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const location = useLocation();
    const catalogue = location.state?.catalogue; // Utilisez l'opérateur de chaînage optionnel

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/produit/getProduitByCodeBranche/${catalogue.codeBranche}`);
            const products = response.data;

            console.log('Fetched products:', products); // Ajoutez cette ligne

            // Stocker les produits dans localStorage
            localStorage.setItem(`products_${catalogue.codeBranche}`, JSON.stringify(products));
            setProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        if (catalogue && catalogue.codeBranche) {
            // Nettoyez les anciennes données
            localStorage.removeItem(`products_${catalogue.codeBranche}`);
            const storedProducts = localStorage.getItem(`products_${catalogue.codeBranche}`);
            
            console.log('Stored products:', storedProducts); // Ajoutez cette ligne

            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                fetchProducts();
            }
        } else {
            console.warn('Catalogue or codeBranche is missing:', catalogue);
        }
    }, [catalogue]);

    const handleViewClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    return (
        <>
            <PageTitle activeMenu="Product List" motherMenu="Catalogue" />

            <div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head"></div>
            <div className="row">
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    products.map((product, index) => (
                        <div className="col-xl-3 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index}>
                            <div className="card project-boxed">
                                <div className="card-header align-items-start">
                                    <div>
                                        <div className="text-dark fs-14 text-nowrap">
                                            <label>Code Sous Branche: </label>
                                            {product.code_sous_branche}
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
                                            <Dropdown.Item className="text-success" onClick={() => handleViewClick(product)}>Voir</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="card-body p-0 pb-3">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <span className="mb-0 title">Libeller Sous Branche</span> :
                                            <span className="text-black ms-2">{product.libelle_sous_branche}</span>
                                        </li>
                                        <li className="list-group-item">
                                            <span className="mb-0 title">Code Branche</span> :
                                            <span className="text-black ms-2">{product.codeBranche}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <>
                            <p><strong>Code Sous Branche:</strong> {selectedProduct.code_sous_branche}</p>
                            <p><strong>Libeller Sous Branche:</strong> {selectedProduct.libelle_sous_branche}</p>
                            <p><strong>Code Branche:</strong> {selectedProduct.codeBranche}</p>
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

export default CatalogueProductPage;
