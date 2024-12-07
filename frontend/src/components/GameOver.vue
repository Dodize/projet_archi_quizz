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
      
      <!-- Boutons rejouer et retour au menu -->
      <div class="flex justify-center space-x-4 mt-6">
        
          <button
            @click="resetStoreRejouer" 
            class="w-full px-4 py-2 text-white font-semibold rounded-md bg-[#007bff] hover:bg-blue-600">
            Play again (same settings)
          </button>
          <button 
            @click="resetStoreMenu"
            class="w-full px-4 py-2 text-white font-semibold rounded-md bg-[#ff1493] hover:bg-pink-600">
            Go back to main menu
          </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { store } from './store.js';

const router = useRouter();

const gameOverReason = store.gameOverReason;

// Déterminer le message affiché selon la raison de la fin de partie
const message =
  gameOverReason === 'hearts'
    ? "The game's over: you've lost all your hearts. Try again to beat your record!"
    : "Congratulations! You've answered all the questions 🎉";

const resetStoreRejouer = () => {
  resetStore(store.categoryId, store.categoryName, store.difficulty, store.nbQuestions); // Remettre le store à zéro
  router.push('/game'); // Retour au menu principal
};

const resetStoreMenu = () => {
  resetStore('0', 'General Knowledge', '', 0); // Remettre le store à zéro
  router.push('/'); // Retour au menu principal
};

// Fonction pour réinitialiser les données et revenir au menu principal
const resetStore = (id, name, diff, nbQ) => {
  // Remettre le store à zéro aux valeurs par défaut
  store.categoryId = id;
  store.categoryName = name;
  store.difficulty = diff;
  store.nbQuestions = nbQ;
  store.gameOverReason = 'hearts';
  store.piecesIndice = 0;
  store.heartsRemaining = 3;
  store.questionsList = [];
  store.questionEnCours = 0;
  store.nombreBonneReponses = 0;
  store.nbIndicesDepenses = 0;
  store.reponsesRetireesIndex = [];
  store.afficherReponseBool = false;
  store.mauvaiseReponseCliqueeIndex = null;
}

</script>

<style scoped>
.game-over {
  text-align: center;
}
</style>
