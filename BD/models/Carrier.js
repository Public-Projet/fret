module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      description: 'L\'adresse email unique du transporteur.'
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Le mot de passe hashé du transporteur.'
    },
    firstname: {
      type: 'string',
      required: true,
      description: 'Le prénom de du transporteur.'
    },
    lastname: {
      type: 'string',
      required: true,
      description: 'Le nom de famille du transporteur.'
    },
    username: {
      type: 'string',
      required: true,
      description: 'Le nom d\'utilisateur du transporteur.'
    },
    phone: {
      type: 'string',
      description: 'Le numéro de téléphone du transporteur.'
    },
    role: {
      type: 'string',
      isIn: ['carrier'],
      defaultsTo: 'carrier',
      description: 'Le rôle du transporteur.'
    },
    bio: {
      type: 'string',
      description: 'La spécialité technique du transporteur.'
    },
    photoUrl: {
      type: 'string',
      description: 'L\'URL de la photo de profil du transporteur.'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended'],
      defaultsTo: 'pending',
      description: 'Le statut du compte transporteur (en attente, actif, suspendu).'
    },
    emailProofToken: {
      type: 'string',
      description: 'Token pour la vérification de l\'email.'
    },
    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'Date d\'expiration du token de vérification (timestamp).'
    },
    passwordResetToken: {
      type: 'string',
      description: 'Token pour la réinitialisation du mot de passe.'
    },
    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'Date d\'expiration du token de réinitialisation.'
    },
  },

  beforeCreate: async function (valuesToSet, proceed) {
    if (valuesToSet.phone) {
      try {
        valuesToSet.phone = await sails.helpers.utils.formatPhoneNumber(valuesToSet.phone);
      } catch (err) {
        return proceed(err);
      }
    }

    if (valuesToSet.password) {
      try {
        await sails.helpers.utils.validatePassword.with({ password: valuesToSet.password });
        const bcrypt = require('bcryptjs');
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
      } catch (err) {
        if (err.invalid) {
          return proceed(new Error(err.invalid));
        }
        return proceed(err);
      }
    }
    return proceed();
  },

  beforeUpdate: async function (valuesToSet, proceed) {
    if (valuesToSet.phone) {
      try {
        valuesToSet.phone = await sails.helpers.utils.formatPhoneNumber(valuesToSet.phone);
      } catch (err) {
        return proceed(err);
      }
    }

    if (valuesToSet.password) {
      try {
        await sails.helpers.utils.validatePassword.with({ password: valuesToSet.password });
        const bcrypt = require('bcryptjs');
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
      } catch (err) {
        if (err.invalid) {
          return proceed(new Error(err.invalid));
        }
        return proceed(err);
      }
    }
    return proceed();
  },

  customToJSON: function () {
    return _.omit(this, ['password']);
  }
};
