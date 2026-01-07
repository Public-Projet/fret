## 1. REGISTER
### 1.1 CURL
```curl
curl -X 'POST' \
  'https://cypass-backend.alwaysdata.net/api/auth/register.php' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=steveasterafovo%40gmail.com&password= '
```

### 1.2 RESPONSE
### 1.2.1 PASS ERROR
```json
{
  "success": false,
  "message": "Le mot de passe doit contenir au moins 12 caractères. Le mot de passe doit contenir au moins une lettre majuscule. Le mot de passe doit contenir au moins une lettre minuscule. Le mot de passe doit contenir au moins un chiffre. Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*()_+-=[]{}|;:,.<>?)",
  "errors": [
    "Le mot de passe doit contenir au moins 12 caractères",
    "Le mot de passe doit contenir au moins une lettre majuscule",
    "Le mot de passe doit contenir au moins une lettre minuscule",
    "Le mot de passe doit contenir au moins un chiffre",
    "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*()_+-=[]{}|;:,.<>?)"
  ],
  "requirements": {
    "min_length": 12,
    "require_uppercase": true,
    "require_lowercase": true,
    "require_digit": true,
    "require_special_char": true,
    "special_chars": "!@#$%^&*()_+-=[]{}|;:,.<>?",
    "description": "Le mot de passe doit contenir au moins 12 caractères avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (!@#$%^&*()_+-=[]{}|;:,.<>?)"
  }
}
```

### 1.2.2 MAIL ERROR
```json
{
  "success": false,
  "message": "Cet email est déjà utilisé"
}
```

### 1.2.3 SUCCESS
```json
{
  "success": true,
  "message": "Compte créé avec succès. Vérifiez votre boîte email pour activer votre compte.",
  "data": {
    "user_id": 1,
    "email": "steveasterafovo@gmail.com",
    "verification_required": true,
    "email_sent": true
  }
}
```


## 2. MAIL VERIFICATION
### 2.1 CURL
```curl
curl -X 'GET' \
  'https://cypass-backend.alwaysdata.net/api/auth/verify_email.php?token=f49006367e40ee62bea059e7b496cc49e52598bc32e6486b2403dd588cbf7af9' \
  -H 'accept: application/json'
```

### 2.2 RESPONSE
```json
{
  "success": true,
  "message": "Compte activé avec succès ! Vous pouvez maintenant vous connecter.",
  "data": {
    "email": "steveasterafovo@gmail.com",
    "verified": true
  }
}
```


## 3. LOGIN
### 3.1 CURL
```curl
curl -X 'POST'
  'https://cypass-backend.alwaysdata.net/api/auth/login.php'
  -H 'accept: application/json'
  -H 'Content-Type: application/x-www-form-urlencoded'
  -d 'email=eliseeatonde%40gmail.com&password=Elis%C3%A9eATONDE%40123'
```

### 3.2 RESPONSE
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "01KD033HCK0007NAJ8GRMCZ70V",
      "email": "eliseeatonde@gmail.com",
      "organization": null,
      "role": "user",
      "created_at": "2025-12-21 10:16:02"
    }
  }
}
```

## 4. GET PROFIL
### 4.1 CURL
```curl
curl -X 'GET' \
  'https://cypass-backend.alwaysdata.net/api/auth/get_profile.php?user_id=01KD033HCK0007NAJ8GRMCZ70V' \
  -H 'accept: application/json'
  ```

### 4.2 RESPONSE
```json
{
  "success": true,
  "user": {
    "id": "01KD033HCK0007NAJ8GRMCZ70V",
    "email": "eliseeatonde@gmail.com",
    "name": null,
    "organization_name": null,
    "role": "user",
    "email_verified": true,
    "created_at": "2025-12-21 10:16:02"
  },
  "statistics": {
    "total_documents": 0,
    "total_incidents": 0
  }
}
```

## 5. UPDATE PROFIL
### 5.1 CURL
```curl
curl -X 'PUT' \
  'https://cypass-backend.alwaysdata.net/api/auth/update_profile.php' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'user_id=01KD033HCK0007NAJ8GRMCZ70V&name=Elis%C3%A9e%20ATONDE&organization_name=HODD'
```

### 5.2 RESPONSE
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "user": {
    "id": "01KD033HCK0007NAJ8GRMCZ70V",
    "email": "eliseeatonde@gmail.com",
    "name": "Elisée ATONDE",
    "organization_name": "HODD",
    "role": "user",
    "created_at": "2025-12-21 10:16:02"
  }
}
```
