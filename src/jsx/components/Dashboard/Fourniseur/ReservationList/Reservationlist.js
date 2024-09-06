import React, { Component, Fragment } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Alert, Confirm } from 'react-st-modal';

export class DatatablePstatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quittances: [],
      _id: '',
      codeAgent: '',
      numPolice: '',
      numQuittance: '',
      dateMutDu: '',
      dateMutAu: '',
      primeTotal: '',
      EtatMvt: '',
      mode: 'add',
      loading: true,
      error: null
    };

    this.columns = [
      { key: 'codeAgent', text: 'Code Agent', sortable: true },
      { key: 'numPolice', text: 'Numéro Police', sortable: true },
      { key: 'numQuittance', text: 'Numéro Quittance', sortable: true },
      { key: 'dateMutDu', text: 'Date Mutuelle Du', sortable: true, cell: record => new Date(record.dateMutDu).toLocaleDateString() },
      { key: 'dateMutAu', text: 'Date Mutuelle Au', sortable: true, cell: record => new Date(record.dateMutAu).toLocaleDateString() },
      { key: 'primeTotal', text: 'Prime Totale', sortable: true },
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
      filename: 'quittances',
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
    axios.get(`/api/quittance/getAllQuittance`)
      .then(response => {
        this.setState({ quittances: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  editRecord = record => {
    this.setState({
      mode: 'edit',
      codeAgent: record.codeAgent,
      numPolice: record.numPolice,
      numQuittance: record.numQuittance,
      dateMutDu: record.dateMutDu,
      dateMutAu: record.dateMutAu,
      primeTotal: record.primeTotal,
      _id: record._id
    });
  };

  deleteRecord = async (record) => {
    try {
      const result = await Confirm('Voulez-vous supprimer la ligne sélectionnée ?', 'Confirmation');
      if (result) {
        await this.deleteQuittance(record._id);
        Alert('Quittance supprimée avec succès', 'Confirmation');
        this.loadData();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la quittance:', error);
      Alert('Erreur lors de la suppression de la quittance. Veuillez réessayer plus tard.', 'Erreur');
    }
  };

  deleteQuittance = async (_id) => {
    try {
      if (!_id) {
        throw new Error('ID de quittance manquant.');
      }
      await axios.delete(`/api/quittance/SupprimerQuittance/${_id}`);
    } catch (error) {
      console.error('Erreur lors de l\'appel API:', error);
      throw error;
    }
  };

  clearForm = () => {
    this.setState({
      mode: 'add',
      codeAgent: '',
      numPolice: '',
      numQuittance: '',
      dateMutDu: '',
      dateMutAu: '',
      primeTotal: '',
      _id: ''
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { codeAgent, numPolice, numQuittance, dateMutDu, dateMutAu, primeTotal, EtatMvt, _id } = this.state;
    const quittance = { codeAgent, numPolice, numQuittance, dateMutDu, dateMutAu, primeTotal, EtatMvt };

    if (_id) {
      axios.put(`/api/quittance/ModifierQuittance/${_id}`, quittance)
        .then(() => {
          Alert('Quittance modifiée avec succès', 'Confirmation');
          this.loadData();
          this.clearForm();
        })
        .catch(error => {
          console.error('Erreur lors de la modification de la quittance:', error);
          Alert('Erreur lors de la modification de la quittance. Veuillez réessayer plus tard.', 'Erreur');
        });
    } else {
      axios.post(`/api/quittance/AjouterQuittance`, quittance)
        .then(() => {
          Alert('Quittance ajoutée avec succès', 'Confirmation');
          this.loadData();
          this.clearForm();
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de la quittance:', error);
          Alert('Erreur lors de l\'ajout de la quittance. Veuillez réessayer plus tard.', 'Erreur');
        });
    }
  };

  render() {
    const { quittances } = this.state;

    return (
      <div className="container mt-4">
        <Row className="mb-3">
          <Col>
            <Card className="p-3">
              <Card.Body>
                <Card.Title className="mb-2">{this.state.mode === 'edit' ? 'Modifier une Quittance' : 'Ajouter une Quittance'}</Card.Title>
                <Form onSubmit={this.onSubmit}>
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
                  <Form.Group controlId="numPolice">
                    <Form.Label>Numéro Police</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Numéro Police"
                      value={this.state.numPolice}
                      onChange={e => this.setState({ numPolice: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="numQuittance">
                    <Form.Label>Numéro Quittance</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Numéro Quittance"
                      value={this.state.numQuittance}
                      onChange={e => this.setState({ numQuittance: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="dateMutDu">
                    <Form.Label>Date Mutuelle Du</Form.Label>
                    <Form.Control
                      type="date"
                      value={this.state.dateMutDu}
                      onChange={e => this.setState({ dateMutDu: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="dateMutAu">
                    <Form.Label>Date Mutuelle Au</Form.Label>
                    <Form.Control
                      type="date"
                      value={this.state.dateMutAu}
                      onChange={e => this.setState({ dateMutAu: e.target.value })}
                      required
                      size="sm"
                    />
                  </Form.Group>
                  <Form.Group controlId="primeTotal">
                    <Form.Label>Prime Totale</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Prime Totale"
                      value={this.state.primeTotal}
                      onChange={e => this.setState({ primeTotal: e.target.value })}
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
                <Card.Title>Liste des Quittances</Card.Title>
                <ReactDatatable
                  records={quittances}
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

export default DatatablePstatus;