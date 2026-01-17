module.exports = {
  friendlyName: 'Mettre à jour une disponibilité',
  description: 'Mettre à jour les détails d\'une disponibilité existante.',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    vehicleId: {
      type: 'string'
    },
    origin: {
      type: 'json'
    },
    destination: {
      type: 'json'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    maxRequests: {
      type: 'number',
      allowNull: true
    },
    status: {
      type: 'string',
      isIn: ['active', 'expired', 'full']
    }
  },

  exits: {
    success: {
      statusCode: 200,
      description: 'Disponibilité mise à jour avec succès.'
    },
    invalidDates: {
      statusCode: 400,
      description: 'La date de début doit être avant la date de fin.',
      responseType: 'json'
    },
    notFound: {
      statusCode: 404,
      description: 'Disponibilité non trouvée.',
      responseType: 'json'
    },
    forbidden: {
      statusCode: 403,
      description: 'Accès non autorisé ou véhicule invalide.',
      responseType: 'json'
    }
  },

  fn: async function (inputs) {
    const availability = await Availability.findOne({ id: inputs.id });

    if (!availability) {
      throw 'notFound';
    }

    if (availability.carrier !== this.req.me.id) {
      throw 'forbidden';
    }

    // Determine effective dates to validate
    const effectiveStartDate = inputs.startDate ? new Date(inputs.startDate) : new Date(availability.startDate);
    const effectiveEndDate = inputs.endDate ? new Date(inputs.endDate) : new Date(availability.endDate);
    const now = new Date();

    if (effectiveStartDate >= effectiveEndDate) {
      throw 'invalidDates';
    }

    // Validate future dates only if they are being CHANGED.
    // Use inputs.startDate/endDate to check change.
    if (inputs.startDate && new Date(inputs.startDate) < now) {
      throw new Error('La date de début ne peut pas être dans le passé.');
    }
    if (inputs.endDate && new Date(inputs.endDate) < now) {
      throw new Error('La date de fin ne peut pas être dans le passé.');
    }

    const updates = {};
    if (inputs.origin) updates.origin = inputs.origin;
    if (inputs.destination) updates.destination = inputs.destination;
    if (inputs.startDate) updates.startDate = inputs.startDate;
    if (inputs.endDate) updates.endDate = inputs.endDate;
    if (inputs.price !== undefined) updates.price = inputs.price;
    // Status is NOT manually updatable anymore
    if (inputs.maxRequests !== undefined) updates.maxRequests = inputs.maxRequests;

    // Pass currentRequests to updates for model hook to check 'full' status against new maxRequests?
    // Model hook runs on 'valuesToSet'. It doesn't know DB values unless we pass them or it fetches.
    // Since we are not fetching in model hook for performance (assumed), we can assist it 
    // OR we just calculate status here like before, but STRICTLY.

    // Let's calculate status here to be safe and explicit, overriding model hook if needed or working with it.
    // Actually, model hook runs logic. If we pass status, it might override or respect. 
    // Let's determine status based on RULES.

    let newStatus = availability.status; // Default keep current

    // Re-eval status
    const effectiveMax = inputs.maxRequests !== undefined ? inputs.maxRequests : availability.maxRequests;
    const currentRequests = availability.currentRequests || 0;

    // 1. Check Full
    if (effectiveMax !== null && effectiveMax !== undefined && currentRequests >= effectiveMax) {
      newStatus = 'full';
    } else {
      // Not full (or limit removed)
      // Check Expired
      if (effectiveEndDate < now) {
        newStatus = 'expired';
      } else {
        // If it was full/expired, but now valid -> active
        newStatus = 'active';
      }
    }

    updates.status = newStatus;

    // Handle vehicle change separately to verify ownership
    if (inputs.vehicleId && inputs.vehicleId !== availability.vehicle) {
      const vehicle = await Vehicle.findOne({ id: inputs.vehicleId });
      if (!vehicle || vehicle.carrier !== this.req.me.id) {
        throw 'forbidden';
      }
      updates.vehicle = inputs.vehicleId;
    }

    const updatedAvailability = await Availability.updateOne({ id: inputs.id })
      .set(updates);

    return {
      message: 'Disponibilité mise à jour.',
      availability: updatedAvailability
    };
  }
};
