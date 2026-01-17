module.exports = {
  friendlyName: 'Lister les véhicules',
  description: 'Lister les véhicules du transporteur connecté.',

  exits: {
    success: {
      statusCode: 200,
      description: 'Liste des véhicules récupérée avec succès.'
    }
  },

  fn: async function () {
    const vehicles = await Vehicle.find({ carrier: this.req.me.id });

    return {
      vehicles
    };
  }
};
