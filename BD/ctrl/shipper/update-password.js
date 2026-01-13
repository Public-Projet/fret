module.exports = {
  friendlyName: 'Mettre à jour le mot de passe',
  description: 'Mettre à jour le mot de passe de l\'expéditeur connecté.',

  inputs: {
    currentPassword: {
      type: 'string',
      required: true,
      description: 'Le mot de passe actuel.'
    },
    newPassword: {
      type: 'string',
      required: true,
      description: 'Le nouveau mot de passe.'
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Mot de passe mis à jour avec succès.'
    },
    badCombo: {
      statusCode: 403,
      description: 'Mot de passe actuel incorrect.',
      responseType: 'json'
    },
    passwordFormatInvalid: {
      statusCode: 400,
      description: 'Le format du mot de passe est invalide.',
      responseType: 'json'
    }
  },

  fn: async function ({ currentPassword, newPassword }) {
    const bcrypt = require('bcryptjs');
    const shipper = await Shipper.findOne({ id: this.req.me.id });

    if (!shipper) {
      throw {
        badCombo: {
          message: 'Utilisateur introuvable.'
        }
      };
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, shipper.password);
    if (!passwordsMatch) {
      throw {
        badCombo: {
          message: 'Le mot de passe actuel est incorrect.'
        }
      };
    }

    try {
      await Shipper.updateOne({ id: this.req.me.id }).set({ password: newPassword });
    } catch (err) {
      if (err.message) {
        if (err.message.includes('Le mot de passe doit contenir') || (err.invalid && err.invalid.includes('Le mot de passe'))) {
          const msg = err.invalid || err.message;
          throw {
            passwordFormatInvalid: {
              message: msg.includes('Error: ') ? msg.split('Error: ')[1] : msg
            }
          };
        }
        if (err.raw && err.raw.invalid) {
          throw {
            passwordFormatInvalid: {
              message: err.raw.invalid
            }
          };
        }
      }

      if (err.invalid) {
        throw {
          passwordFormatInvalid: {
            message: err.invalid
          }
        };
      }
      throw err;
    }

    // Notifier l'expéditeur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'shipper',
      app: 'bf',
      title: 'Mot de passe modifié',
      content: 'Votre mot de passe a été modifié avec succès.',
      priority: 'normal',
      isForAdmin: false
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour du mot de passe :', err));

    return {
      message: 'Votre mot de passe a été mis à jour avec succès.'
    };
  }
};
