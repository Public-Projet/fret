import { ref, computed } from 'vue';

const showPromptModal = ref(false);
const SNOOZE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours
const LOCAL_STORAGE_KEY = 'bf-notification-prompt-dismissed';

/**
 * Composable pour les notifications desktop natives (Web Notifications API)
 * Gère la demande de permission et l'envoi de notifications même quand l'onglet est en arrière-plan.
 */
export const useDesktopNotifications = () => {
  /**
   * Vérifie si le navigateur supporte l'API Notification
   */
  const isSupported = computed(() => {
    if (import.meta.server) return false;
    return 'Notification' in window;
  });

  /**
   * Permission actuelle : 'default' | 'granted' | 'denied'
   */
  const permission = computed<NotificationPermission>(() => {
    if (import.meta.server || !('Notification' in window)) return 'default';
    return Notification.permission;
  });

  /**
   * Demande la permission à l'utilisateur d'afficher des notifications desktop.
   * N'affiche la demande que si la permission n'est pas encore accordée ou refusée.
   * Retourne true si la permission est accordée.
   */
  const requestPermission = async (): Promise<boolean> => {
    if (import.meta.server || !('Notification' in window)) return false;

    // Déjà accordée
    if (Notification.permission === 'granted') return true;

    // Déjà refusée définitivement → ne pas redemander
    if (Notification.permission === 'denied') return false;

    // Demander la permission (état 'default')
    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch (error) {
      console.warn('[DesktopNotifications] Impossible de demander la permission:', error);
      return false;
    }
  };

  /**
   * Vérifie si on doit demander la permission avec notre modal personnalisé.
   */
  const checkAndPromptPermission = () => {
    if (import.meta.server || !isSupported.value) return;

    // Si déjà accordé ou bloqué au niveau du navigateur, on n'affiche rien
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;

    // Vérifie le snooze du modal personnalisé
    const dismissedTimeStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (dismissedTimeStr) {
      const dismissedTime = parseInt(dismissedTimeStr, 10);
      if (!isNaN(dismissedTime) && Date.now() - dismissedTime < SNOOZE_DURATION_MS) {
        return; // Toujours sous snooze
      }
    }

    showPromptModal.value = true;
  };

  /**
   * Accepte la demande : ferme le modal et lance la demande native du navigateur
   */
  const acceptPrompt = async (): Promise<boolean> => {
    showPromptModal.value = false;
    return await requestPermission();
  };

  /**
   * Reporte la demande : ferme le modal et enregistre le snooze
   */
  const dismissPrompt = () => {
    showPromptModal.value = false;
    localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
  };

  /**
   * Envoie une notification desktop native.
   * @param title   - Titre de la notification
   * @param options - Options natives (body, icon, badge, tag…)
   */
  const sendNotification = (
    title: string,
    options: NotificationOptions = {}
  ): Notification | null => {
    if (import.meta.server || !('Notification' in window)) return null;
    if (Notification.permission !== 'granted') return null;

    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/pwa-192x192.png',
      lang: 'fr',
      requireInteraction: false,
      ...options,
    };

    try {
      const notif = new Notification(title, defaultOptions);

      // Clic sur la notification → ramener le focus sur l'onglet
      notif.onclick = () => {
        if (typeof window !== 'undefined') {
          window.focus();
        }
        notif.close();
      };

      return notif;
    } catch (error) {
      console.warn('[DesktopNotifications] Erreur lors de l\'envoi:', error);
      return null;
    }
  };

  /**
   * Envoie une notification desktop pour une nouvelle notification de la plateforme.
   * Raccourci typique pour les notifications BF.
   */
  const notifyNewPlatformNotification = (
    title: string,
    body: string,
    options: NotificationOptions = {}
  ): Notification | null => {
    return sendNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      tag: 'bourse-fret-notification', // Regroupe les notifications identiques
      ...options,
    });
  };

  return {
    isSupported,
    permission,
    requestPermission,
    showPromptModal,
    checkAndPromptPermission,
    acceptPrompt,
    dismissPrompt,
    sendNotification,
    notifyNewPlatformNotification,
  };
};
