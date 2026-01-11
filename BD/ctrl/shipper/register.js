module.exports = {
    friendlyName: 'Inscription expéditeur',
    description: 'Inscrire un nouvel expéditeur.',

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
        firstname: {
            type: 'string',
            required: true
        },
        lastname: {
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {
            description: 'Inscription réussie. Email de vérification envoyé.'
        },
        emailAlreadyInUse: {
            statusCode: 409,
            description: 'L\'email fourni est déjà utilisé.'
        },
        invalidPhoneFormat: {
            statusCode: 400,
            description: 'Le format du numéro de téléphone est invalide.'
        },
        passwordFormatInvalid: {
            statusCode: 400,
            description: 'Le format du mot de passe est invalide.'
        }
    },

    fn: async function ({ email, password, firstname, lastname }) {
        const crypto = require('crypto');

        const emailProofToken = crypto.randomBytes(32).toString('hex');
        const emailProofTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

        try {
            const newShipper = await Shipper.create({
                email: email.toLowerCase(),
                password: password,
                firstname,
                lastname,
                username: `${firstname.toLowerCase()}_${lastname.toLowerCase()}`,
                status: 'pending',
                emailProofToken,
                emailProofTokenExpiresAt
            }).fetch();
        } catch (err) {
            if (err.code === 'E_UNIQUE') {
                throw 'emailAlreadyInUse';
            }
            if (err.message) {
                if (err.message.includes('invalidFormat') || err.message.includes('The phone number format is invalid')) {
                    throw { invalidPhoneFormat: 'Le format du numéro de téléphone est invalide.' };
                }

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

        try {
            const appUrls = sails.config.custom.appUrl;

            await sails.helpers.sender.email.with({
                layout: 'default-layout',
                template: 'shipper/verify-email',
                to: email,
                subject: 'Vérifiez votre adresse email - Bourse de Fret',
                appSlug: 'bf',
                templateData: {
                    firstName: firstname,
                    verificationLink: `${appUrls}/auth/verify-email?token=${emailProofToken}`,
                    expirationDelay: '24 heures'
                }
            });
        } catch (error) {
            sails.log.error('Échec de l\'envoi de l\'email de vérification au nouvel expéditeur :', error);
        }

        return {
            message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.'
        };
    }
};
