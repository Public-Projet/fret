/**
 * Sanitizes an error message to prevent database/internal details leaks to end users.
 */
export const sanitizeErrorMessage = (message: string): string => {
  if (!message) return 'Une erreur est survenue';

  const rawLower = message.toLowerCase();

  // Détecter les erreurs de base de données, réseaux, ou stack traces
  if (
    rawLower.includes('adaptererror') ||
    rawLower.includes('database') ||
    rawLower.includes('connection') ||
    rawLower.includes('getaddrinfo') ||
    rawLower.includes('enotfound') ||
    rawLower.includes('sails') ||
    rawLower.includes('postgresql') ||
    rawLower.includes('at object.fn') ||
    rawLower.includes('node_modules') ||
    rawLower.includes('unexpected error')
  ) {
    return 'Une erreur de connexion au serveur est survenue. Veuillez réessayer ultérieurement.';
  }

  return message;
};

/**
 * Centralized error message extractor for backend responses
 */
export const extractErrorMessage = (error: any): string => {
  if (!error) return 'Une erreur est survenue';
  
  if (typeof error === 'string') {
    return sanitizeErrorMessage(error);
  }

  let message = 'Une erreur est survenue';

  // Handle Nuxt $fetch error data
  const errorData = error?.data?.data || error?.data;

  if (errorData && typeof errorData === 'object') {
    // Check for common Sails.js/Backend specific error keys
    const errorKeys = [
      'badCombo', 
      'invalidPhoneFormat', 
      'passwordFormatInvalid', 
      'passwordAlreadyUsed',
      'notFound', 
      'invalidEmail', 
      'emailAlreadyInUse', 
      'licensePlateAlreadyInUse',
      'invalidToken',
      'expiredToken',
      'alreadyActive',
      'accountPending',
      'accountSuspended'
    ];
    
    let foundKey = false;
    for (const key of errorKeys) {
      if (errorData[key]) {
        if (typeof errorData[key] === 'object' && errorData[key] !== null) {
          message = (errorData[key] as { message?: string }).message || 'Une erreur est survenue';
          foundKey = true;
          break;
        } else if (typeof errorData[key] === 'string') {
          message = errorData[key] as string;
          foundKey = true;
          break;
        }
      }
    }

    if (!foundKey && errorData.message && typeof errorData.message === 'string') {
      message = errorData.message;
    }
  } else if (error.message && !error.message.startsWith('Erreur HTTP')) {
    message = error.message;
  }

  return sanitizeErrorMessage(message);
};

/**
 * Extract a success message from a backend response with a fallback.
 */
export const extractSuccessMessage = (response: any, fallback = 'Opération réussie'): string => {
  if (!response) return fallback;
  
  if (typeof response === 'string') return response;
  
  // Checks common keys for success messages
  if (response.message && typeof response.message === 'string') {
    return response.message;
  }
  
  if (response.data && typeof response.data === 'object') {
    if (response.data.message && typeof response.data.message === 'string') {
      return response.data.message;
    }
  }
  
  return fallback;
};
