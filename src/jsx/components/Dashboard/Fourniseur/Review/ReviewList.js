import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, useTheme, Accordion, AccordionDetails, AccordionSummary, Button, TextField } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { tokens } from "./theme";

// Composant Header
const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        fontWeight="bold"
        color={colors.redAccent[950]}
        mb="5px"
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

// Composant AccordionItem
const AccordionItem = ({ question, details, onRespond }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleResponse = () => {
    const response = prompt("Entrez votre réponse :");
    if (response) {
      const codeClient = localStorage.getItem('codeClient');
      if (codeClient) {
        onRespond(codeClient, response);
      } else {
        alert('Code client non trouvé dans le stockage local.');
      }
    }
  };

  return (
    <Accordion defaultExpanded sx={{ bgcolor: `${colors.primary[400]}` }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography color={colors.greenAccent[500]} variant="h5">
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{details}</Typography>
        <Button variant="contained" color="primary" onClick={handleResponse}>
          Répondre
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

// Composant FAQ
const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get('/api/demande/getAllDemande');
        setFaqs(response.data);

        // Stocker le codeClient du premier élément dans le localStorage pour l'exemple
        if (response.data.length > 0) {
          localStorage.setItem('codeClient', response.data[0].codeClient);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  useEffect(() => {
    // Filtrer les FAQs en fonction du terme de recherche
    setFilteredFaqs(
      faqs.filter(faq =>
        (faq.nom || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, faqs]);

  const handleRespond = async (codeClient, reponse) => {
    try {
      await axios.post(`/api/demande/repondreDemandeParEmail/${codeClient}`, { reponse });
      alert('Réponse envoyée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  // Transformez les données en format approprié pour AccordionItem
  const accordionData = filteredFaqs.map(faq => ({
    question: faq.nom || '', // Valeur par défaut pour éviter les erreurs
    details: faq.description || '', // Valeur par défaut pour éviter les erreurs
  }));

  return (
    <Box m="20px">
      <Header subtitle="Gestion des demandes" />
      <TextField
        label="Rechercher"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {accordionData.map((accordion, index) => (
        <AccordionItem key={index} {...accordion} onRespond={handleRespond} />
      ))}
    </Box>
  );
};

export default FAQ;
