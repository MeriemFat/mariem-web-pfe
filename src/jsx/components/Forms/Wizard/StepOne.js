import React from "react";

const StepOne = () => {
   return (
      <section>
         <div className="row">
             <ul>
                 <li>
                     <b>*** Rôle Client *** </b> Ce rôle représente un client, souvent un utilisateur final ou un partenaire qui utilise les services ou les produits de l'organisation. Un client a accès aux fonctionnalités nécessaires pour interagir avec les services, faire des demandes, et consulter des informations personnelles. 
                     Exemple d'accès: Peut consulter et gérer ses informations personnelles, soumettre des demandes ou des requêtes, et suivre l'état de ses demandes.
                 </li>
                 <br></br>
                 <li>
                     <b>*** Rôle Agent ***</b> Ce rôle représente un agent, souvent un employé ou un représentant de l'organisation chargé de traiter les demandes des clients et de fournir un support. Un agent a accès à des fonctionnalités permettant de gérer et de répondre aux demandes des clients.
                     Exemple d'accès: Peut accéder aux demandes des clients, répondre à leurs requêtes, et gérer les tickets de support.
                 </li>
                 <br></br>

                 <li>
                     <b>*** Rôle Centre Technique *** </b> Ce rôle représente le personnel du centre technique, souvent des spécialistes ou des techniciens responsables de la maintenance, du support technique et de la résolution des problèmes complexes. Un centre technique a un accès approfondi aux systèmes et aux données pour résoudre les problèmes techniques et assurer le bon fonctionnement des services.
                     Exemple d'accès: Peut accéder à des outils de diagnostic, gérer les incidents techniques, et mettre en œuvre des solutions pour les problèmes complexes.
                 </li>

             </ul>
         </div>
      </section>
   );
};

export default StepOne;
