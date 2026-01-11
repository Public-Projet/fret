module.exports = {
    friendlyName: 'Connexion expéditeur',
    description: 'Se connecter en utilisant l\'email et le mot de passe fournis.',

    inputs: {
        email: {
            type: 'string',
            required: true,
            isEmail: true
        },
        password: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Connexion réussie.'
        },
        badCombo: {
            description: 'Email ou mot de passe invalide.',
            statusCode: 401
        }
    },

    fn: async function ({ email, password }) {
        const bcrypt = require('bcryptjs');

        // Trouver l'expéditeur par email
        const shipper = await Shipper.findOne({ email: email.toLowerCase() });

        if (!shipper) {
            throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
        }

        // Vérifier le mot de passe
        const passwordsMatch = await bcrypt.compare(password, shipper.password);

        if (!passwordsMatch) {
            throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
        }

        // Générer le JWT
        const token = await sails.helpers.generateJwt({
            id: shipper.id,
            email: shipper.email,
            role: 'shipper'
        });

        // Retourner le token et les données utilisateur
        return {
            token,
            user: {
                id: shipper.id,
                email: shipper.email,
                firstname: shipper.firstname,
                lastname: shipper.lastname,
                role: 'shipper',
                status: shipper.status
            }
        };
    }
};
