module.exports = {
  friendlyName: 'Réinitialiser le mot de passe',
  description: 'Réinitialiser le mot de passe en utilisant un token valide.',

  inputs: {
    token: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Réinitialisation de mot de passe réussie.'
    },
    invalidToken: {
      description: 'Token invalide ou expiré.',
      statusCode: 400
    },
    passwordFormatInvalid: {
      statusCode: 400,
      description: 'Le format du mot de passe est invalide.'
    }
  },

  fn: async function ({ token, password }) {
    const bcrypt = require('bcryptjs');

    const carrier = await Carrier.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { '>': Date.now() }
    });

    if (!carrier) { throw { invalidToken: 'Token invalide ou expiré.' }; }

    try {
      await Carrier.updateOne({ id: carrier.id }).set({
        password: password,
        passwordResetToken: '',
        passwordResetTokenExpiresAt: 0
      });
    } catch (err) {
      if (err.message) {
        if (err.message.includes('validatePassword') || err.message.includes('Le mot de passe')) {
          let cleanMsg = '';

          if (err.message.includes("Additional data: '")) {
            const parts = err.message.split("Additional data: '");
            if (parts[1]) {
              cleanMsg = parts[1].split("'")[0];
            }
          }

          if (!cleanMsg && err.message.includes('Le mot de passe doit contenir')) {
            cleanMsg = 'Le mot de passe doit contenir au moins 8 caractères, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.';
          }

          if (cleanMsg) {
            throw { passwordFormatInvalid: cleanMsg };
          }
        }

        if (err.raw && err.raw.invalid) {
          throw { passwordFormatInvalid: err.raw.invalid };
        }
      }

      if (err.invalid) {
        throw { passwordFormatInvalid: err.invalid };
      }
      throw err;
    }

    // Notifier le transporteur
    await sails.helpers.sender.notification.with({
      recipientId: carrier.id,
      model: 'carrier',
      app: 'ci',
      title: 'Mot de passe réinitialisé',
      content: 'Votre mot de passe a été réinitialisé avec succès.',
      priority: 'normal',
      isForAdmin: false
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de réinitialisation de mot de passe :', err));

    return {
      message: 'Mot de passe réinitialisé avec succès'
    };
  }
};
