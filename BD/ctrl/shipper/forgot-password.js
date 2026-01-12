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

        // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        if (!shipper) {
            return {
                message: 'Si cette adresse email est associée à un compte, vous recevrez un lien de réinitialisation.'
            };
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
                    role: 'Expéditeur',
                    resetLink: `${appUrls}/auth/reset-password-shipper?token=${passwordResetToken}`,
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
