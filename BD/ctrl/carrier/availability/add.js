module.exports = {
  friendlyName: 'Ajouter une disponibilité',
  description: 'Ajouter une nouvelle disponibilité pour un véhicule.',

  inputs: {
    vehicleId: {
      type: 'string',
      required: true
    },
    origin: {
      type: 'json',
      required: true
    },
    destination: {
      type: 'json'
    },
    startDate: {
      type: 'string',
      required: true
    },
    endDate: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number'
    },
    maxRequests: {
      type: 'number',
      description: 'Nombre maximum de demandes acceptées'
    }
  },

  exits: {
    success: {
      statusCode: 201,
      description: 'Disponibilité créée avec succès.'
    },
    invalidDates: {
      statusCode: 400,
      description: 'La date de début doit être avant la date de fin.',
      responseType: 'json'
    },
    invalidVehicle: {
      statusCode: 400,
      description: 'Véhicule invalide ou n\'appartient pas au transporteur.',
      responseType: 'json'
    }
  },

  fn: async function (inputs) {
    // Validate dates: Start < End
    if (new Date(inputs.startDate) >= new Date(inputs.endDate)) {
      throw 'invalidDates';
    }

    // Validate Future Dates
    const now = new Date();
    if (new Date(inputs.startDate) < now || new Date(inputs.endDate) < now) {
      // We can throw invalidDates or a new exit. 
      // For now let's reuse invalidDates or let model throw.
      // Let's rely on model for specific "past date" error message? 
      // Or throw existing 'invalidDates' for simplicity in controller, 
      // but model gives better message. 
      // Let's catch model error?
      // Actually user logic said "client and server validation". 
      // Let's add explicit check.
      throw new Error('Les dates ne peuvent pas être dans le passé.');
    }

    // Verify vehicle ownership
    const vehicle = await Vehicle.findOne({ id: inputs.vehicleId });
    if (!vehicle || vehicle.carrier !== this.req.me.id) {
      throw 'invalidVehicle';
    }

    // Remove status if it was there (it wasn't in inputs, but ensure we don't pass it)
    const availability = await Availability.create({
      carrier: this.req.me.id,
      vehicle: inputs.vehicleId,
      origin: inputs.origin,
      destination: inputs.destination,
      startDate: inputs.startDate,
      endDate: inputs.endDate,
      price: inputs.price,
      maxRequests: inputs.maxRequests
      // Status is auto-calculated by model defaults logic
    }).fetch();

    return {
      message: 'Disponibilité ajoutée avec succès.',
      availability
    };
  }
};
