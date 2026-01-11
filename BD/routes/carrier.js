module.exports = {
  'POST /api/v1/carrier/auth/register': {
    action: 'carrier/auth/register',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },
  'POST /api/v1/carrier/auth/verify-email': {
    action: 'carrier/auth/verify-email',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },
  'POST /api/v1/carrier/auth/login': {
    action: 'carrier/auth/login',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },
  'POST /api/v1/carrier/auth/logout': {
    action: 'carrier/auth/logout',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },
  'POST /api/v1/carrier/auth/forgot-password': {
    action: 'carrier/auth/forgot-password',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },
  'POST /api/v1/carrier/auth/reset-password': {
    action: 'carrier/auth/reset-password',
    swagger: { tags: ['TRANSPORTEUR - AUTH'] }
  },
};
