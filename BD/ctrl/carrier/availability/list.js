module.exports = {
  friendlyName: 'Lister les disponibilités',
  description: 'Lister les disponibilités du transporteur connecté.',

  exits: {
    success: {
      statusCode: 200,
      description: 'Liste récupérée.'
    }
  },

  fn: async function () {
    const availabilities = await Availability.find({ carrier: this.req.me.id })
      .populate('vehicle')
      .sort('createdAt DESC');

    return {
      availabilities
    };
  }
};
