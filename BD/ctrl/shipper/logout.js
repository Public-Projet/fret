module.exports = {
    friendlyName: 'Déconnexion expéditeur',
    description: 'Se déconnecter en tant qu\'expéditeur.',

    exits: {
        success: {
            description: 'Déconnexion réussie.'
        }
    },

    fn: async function () {
        return { message: 'Déconnexion réussie.' };
    }
};
