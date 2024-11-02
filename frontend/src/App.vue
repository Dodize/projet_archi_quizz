<template>
  <!-- Boucle sur les catégories -->
  <h1 class="text-center mb-6 mt-0 text-2xl font-extrabold">Catégories</h1>
  <div v-if="categories.length" class="flex flex-wrap justify-center gap-4 text-center">
    <!-- Appel de ListeFormulaire pour chaque catégorie -->
    <ListeFormulaire
      v-for="(category, index) in categories" 
      :key="index"
      :txt="category.name"
      :isActive="activeCategory === index"
      @activate="activeCategory = index"
      color="#007bff"
    />
  </div>

  <div v-if="error">
    <p>Erreur sur les catégories: {{ error }}</p>
  </div>

  <!-- Boucle sur les difficultés -->
  <h1 class="text-center mb-6 mt-0 text-2xl font-extrabold">Difficultés</h1>
  <div v-if="difficulties.length" class="flex flex-wrap justify-center gap-4 text-center">
    <ListeFormulaire
      v-for="(difficulty, index) in difficulties" 
      :key="index"
      :txt="difficulty"
      :isActive="activeDifficulty === index"
      @activate="activeDifficulty = index"
      color="#ff1493"
    />
  </div>

  <div v-if="error">
    <p>Erreur sur les difficultés: {{ error }}</p>
  </div>

  <!-- Boucle sur les nombres de questions -->
  <h1 class="text-center mb-6 mt-0 text-2xl font-extrabold">Nombre de questions</h1>
  <div v-if="nbQuestions.length" class="flex flex-wrap justify-center gap-4 text-center">
    <ListeFormulaire
      v-for="(nbQ, index) in nbQuestions"
      :key="index"
      :txt="nbQ.toString()"
      :isActive="activeNbQuestions === index"
      @activate="activeNbQuestions = index"
      color="#ff6700"
    />
    <ListeFormulaire
      txt="infini"
      :isImage="true"
      :isActive="activeNbQuestions === 'infini'"
      @activate="activeNbQuestions = 'infini'"
      color="#ff6700"
    />
  </div>

  <div v-if="error">
    <p>Erreur sur le nombre de questions: {{ error }}</p>
  </div>

  <!-- Bouton pour lancer partie -->
  <div class="text-center mt-8">
    <button 
      @click="startGame"
      :disabled="!activeCategory || activeDifficulty === null || activeNbQuestions === null"
      class="bg-[#32cd32] text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Commencer la Partie
    </button>
  </div>

</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ListeFormulaire from './components/ListeFormulaire.vue';

// Variables de stockage des informations
const categories = ref([]);
const difficulties = ref(['easy', 'medium', 'hard']);
const nbQuestions = ref([10, 20, 50, 70]);

const error = ref(null);

// Variables pour suivre l'état actif des boutons
const activeCategory = ref(null);    // Garde la catégorie sélectionnée
const activeDifficulty = ref(null);  // Garde la difficulté sélectionnée
const activeNbQuestions = ref(null); // Garde le nombre de questions sélectionné

// Fonction pour charger les catégories
const fetchCategories = async () => {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    categories.value = response.data.trivia_categories; // Met à jour les catégories
  } catch (err) {
    error.value = 'Erreur lors de la récupération des catégories';
    console.error('Error fetching categories:', err);
  }
};

// Appel lors du montage du composant
onMounted(() => {
  fetchCategories();
});


// Fonction pour démarrer la partie avec les paramètres sélectionnés
const startGame = () => {
  if (activeCategory.value !== null && activeDifficulty.value !== null && activeNbQuestions.value !== null) {
    // Obtenez les valeurs des sélections
    const selectedCategory = categories.value[activeCategory.value];
    const selectedDifficulty = difficulties.value[activeDifficulty.value];
    const selectedNbQuestions = activeNbQuestions.value === 'infini' ? '∞' : nbQuestions.value[activeNbQuestions.value];

    // Affiche les valeurs sélectionnées (à remplacer par l'appel à une fonction de démarrage de partie)
    console.log("Démarrage de la partie avec les paramètres :");
    console.log("Catégorie :", selectedCategory);
    console.log("Difficulté :", selectedDifficulty);
    console.log("Nombre de questions :", selectedNbQuestions);

    // Appel d'une fonction pour lancer la partie, par exemple en passant les paramètres
    // launchGame(selectedCategory, selectedDifficulty, selectedNbQuestions);
  }
};

</script>

<style scoped>
h1 {
  text-shadow: 5px 6px 15px rgba(0, 0, 0, 0.3);
}
</style>
