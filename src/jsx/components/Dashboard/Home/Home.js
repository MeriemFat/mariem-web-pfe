import React from 'react';
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PersonAdd, Book, AddBoxSharp, Traffic, Info } from "@mui/icons-material";
import { tokens } from "./theme";
import StatBox from "./StatBox"; // Assurez-vous que le chemin est correct

function Home() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box m="30px">
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(6, 10fr)"
            : isMdDevices
            ? "repeat(6, 10fr)"
            : "repeat(6, 10fr)"
        }
        gridAutoRows="115px"
        gap="50px"
      >
        {/* Statistic Items */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/Gestion_Utilisateures')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestion des Utilisateures"
            subtitle="12"
            icon={
              <PersonAdd
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/Gestion_des_Contrats')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestion des Contrats"
            subtitle="45"
            icon={
              <Book
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/Gestion_des_Sinistres')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestion des Sinistres"
            subtitle="15"
            icon={
              <AddBoxSharp
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/Quittance')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestions des Quittances"
            subtitle="25"
            icon={
              <Traffic
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/Gestion_des_Demandes')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestions des Demandes"
            subtitle="56"
            icon={
              <Traffic
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/catalogue')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestions des Catalogues"
            subtitle="7"
            icon={
              <Traffic
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/app/contacts')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestions des Parrinages"
            subtitle="7"
            icon={
              <Traffic
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.redAccent[500]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => handleNavigation('/app/contacts')}
          sx={{ cursor: 'pointer' }} // Ajout du curseur pointer pour indiquer la clicabilité
        >
          <StatBox
            title="Gestions des contacts"
            subtitle="7"
            icon={
              <Info
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
