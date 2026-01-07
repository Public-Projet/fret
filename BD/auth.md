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
#### 1.2.1 PASSWORD ERROR
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

#### 1.2.2 MAIL ERROR
```json
{
  "success": false,
  "message": "Cet email est déjà utilisé"
}
```

#### 1.2.3 SUCCESS
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
---

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
#### 3.2.1 OLD - SANS TOKEN
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

#### 3.2.2 NEW - SECURE (HttpOnly Cookie)
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "01KD51G2CV000TFD23Z2R75A0Z",
      "email": "steveasterafovo@gmail.com",
      "name": "Steve Aster AFOVO",
      "organization": "CYPASS",
      "role": "user",
      "created_at": "2025-12-23 08:24:07"
    },
    "token": "7638f30c11c55b9fcf4f6e5b955c7e4df1fa4c2f0719d93c4df09fdc798c394c195347a72730c7abfc8f112bba832787fc1e29732cd2e12923440f472a5bb44e",
    "created_at": "2026-01-06 17:19:53",
    "expires_at": "2026-01-07 17:19:53"
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
