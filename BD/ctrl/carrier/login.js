module.exports = {
  friendlyName: 'Connexion transporteur',
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
    },
    rememberMe: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Si true, la session sera prolongée à 30 jours au lieu de 1 jour.'
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

  fn: async function ({ email, password, rememberMe }) {
    const bcrypt = require('bcryptjs');

    // Trouver le transporteur par email
    const carrier = await Carrier.findOne({ email: email.toLowerCase() });

    if (!carrier) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Vérifier le mot de passe
    const passwordsMatch = await bcrypt.compare(password, carrier.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Déterminer la durée du token selon l'option "Se souvenir de moi"
    const tokenExpiration = rememberMe ? '30d' : '3d';

    // Générer le JWT
    const token = await sails.helpers.generateJwt.with({
      payload: {
        id: carrier.id,
        email: carrier.email,
        role: 'carrier'
      },
      expiresIn: tokenExpiration
    });

    // Retourner le token et les données utilisateur
    return {
      token,
      user: {
        id: carrier.id,
        email: carrier.email,
        firstname: carrier.firstname,
        lastname: carrier.lastname,
        role: 'carrier',
        status: carrier.status
      },
      expiresIn: tokenExpiration
    };
  }
};
