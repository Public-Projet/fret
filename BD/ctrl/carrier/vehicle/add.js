module.exports = {
  friendlyName: 'Ajouter un véhicule',
  description: 'Ajouter un nouveau véhicule pour le transporteur connecté.',

  inputs: {
    type: {
      type: 'string',
      required: true,
      isIn: ['truck', 'van', 'pickup', 'semi', 'other']
    },
    licensePlate: {
      type: 'string',
      required: true
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
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Véhicule ajouté avec succès.'
    },
    licensePlateAlreadyInUse: {
      statusCode: 409,
      description: 'Cette immatriculation existe déjà.',
      responseType: 'json'
    }
  },

  fn: async function (inputs) {
    try {
      const vehicle = await Vehicle.create({
        ...inputs,
        carrier: this.req.me.id
      }).fetch();

      return {
        message: 'Véhicule ajouté avec succès.',
        vehicle
      };
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        throw 'licensePlateAlreadyInUse';
      }
      throw err;
    }
  }
};
