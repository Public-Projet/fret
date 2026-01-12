module.exports = {
  friendlyName: 'Mettre à jour le profil',
  description: 'Mettre à jour le profil du transporteur connecté.',

  inputs: {
    lastname: {
      type: 'string',
      description: 'Le nom de famille.'
    },
    firstname: {
      type: 'string',
      description: 'Le prénom.'
    },
    phone: {
      type: 'string',
      description: 'Le numéro de téléphone.'
    },
    photoUrl: {
      type: 'string',
      description: 'L\'URL de la photo de profil.'
    },
    bio: {
      type: 'string',
      description: 'La biographie ou description.'
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Profil mis à jour avec succès.'
    },
    invalidPhoneFormat: {
      statusCode: 400,
      description: 'Le format du numéro de téléphone est invalide.',
      responseType: 'json'
    }
  },

  fn: async function ({ lastname, firstname, phone, photoUrl, bio }) {
    try {
      const updatedCarrier = await Carrier.updateOne({ id: this.req.me.id })
        .set({
          lastname: lastname || undefined,
          firstname: firstname || undefined,
          phone: phone || undefined,
          photoUrl: (photoUrl === '' || photoUrl === null) ? '' : photoUrl,
          bio: bio || undefined
        });

      // Notifier le transporteur
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'carrier',
        app: 'bf',
        title: 'Profil mis à jour',
        content: 'Vos informations de profil ont été mises à jour avec succès.',
        priority: 'low',
        isForAdmin: false
      }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour du profil :', err));

      return {
        message: 'Votre profil a été mis à jour avec succès.',
        user: {
          id: updatedCarrier.id,
          email: updatedCarrier.email,
          firstname: updatedCarrier.firstname,
          lastname: updatedCarrier.lastname,
          phone: updatedCarrier.phone,
          photoUrl: updatedCarrier.photoUrl,
          bio: updatedCarrier.bio,
          role: updatedCarrier.role,
          status: updatedCarrier.status
        }
      };
    } catch (err) {
      if (err.message && (err.message.includes('invalidFormat') || err.message.includes('phone'))) {
        throw {
          invalidPhoneFormat: {
            message: 'Le format du numéro de téléphone est invalide.'
          }
        };
      }
      throw err;
    }
  }
};
