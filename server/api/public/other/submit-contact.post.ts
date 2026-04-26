import { proxyToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return proxyToBackend(event, '/public/contact/submit', {
    method: 'POST',
    body,
  });
});
