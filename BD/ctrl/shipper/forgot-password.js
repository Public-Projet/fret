module.exports = {
    friendlyName: 'Mot de passe oublié expéditeur',
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
        const shipper = await Shipper.findOne({ email: email.toLowerCase() });

        if (!shipper) {
            return;
        }

        const passwordResetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 heure

        await Shipper.updateOne({ id: shipper.id }).set({
            passwordResetToken,
            passwordResetTokenExpiresAt
        });

        try {
            const appUrls = sails.config.custom.appUrl;

            await sails.helpers.sender.email.with({
                layout: 'default-layout',
                template: 'shipper/forgot-password',
                to: email,
                subject: 'Réinitialisation de mot de passe - Bourse de Fret',
                appSlug: 'bf',
                templateData: {
                    firstName: shipper.firstname,
                    resetLink: `${appUrls}/auth/reset-password-shipper?token=${passwordResetToken}`,
                    expirationDelay: '1 heure'
                }
            });
        } catch (error) {
            sails.log.error('Échec de l\'envoi de l\'email de réinitialisation de mot de passe :', error);
        }

        return;
    }
};
