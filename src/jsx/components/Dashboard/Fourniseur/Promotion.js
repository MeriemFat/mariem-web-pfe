import React, { useState, useEffect, Fragment } from 'react';
import { Form } from 'react-bootstrap';
import { Alert, Confirm } from 'react-st-modal';
import { Tooltip } from 'react-tooltip';
import ReactDatatable from '@ashvin27/react-datatable';
const initialExerciseMode = 'Médecin de la Santé Publique';
const initialDoctors = [
  { id: 1, fullname: 'John Doe', address: '123 Main St', governorate: 'Gouv', phone: '123456789', specialty: 'Cardiology', mode: 'Médecin de Libre Pratique' },
  // Ajoutez plus d'exemples si nécessaire
];

const Promotion = () => {
  const [doctors, setDoctors] = useState([]);
  const [id, setId] = useState('');
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [exerciseMode, setExerciseMode] = useState(initialExerciseMode);
  const [mode, setMode] = useState('add');

  const columns = [
    {
      key: 'fullname',
      text: 'Nom & Prénom',
      sortable: true,
      cell: record => (
        <Fragment>
          <p className="no-margin-bottom" data-for="fullname" data-tip={record.fullname}>
            {record.fullname.length > 20 ? record.fullname.substring(0, 20) + '...' : record.fullname}
          </p>
          <Tooltip id="fullname" />
        </Fragment>
      )
    },
    {
      key: 'address',
      text: 'Adresse',
      sortable: true,
      cell: record => (
        <Fragment>
          <p className="no-margin-bottom" data-for="address" data-tip={record.address}>
            {record.address.length > 20 ? record.address.substring(0, 20) + '...' : record.address}
          </p>
          <Tooltip id="address" />
        </Fragment>
      )
    },
    {
      key: 'governorate',
      text: 'Gouvernorat',
      sortable: true
    },
    {
      key: 'phone',
      text: 'N° Tél',
      sortable: true
    },
    {
      key: 'specialty',
      text: 'Spécialité',
      sortable: true
    },
    {
      key: 'mode',
      text: 'Mode d\'exercice',
      sortable: true
    },
    {
      key: 'actions',
      text: 'Actions',
      width: '150',
      align: 'center',
      cell: (record, index) => (
        <Fragment>
          <button
            className="btn btn-primary buttons-pdf" title="Modifier"
            onClick={() => editRecord(record, index)}
            style={{ marginRight: '5px' }}>
            <span><i className="mdi mdi-lead-pencil" aria-hidden="true"></i></span>
          </button>
          <button
            className="btn btn-danger buttons-pdf" title="Supprimer"
            onClick={() => deleteRecord(record, index)}>
            <span><i className="mdi mdi-delete" aria-hidden="true"></i></span>
          </button>
        </Fragment>
      )
    }
  ];

  const config = {
    page_size: 10,
    length_menu: [10, 15, 20],
    show_filter: true,
    show_pagination: true,
    pagination: 'advance',
    filename: 'doctors',
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

  const editRecord = (record, index) => {
    setMode('edit');
    setId(record.id);
    setFullname(record.fullname);
    setAddress(record.address);
    setGovernorate(record.governorate);
    setPhone(record.phone);
    setSpecialty(record.specialty);
    setExerciseMode(record.mode);
  };

  const deleteRecord = async (record, index) => {
    const result = await Confirm('Voulez-vous supprimer la ligne sélectionnée', 'Confirmation');
    if (result) {
      deleteDoctor(record.id);
    }
    clearForm();
  };

  const clearForm = () => {
    setMode('add');
    setId('');
    setFullname('');
    setAddress('');
    setGovernorate('');
    setPhone('');
    setSpecialty('');
    setExerciseMode(initialExerciseMode);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const doctor = {
      id: id || Date.now(), // Utilisez un ID temporaire si vous en avez besoin
      fullname,
      address,
      governorate,
      phone,
      specialty,
      mode: exerciseMode
    };

    if (id) {
      // Mettez à jour un médecin existant
      const updatedDoctors = doctors.map(d => (d.id === id ? doctor : d));
      setDoctors(updatedDoctors);
      Alert('Médecin modifié avec succès', 'Confirmation');
    } else {
      // Ajoutez un nouveau médecin
      setDoctors([...doctors, doctor]);
      Alert('Médecin ajouté avec succès', 'Confirmation');
    }

    clearForm();
  };

  const deleteDoctor = (id) => {
    // Simulez la suppression
    const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
    setDoctors(updatedDoctors);
    Alert('Médecin supprimé avec succès', 'Confirmation');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDoctors(initialDoctors);
  };

  return (
    <div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title" hidden={mode === 'edit'}>Ajouter une Sinistre</h4>
              <h4 className="card-title" hidden={mode === 'add'}>Modifier une Sinistre</h4>
              <p className="card-description" />
              <form className="forms-sample" id="addDoctorForm" onSubmit={onSubmit}>
                <Form.Group>
                  <Form.Control type="hidden" id="id" placeholder="Identifiant" required={false}
                    value={id} onChange={e => setId(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="fullname">Nom & Prénom</label>
                  <Form.Control type="text" id="fullname" placeholder="Nom & Prénom" required={true}
                    value={fullname} onChange={e => setFullname(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="address">Adresse</label>
                  <Form.Control type="text" className="form-control" id="address" placeholder="Adresse" required={true}
                    value={address} onChange={e => setAddress(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="governorate">Gouvernorat</label>
                  <Form.Control type="text" id="governorate" placeholder="Gouvernorat" required={true}
                    value={governorate} onChange={e => setGovernorate(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="phone">N° Téléphone</label>
                  <Form.Control type="text" id="phone" placeholder="N° Téléphone" required={false}
                    value={phone} onChange={e => setPhone(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="specialty">Spécialité</label>
                  <Form.Control type="text" id="specialty" placeholder="Spécialité" required={true}
                    value={specialty} onChange={e => setSpecialty(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exerciseMode">Mode d'exercice</label>
                  <select className="form-control" id="exerciseMode" required={true}
                    onChange={e => setExerciseMode(e.target.value)} value={exerciseMode}>
                    <option value="Médecin de la Santé Publique">Médecin de la Santé Publique</option>
                    <option value="Médecin de Libre Pratique">Médecin de Libre Pratique</option>
                    <option value="Médecin Hôpital Sanitaire">Médecin Hôpital Sanitaire</option>
                    <option value="Médecin Hospitalo-Universitaire">Médecin Hospitalo-Universitaire</option>
                    <option value="Médecin Militaire">Médecin Militaire</option>
                  </select>
                </Form.Group>
                <button type="submit" className="btn btn-primary mr-2">
                  <span hidden={mode === 'edit'}>Ajouter</span>
                  <span hidden={mode === 'add'}>Modifier</span>
                </button>
                <button className="btn btn-dark" type="button" onClick={clearForm}>Annuler</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Liste des Sinistre</h4>
          <ReactDatatable
            config={config}
            records={doctors}
            columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Promotion;
