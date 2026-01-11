module.exports = {
  friendlyName: 'Vérifier l\'email transporteur',
  description: 'Vérifier l\'adresse email en utilisant un token.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Email vérifié avec succès.'
    },
    invalidToken: {
      statusCode: 400,
      description: 'Token invalide ou expiré.',
      responseType: 'json'
    },
    expiredToken: {
      statusCode: 410,
      description: 'Le lien de vérification a expiré.',
      responseType: 'json'
    }
  },

  fn: async function ({ token }) {
    // Chercher le transporteur avec ce token (sans vérifier l'expiration)
    const carrierWithToken = await Carrier.findOne({ emailProofToken: token });

    if (!carrierWithToken) {
      throw {
        invalidToken: {
          message: 'Le lien de vérification est invalide. Veuillez vous réinscrire.'
        }
      };
    }

    // Vérifier si le token est expiré
    if (carrierWithToken.emailProofTokenExpiresAt <= Date.now()) {
      throw {
        expiredToken: {
          message: 'Le lien de vérification a expiré. Veuillez demander un nouveau lien.'
        }
      };
    }

    await Carrier.updateOne({ id: carrierWithToken.id }).set({
      status: 'active',
      emailProofToken: '',
      emailProofTokenExpiresAt: 0
    });

    return {
      message: 'Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.'
    };
  }
};
