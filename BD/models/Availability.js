module.exports = {
  attributes: {
    carrier: {
      model: 'carrier',
      required: true
    },
    vehicle: {
      model: 'vehicle',
      required: true
    },
    origin: {
      type: 'json',
      required: true,
      custom: function (value) {
        return _.isObject(value) && _.isString(value.city) && _.isString(value.country);
      }
    },
    destination: {
      type: 'json',
      // Destination can be null/undefined if "Anywhere"
    },
    startDate: {
      type: 'ref',
      columnType: 'timestamp',
      required: true
    },
    endDate: {
      type: 'ref',
      columnType: 'timestamp',
      required: true
    },
    price: {
      type: 'number',
      columnType: 'float'
    },
    maxRequests: {
      type: 'number',
      allowNull: true
    },
    currentRequests: {
      type: 'number',
      defaultsTo: 0
    },
    status: {
      type: 'string',
      isIn: ['active', 'expired', 'full'],
      defaultsTo: 'active'
    }
  },

  beforeCreate: function (valuesToSet, proceed) {
    const now = new Date();

    // Validate Dates
    if (valuesToSet.startDate && valuesToSet.endDate) {
      const start = new Date(valuesToSet.startDate);
      const end = new Date(valuesToSet.endDate);

      if (start < now) {
        return proceed(new Error('La date de début ne peut pas être dans le passé.'));
      }
      if (end < now) {
        return proceed(new Error('La date de fin ne peut pas être dans le passé.'));
      }
      if (start >= end) {
        return proceed(new Error('La date de début doit être avant la date de fin.'));
      }
    }

    // Determine Status
    // Default to active, but check conditions
    let status = 'active';

    // 1. Check Full
    if (valuesToSet.maxRequests && valuesToSet.currentRequests >= valuesToSet.maxRequests) {
      status = 'full';
    }
    // 2. Check Expired (shouldn't happen on create given validation, but good practice)
    else if (valuesToSet.endDate && new Date(valuesToSet.endDate) < now) {
      status = 'expired';
    }

    valuesToSet.status = status;

    return proceed();
  },

  beforeUpdate: function (valuesToSet, proceed) {
    const now = new Date();

    // Validate Dates if both present (partial update check is harder without fetch)
    if (valuesToSet.startDate && valuesToSet.endDate) {
      const start = new Date(valuesToSet.startDate);
      const end = new Date(valuesToSet.endDate);

      if (start >= end) {
        return proceed(new Error('La date de début doit être avant la date de fin.'));
      }
      // We allow updating start/end to future, but if they are set to past, we might block or allow (for corrections?)
      // Request said "cannot choose date in past", so block.
      if (start < now) {
        // Exception: if we are not changing start date, we shouldn't block. 
        // But we don't know if we are changing it here easily. 
        // For now, adhere to strictly "no past dates" for NEW values.
        return proceed(new Error('La date de début ne peut pas être dans le passé.'));
      }
      if (end < now) {
        return proceed(new Error('La date de fin ne peut pas être dans le passé.'));
      }
    }

    // Status Logic
    // We need to know current/max requests to determine status.
    // Since we can't easily access "current" db state here in generic hook without extra query,
    // we assume the controller handles the "Full" logic or passes necessary flags.
    // However, we CAN force "expired" if endDate < now.

    if (valuesToSet.endDate && new Date(valuesToSet.endDate) < now) {
      valuesToSet.status = 'expired';
    }

    // If limits are passed, we can check 'full'
    if (valuesToSet.maxRequests !== undefined && valuesToSet.currentRequests !== undefined) {
      if (valuesToSet.currentRequests >= valuesToSet.maxRequests) {
        valuesToSet.status = 'full';
      } else if (valuesToSet.status === 'full') {
        // If it was full but now request count < max, revert to active (if valid date)
        // This assumes we are allowed to change status back.
        valuesToSet.status = 'active';
      }
    }

    return proceed();
  }
};
