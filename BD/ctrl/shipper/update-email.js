module.exports = {
  friendlyName: 'Mettre à jour l\'email',
  description: 'Mettre à jour l\'email de l\'expéditeur connecté.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      description: 'La nouvelle adresse email.'
    },
    password: {
      type: 'string',
      required: true,
      description: 'Le mot de passe actuel pour confirmer la modification.'
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Email mis à jour avec succès.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'L\'adresse email fournie est déjà utilisée.',
      responseType: 'json'
    },
    badCombo: {
      statusCode: 403,
      description: 'Mot de passe incorrect.',
      responseType: 'json'
    }
  },

  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');
    const shipper = await Shipper.findOne({ id: this.req.me.id });

    if (!shipper) {
      throw {
        badCombo: {
          message: 'Utilisateur introuvable.'
        }
      };
    }

    const passwordsMatch = await bcrypt.compare(password, shipper.password);
    if (!passwordsMatch) {
      throw {
        badCombo: {
          message: 'Le mot de passe saisi est incorrect.'
        }
      };
    }

    try {
      const updatedShipper = await Shipper.updateOne({ id: this.req.me.id })
        .set({
          email: email.toLowerCase()
        });

      // Notifier l'expéditeur
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'shipper',
        app: 'bf',
        title: 'Email mis à jour',
        content: `Votre adresse email a été mise à jour avec succès vers ${email.toLowerCase()}.`,
        priority: 'normal',
        isForShipper: true
      }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour d\'email :', err));

      return {
        message: 'Votre adresse email a été mise à jour avec succès.',
        user: {
          id: updatedShipper.id,
          email: updatedShipper.email,
          lastname: updatedShipper.lastname,
          firstname: updatedShipper.firstname,
          role: updatedShipper.role,
          status: updatedShipper.status,
          photoUrl: updatedShipper.photoUrl
        }
      };

    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        throw {
          emailAlreadyInUse: {
            message: 'Cette adresse email est déjà utilisée par un autre compte.'
          }
        };
      }
      throw err;
    }
  }
};
