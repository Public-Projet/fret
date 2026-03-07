export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const resource = query.resource as string;

  if (!resource) {
    throw createError({ statusCode: 400, statusMessage: 'Resource parameter is required' });
  }

  // Whitelist des resources CMS autorisées
  const allowed = ['partners', 'testimonials', 'team', 'faq', 'safety', 'help', 'social-links'];
  if (!allowed.includes(resource)) {
    throw createError({ statusCode: 400, statusMessage: `Resource '${resource}' non autorisée` });
  }

  return proxyToBackend(event, `/public/cms/${resource}`);
});
