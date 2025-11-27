<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 card p-8">
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
          <TruckIcon class="h-8 w-8 text-primary-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Connexion
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            créez un compte gratuitement
          </NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="email-address" class="label">Adresse email</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
              class="input" placeholder="exemple@email.com" />
          </div>
          <div>
            <label for="password" class="label">Mot de passe</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
              v-model="password" class="input" placeholder="••••••••" />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
            </span>
            <span v-if="loading">Connexion...</span>
            <span v-else>Se connecter</span>
          </button>
        </div>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400">
        <p class="font-bold mb-2">Comptes de démo :</p>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <p class="font-semibold">Chargeur :</p>
            <p>s.azian@charg.com</p>
          </div>
           <button type="button" @click="loginAsDemo('shipper')"
            class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors">
            Connexion Chargeur
          </button>
          <div>
            <p class="font-semibold">Transporteur :</p>
            <p>amos.kpos@transp.com</p>
          </div>
          <button type="button" @click="loginAsDemo('carrier')"
            class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200 transition-colors">
            Connexion Transporteur
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TruckIcon, LockClosedIcon } from '@heroicons/vue/24/solid';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.login(email.value, password.value);
    if (result.success && result.user) {
      if (result.user.role === 'shipper') {
        router.push('/dashboard/shipper');
      } else {
        router.push('/dashboard/carrier');
      }
    } else {
      error.value = result.error || 'Erreur de connexion';
    }
  } catch (e) {
    error.value = 'Une erreur inattendue est survenue';
  } finally {
    loading.value = false;
  }
};

const loginAsDemo = async (role: 'shipper' | 'carrier') => {
  if (role === 'shipper') {
    email.value = 's.azian@charg.com';
  } else {
    email.value = 'amos.kpos@transp.com';
  }
  password.value = 'password';
  await handleLogin();
};
</script>
