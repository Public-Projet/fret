<template>
  <div v-if="lastConnectedRole && lastConnectedAt" class="text-center text-xs text-gray-500 dark:text-gray-400">
    <p>
      Dernière connexion : {{ formatLastConnectedDate(lastConnectedAt) }}
      en tant que {{ lastConnectedRole === 'shipper' ? 'Expéditeur' : 'Transporteur' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/types';

const props = defineProps<{
  lastConnectedRole: UserRole | null;
  lastConnectedAt: string | null;
}>();

const formatLastConnectedDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};
</script>
