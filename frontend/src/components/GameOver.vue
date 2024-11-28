<template>
  <div class="game-over flex justify-center items-center h-screen">
    <div class="overflow-y-auto mt-2.5 bg-boxGrey p-7 pb-4 rounded-2xl w-4/5 text-center shadow-2xl h-64">
      <!-- Affichage conditionnel basé sur gameOverReason -->
      <h1 class="text-5xl font-extrabold mb-4">
        {{ gameOverReason === 'hearts' ? 'Defeat 😔' : 'Victory 🎉' }}
      </h1>
      <p class="text-lg">
        {{ message }}
      </p>
      
      <!-- Boutons de rejouer et retour au menu -->
      <div class="flex justify-center space-x-4 mt-6">
        <router-link to="/game" class="flex-1 max-w-xs">
          <button class="w-full px-4 py-2 text-white font-semibold rounded-md bg-[#007bff] hover:bg-blue-600">
            Play again (same settings)
          </button>
        </router-link>
        <router-link to="/" class="flex-1 max-w-xs">
          <button class="w-full px-4 py-2 text-white font-semibold rounded-md bg-[#ff1493] hover:bg-pink-600">
            Go back to main menu
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { store } from './store.js';

const route = useRoute();

const nbQuestionsRight = store.nbQuestionsRight;
const gameOverReason = store.gameOverReason;

// Déterminer le message affiché selon la raison de la fin de partie
const message =
  gameOverReason === 'hearts'
    ? "The game's over: you've lost all your hearts. Try again to beat your record!"
    : "Congratulations! You've answered all the questions 🎉";
</script>

<style scoped>
.game-over {
  text-align: center;
}
</style>
