module.exports = {
  friendlyName: 'Obtenir le profil',
  description: 'Obtenir le profil de l\'expéditeur connecté.',

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
    const shipper = await Shipper.findOne({ id: this.req.me.id });

    if (!shipper) {
      throw {
        notFound: {
          message: 'Le profil de l\'expéditeur est introuvable.'
        }
      };
    }

    return {
      message: 'Profil récupéré avec succès.',
      user: {
        id: shipper.id,
        email: shipper.email,
        firstname: shipper.firstname,
        lastname: shipper.lastname,
        role: shipper.role,
        photoUrl: shipper.photoUrl,
        status: shipper.status,
        username: shipper.username,
        phone: shipper.phone,
        bio: shipper.bio
      }
    };
  }
};
