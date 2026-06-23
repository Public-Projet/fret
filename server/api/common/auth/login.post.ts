import { encryptToken } from '~/server/utils/crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const role = body?.role;

  if (!role || !['shipper', 'carrier'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le rôle est requis (shipper ou carrier)',
    });
  }

  // Ne pas envoyer le "role" au backend
  const { role: _role, ...loginData } = body;

  const endpoint = role === 'shipper'
    ? '/shipper/auth/login'
    : '/carrier/auth/login';

  const response = await proxyToBackend<{ token: string; [key: string]: any }>(event, endpoint, {
    method: 'POST',
    body: loginData,
  });

  // Chiffrer le JWT brut avant de l'exposer au client.
  // Le navigateur ne verra qu'une valeur opaque AES-256-GCM, non décodable sur jwt.io.
  return {
    ...response,
    token: encryptToken(response.token),
  };
});

