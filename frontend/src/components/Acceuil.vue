<template>
    <div class="text-center mt-6">
      <h1 class="text-6xl mb-10">
        Welcome in Culture Quizz
      </h1>
      <!-- Bouton Connexion -->
      <button
        class="btn font-bold py-2 px-4 bg-[#007bff] text-white rounded-md shadow-md hover:bg-blue-600 transition-all mb-4"
        @click="goToConnection"
      >
        Connection
      </button>
      <!-- Bouton pour le menu -->
      <button
        class="btn font-bold py-2 px-4 bg-[#ff1493] text-white rounded-md shadow-md hover:bg-[#de0078] transition-all mb-4"
        @click="goToSelection"
      >
        Menu Selection
      </button>
      <!-- Bouton pour les règles -->
      <button
        class="btn font-bold py-2 px-4 bg-[#ff6700] text-white rounded-md shadow-md hover:bg-[#de5900] transition-all"
        @click="openRulesPopup"
      >
        Rules
      </button>
  
      <!-- Pop-up pour les règles -->
    <div
      v-if="showRules"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-md shadow-lg text-center max-w-4xl">
        <h2 class="text-xl font-bold mb-4">Game Rules</h2>
        <!-- Two-column layout for content -->
        <div class="grid grid-cols-2 gap-6 text-left text-gray-700">
          <!-- Column 1 -->
          <div>
            <h3 class="font-bold">Game Settings</h3>
            <p>
              You can choose the category, difficulty, and the number of questions you want to answer.
            </p>
            <h3 class="font-bold mt-4">Money</h3>
            <p>
              You can earn coins by answering the questions correctly. To earn a coin , You need respectively 8, 5 and 3 correct answers in easy, medium and hard categories.
            </p>
          </div>
          <!-- Column 2 -->
          <div>
            <h3 class="font-bold mt-4">Hint</h3>
            <p>
              You can use 1 coin to grey out a wrong answer. Except for true/false, were it cost 3 because using it allows you to get the right answer.
            </p>
            <h3 class="font-bold">Login</h3>
            <p>
              To access statistics and save coins, you need to log in. .
            </p>
          </div>
        </div>
        <button
          class="btn mt-4 bg-[#32cd32] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#2bb32b]"
          @click="closeRulesPopup"
        >
          Close
        </button>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Initialisation du routeur
  const router = useRouter();
  
  // Gestion de la pop-up
  const showRules = ref(false);
  
  const openRulesPopup = () => {
    showRules.value = true;
  };
  
  const closeRulesPopup = () => {
    showRules.value = false;
  };
  
  // Navigation
  const goToConnection = () => {
    router.push('/connection');
  };
  
  const goToSelection = () => {
    router.push('/selectionMenu');
  };
  </script>
  
  <style scoped>
  .btn {
    cursor: pointer;
    display: block; /* Met chaque bouton sur une ligne distincte */
    width: 200px; /* Largeur uniforme */
    margin: 0 auto; /* Centrer les boutons horizontalement */
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 255px 25px 225px 25px/25px 225px 25px 255px;
    margin-bottom: 25px;

  }
  
  /* Style pour la fenêtre pop up */
  .fixed {
    position: fixed;
  }
  
  .bg-opacity-50 {
    backdrop-filter: blur(5px); /* Ajoute un flou à l'arrière-plan pour pop up*/
  }
  </style>
  