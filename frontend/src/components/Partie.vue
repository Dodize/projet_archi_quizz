<template>
  <div class="relative">

    <!-- Avatar + username ou "Login" selon si connecté -->
    <div
      @click="ouvrirCompte"
      class="cursor-pointer transition-all hover:scale-110 hover:shadow-lg absolute top-3 right-4 flex items-center bg-boxGrey w-36 border-amber-500 rounded-lg p-2 space-x-2"
    >
      <img :src="isConnected ? avatar : '/img/default-avatar.png'" alt="Icône utilisateur" class="h-10 w-10 rounded-full" />
      <p class="text-sm font-semibold text-gray-700">
        {{ isConnected ? username : "Log in" }}
      </p>
    </div>

    <div class="grid grid-cols-[1fr_5fr]">
      <!-- Affichage des coeurs -->
      <div class="w-36 ml-2.5">
        <div class="grid grid-cols-3">
          <img v-for="(index) in 3" :key="index" :src="getHeartImage(index)" class="h-12" alt="Heart" />
        </div>
        <!-- Affichage des pièces-indices -->
        <div class="flex items-center  bg-transparentRed w-36 border-amber-500 rounded-lg m-5 ml-0">
          <img src="/img/piece-de-monnaie.png" class="h-12" alt="Coin" />
          <div class="flex justify-center w-full">
            <p class="ml-2" v-html="store.piecesIndice"></p>
          </div>
        </div>
      </div>

      <!-- Contenu "quizz box" -->
      <div class="flex">
        <div class="overflow-y-auto mt-2.5 bg-boxGrey p-7 pb-4 rounded-2xl w-4/5 text-center shadow-2xl h-128">
          <h1 class="text-center mb-6 mt-0 text-5xl font-extrabold">{{ store.categoryName }}</h1>
          <p v-html="question" class="text-center mb-2"></p>

          <!-- Reponses -->
          <ul class="">
            <li v-for="(reponse, index) in reponses" :key="index" class="flex justify-center">
              <button type="button" @click="afficherReponse(reponse, index)"
                class="px-6 py-3 text-lg rounded-3xl shadow-md duration-200 ease-linear transform border-2e mt-2 mb-2 text-white font-semibold w-72"
                :class="{
                  'bg-green-500 border-green-500': correctAnswerIndex === index && store.afficherReponseBool,
                  'bg-red-500 border-red-500': store.mauvaiseReponseCliqueeIndex === index && store.afficherReponseBool,
                  'bg-[#B0B0B0] border-[#B0B0B0]': (store.afficherReponseBool && index !== correctAnswerIndex && index !== store.mauvaiseReponseCliqueeIndex) || store.reponsesRetireesIndex.includes(index),
                  'cursor-pointer transition-all hover:scale-110 hover:shadow-lg': !store.afficherReponseBool && !(store.reponsesRetireesIndex.includes(index)),
                  'bg-[#007bff] border-white': index === 0 && !store.afficherReponseBool && !(store.reponsesRetireesIndex.includes(index)),
                  'bg-[#ff1493] border-white': index === 1 && !store.afficherReponseBool && reponses.length == 4 && !(store.reponsesRetireesIndex.includes(index)),
                  'bg-[#ff6700] border-white': index === 2 && !store.afficherReponseBool && !(store.reponsesRetireesIndex.includes(index)),
                  'bg-[#32cd32] border-white': (index === 3 || (index === 1 && reponses.length == 2)) && !store.afficherReponseBool && !(store.reponsesRetireesIndex.includes(index)),
                }" :disabled="store.afficherReponseBool === true || store.reponsesRetireesIndex.includes(index)" v-html="reponse">
              </button>

            </li>
          </ul>
          <!-- Overlay derrière la popup -->
          <div v-if="affichagePopupIndice" class="fixed inset-0 bg-black opacity-50"></div>

          <!-- Popup indice -->
          <div :class="{
            'hidden': !affichagePopupIndice,
            'left-100': store.piecesIndice === 0 || store.piecesIndice < 3 && reponses.length == 2,
            'left-96': store.piecesIndice != 0
          }" class="fixed top-48 bg-white rounded-3xl p-4">

            <span class="absolute top-1.5 right-4 cursor-pointer text-gray-500 text-4xl"
              @click="masquerPopupIndice">&times;</span>

            <!-- Texte popup -->
            <p class="p-8 pb-4" :class="store.piecesIndice == 0 || reponses.length == 2 ? 'hidden' : 'block'">Do you want to
              spend a coin to delete a wrong answer?</p>
            <p class="p-8 pb-4" :class="store.piecesIndice < 3 || reponses.length == 4 ? 'hidden' : 'block'">Do you want to
              spend <b>3</b> coins to delete a wrong answer?</p>
            <p class="p-8 pb-12"
              :class="store.piecesIndice == 0 || store.piecesIndice < 3 && reponses.length == 2 ? 'bloc' : 'hidden'">Not enough
              money 😔 <br> Keep playing to buy a hint! 🎮 <br> (Hints for true/false questions cost 3 coins)</p>
            <!-- Boutons oui non -->
            <button @click="depenserIndice"
              :class="store.piecesIndice == 0 || store.piecesIndice < 3 && reponses.length == 2 ? 'hidden' : 'visible'"
              class="mb-8 mx-4 text-lg rounded-3xl shadow-md duration-200 ease-linear transform border-2e mt-2 mb-2 font-semibold w-24">Yes</button>
            <button @click="masquerPopupIndice"
              :class="store.piecesIndice == 0 || store.piecesIndice < 3 && reponses.length == 2 ? 'hidden' : 'visible'"
              class="mb-8 mx-4 text-lg rounded-3xl shadow-md duration-200 ease-linear transform border-2e mt-2 mb-2 font-semibold w-24">No</button>

          </div>

          <div class="grid grid-cols-2">
            <!-- Symbole indice -->
            <div @click="afficherPopupIndice" :class="{
              'hover:bg-blue-700 cursor-pointer transition-all hover:scale-110 hover:shadow-lg': !affichagePopupIndice,
              'invisible': !affichageBoutonIndice || store.afficherReponseBool
            }" class=" flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
              <img src="/img/idee-ampoule.png" class="h-12" alt="Lightbulb" />
            </div>

            <!-- Bouton next -->
            <div class="flex justify-end">
              <button type="button" @click="questionSuivante"
                class="rounded-full h-11 w-32 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                :class="!store.afficherReponseBool ? 'invisible' : ''">
                Next <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="size-6 inline">
                  <path fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script async setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from "vue"
