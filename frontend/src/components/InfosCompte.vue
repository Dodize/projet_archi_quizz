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
          <!-- Partie compte -->
          <div class="flex flex-col items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-6 rounded-lg">
              
              <!-- Section pièces / username -->
              <div class="text-center mb-6">
                <h2 class="text-3xl font-bold mb-4 text-gray-800">Welcome, {{ username }}!</h2>
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
                    @click="selectionnerAvatar(icon)" :alt=icon
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
        </div>
        <div v-else-if="activeTab === 'stats'">
          <h2 class="text-3xl font-bold mb-4">Game Statistics</h2>
          <p class="text-base">Total Games Played: {{ nbParties }}</p>
          <p class="text-base" :class="recordModeInfini == 0 ? 'hidden' : 'block'">Record for infinite mode: {{ recordModeInfini }}</p>

          <!-- Chart -->
          <h3 class="text-2xl mt-5 text-center font-bold" :class="{'hidden': partiesJouees.length === 0}" v-html="graphTitle"></h3>
          <div class="flex  justify-center" id="chartLegendContainer">
            <div class="w-1/2">
              <canvas class="h-72" ref="quizChart"></canvas>
            </div>
          </div>
          <!-- Fleches pour parcourir les graphs -->
          <div class="flex justify-between mx-8">
            <button @click="changeGraph(-1)" :disabled="indexGraph == 0" :class="{'opacity-50': indexGraph === 0}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg></button>

            <button @click="changeGraph(1)" :disabled="indexGraph == 1" :class="{'opacity-50': indexGraph === 1}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg></button>
          </div>
          

          
        </div>
      </div>
    </div>
  </div>
</template>

<script async setup>
import axios from "axios";
import { ref, watch, nextTick, onMounted } from "vue";
import Chart from "chart.js/auto";
import { useRouter } from 'vue-router';

const activeTab = ref("account"); // Onglet actif par défaut

// PARTIE COMPTE
const isConnected = ref(false);
const username = ref("");
const avatarActuel = ref("");
const argent = ref(0);
let partiesJouees;

// PARTIE STATS DU COMPTE
const nbParties = ref(0);

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
      partiesJouees = response.data.partiesJouees;

      isConnected.value = true;
      username.value = fetchedUsername; // Stockage du nom d'utilisateur
      argent.value = fetchedArgent;     // Stockage du montant d'argent
      nbParties.value = response.data.partiesJouees.length

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


//PARTIE STATISTIQUES
const recordModeInfini = ref(0); // Nombre record pour le mode "infini"
let indexGraph = 0;
const graphTitle = ref("");

// Création du graphique -> catégories
const quizChart = ref(null);
let chartInstance = null; // Garde une instance du graphique pour éviter les doublons
const palette = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8DFF33", "#33FFBD",
  "#D633FF", "#FFD633", "#338FFF", "#33FF57", "#FF3366", "#8033FF", "#33FFFF",
]; //couleurs utilisés pour les graphiques

const changeGraph = async (increment) => {
  indexGraph += increment;
  console.log(indexGraph)
  await renderChart();
}

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

  switch (indexGraph) {
    case 0:
      createCategoriePie(ctx);
      break;
    case 1:
      createRecordBar(ctx);
      break;
  }

  
  
};

function createCategoriePie(ctx) {
  graphTitle.value = "Your most played categories"
  //Calcul des catégories
  const repartitionCategories = partiesJouees.reduce((acc, partie) => {
      const categorie = partie.categorie;
      acc[categorie] = (acc[categorie] || 0) + 1;
      return acc;
    }, {});
    const categories = Object.keys(repartitionCategories);
    const counts = Object.values(repartitionCategories);
    // Étendre la palette au nombre de catégories
    const extendedPalette = Array.from({ length: categories.length }, (_, i) => palette[i % palette.length]);

    //Créer un nouveau graphique
    chartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: categories,
        datasets: [
          {
            data: counts,
            backgroundColor: extendedPalette,
            hoverOffset: 4,
            borderWidth: 0
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
}

function createRecordBar(ctx) {
  graphTitle.value = "Record of correct answers by category"
  const recordsParCategorie = partiesJouees.reduce((acc, partie) => {
    const categorie = partie.categorie;
    acc[categorie] = Math.max(acc[categorie] || 0, partie.nbBonnesReponses);
    return acc;
  }, {});
  const categoriesRecord = Object.keys(recordsParCategorie);
  const records = Object.values(recordsParCategorie);
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categoriesRecord,
      datasets: [{
        label: 'Record de Bonnes Réponses',
        data: records, 
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false, // Masquer la légende
        },
      }
    },
  });
}

// Regarder les changements d'onglet et rendre le graphique
watch(activeTab, async (newTab) => {
  if (newTab === "stats") {
    await renderChart();
  }
  //Chargement des autres statistiques
  const partiesModeInfini = partiesJouees.filter(partie => partie.nbQuestions === -1);
  recordModeInfini.value = partiesModeInfini.reduce((max, partie) => {
    return partie.nbBonnesReponses > max ? partie.nbBonnesReponses : max;
  }, 0) + 3; //comme il y a trois vies, le record est la question "nbBonnesReponses + 3"
});

</script>


<style scoped>
</style>
