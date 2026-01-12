module.exports = {
  friendlyName: 'Mot de passe oublié transporteur',
  description: 'Initier le processus de réinitialisation de mot de passe.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },
  exits: {
    success: {
      description: 'Si l\'email existe, un lien de réinitialisation est envoyé.'
    }
  },

  fn: async function ({ email }) {
    const crypto = require('crypto');
    const carrier = await Carrier.findOne({ email: email.toLowerCase() });

    if (!carrier) {
      return {
        message: 'Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation.'
      };
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 heure

    await Carrier.updateOne({ id: carrier.id }).set({
      passwordResetToken,
      passwordResetTokenExpiresAt
    });

    try {
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'carrier/forgot-password',
        to: email,
        subject: 'Réinitialisation de mot de passe - Bourse de Fret',
        appSlug: 'bf',
        templateData: {
          firstName: carrier.firstname,
          role: 'Transporteur',
          resetLink: `${appUrls}/auth/reset-password-carrier?token=${passwordResetToken}`,
          expirationDelay: '1 heure'
        }
      });
    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email de réinitialisation de mot de passe :', error);
    }

    return {
      message: 'Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation.'
    };
  }
};