import { store } from './store.js';

// Variables globales
const router = useRouter();

// État utilisateur
const isConnected = ref(false);
const username = ref("");
const avatar = ref("");

// Fonction pour charger les informations utilisateur
const fetchUserInfo = async () => {
  try {
    // Récupération du token
    const token = localStorage.getItem('token');

    if (!token) {
      console.log("Token non trouvé");
      isConnected.value = false;
      return;
    }

    // Appel à l'api pour récupérer les infos de l'utilisateur
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-informations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.username) {
      isConnected.value = true;
      username.value = response.data.username;
      avatar.value = `/img/${response.data.avatar}` || "/img/default-avatar.png";
      store.piecesIndice = response.data.argent;
    } else {
      isConnected.value = false;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des informations utilisateur :", error);
    isConnected.value = false;
  }
};

// Fonction pour ouvrir la page de compte ou de connexion
const ouvrirCompte = () => {
  if (isConnected.value) {
    router.push("/account"); // Rediriger vers le compte utilisateur
  } else {
    router.push("/connection"); // Rediriger vers la page de connexion
  }
};

// Charger les informations utilisateur au montage
onMounted(fetchUserInfo);

const props = defineProps({
  categoryId: String,
  categoryName: String,
  difficulty: String,
  nbQuestions: [String, Number],
});

//Parametres de la partie
const categorieId = store.categoryId;
const difficulteChoisie = store.difficulty;
const nbQuestionsQuizz = store.nbQuestions;
const nbQuestionsParAPI = 10; //nombre de tirages de questions a chaque appel API

const reponses = ref([]); // Reponses en cours
let question = "";

//Variables conditionnant l'affichage
let correctAnswerIndex; // l'index du bouton contenant la bonne reponse
const affichagePopupIndice = ref(false);
const affichageBoutonIndice = ref(true);
let selectedReponse = null;

// Affiche les images de coeurs en fonction du nombre de vies restantes
const getHeartImage = (index) => {
  return index <= store.heartsRemaining ? '/img/full_heart.png' : '/img/transparent_empty_heart.png';
};

// Chargement des questions depuis l'API au chargement de la page
onMounted(async () => {
  if (store.questionsList.length === 0) {
    // Charger les questions uniquement si la liste est vide
    const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId + '&difficulty=' + difficulteChoisie);
    store.questionsList = responseAPI.data.results;
  }
  majQuestion();
})

// Affichage des bonnes et mauvaises réponses lorsqu'une réponse est choisie
const afficherReponse = (_selectedReponse, index) => {
  selectedReponse = _selectedReponse;
  if (store.questionsList[store.questionEnCours].correct_answer != selectedReponse) {
    store.mauvaiseReponseCliqueeIndex = index;
    store.heartsRemaining -= 1;
  }
  store.afficherReponseBool = true;
}

// Affichage de la popup pour l'utilisation des indices
const afficherPopupIndice = () => {
  affichagePopupIndice.value = true;
}

// Fermeture de la popup pour l'utilisation des indices
const masquerPopupIndice = () => {
  affichagePopupIndice.value = false;
}

