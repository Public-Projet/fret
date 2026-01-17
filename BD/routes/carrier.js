module.exports = {
  'GET /api/v1/carrier/me': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/profile/get-profile',
    swagger: { tags: ['TRANSPORTEUR - PROFILE'] }
  },
  'PATCH /api/v1/carrier/update-profile': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/profile/update-profile',
    swagger: { tags: ['TRANSPORTEUR - PROFILE'] }
  },
  'PATCH /api/v1/carrier/update-password': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/profile/update-password',
    swagger: { tags: ['TRANSPORTEUR - PROFILE'] }
  },
  'PATCH /api/v1/carrier/update-email': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/profile/update-email',
    swagger: { tags: ['TRANSPORTEUR - PROFILE'] }
  },
  'DELETE /api/v1/carrier/delete-account': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'auth/delete-account',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },

  // VEHICULES
  'POST /api/v1/carrier/vehicle': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/vehicle/add',
    swagger: { tags: ['TRANSPORTEUR - VEHICULES'] }
  },
  'GET /api/v1/carrier/vehicles': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/vehicle/list',
    swagger: { tags: ['TRANSPORTEUR - VEHICULES'] }
  },
  'GET /api/v1/carrier/vehicle/:id': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/vehicle/get',
    swagger: { tags: ['TRANSPORTEUR - VEHICULES'] }
  },
  'PATCH /api/v1/carrier/vehicle/:id': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/vehicle/update',
    swagger: { tags: ['TRANSPORTEUR - VEHICULES'] }
  },
  'PATCH /api/v1/carrier/vehicle/:id/status': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/vehicle/update-status',
    swagger: { tags: ['TRANSPORTEUR - VEHICULES'] }
  },
  'DELETE /api/v1/carrier/vehicle/:id': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/vehicle/delete',
    swagger: { tags: ['TRANSPORTEUR - VEHICULES'] }
  },

  // DISPONIBILITES
  'POST /api/v1/carrier/availability': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/availability/add',
    swagger: { tags: ['TRANSPORTEUR - DISPONIBILITES'] }
  },
  'GET /api/v1/carrier/availability': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/availability/list',
    swagger: { tags: ['TRANSPORTEUR - DISPONIBILITES'] }
  },
  'GET /api/v1/carrier/availability/:id': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/availability/get',
    swagger: { tags: ['TRANSPORTEUR - DISPONIBILITES'] }
  },
  'PATCH /api/v1/carrier/availability/:id': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/availability/update',
    swagger: { tags: ['TRANSPORTEUR - DISPONIBILITES'] }
  },
  'DELETE /api/v1/carrier/availability/:id': {
    policy: ['isAuthenticated', 'isCarrier'],
    action: 'carrier/availability/delete',
    swagger: { tags: ['TRANSPORTEUR - DISPONIBILITES'] }
  },
};
