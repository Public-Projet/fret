module.exports = {
  friendlyName: 'Supprimer le compte (Soft Delete)',
  description: 'Marquer le compte utilisateur comme supprimé et invalider la session.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200,
      description: 'Compte supprimé avec succès.'
    },
    serverError: {
      statusCode: 500,
      description: 'Erreur interne du serveur.',
      responseType: 'json'
    }
  },

  fn: async function () {
    const userId = this.req.me.id;
    const role = this.req.me.role;
    const Model = role === 'shipper' ? Shipper : Carrier;

    try {
      // Soft delete: update deletedAt timestamp
      await Model.updateOne({ id: userId })
        .set({ deletedAt: Date.now() });

      // Invalidate session/token (if applicable) -> handeled by logout on frontend usually, 
      // but strictly we might want to blacklist token if using JWT, but for now we rely on frontend clearing.

      return {
        message: 'Votre compte a été supprimé avec succès.'
      };

    } catch (err) {
      sails.log.error('Error deleting account:', err);
      throw 'serverError';
    }
  }
};
