module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      description: 'L\'adresse email unique de l\'expediteur.'
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Le mot de passe hashé de l\'expediteur.'
    },
    firstname: {
      type: 'string',
      required: true,
      description: 'Le prénom de l\'expediteur.'
    },
    lastname: {
      type: 'string',
      required: true,
      description: 'Le nom de famille de l\'expediteur.'
    },
    username: {
      type: 'string',
      required: true,
      description: 'Le nom d\'utilisateur de l\'expediteur.'
    },
    phone: {
      type: 'string',
      description: 'Le numéro de téléphone de l\'expediteur.'
    },
    role: {
      type: 'string',
      isIn: ['shipper'],
      defaultsTo: 'shipper',
      description: 'Le rôle de l\'expediteur.'
    },
    bio: {
      type: 'string',
      description: 'La spécialité technique de l\'expediteur.'
    },
    photoUrl: {
      type: 'string',
      description: 'L\'URL de la photo de profil de l\'expediteur.'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended'],
      defaultsTo: 'pending',
      description: 'Le statut du compte expediteur (en attente, actif, suspendu).'
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
