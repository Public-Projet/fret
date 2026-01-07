<?php

/**
 * Classe de validation de mots de passe
 * Implémente une politique de sécurité stricte
 * Projet CYPASS - MVP Backend
 * 
 * Politique de sécurité :
 * - Minimum 12 caractères
 * - Au moins une lettre majuscule
 * - Au moins une lettre minuscule
 * - Au moins un chiffre
 * - Au moins un caractère spécial (*, #, @, !, $, %, &, etc.)
 */

class PasswordValidator
{
    // Constantes de configuration
    const MIN_LENGTH = 12;
    const REQUIRE_UPPERCASE = true;
    const REQUIRE_LOWERCASE = true;
    const REQUIRE_DIGIT = true;
    const REQUIRE_SPECIAL_CHAR = true;

    // Caractères spéciaux autorisés
    const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    /**
     * Valide un mot de passe selon la politique de sécurité
     * 
     * @param string $password Le mot de passe à valider
     * @return array ['valid' => bool, 'message' => string, 'errors' => array]
     */
    public static function validate($password)
    {
        $errors = [];
        $valid = true;

        // Vérifier la longueur minimale
        if (strlen($password) < self::MIN_LENGTH) {
            $errors[] = sprintf('Le mot de passe doit contenir au moins %d caractères', self::MIN_LENGTH);
            $valid = false;
        }

        // Vérifier la présence d'une lettre majuscule
        if (self::REQUIRE_UPPERCASE && !preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Le mot de passe doit contenir au moins une lettre majuscule';
            $valid = false;
        }

        // Vérifier la présence d'une lettre minuscule
        if (self::REQUIRE_LOWERCASE && !preg_match('/[a-z]/', $password)) {
            $errors[] = 'Le mot de passe doit contenir au moins une lettre minuscule';
            $valid = false;
        }

        // Vérifier la présence d'un chiffre
        if (self::REQUIRE_DIGIT && !preg_match('/[0-9]/', $password)) {
            $errors[] = 'Le mot de passe doit contenir au moins un chiffre';
            $valid = false;
        }

        // Vérifier la présence d'un caractère spécial
        if (self::REQUIRE_SPECIAL_CHAR && !preg_match('/[' . preg_quote(self::SPECIAL_CHARS, '/') . ']/', $password)) {
            $errors[] = 'Le mot de passe doit contenir au moins un caractère spécial (' . self::SPECIAL_CHARS . ')';
            $valid = false;
        }

        // Construire le message de réponse
        if ($valid) {
            $message = 'Mot de passe valide';
        } else {
            $message = implode('. ', $errors);
        }

        return [
            'valid' => $valid,
            'message' => $message,
            'errors' => $errors
        ];
    }

    /**
     * Retourne les exigences de la politique de mot de passe
     * Utile pour afficher les règles à l'utilisateur
     * 
     * @return array
     */
    public static function getRequirements()
    {
        return [
            'min_length' => self::MIN_LENGTH,
            'require_uppercase' => self::REQUIRE_UPPERCASE,
            'require_lowercase' => self::REQUIRE_LOWERCASE,
            'require_digit' => self::REQUIRE_DIGIT,
            'require_special_char' => self::REQUIRE_SPECIAL_CHAR,
            'special_chars' => self::SPECIAL_CHARS,
            'description' => sprintf(
                'Le mot de passe doit contenir au moins %d caractères avec au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (%s)',
                self::MIN_LENGTH,
                self::SPECIAL_CHARS
            )
        ];
    }

    /**
     * Vérifie si un mot de passe est valide (version simplifiée)
     * 
     * @param string $password
     * @return bool
     */
    public static function isValid($password)
    {
        $result = self::validate($password);
        return $result['valid'];
    }

    /**
     * Calcule la force d'un mot de passe (0-100)
     * 
     * @param string $password
     * @return int Score de 0 à 100
     */
    public static function calculateStrength($password)
    {
        $score = 0;
        $length = strlen($password);

        // Points pour la longueur
        if ($length >= 12) $score += 25;
        if ($length >= 16) $score += 10;
        if ($length >= 20) $score += 10;

        // Points pour la complexité
        if (preg_match('/[a-z]/', $password)) $score += 15;
        if (preg_match('/[A-Z]/', $password)) $score += 15;
        if (preg_match('/[0-9]/', $password)) $score += 15;
        if (preg_match('/[' . preg_quote(self::SPECIAL_CHARS, '/') . ']/', $password)) $score += 15;

        // Points bonus pour la diversité de caractères
        $uniqueChars = count(array_unique(str_split($password)));
        if ($uniqueChars >= 10) $score += 5;

        return min(100, $score);
    }
}
