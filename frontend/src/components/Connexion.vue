<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
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
        try {
          if (this.isRegisterMode) {
            // Appel pour créer un nouveau compte
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
              username: this.username,
              password: this.password,
              mail: null,   // Champ mail par défaut à null
              argent: 0,    // Champ argent par défaut à 0
            });
  
            this.successMessage = `Compte créé avec succès pour ${response.data.user.username}. Vous pouvez maintenant vous connecter.`;
            this.errorMessage = "";
            this.isRegisterMode = false; // Basculer en mode connexion après création
          } else {
            // Appel pour la connexion
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
          this.errorMessage = error.response?.data?.message || (this.isRegisterMode ? "Erreur de création de compte" : "Erreur de connexion");
          this.successMessage = "";
        }
      },
      toggleMode() {
        // Basculer entre le mode Connexion et le mode Création de compte
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
  /* Utilisation de Tailwind pour styliser le contenu */
  </style>  