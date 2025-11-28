<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- À propos -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl font-bold text-white">Bourse de Fret Bénin</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            La plateforme moderne de mise en relation entre chargeurs et transporteurs.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <IconBrandFacebook class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <IconBrandX class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <IconBrandLinkedin class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Liens rapides -->
        <div>
          <h3 class="text-white font-semibold mb-4">Liens rapides</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/offers" class="text-sm hover:text-white transition-colors">
                Annonces
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-sm hover:text-white transition-colors">
                À propos
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/how-it-works" class="text-sm hover:text-white transition-colors">
                Comment ça marche
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/pricing" class="text-sm hover:text-white transition-colors">
                Tarifs
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-white font-semibold mb-4">Support</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/help" class="text-sm hover:text-white transition-colors">
                Centre d'aide
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-sm hover:text-white transition-colors">
                Contact
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="text-sm hover:text-white transition-colors">
                FAQ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/safety" class="text-sm hover:text-white transition-colors">
                Sécurité
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Légal -->
        <div>
          <h3 class="text-white font-semibold mb-4">Légal</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/terms" class="text-sm hover:text-white transition-colors">
                Conditions d'utilisation
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy" class="text-sm hover:text-white transition-colors">
                Politique de confidentialité
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/cookies" class="text-sm hover:text-white transition-colors">
                Cookies
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/legal" class="text-sm hover:text-white transition-colors">
                Mentions légales
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-sm text-gray-400">
          © {{ currentYear }} Bourse de Fret Bénin. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconBrandFacebook, IconBrandLinkedin, IconBrandX } from '@tabler/icons-vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
