<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        {{ isRegisterMode ? 'Create an account' : 'Login' }}
      </h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="username" class="block mb-2 font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your username"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ isRegisterMode ? 'Sign up' : 'Login' }}
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-center text-red-500">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-4 text-center text-green-500">{{ successMessage }}</p>
      <p class="mt-4 text-center text-gray-600">
        {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
        <button
          @click="toggleMode"
          class="text-blue-500 hover:underline focus:outline-none ml-1"
        >
          {{ isRegisterMode ? 'Login' : 'Sign up' }}
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
        this.errorMessage = "The password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and be between 8 and 32 characters long.";
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
            avatar: "default-avatar.png",
          });

          this.successMessage = `Account successfully created for ${response.data.user.username}. You can now login.`;
          this.errorMessage = "";
          this.isRegisterMode = false; // Passe en mode connexion après création
        } else {
          // Mode connexion
          // requête post pour vérification en bd que les identifiants sont corrects
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
            username: this.username,
            password: this.password,
          });

          this.successMessage = `Welcome, ${this.username}! Login successful.`;
          this.errorMessage = "";

          localStorage.setItem('token', response.data.token);
        }

        // Réinitialiser les champs de saisie
        this.username = "";
        this.password = "";
      } catch (error) {
        // Affiche le message du back ou un message par défaut sinon
        this.errorMessage = error.response?.data?.error || 
                            (this.isRegisterMode ? "Error creating account" : "Login failed");
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