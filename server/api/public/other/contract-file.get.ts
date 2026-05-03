import { proxyBinaryToBackend } from '~/server/utils/api';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filename = query.filename as string;

  if (!filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom du contrat est requis',
    });
  }

  // Extract the actual filename if a path was accidentally provided
  const filenameStr = filename.split('/').pop() || filename;

  // On utilise notre utilitaire pour les flux binaires
  return proxyBinaryToBackend(event, `/public/contracts/download/${encodeURIComponent(filenameStr)}`);
});
