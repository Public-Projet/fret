import { proxyBinaryToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filename = query.filename as string;

  if (!filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom du fichier est requis',
    });
  }

  // On utilise notre nouvel utilitaire pour les flux binaires
  return proxyBinaryToBackend(event, `/public/contracts/download/${encodeURIComponent(filename)}`);
});
