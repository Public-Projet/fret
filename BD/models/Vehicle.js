module.exports = {
  attributes: {
    type: {
      type: 'string',
      isIn: ['truck', 'van', 'pickup', 'semi', 'other'],
      required: true,
      description: 'Le type de véhicule.'
    },
    licensePlate: {
      type: 'string',
      required: true,
      unique: true,
      description: 'L\'immatriculation du véhicule.'
    },
    brand: {
      type: 'string',
      description: 'La marque du véhicule.'
    },
    model: {
      type: 'string',
      description: 'Le modèle du véhicule.'
    },
    capacity: {
      type: 'number',
      description: 'La capacité en tonnes.'
    },
    volume: {
      type: 'number',
      description: 'Le volume en m3.'
    },
    status: {
      type: 'string',
      isIn: ['available', 'in_transit', 'maintenance'],
      defaultsTo: 'available',
      description: 'Le statut du véhicule.'
    },
    carrier: {
      model: 'carrier',
      required: true,
      description: 'Le transporteur propriétaire du véhicule.'
    }
  }
};
