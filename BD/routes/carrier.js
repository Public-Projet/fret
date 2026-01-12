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
};
