module.exports = {
  friendlyName: 'Mettre à jour un véhicule',
  description: 'Mettre à jour un véhicule existant.',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      isIn: ['truck', 'van', 'pickup', 'semi', 'other']
    },
    brand: {
      type: 'string'
    },
    model: {
      type: 'string'
    },
    capacity: {
      type: 'number'
    },
    volume: {
      type: 'number'
    },
    status: {
      type: 'string',
      isIn: ['available', 'in_transit', 'maintenance']
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Véhicule mis à jour avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Véhicule non trouvé.',
      responseType: 'json'
    },
    forbidden: {
      statusCode: 403,
      description: 'Vous n\'êtes pas autorisé à modifier ce véhicule.',
      responseType: 'json'
    }
  },

  fn: async function (inputs) {
    const vehicle = await Vehicle.findOne({ id: inputs.id });

    if (!vehicle) {
      throw 'notFound';
    }

    if (vehicle.carrier !== this.req.me.id) {
      throw 'forbidden';
    }

    const updatedVehicle = await Vehicle.updateOne({ id: inputs.id })
      .set(_.omit(inputs, ['id']));

    return {
      message: 'Véhicule mis à jour avec succès.',
      vehicle: updatedVehicle
    };
  }
};
