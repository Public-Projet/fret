<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 card p-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
          <IconUser class="h-8 w-8 text-primary-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Créer un compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            connectez-vous à votre compte existant
          </NuxtLink>
        </p>
      </div>

      <!-- Role Selection -->
      <div class="flex justify-center space-x-4 mb-6">
        <button type="button" @click="role = 'shipper'" :class="[
          'flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all',
          role === 'shipper'
            ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
            : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'
        ]">
          <IconCube class="w-6 h-6 mx-auto mb-2" />
          <span class="font-medium">Chargeur</span>
        </button>
        <button type="button" @click="role = 'carrier'" :class="[
          'flex-1 py-3 px-4 rounded-lg border-2 text-center transition-all',
          role === 'carrier'
            ? 'border-secondary-600 bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400'
            : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400'
        ]">
          <IconTruck class="w-6 h-6 mx-auto mb-2" />
          <span class="font-medium">Transporteur</span>
        </button>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="label">Prénom</label>
              <input id="firstName" type="text" required v-model="form.firstName" class="input" />
            </div>
            <div>
              <label for="lastName" class="label">Nom</label>
              <input id="lastName" type="text" required v-model="form.lastName" class="input" />
            </div>
          </div>

          <div>
            <label for="company" class="label">Entreprise (Optionnel)</label>
            <input id="company" type="text" v-model="form.company" class="input" />
          </div>

          <div>
            <label for="email" class="label">Adresse email</label>
            <input id="email" type="email" required v-model="form.email" class="input" />
          </div>

          <div>
            <label for="phone" class="label">Téléphone</label>
            <input id="phone" type="tel" required v-model="form.phone" class="input" />
          </div>

          <div>
            <label for="password" class="label">Mot de passe</label>
            <input id="password" type="password" required v-model="form.password" class="input" />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading">
            <span v-if="loading">Création du compte...</span>
            <span v-else>S'inscrire</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import type { UserRole } from '~/types';
import { IconCube, IconTruck, IconUser } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const role = ref<UserRole>('shipper');
const loading = ref(false);
const error = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  password: '',
});

onMounted(() => {
  if (route.query.role && (route.query.role === 'shipper' || route.query.role === 'carrier')) {
    role.value = route.query.role as UserRole;
  }
});

const handleRegister = async () => {
  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.register({
      ...form,
      role: role.value,
    });

    if (result.success && result.user) {
      if (result.user.role === 'shipper') {
        router.push('/app/index');
      } else {
        router.push('/app/carrier');
      }
    } else {
      error.value = result.error || 'Erreur lors de l\'inscription';
    }
  } catch (e) {
    error.value = 'Une erreur inattendue est survenue';
  } finally {
    loading.value = false;
  }
};
</script>
