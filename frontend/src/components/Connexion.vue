<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        {{ isRegisterMode ? 'Créer un compte' : 'Connexion' }}
      </h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="username" class="block mb-2 font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Entrez votre nom d'utilisateur"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label for="password" class="block mb-2 font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Entrez votre mot de passe"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ isRegisterMode ? 'Créer un compte' : 'Se connecter' }}
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-center text-red-500">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-center text-green-500">{{ successMessage }}</p>
      <p class="mt-4 text-center text-gray-600">
        {{ isRegisterMode ? 'Déjà un compte ?' : 'Pas encore de compte ?' }}
        <button
          @click="toggleMode"
          class="text-blue-500 hover:underline focus:outline-none ml-1"
        >
          {{ isRegisterMode ? 'Se connecter' : 'Créer un compte' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Connexion",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      successMessage: "",
      isRegisterMode: false, // Mode pour basculer entre Connexion et Création de compte
    };
  },
  methods: {
    async submitForm() {

      // Vérification du mot de passe en mode création de compte
      if (this.isRegisterMode && !this.isPasswordValid(this.password)) {
        this.errorMessage = "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 caractère spécial et être entre 8 et 32 caractères.";
        this.successMessage = "";
        return;
      }

      try {
        // Mode nouveau compte
        if (this.isRegisterMode) {
          // requête post pour ajout en bd
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
            username: this.username,
            password: this.password,
            argent: 0, // à voir si on lui met de l'argent
          });

          this.successMessage = `Compte créé avec succès pour ${response.data.user.username}. Vous pouvez maintenant vous connecter.`;
          this.errorMessage = "";
          this.isRegisterMode = false; // Passe en mode connexion après création
        } else {
          // Mode connexion
          // requête post pour vérification en bd que les identifiants sont corrects
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
            username: this.username,
            password: this.password,
          });

          this.successMessage = `Bienvenue, ${response.data.user.username}! Connexion réussie.`;
          this.errorMessage = "";
        }

        // Réinitialiser les champs de saisie
        this.username = "";
        this.password = "";
      } catch (error) {
        // Affiche le message du back ou un message par défaut sinon
        this.errorMessage = error.response?.data?.error || 
                            (this.isRegisterMode ? "Erreur de création de compte" : "Erreur de connexion");
        this.successMessage = "";
      }
    },
    isPasswordValid(password) {
      // pwd -> 1 majuscule, 1 minuscule, 1 char spécial, entre 8 et 32 chars
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,32}$/;
      return passwordRegex.test(password);
    },
    toggleMode() {
      // permet de changer de mode
      this.isRegisterMode = !this.isRegisterMode;
      this.errorMessage = "";
      this.successMessage = "";
      this.username = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
</style>