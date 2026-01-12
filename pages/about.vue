<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <!-- Background animé -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 dark:from-slate-900 dark:via-gray-900 dark:to-slate-950">
        <div class="absolute inset-0 opacity-20">
          <div
            class="absolute top-20 left-10 w-72 h-72 bg-white dark:bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob">
          </div>
          <div
            class="absolute top-40 right-10 w-72 h-72 bg-green-400 dark:bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000">
          </div>
          <div
            class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 dark:bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
          </div>
        </div>
      </div>

      <div class="container-custom relative z-10 py-20 text-center">
        <div
          class="inline-flex items-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full px-6 py-3 mb-8 animate-fade-in">
          <IconInfoCircle class="w-5 h-5 text-green-300 dark:text-emerald-400" />
          <span class="text-sm text-white dark:text-gray-200 font-medium">Qui sommes-nous ?</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black text-white dark:text-gray-100 mb-6 leading-tight">
          Notre
          <span
            class="block mt-2 bg-gradient-to-r from-green-400 via-green-300 to-green-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
            Histoire
          </span>
        </h1>

        <p class="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Découvrez l'équipe passionnée qui révolutionne le transport de marchandises au Bénin
        </p>
      </div>

      <!-- Wave separator -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path
            d="M0 200L48 183.3C96 166.7 192 133.3 288 116.7C384 100 480 100 576 108.3C672 116.7 768 133.3 864 133.3C960 133.3 1056 116.7 1152 108.3C1248 100 1344 100 1392 100L1440 100V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z"
            fill="currentColor" class="text-gray-50 dark:text-gray-900" />
        </svg>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="section bg-gray-50 dark:bg-gray-900">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <GradientBadge text="Notre Mission" variant="blue" />
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              Connecter les acteurs du
              <span class="text-gradient">transport au Bénin</span>
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Bourse de Fret Bénin est née d'un constat simple : le transport de marchandises au Bénin
              manquait cruellement de digitalisation et de transparence. Notre plateforme met en relation
              directe les chargeurs avec des transporteurs qualifiés, éliminant les intermédiaires inutiles.
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Notre objectif est de rendre le transport de fret accessible, sécurisé et économique pour
              tous. Que vous soyez une entreprise cherchant à optimiser sa logistique ou un transporteur
              indépendant en quête de nouvelles opportunités, nous sommes là pour vous.
            </p>
          </div>

          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl blur-3xl">
            </div>
            <div
              class="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <IconTarget class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-1">Vision</h4>
                    <p class="text-gray-600 dark:text-gray-400">Devenir la référence du transport de fret en
                      Afrique de l'Ouest</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <IconRocket class="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-1">Ambition</h4>
                    <p class="text-gray-600 dark:text-gray-400">Digitaliser 100% du transport de marchandises au
                      Bénin d'ici 2030</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <IconHeart class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-1">Engagement</h4>
                    <p class="text-gray-600 dark:text-gray-400">Support 24/7 et accompagnement personnalisé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container-custom">
        <div class="text-center mb-16">
          <GradientBadge text="Nos Valeurs" variant="green" />
          <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Ce qui nous guide au quotidien
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in VALUES" :key="value.title"
            :class="['group relative rounded-3xl p-8 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:shadow-lg dark:shadow-black/20 dark:hover:shadow-xl dark:hover:shadow-black/30', value.bgClass]">
            <div
              :class="['w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg', value.iconBgClass]">
              <component :is="value.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ value.title }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="section bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div class="container-custom">
        <div class="text-center mb-16">
          <GradientBadge text="L'Équipe" variant="blue" />
          <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Les visages derrière la plateforme
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Une équipe passionnée par l'innovation et le transport
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div v-for="member in TEAM" :key="member.initials"
            class="group bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
            <div
              :class="['w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300', member.avatarClass]">
              <span class="text-3xl font-black text-white">{{ member.initials }}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ member.name }}</h3>
            <p :class="['font-semibold mb-3', member.roleClass]">{{ member.role }}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="section bg-white dark:bg-gray-800">
      <div class="container-custom">
        <div class="text-center mb-16">
          <GradientBadge text="Nos Chiffres" variant="green" />
          <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Bourse de Fret en chiffres
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in STATS" :key="stat.label" :class="['text-center p-8 rounded-3xl', stat.bgClass]">
            <div :class="['text-5xl md:text-6xl font-black mb-2', stat.textClass]">
              {{ animatedStats[stat.key].toLocaleString() }}{{ stat.suffix }}
            </div>
            <p class="text-gray-600 dark:text-gray-300 font-semibold">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-24 overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 dark:from-slate-900 dark:via-gray-900 dark:to-slate-950">
        <div class="absolute inset-0 opacity-20">
          <div
            class="absolute top-0 left-0 w-96 h-96 bg-white dark:bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob">
          </div>
          <div
            class="absolute bottom-0 right-0 w-96 h-96 bg-green-400 dark:bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000">
          </div>
        </div>
      </div>

      <div class="container-custom relative z-10 text-center">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-6xl font-black text-white dark:text-gray-100 mb-6 leading-tight">
            Rejoignez l'aventure
            <span
              class="block bg-gradient-to-r from-green-400 via-green-300 to-green-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">Bourse
              de Fret Bénin</span>
          </h2>
          <p class="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Que vous soyez chargeur ou transporteur, notre plateforme est faite pour vous
          </p>

          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <NuxtLink to="/auth/register"
              class="group px-10 py-5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-xl shadow-2xl hover:shadow-white/30 dark:hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-110 flex items-center space-x-3 dark:border dark:border-gray-700">
              <span>Créer mon compte</span>
              <IconArrowRight class="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </NuxtLink>

            <NuxtLink to="/h/contact"
              class="px-10 py-5 border-4 border-white dark:border-gray-600 text-white dark:text-gray-200 rounded-2xl font-black text-xl hover:bg-white hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-110">
              Nous contacter
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { GradientBadge } from '@/components/common';
import {
  IconInfoCircle, IconTarget, IconRocket, IconHeart, IconShieldCheck, IconBulb, IconUsers, IconBolt, IconArrowRight
} from '@tabler/icons-vue';

