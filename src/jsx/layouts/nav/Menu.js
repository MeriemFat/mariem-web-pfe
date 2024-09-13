export const MenuList = [

    //Simple User
    {
        title: 'Home',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-dashboard-1"></i>,
        roles:[10,20,30],
        content: [
            {
                title: 'Role Request',
                to: 'request-Role',

            },
            {
                title: 'Profile',
                to: 'profile',

            },
           

        ],
    },

    //Colaborateur
    {
        title: 'Agent',
        roles:[20],
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-speedometer-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Contrats',
                to: 'Contrats',
            },
            {
                title: 'Sinistre ',
                to: 'Sinistre',
            },
            {
                title: 'Quittance',
                to: 'Quittance',
            },

            {
                title:'catalogue',
                hasMenu : true,
                content : [
                    {
                        title: 'catalogue',
                        to : 'catalogue',
                    },

                ],
            },


            {
                title: 'Gestion des demande',
                to: 'Gestion_Des_Demande',
            },
           


        ],
    },



    //CentreTechnique
    {
        title: 'CentreTechnique',
        classsChange: 'mm-collapse',
        roles:[30],
        iconStyle: <i className="flaticon-admin"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Gestion_Utilisateures',
                to: 'Gestion_Utilisateures'
            },
            {
                title: 'Role Request',
                to: 'role-request'
            },
            {
                title: 'Gestion_des_Contrats',
                to: 'Gestion_des_Contrats',
            },
          
            {
                title: 'Gestion_des_Sinistres',
                to: 'Gestion_des_Sinistres',
            },
            {
                title: 'Gestion_des_Quittances',
                to: 'Gestion_des_Quittances',
            },
            {
                title: 'Gestion des Demandes',
                to: 'Gestion_des_Demandes'
            },

        ],
    },




]


export const LINKS = [

    {
        title: 'Home',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-home-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Role Request',
                to: 'request-Role',

            },
            {
                title: 'Profile',
                to: 'profile',

            },
          
        ],

    },
    {



        title: 'Agent',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-speedometer-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Contrats',
                to: 'Contrats',
            },
            {
                title: ' Sinistre',
                to: 'Sinistre',
            },
            {
                title: 'Quittance',
                to: 'Quittance',
            },

            {
                title:'catalogue',
                hasMenu : true,
                content : [
                    {
                        title: 'Payment With Stripe',
                        to : 'payment-stripe',
                    },
                    {
                        title: 'Payment With Flouci',
                        to : 'payment-flouci',
                    },
                    {
                        title:'Payment With Pluxe',
                        to : 'payment-pluxee',
                    },
                    {
                        title: 'catalogue',
                        to : 'catalogue',
                    },

                ],
            },


            {
                title: 'Gestion des demande',
                to: 'Gestion_Des_Demande',
            },
           
          


        ],
    },

    {
        title: 'CentreTechnique',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-admin"></i>,
        content: [
            {
                title: 'Gestion_Utilisateures',
                to: 'Gestion_Utilisateures'
            },
            {
                title: 'Role Request',
                to: 'role-request'
            },
            {
                title: 'Gestion_des_Contrats',
                to: 'Gestion_des_Contrats',
            },
          
            {
                title: 'Gestion_des_Sinistres',
                to: 'Gestion_des_Sinistres',
            },
            {
                title: 'Gestion_des_Quittances',
                to: 'Gestion_des_Quittances',
            },
            {
                title: 'Gestion des Demandes',
                to: 'Gestion_des_Demandes'
            },

        ],
    },

]

export const USER_LINKS = [
    {
        title: 'Home',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-home-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Role Request',
                to: 'request-Role',

            },
            {
                title: 'Profile',
                to: 'profile',

            },
          

        ],

    },

]
export const ADMIN_LINKS = [
    {
        title: 'Home',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-home-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Role Request',
                to: 'request-Role',

            },
            {
                title: 'Profile',
                to: 'profile',

            },
           

        ],

    },
    {
        title: 'Agent',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-speedometer-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Contrats',
                to: 'Contrats',
            },
            {
                title: 'Sinistre ',
                to: 'promotion',
            },
            {
                title: 'Quittance',
                to: 'Quittance',
            },

            {
                title:'catalogue',
                hasMenu : true,
                content : [
                    {
                        title: 'Payment With Stripe',
                        to : 'payment-stripe',
                    },
                    {
                        title: 'Payment With Flouci',
                        to : 'payment-flouci',
                    },
                    {
                        title:'Payment With Pluxe',
                        to : 'payment-pluxee',
                    },
                    {
                        title: 'catalogue',
                        to : 'catalogue',
                    },

                ],
            },


            {
                title: 'Gestion des demande',
                to: 'Gestion_Des_Demande',
            },
           


        ],
    },
    
    {
        title: 'CentreTechnique',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-admin"></i>,
        content: [
            {
                title: 'Gestion_Utilisateures',
                to: 'Gestion_Utilisateures'
            },
            {
                title: 'Role Request',
                to: 'role-request'
            },
            {
                title: 'Gestion_des_Contrats',
                to: 'Gestion_des_Contrats',
            },
          
            {
                title: 'Gestion_des_Sinistres',
                to: 'Gestion_des_Sinistres',
            },
            {
                title: 'Gestion_des_Quittances',
                to: 'Gestion_des_Quittances',
            },
            {
                title: 'Gestion des Demandes',
                to: 'Gestion_des_Demandes'
            },

        ],
    },


]

export const FOURNISSEUR_LINKS = [
    {
        title: 'Home',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-home-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Role Request',
                to: 'request-Role',

            },
          

        ],

    },

]
export const AGENT_LINKS = [
    {
        title: 'Home',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-home-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Role Request',
                to: 'request-Role',

            },
            {
                title: 'Profile',
                to: 'profile',

            },
          

        ],

    },
    {
        title: 'Agent',
        classsChange: 'mm-collapse',
        iconStyle: <i className="flaticon-speedometer-1"></i>,
        content: [
            {
                title: 'Home',
                to: 'home',
            },
            {
                title: 'Contrats',
                to: 'Contrats',
            },
            {
                title: 'Sinistre ',
                to: 'promotion',
            },
            {
                title: 'Quittance',
                to: 'Quittance',
            },
            {
                title:'catalogue',
                hasMenu : true,
                content : [
                    {
                        title: 'Payment With Stripe',
                        to : 'payment-stripe',
                    },
                    {
                        title: 'Payment With Flouci',
                        to : 'payment-flouci',
                    },
                    {
                        title:'Payment With Pluxe',
                        to : 'payment-pluxee',
                    },
                    {
                        title: 'catalogue',
                        to : 'catalogue',
                    },

                ],
            },
            {
                title: 'Gestion des demande',
                to: 'Gestion_Des_Demande',
            },
        


        ],
    },
]


export default {LINKS , ADMIN_LINKS ,AGENT_LINKS, USER_LINKS,FOURNISSEUR_LINKS}
