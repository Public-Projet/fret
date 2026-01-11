module.exports = {
  'POST /api/v1/shipper/auth/register': {
    action: 'shipper/auth/register',
    swagger: { tags: ['EXPEDITEUR - AUTH'] }
  },
  'POST /api/v1/shipper/auth/verify-email': {
    action: 'shipper/auth/verify-email',
    swagger: { tags: ['EXPEDITEUR - AUTH'] }
  },
  'POST /api/v1/shipper/auth/login': {
    action: 'shipper/auth/login',
    swagger: { tags: ['EXPEDITEUR - AUTH'] }
  },
  'POST /api/v1/shipper/auth/logout': {
    action: 'shipper/auth/logout',
    swagger: { tags: ['EXPEDITEUR - AUTH'] }
  },
  'POST /api/v1/shipper/auth/forgot-password': {
    action: 'shipper/auth/forgot-password',
    swagger: { tags: ['EXPEDITEUR - AUTH'] }
  },
  'POST /api/v1/shipper/auth/reset-password': {
    action: 'shipper/auth/reset-password',
    swagger: { tags: ['EXPEDITEUR - AUTH'] }
  },
};
