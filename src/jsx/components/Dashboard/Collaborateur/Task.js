import React, { Component, Fragment } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Alert, Confirm } from 'react-st-modal';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';

const initialEtatSinistre = 'ouvert';
const initialLibellerMouvement = 'Recour';

export class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sinistres: [],
      codeClient: '',
      numSinistre: '',
      numPolice: '',
      codeAgent: '',
      restRegler: '',
      etatSinistre: initialEtatSinistre,
      mode: 'add',
      _id: '' // Ajouté pour stocker l'ID du sinistre
    };

    this.columns = [
      { key: 'codeClient', text: 'Code Client', sortable: true },
      { key: 'numSinistre', text: 'Numéro de Sinistre', sortable: true },
      { key: 'numPolice', text: 'Numéro de Police', sortable: true }, 
      { key: 'codeAgent', text: 'Code Agent', sortable: true },
      { key: 'restRegler', text: 'Date de Règlement', sortable: true, cell: record => new Date(record.restRegler).toLocaleDateString() },
      { key: 'etatSinistre', text: 'État du Sinistre', sortable: true },
      {
        key: 'actions',
        text: 'Actions',
        width: '150',
        align: 'center',
        cell: (record, index) => (
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
      filename: 'sinistres',
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
    axios.get(`/api/sinistres/getAllSinistre`)
      .then(response => {
        this.setState({ sinistres: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  editRecord = record => {
    this.setState({
      mode: 'edit',
      codeClient: record.codeClient,
      numSinistre: record.numSinistre,
      numPolice: record.numPolice,
      codeAgent: record.codeAgent,
      restRegler: record.restRegler,
      etatSinistre: record.etatSinistre,
      _id: record._id // Stockez l'ID du sinistre dans l'état
    });
  };

  deleteRecord = async (record) => {
    try {
      const result = await Confirm('Voulez-vous supprimer la ligne sélectionnée ?', 'Confirmation');
      if (result) {
        await this.deleteSinistre(record._id);
        Alert('Sinistre supprimé avec succès', 'Confirmation');
        this.loadData();
      }
      this.clearForm();
    } catch (error) {
      console.error('Erreur lors de la suppression du sinistre:', error);
    }
  };
  
  deleteSinistre = async (_id) => {
    try {
      await axios.delete(`/api/sinistres/supprimerSinistre/${_id}`);
    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error);
      throw error; // Rejeter l'erreur pour qu'elle puisse être captée par le bloc catch dans deleteRecord
    }
  };

  clearForm = () => {
    this.setState({
      mode: 'add',
      codeClient: '',
      numSinistre: '',
      numPolice: '',
      codeAgent: '',
      restRegler: '',
      etatSinistre: initialEtatSinistre,
      _id: '' // Réinitialisez l'ID du sinistre
    });
  };
  
  onSubmit = (e) => {
    e.preventDefault();
  
    const { codeClient, numSinistre, numPolice, codeAgent, restRegler, etatSinistre, _id } = this.state;
    const sinistre = { codeClient, numSinistre, numPolice, codeAgent, restRegler, etatSinistre };
  
    if (_id) { // Vérifiez si un ID existe pour déterminer s'il s'agit d'une modification ou d'un ajout
      axios.put(`/api/sinistres/updateSinistre/${_id}`, sinistre) // Utilisation de PUT pour la modification
        .then(() => {
          alert('Sinistre modifié avec succès'); // Utilisation de `alert` pour afficher une alerte
          this.loadData();
          this.clearForm();
        })
        .catch(error => {
          console.error('Erreur lors de la modification du sinistre:', error);
        });
    } else {
      axios.post(`/api/sinistres/AjouterSinistre`, sinistre) // Utilisation de POST pour l'ajout
        .then(() => {
          alert('Sinistre ajouté avec succès'); // Utilisation de `alert` pour afficher une alerte
          this.loadData();
          this.clearForm();
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout du sinistre:', error);
        });
    }
  };
  
  render() {
    return (
      <div className="container mt-4">
        <Row className="mb-3">
          <Col>
            <Card className="p-3">
              <Card.Body>
                <Card.Title className="mb-2">{this.state.mode === 'edit' ? 'Modifier un Sinistre' : 'Ajouter un Sinistre'}</Card.Title>
                <Form onSubmit={this.onSubmit}>
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
                  <Form.Group controlId="numSinistre">
                    <Form.Label>Numéro de Sinistre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Numéro de Sinistre"
                      value={this.state.numSinistre}
                      onChange={e => this.setState({ numSinistre: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="numPolice">
                    <Form.Label>Numéro de Police</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Numéro de Police"
                      value={this.state.numPolice}
                      onChange={e => this.setState({ numPolice: e.target.value })}
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
                  <Form.Group controlId="restRegler">
                    <Form.Label>Date de Règlement</Form.Label>
                    <Form.Control
                      type="date"
                      value={this.state.restRegler}
                      onChange={e => this.setState({ restRegler: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="etatSinistre">
                    <Form.Label>État du Sinistre</Form.Label>
                    <Form.Control
                      as="select"
                      value={this.state.etatSinistre}
                      onChange={e => this.setState({ etatSinistre: e.target.value })}
                      required
                      size="sm"
                    >
                      <option value="ouvert">Ouvert</option>
                      <option value="ferme">Fermé</option>
                      <option value="en_cours">En Cours</option>
                    </Form.Control>
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
                <Card.Title>Liste des Sinistres</Card.Title>
                <ReactDatatable
                  records={this.state.sinistres}
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
export default PostPage;
