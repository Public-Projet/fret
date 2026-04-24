/**
 * Centralized error message extractor for backend responses
 */
export const extractErrorMessage = (error: any): string => {
  if (!error) return 'Une erreur est survenue';
  
  // Handle Nuxt $fetch error data
  const errorData = error?.data?.data || error?.data;

  if (errorData && typeof errorData === 'object') {
    // Check for common Sails.js/Backend specific error keys
    const errorKeys = [
      'badCombo', 
      'invalidPhoneFormat', 
      'passwordFormatInvalid', 
      'notFound', 
      'invalidEmail', 
      'emailAlreadyInUse', 
      'licensePlateAlreadyInUse'
    ];
    
    for (const key of errorKeys) {
      if (errorData[key] && typeof errorData[key] === 'object') {
        return (errorData[key] as { message?: string }).message || 'Une erreur est survenue';
      }
    }

    if (errorData.message && typeof errorData.message === 'string') {
      return errorData.message;
    }
  }

  // Fallback to standard error message
  if (error.message && !error.message.startsWith('Erreur HTTP')) {
    return error.message;
  }

  return 'Une erreur est survenue';
};
