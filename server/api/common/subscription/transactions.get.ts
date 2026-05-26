import { proxyToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  return proxyToBackend(event, '/subscription/transactions');
});
