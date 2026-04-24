// Génère les initiales à partir d'un nom complet
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

// Palette de couleurs pour les avatars de fallback
const AVATAR_COLORS = [
  'bg-gradient-to-br from-blue-500 to-blue-700',
  'bg-gradient-to-br from-green-500 to-green-700',
  'bg-gradient-to-br from-yellow-500 to-yellow-700',
  'bg-gradient-to-br from-purple-500 to-purple-700',
  'bg-gradient-to-br from-pink-500 to-pink-700',
  'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'bg-gradient-to-br from-teal-500 to-teal-700',
];

// Retourne une classe de couleur d'avatar déterministe basée sur l'index
export function getAvatarClass(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// Palette de couleurs pour le rôle
const ROLE_COLORS = [
  'text-blue-600 dark:text-blue-400',
  'text-green-600 dark:text-green-400',
  'text-purple-600 dark:text-purple-400',
  'text-indigo-600 dark:text-indigo-400',
  'text-pink-600 dark:text-pink-400',
  'text-teal-600 dark:text-teal-400',
];

export function getRoleClass(index: number): string {
  return ROLE_COLORS[index % ROLE_COLORS.length];
}
