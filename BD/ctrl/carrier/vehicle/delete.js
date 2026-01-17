module.exports = {
  friendlyName: 'Supprimer un véhicule',
  description: 'Supprimer un véhicule.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Véhicule supprimé avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Véhicule non trouvé.',
      responseType: 'json'
    },
    forbidden: {
      statusCode: 403,
      description: 'Vous n\'êtes pas autorisé à supprimer ce véhicule.',
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

    await Vehicle.destroyOne({ id });

    return {
      message: 'Véhicule supprimé avec succès.'
    };
  }
};
