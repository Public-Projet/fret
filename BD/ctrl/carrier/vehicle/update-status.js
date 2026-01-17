module.exports = {
  friendlyName: 'Mettre à jour le statut du véhicule',
  description: 'Mettre à jour le statut d\'un véhicule (disponible, en transit, maintenance).',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      required: true,
      isIn: ['available', 'in_transit', 'maintenance']
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Statut mis à jour avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Véhicule non trouvé.',
      responseType: 'json'
    },
    forbidden: {
      statusCode: 403,
      description: 'Accès non autorisé.',
      responseType: 'json'
    }
  },

  fn: async function ({ id, status }) {
    const vehicle = await Vehicle.findOne({ id });

    if (!vehicle) {
      throw 'notFound';
    }

    if (vehicle.carrier !== this.req.me.id) {
      throw 'forbidden';
    }

    const updatedVehicle = await Vehicle.updateOne({ id })
      .set({ status });

    return {
      message: 'Statut mis à jour.',
      vehicle: updatedVehicle
    };
  }
};
