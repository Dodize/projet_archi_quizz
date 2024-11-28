<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      
      <!-- Section pièces / username -->
      <div class="text-center mb-6">
        <p class="text-2xl font-semibold text-gray-800">Welcome, {{ username }}!</p>
        <p class="text-sm text-gray-500">You have <span class="font-semibold">{{ argent }}</span> coins.</p>
      </div>

      <h2 class="text-center mb-6 text-lg font-medium text-gray-700">Change avatar</h2>

      <!-- Section des avatars -->
      <div>
        <div class="grid grid-cols-5 gap-4">
          <img
            v-for="(icon, index) in avatarsDisponibles"
            :key="index"
            :src="icon"
            class="cursor-pointer w-16 h-16 rounded-full p-1 border-2 transition-transform"
            :class="{
              'border-blue-500 scale-105': icon === avatarActuel,
              'border-gray-300': icon !== avatarActuel
            }"
            @click="selectionnerAvatar(icon)"
          />
        </div>
        <button
          @click="validerChangementAvatar"
          class="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Change avatar
        </button>
        <!-- Message lié au changement d'avatar -->
        <div
          v-if="avatarMessage"
          :class="avatarMessageType === 'error' ? 'text-red-600' : 'text-green-600'"
          class="text-center mt-2"
        >
          {{ avatarMessage }}
        </div>
      </div>

      <h2 class="text-center mb-6 text-lg font-medium text-gray-700 mt-8">Change password</h2>

      <!-- Section du formulaire de mot de passe -->
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label for="oldPassword" class="block text-sm font-medium text-gray-700">Current password</label>
          <input
            type="password"
            id="oldPassword"
            v-model="oldPassword"
            placeholder="Enter your current password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700">New password</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            placeholder="Enter your new password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm your new password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Confirm your new password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
        >
          Change password
        </button>
        <!-- Message lié au changement de mot de passe -->
        <div
          v-if="passwordMessage"
          :class="passwordMessageType === 'error' ? 'text-red-600' : 'text-green-600'"
          class="text-center mt-2"
        >
          {{ passwordMessage }}
        </div>

      </form>
      
      <!-- Bouton de déconnexion -->
      <button
        @click="logout"
        class="w-full mt-8 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white"
      >
        Logout
      </button>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

export default {
  name: "InfosCompte",
  setup() {
    // État utilisateur
    const isConnected = ref(false);
    const username = ref("");
    const avatarActuel = ref("");
    const argent = ref(0);

    onMounted(() => {
      fetchUserInfo();
    });

    const avatarsDisponibles = [
      "/img/default-avatar.png",
      "/img/bear.png",
      "/img/cat.png",
      "/img/chicken.png",
      "/img/dog.png",
      "/img/panda.png",
      "/img/meerkat.png",
      "/img/rabbit.png",
      "/img/dog2.png",
      "/img/dragon.png",
      "/img/giraffe.png",
    ];

    const fetchUserInfo = async () => {
      try {
        // Récupération du token depuis le stockage local
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token non trouvé");
          isConnected.value = false;
          return;
        }

        // Requête GET vers l'API pour récupérer les informations utilisateur
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user-informations`, // Remplacer par l'endpoint réel
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ajout du token dans les headers
            },
          }
        );

        // Vérification de la réponse et mise à jour des données utilisateur
        if (response.data) {
          const { username: fetchedUsername, argent: fetchedArgent, avatar } = response.data;

          isConnected.value = true;
          username.value = fetchedUsername; // Stockage du nom d'utilisateur
          argent.value = fetchedArgent;     // Stockage du montant d'argent

          // Validation et initialisation de l'avatar actuel
          const fetchedAvatar = `/img/${avatar}`;
          avatarActuel.value = avatarsDisponibles.includes(fetchedAvatar)
            ? fetchedAvatar
            : "/img/default-avatar.png"; // Avatar par défaut si invalide
        } else {
          console.log("Données utilisateur non trouvées");
          isConnected.value = false;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des informations utilisateur :", error);
        isConnected.value = false;
      }
    };

    // États pour le changement de mot de passe
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const token = localStorage.getItem("token");

    const passwordMessage = ref("");
    const passwordMessageType = ref("");

    const changePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        passwordMessage.value = "Not the same passwords.";
        passwordMessageType.value = "error";
        return;
      }

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/change-password`,
          {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        passwordMessage.value = "Password changed successfully.";
        passwordMessageType.value = "success";
        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
      } catch (error) {
        console.error(error);
        passwordMessage.value =
          error.response?.data?.error || "An error occurred.";
        passwordMessageType.value = "error";
      }
    };

    const selectionnerAvatar = (avatar) => {
      avatarActuel.value = avatar;
    };

    const avatarMessage = ref("");
    const avatarMessageType = ref("");

    const validerChangementAvatar = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/update-avatar`,
          { avatar: avatarActuel.value },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        avatarMessage.value = "Avatar changed successfully.";
        avatarMessageType.value = "success";
      } catch (error) {
        console.error(error);
        avatarMessage.value =
          error.response?.data?.error || "An error occurred.";
        avatarMessageType.value = "error";
      }
    };

    // Appeler fetchUserInfo au montage du composant
    onMounted(fetchUserInfo);

    const router = useRouter();

    // Fonction de déconnexion
    const logout = () => {
      localStorage.removeItem("token"); // Suppression du token
      router.push("/connection"); // Redirection vers la vue de connexion
    };

    return {
      oldPassword,
      newPassword,
      confirmPassword,
      changePassword,
      avatarsDisponibles,
      avatarActuel,
      selectionnerAvatar,
      validerChangementAvatar,
      avatarMessage,
      avatarMessageType,
      passwordMessage,
      passwordMessageType,
      argent,
      username,
      logout
    };
  },
};
</script>

<style scoped>
img {
  transition: transform 0.2s, border-color 0.2s;
}
</style>