module.exports = {
    friendlyName: 'Réinitialiser le mot de passe expéditeur',
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
            statusCode: 400,
            description: 'Token invalide.',
            responseType: 'json'
        },
        expiredToken: {
            statusCode: 410,
            description: 'Le lien de réinitialisation a expiré.',
            responseType: 'json'
        },
        passwordFormatInvalid: {
            statusCode: 400,
            description: 'Le format du mot de passe est invalide.',
            responseType: 'json'
        }
    },

    fn: async function ({ token, password }) {
        // Chercher l'expéditeur avec ce token (sans vérifier l'expiration)
        const shipperWithToken = await Shipper.findOne({ passwordResetToken: token });

        if (!shipperWithToken) {
            throw {
                invalidToken: {
                    message: 'Le lien de réinitialisation est invalide. Veuillez faire une nouvelle demande.'
                }
            };
        }

        // Vérifier si le token est expiré
        if (shipperWithToken.passwordResetTokenExpiresAt <= Date.now()) {
            throw {
                expiredToken: {
                    message: 'Le lien de réinitialisation a expiré. Veuillez faire une nouvelle demande.'
                }
            };
        }

        try {
            await Shipper.updateOne({ id: shipperWithToken.id }).set({
                password: password,
                passwordResetToken: '',
                passwordResetTokenExpiresAt: 0
            });
        } catch (err) {
            if (err.message) {
                if (err.message.includes('validatePassword') || err.message.includes('Le mot de passe')) {
                    let cleanMsg = 'Le mot de passe doit contenir au moins 8 caractères, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.';

                    if (err.message.includes("Additional data: '")) {
                        const parts = err.message.split("Additional data: '");
                        if (parts[1]) {
                            cleanMsg = parts[1].split("'")[0];
                        }
                    }

                    throw { passwordFormatInvalid: { message: cleanMsg } };
                }

                if (err.raw && err.raw.invalid) {
                    throw { passwordFormatInvalid: { message: err.raw.invalid } };
                }
            }

            if (err.invalid) {
                throw { passwordFormatInvalid: { message: err.invalid } };
            }
            throw err;
        }

        // Notifier l'expéditeur
        await sails.helpers.sender.notification.with({
            recipientId: shipperWithToken.id,
            model: 'shipper',
            app: 'bf',
            title: 'Mot de passe réinitialisé',
            content: 'Votre mot de passe a été réinitialisé avec succès.',
            priority: 'normal',
            isForAdmin: false
        }).catch(err => sails.log.error('Erreur notification reset password:', err));

        return {
            message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
        };
    }
};
