<template>
    <div class="flex justify-center">
      <!-- Conteneur principal -->
      <div class="flex mt-2.5 bg-boxGrey p-3 py-7 rounded-2xl w-4/6 shadow-2xl h-128 mx-4">
        <!-- Menu latéral -->
        <div class="w-1/4 h-full p-4 rounded-l-2xl">
          <ul class="space-y-4">
            <li>
              <button
                class="w-full text-left text-lg p-3 rounded-md hover:bg-gray-300 focus:outline-none"
                :class="{'bg-gray-300': activeTab === 'account'}"
                @click="activeTab = 'account'">
                Account
              </button>
            </li>
            <li>
              <button
                class="w-full text-left text-lg p-3 rounded-md hover:bg-gray-300 focus:outline-none"
                :class="{'bg-gray-300': activeTab === 'stats'}"
                @click="activeTab = 'stats'">
              Game Statistics
              </button>
            </li>
          </ul>
        </div>
  
        <!-- Contenu principal -->
        <div class="w-3/4 overflow-y-auto px-6">
          <div v-if="activeTab === 'account'">
            <h2 class="text-3xl font-bold mb-4">Account</h2>
            <p class="text-lg">Partie de Leila</p>
            <!-- Ajoutez ici les détails du compte -->
          </div>
          <div v-else-if="activeTab === 'stats'">
            <h2 class="text-3xl font-bold mb-4">Game Statistics</h2>
            <p class="text-lg">Total Games Played: {{ nbParties }}</p>
            <p class="text-lg">Number of coins: {{ nbCoins }}</p>

            <!-- Chart -->
            <div class="flex justify-center mt-10">
              <div class="w-1/2">
                <canvas ref="quizChart"></canvas>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script async setup>
  import { ref, onMounted, watch, nextTick } from "vue";
  import Chart from "chart.js/auto";
  
  const activeTab = ref("account"); // Onglet actif par défaut
  const nbParties = ref(3); // Exemple de données
  const nbCoins = ref(10); // Exemple de données
  
  // Données pour le graphique
  const categories = ref(["History", "Science", "Entertainment", "Sports", "Geography"]);
  const categoryData = ref([25, 35, 15, 10, 15]); // Nombre de parties par catégorie
  
  // Référence au canvas
  const quizChart = ref(null);
  let chartInstance = null; // Garde une instance du graphique pour éviter les doublons
  
  const renderChart = async () => {
    // Attendre que le DOM soit mis à jour avec nextTick
    await nextTick();
  
    if (!quizChart.value) {
      console.error("Canvas element not found!");
      return;
    }
  
    const ctx = quizChart.value.getContext("2d");
  
    // Détruire l'ancien graphique s'il existe (évite les doublons)
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    // Créer un nouveau graphique
    chartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: categories.value,
        datasets: [
          {
            data: categoryData.value,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Most Played Quiz Categories",
          },
        },
      },
    });
  };
  
  // Regarder les changements d'onglet et rendre le graphique
  watch(activeTab, async (newTab) => {
    if (newTab === "stats") {
      console.log("ici");
      await renderChart();
    }
  });
  
  onMounted(async () => {
    // Optionnel : Si "stats" est actif au montage, créer le graphique directement
    if (activeTab.value === "stats") {
      await renderChart();
    }
  });
  </script>
  
  
  <style scoped>
  /* Ajoutez du style personnalisé si nécessaire */
  </style>
  