// Valeurs de l'entreprise
const VALUES = [
  {
    icon: IconShieldCheck,
    title: 'Confiance',
    description: 'Tous nos transporteurs sont vérifiés et certifiés. Votre marchandise est entre de bonnes mains.',
    bgClass: 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/80 dark:to-blue-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    icon: IconBulb,
    title: 'Innovation',
    description: 'Nous utilisons les dernières technologies pour optimiser vos transports.',
    bgClass: 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800/80 dark:to-green-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-green-500 to-green-700'
  },
  {
    icon: IconUsers,
    title: 'Proximité',
    description: 'Une équipe à votre écoute, disponible pour vous accompagner à chaque étape.',
    bgClass: 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/80 dark:to-blue-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    icon: IconBolt,
    title: 'Efficacité',
    description: 'Trouvez un transporteur en moins de 30 minutes. Pas de perte de temps !',
    bgClass: 'bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800/80 dark:to-green-900/20 dark:backdrop-blur-sm',
    iconBgClass: 'bg-gradient-to-br from-green-500 to-green-700'
  }
];

// Équipe
const TEAM = [
  {
    initials: 'SA',
    name: 'Sylvestre AIZAN ALAGBE',
    role: 'Co-fondateur & CEO',
    description: "10 ans d'expérience dans la logistique et le transport au Bénin",
    avatarClass: 'bg-gradient-to-br from-blue-500 to-blue-700',
    roleClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    initials: 'HD',
    name: 'Handel DOVOEDO',
    role: 'Co-fondateur & CTO',
    description: 'Expert en développement de plateformes digitales B2B',
    avatarClass: 'bg-gradient-to-br from-green-500 to-green-700',
    roleClass: 'text-green-600 dark:text-green-400'
  },
  {
    initials: 'AK',
    name: 'Amos KPOSSOU',
    role: 'Directeur des Opérations',
    description: 'Spécialiste en gestion de la relation client et qualité',
    avatarClass: 'bg-gradient-to-br from-blue-500 to-green-500',
    roleClass: 'text-blue-600 dark:text-blue-400'
  }
];

// Statistiques
const STATS = [
  {
    key: 'shippers' as const,
    label: 'Chargeurs actifs',
    targetValue: 5247,
    suffix: '+',
    animated: true,
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    key: 'carriers' as const,
    label: 'Transporteurs',
    targetValue: 12389,
    suffix: '+',
    animated: true,
    bgClass: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-green-600 dark:text-green-400'
  },
  {
    key: 'deliveries' as const,
    label: 'Transports réussis',
    targetValue: 847,
    suffix: 'k+',
    animated: true,
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    key: 'satisfaction' as const,
    label: 'Satisfaction client',
    targetValue: 98,
    suffix: '%',
    animated: true,
    bgClass: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-green-600 dark:text-green-400'
  }
];

definePageMeta({
  layout: 'guest'
});

useHead({
  title: 'À Propos',
  meta: [
    {
      name: 'description',
      content: 'Découvrez l\'équipe et la mission de Bourse de Fret Bénin, la plateforme n°1 du transport de marchandises au Bénin.'
    }
  ]
});

const animatedStats = reactive({
  shippers: 0,
  carriers: 0,
  deliveries: 0,
  satisfaction: 0
});

const animateValue = (key: keyof typeof animatedStats, end: number, duration: number) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    animatedStats[key] = Math.floor(end * progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    STATS.forEach(stat => {
      animateValue(stat.key, stat.targetValue, 2000);
    });
  }, 500);
});
</script>

<style scoped>
@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.text-gradient {
  @apply bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent;
}
</style>
