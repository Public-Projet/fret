module.exports = {
  friendlyName: 'Récupérer une disponibilité',
  description: 'Récupérer les détails d\'une disponibilité spécifique.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Disponibilité récupérée.'
    },
    notFound: {
      statusCode: 404,
      description: 'Disponibilité non trouvée.',
      responseType: 'json'
    },
    forbidden: {
      statusCode: 403,
      description: 'Accès non autorisé.',
      responseType: 'json'
    }
  },

  fn: async function ({ id }) {
    const availability = await Availability.findOne({ id })
      .populate('vehicle');

    if (!availability) {
      throw 'notFound';
    }

    if (availability.carrier !== this.req.me.id) {
      throw 'forbidden';
    }

    return {
      availability
    };
  }
};
