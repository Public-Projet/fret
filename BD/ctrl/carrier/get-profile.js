module.exports = {
  friendlyName: 'Obtenir le profil',
  description: 'Obtenir le profil du transporteur connecté.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200,
      description: 'Profil récupéré avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Profil non trouvé.',
      responseType: 'json'
    }
  },

  fn: async function () {
    const carrier = await Carrier.findOne({ id: this.req.me.id });

    if (!carrier) {
      throw {
        notFound: {
          message: 'Le profil du transporteur est introuvable.'
        }
      };
    }

    return {
      message: 'Profil récupéré avec succès.',
      user: {
        id: carrier.id,
        email: carrier.email,
        firstname: carrier.firstname,
        lastname: carrier.lastname,
        role: carrier.role,
        photoUrl: carrier.photoUrl,
        status: carrier.status,
        username: carrier.username,
        phone: carrier.phone,
        bio: carrier.bio
      }
    };
  }
};
