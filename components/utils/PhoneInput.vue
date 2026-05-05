<template>
  <div class="phone-input-container w-full">
    <ClientOnly>
      <input ref="phoneInput" type="tel" :value="modelValue" @input="onInput" class="input w-full"
        :placeholder="placeholder" />
      <template #fallback>
        <input type="tel" :value="modelValue" class="input w-full" :placeholder="placeholder" disabled />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const phoneInput = ref<HTMLInputElement | null>(null);
let iti: any = null;

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (iti) {
    const fullNumber = iti.getNumber();
    emit('update:modelValue', fullNumber);
  } else {
    emit('update:modelValue', input.value);
  }
};

const loadLibrary = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).intlTelInput) {
      resolve((window as any).intlTelInput);
      return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/css/intlTelInput.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/intlTelInput.min.js';
    script.onload = () => resolve((window as any).intlTelInput);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    const intlTelInput: any = await loadLibrary();
    if (phoneInput.value) {
      iti = intlTelInput(phoneInput.value, {
        initialCountry: 'bj', // Bénin par défaut
        preferredCountries: ['bj', 'tg', 'ng', 'fr', 'ci'],
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js',
      });

      // Si on a déjà une valeur, on l'initialise dans le plugin
      if (props.modelValue) {
        iti.setNumber(props.modelValue);
      }
    }
  } catch (error) {
    console.error('Failed to load intl-tel-input', error);
  }
});

onBeforeUnmount(() => {
  if (iti) {
    iti.destroy();
  }
});

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  if (iti && newVal !== iti.getNumber()) {
    iti.setNumber(newVal);
  }
});
</script>

<style>
/* Custom styles to match our theme */
.phone-input-container .iti {
  width: 100%;
}

.phone-input-container .iti__flag-container {
  padding: 2px;
}

.phone-input-container .iti__country-list {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  z-index: 100;
  max-width: 300px;
}

.dark .phone-input-container .iti__country-list {
  background-color: #1f2937;
  border-color: #374151;
  color: white;
}

.phone-input-container .iti__country {
  padding: 8px 12px;
}

.phone-input-container .iti__country.iti__highlight {
  background-color: #f3f4f6;
}

.dark .phone-input-container .iti__country.iti__highlight {
  background-color: #374151;
}

.phone-input-container .input {
  padding-left: 90px !important;
  /* Ajuster selon le besoin du plugin */
}

.phone-input-container .iti--separate-dial-code .iti__selected-dial-code {
  color: #6b7280;
}

.dark .phone-input-container .iti--separate-dial-code .iti__selected-dial-code {
  color: #9ca3af;
}
</style>
