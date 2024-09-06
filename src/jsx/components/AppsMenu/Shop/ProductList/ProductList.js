import React, { Component, Fragment } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Alert, Confirm } from 'react-st-modal';

export class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contrats: [],
      _id: '',
      libelle_branche: '',
      libelle_sous_branche: '',
      date_echeance_prochaine: '',
      type_personne: '',
      codeClient: '',
      codeAgent: '',
      mode: 'add',
      loading: true,
      error: null
    };

    this.columns = [
      { key: 'libelle_branche', text: 'Libellé Branche', sortable: true },
      { key: 'libelle_sous_branche', text: 'Libellé Sous-Branche', sortable: true },
      { key: 'date_echeance_prochaine', text: 'Date Échéance Prochaine', sortable: true, cell: record => new Date(record.date_echeance_prochaine).toLocaleDateString() },
      { key: 'type_personne', text: 'Type Personne', sortable: true },
      { key: 'codeClient', text: 'Code Client', sortable: true },
      { key: 'codeAgent', text: 'Code Agent', sortable: true },
      {
        key: 'actions',
        text: 'Actions',
        width: '150',
        align: 'center',
        cell: record => (
          <Fragment>
            <Button
              variant="primary" size="sm" title="Modifier"
              onClick={() => this.editRecord(record)}
              className="mr-1">
              <i className="mdi mdi-lead-pencil" aria-hidden="true"></i>
            </Button>
            <Button
              variant="danger" size="sm" title="Supprimer"
              onClick={() => this.deleteRecord(record)}>
              <i className="mdi mdi-delete" aria-hidden="true"></i>
            </Button>
          </Fragment>
        )
      }
    ];

    this.config = {
      page_size: 10,
      length_menu: [10, 15, 20],
      show_filter: true,
      show_pagination: true,
      pagination: 'advance',
      filename: 'contrats',
      button: {
        excel: true,
        print: false,
        csv: true
      },
      language: {
        length_menu: 'Afficher _MENU_ éléments par page',
        filter: 'Recherche...',
        info: 'Affichage de l\'élément _START_ à _END_ sur _TOTAL_ éléments',
        pagination: {
          first: 'Premier',
          previous: 'Précédent',
          next: 'Suivant',
          last: 'Dernier'
        }
      }
    };
  }

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    axios.get(`/api/contrat/getAllContrats`)
      .then(response => {
        this.setState({ contrats: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };
  

  editRecord = record => {
    this.setState({
      mode: 'edit',
      libelle_branche: record.libelle_branche,
      libelle_sous_branche: record.libelle_sous_branche,
      date_echeance_prochaine: record.date_echeance_prochaine,
      type_personne: record.type_personne,
      codeClient: record.codeClient,
      codeAgent: record.codeAgent,
      _id: record._id
    });
  };

  deleteRecord = async (record) => {
    try {
      const result = await Confirm('Voulez-vous supprimer la ligne sélectionnée ?', 'Confirmation');
      if (result) {
        await this.deleteContrat(record._id);
        Alert('Contrat supprimé avec succès', 'Confirmation');
        this.loadData();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du contrat:', error);
      Alert('Erreur lors de la suppression du contrat. Veuillez réessayer plus tard.', 'Erreur');
    }
  };
  
  deleteContrat = async (_id) => {
    try {
      if (!_id) {
        throw new Error('ID de contrat manquant.');
      }
      await axios.delete(`/api/contrat/supprimerContrat/${_id}`);
    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error);
      throw error;
    }
  };

  clearForm = () => {
    this.setState({
      mode: 'add',
      libelle_branche: '',
      libelle_sous_branche: '',
      date_echeance_prochaine: '',
      type_personne: '',
      codeClient: '',
      codeAgent: '',
      _id: ''
    });
  };
  
  onSubmit = (e) => {
    e.preventDefault();
  
    const { libelle_branche, libelle_sous_branche, date_echeance_prochaine, type_personne, codeClient, codeAgent, _id } = this.state;
    const contrat = { libelle_branche, libelle_sous_branche, date_echeance_prochaine, type_personne, codeClient, codeAgent };
  
    if (_id) {
      axios.put(`/api/contrat/ModifierContrat/${_id}`, contrat)
        .then(() => {
          Alert('Contrat modifié avec succès', 'Confirmation');
          this.loadData();
          this.clearForm();
        })
        .catch(error => {
          console.error('Erreur lors de la modification du contrat:', error);
          Alert('Erreur lors de la modification du contrat. Veuillez réessayer plus tard.', 'Erreur');
        });
    } else {
      axios.post(`/api/contrat/AjouterContrat`, contrat)
        .then(() => {
          Alert('Contrat ajouté avec succès', 'Confirmation');
          this.loadData();
          this.clearForm();
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout du contrat:', error);
          Alert('Erreur lors de l\'ajout du contrat. Veuillez réessayer plus tard.', 'Erreur');
        });
    }
  };
  
  render() {
    const { loading, error, contrats } = this.state;

    return (
      <div className="container mt-4">
        <Row className="mb-3">
          <Col>
            <Card className="p-3">
              <Card.Body>
                <Card.Title className="mb-2">{this.state.mode === 'edit' ? 'Modifier un Contrat' : 'Ajouter un Contrat'}</Card.Title>
                <Form onSubmit={this.onSubmit}>
                  {/* Form Fields */}
                  <Form.Group controlId="libelle_branche">
                    <Form.Label>Libellé Branche</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Libellé Branche"
                      value={this.state.libelle_branche}
                      onChange={e => this.setState({ libelle_branche: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="libelle_sous_branche">
                    <Form.Label>Libellé Sous-Branche</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Libellé Sous-Branche"
                      value={this.state.libelle_sous_branche}
                      onChange={e => this.setState({ libelle_sous_branche: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="date_echeance_prochaine">
                    <Form.Label>Date Échéance Prochaine</Form.Label>
                    <Form.Control
                      type="date"
                      value={this.state.date_echeance_prochaine}
                      onChange={e => this.setState({ date_echeance_prochaine: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="type_personne">
                    <Form.Label>Type Personne</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Type Personne"
                      value={this.state.type_personne}
                      onChange={e => this.setState({ type_personne: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="codeClient">
                    <Form.Label>Code Client</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Code Client"
                      value={this.state.codeClient}
                      onChange={e => this.setState({ codeClient: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="codeAgent">
                    <Form.Label>Code Agent</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Code Agent"
                      value={this.state.codeAgent}
                      onChange={e => this.setState({ codeAgent: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" size="sm">
                    {this.state.mode === 'edit' ? 'Modifier' : 'Ajouter'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="p-3">
              <Card.Body>
                <Card.Title>Liste des Contrats</Card.Title>
             
                  <ReactDatatable
                    records={contrats}
                    columns={this.columns}
                    config={this.config}
                  />
             
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProductList;
