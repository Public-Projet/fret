module.exports = {
  friendlyName: 'Récupérer un véhicule',
  description: 'Récupérer les détails d\'un véhicule spécifique.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Véhicule récupéré avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Véhicule non trouvé.',
      responseType: 'json'
    },
    forbidden: {
      statusCode: 403,
      description: 'Accès non autorisé à ce véhicule.',
      responseType: 'json'
    }
  },

  fn: async function ({ id }) {
    const vehicle = await Vehicle.findOne({ id });

    if (!vehicle) {
      throw 'notFound';
    }

    if (vehicle.carrier !== this.req.me.id) {
      throw 'forbidden';
    }

    return {
      vehicle
    };
  }
};
