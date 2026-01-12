module.exports = {
  'GET /api/v1/shipper/me': {
    policy: ['isAuthenticated', 'isShipper'],
    action: 'shipper/profile/get-profile',
    swagger: { tags: ['EXPÉDITEUR - PROFILE'] }
  },
  'PATCH /api/v1/shipper/update-profile': {
    policy: ['isAuthenticated', 'isShipper'],
    action: 'shipper/profile/update-profile',
    swagger: { tags: ['EXPÉDITEUR - PROFILE'] }
  },
  'PATCH /api/v1/shipper/update-password': {
    policy: ['isAuthenticated', 'isShipper'],
    action: 'shipper/profile/update-password',
    swagger: { tags: ['EXPÉDITEUR - PROFILE'] }
  },
  'PATCH /api/v1/shipper/update-email': {
    policy: ['isAuthenticated', 'isShipper'],
    action: 'shipper/profile/update-email',
    swagger: { tags: ['EXPÉDITEUR - PROFILE'] }
  },
};