// Depense d'un indice (affecte le nombre de pièces et l'affichage des réponses)
const depenserIndice = async() => {
  affichagePopupIndice.value = false;
  if (reponses.value.length == 2) {
    store.piecesIndice -= 3;
  } else {
    store.piecesIndice -= 1;
  }
  //tirage au sort d'une mauvaise reponse à retirer
  let tirage = Math.floor(Math.random() * (reponses.value.length));
  while (tirage == correctAnswerIndex || store.reponsesRetireesIndex.includes(tirage)) {
    tirage = Math.floor(Math.random() * (reponses.value.length));
  }
  store.reponsesRetireesIndex.push(tirage);
  if (reponses.value.length == store.reponsesRetireesIndex.length + 1) {
    affichageBoutonIndice.value = false;
  }
  store.nbIndicesDepenses += 1;

  // Mise à jour en base de données de manière asynchrone
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/update-indices`, {
      indices: store.piecesIndice,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des indices :", error);
  }
}

//**Watcher** pour surveiller heartsRemaining et rediriger si la valeur atteint 0
watch(
  () => store.heartsRemaining, // Getter à cause de l'usage du store
  (newVal) => {
    if (newVal <= 0) {
      store.gameOverReason = 'hearts';
      store.nbQuestionsRight = nbQuestionsQuizz;
      enregistrerPartie();
      router.push('/GameOver');     
    }
  }
);

function enregistrerPartie() {
  const token = localStorage.getItem("token");
      if (!token) {
        console.log("Mode non connecté");
        isConnected.value = false;
        return;
      }
  axios.post(
      `${import.meta.env.VITE_API_URL}/partie`,
      {
        nbQuestions: nbQuestionsQuizz == Infinity ? -1 : nbQuestionsQuizz,
        nbBonnesReponses: store.nombreBonneReponses,
        nbIndices: store.nbIndicesDepenses,
        categorie: store.categoryName
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
}

// Passage à la question suivante après visualisation des réponses
const questionSuivante = async() => {
  affichageBoutonIndice.value = true;
  //incrementation nb bonnes reponses
  if (store.questionsList[store.questionEnCours].correct_answer == selectedReponse && store.reponsesRetireesIndex.length == 0) {
    store.nombreBonneReponses += 1;
    let nbIndicesmodifie = false;
    switch (difficulteChoisie) {
      case "easy":
        if (store.nombreBonneReponses % 8 == 0) {
          store.piecesIndice += 1;
          nbIndicesmodifie = true;
        }
        break;
      case "medium":
        if (store.nombreBonneReponses % 5 == 0) {
          store.piecesIndice += 1;
          nbIndicesmodifie = true;
        }
        break;
      case "hard":
        if (store.nombreBonneReponses % 3 == 0) {
          store.piecesIndice += 1;
          nbIndicesmodifie = true;
        }
        break;
    }

    if (nbIndicesmodifie) {
      // Mise à jour en base de données de manière asynchrone
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/update-indices`, {
          indices: store.piecesIndice,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour des indices :", error);
      }
    }
  }
  selectedReponse = null;
  store.afficherReponseBool = false;
  store.reponsesRetireesIndex = [];
  store.mauvaiseReponseCliqueeIndex = null;
  if (store.questionEnCours < nbQuestionsQuizz - 1) {
    store.questionEnCours += 1;
    if (store.questionsList.length == store.questionEnCours) {
      //on charge les 10 questions suivantes
      await getQuestions();
    } else {
      majQuestion();
    }

  } else {
      store.gameOverReason = 'questions';
      store.nbQuestionsRight = nbQuestionsQuizz;
      enregistrerPartie();
      router.push('/GameOver');
      
  }
}

// Chargement de nouvelles questions lorsque le "stock" est épuisé
const getQuestions = async () => {
  const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId + '&difficulty=' + difficulteChoisie);

  // Ajout des questions à la liste
  store.questionsList = store.questionsList.concat(responseAPI.data.results);

  // Mise à jour de l'affichage
  majQuestion();
}

// Changement de la question en cours
function majQuestion() {
  question = store.questionsList[store.questionEnCours].question;

  const incorrectAnswers = store.questionsList[store.questionEnCours].incorrect_answers.slice();
  const correctAnswer = store.questionsList[store.questionEnCours].correct_answer;

  //Tirer au sort le placement de la question correcte
  if (correctAnswer == "True") {
    //on place true en premiere position
    correctAnswerIndex = 0;
  } else if (correctAnswer == "False") {
    //on place false en deuxieme position
    correctAnswerIndex = 1;
  } else {
    //placement aléatoire
    correctAnswerIndex = Math.floor(Math.random() * (incorrectAnswers.length + 1));
  }

  reponses.value = incorrectAnswers;
  reponses.value.splice(correctAnswerIndex, 0, correctAnswer);
  console.log(correctAnswer); //TODO : penser a enlever
}

</script>

<style scoped>
h1 {
  text-shadow: 5px 6px 15px rgba(0, 0, 0, 0.3);
}
</style>