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

    <!-- coeur sur vous -->
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
            <p class="ml-2" v-html="piecesIndice"></p>
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
                  'bg-green-500 border-green-500': correctAnswerIndex === index && afficherReponseBool,
                  'bg-red-500 border-red-500': mauvaiseReponseCliqueeIndex === index && afficherReponseBool,
                  'bg-[#B0B0B0] border-[#B0B0B0]': (afficherReponseBool && index !== correctAnswerIndex && index !== mauvaiseReponseCliqueeIndex) || reponsesRetireesIndex.includes(index),
                  'cursor-pointer transition-all hover:scale-110 hover:shadow-lg': !afficherReponseBool && !(reponsesRetireesIndex.includes(index)),
                  'bg-[#007bff] border-white': index === 0 && !afficherReponseBool && !(reponsesRetireesIndex.includes(index)),
                  'bg-[#ff1493] border-white': index === 1 && !afficherReponseBool && reponses.length == 4 && !(reponsesRetireesIndex.includes(index)),
                  'bg-[#ff6700] border-white': index === 2 && !afficherReponseBool && !(reponsesRetireesIndex.includes(index)),
                  'bg-[#32cd32] border-white': (index === 3 || (index === 1 && reponses.length == 2)) && !afficherReponseBool && !(reponsesRetireesIndex.includes(index)),
                }" :disabled="afficherReponseBool === true || reponsesRetireesIndex.includes(index)" v-html="reponse">
              </button>

            </li>
          </ul>
          <!-- Overlay derrière la popup -->
          <div v-if="affichagePopupIndice" class="fixed inset-0 bg-black opacity-50"></div>

          <!-- Popup indice -->
          <div :class="{
            'hidden': !affichagePopupIndice,
            'left-100': piecesIndice === 0 || piecesIndice < 3 && reponses.length == 2,
            'left-96': piecesIndice != 0
          }" class="fixed top-48 bg-white rounded-3xl p-4">

            <span class="absolute top-1.5 right-4 cursor-pointer text-gray-500 text-4xl"
              @click="masquerPopupIndice">&times;</span>

            <!-- Texte popup -->
            <p class="p-8 pb-4" :class="piecesIndice == 0 || reponses.length == 2 ? 'hidden' : 'block'">Do you want to
              spend a coin to delete a wrong answer?</p>
            <p class="p-8 pb-4" :class="piecesIndice < 3 || reponses.length == 4 ? 'hidden' : 'block'">Do you want to
              spend <b>3</b> coins to delete a wrong answer?</p>
            <p class="p-8 pb-12"
              :class="piecesIndice == 0 || piecesIndice < 3 && reponses.length == 2 ? 'bloc' : 'hidden'">Not enough
              money 😔 <br> Keep playing to buy a hint! 🎮 <br> (Hints for true/false questions cost 3 coins)</p>
            <!-- Boutons oui non -->
            <button @click="depenserIndice"
              :class="piecesIndice == 0 || piecesIndice < 3 && reponses.length == 2 ? 'hidden' : 'visible'"
              class="mb-8 mx-4 text-lg rounded-3xl shadow-md duration-200 ease-linear transform border-2e mt-2 mb-2 font-semibold w-24">Yes</button>
            <button @click="masquerPopupIndice"
              :class="piecesIndice == 0 || piecesIndice < 3 && reponses.length == 2 ? 'hidden' : 'visible'"
              class="mb-8 mx-4 text-lg rounded-3xl shadow-md duration-200 ease-linear transform border-2e mt-2 mb-2 font-semibold w-24">No</button>

          </div>

          <div class="grid grid-cols-2">
            <!-- Symbole indice -->
            <div @click="afficherPopupIndice" :class="{
              'hover:bg-blue-700 cursor-pointer transition-all hover:scale-110 hover:shadow-lg': !affichagePopupIndice,
              'invisible': !affichageBoutonIndice
            }" class=" flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
              <img src="/img/idee-ampoule.png" class="h-12" alt="Lightbulb" />
            </div>

            <!-- Bouton next -->
            <div class="flex justify-end">
              <button type="button" @click="questionSuivante"
                class="rounded-full h-11 w-32 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                :class="!afficherReponseBool ? 'invisible' : ''">
                Next <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="size-6 inline">
                  <path fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <!-- REMOVE -->
              <button 
        @click="startTest">
        TEST
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
import { ref, onMounted } from "vue";

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
    // Récupération du token depuis le localStorage (ou autre méthode que vous utilisez)
    const token = localStorage.getItem('token');

    // Vérifiez si un token existe
    if (!token) {
      console.log("Token non trouvé");
      isConnected.value = false;
      return;
    }

    // Appel API avec le token dans les headers
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-informations`, {
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token dans le header Authorization
      },
    });

    if (response.data && response.data.username) {
      isConnected.value = true;
      username.value = response.data.username;
      avatar.value = `/img/${response.data.avatar}` || "/img/default-avatar.png";
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

const question = ref(""); // Question en cours
const reponses = ref([]); // Reponses en cours
const piecesIndice = ref(3); //TODO : faire le lien avec le compte
let nombreBonneReponses = 0; // permet de calculer le gain des pièces indice

let questionsList; //Liste des questions chargées depuis l'API
let questionEnCours = 0; //Indice de la question en cours dans la liste

//Variables conditionnant l'affichage
let correctAnswerIndex; // l'index du bouton contenant la bonne reponse
const afficherReponseBool = ref(false);
const mauvaiseReponseCliqueeIndex = ref(null);
const affichagePopupIndice = ref(false);
const affichageBoutonIndice = ref(true);
const reponsesRetireesIndex = ref([]);
let selectedReponse = null;

const heartsRemaining = ref(3); //nombre de coeur au début de la partie

// Affiche les images de coeurs en fonction du nombre de vies restantes
const getHeartImage = (index) => {
  return index <= heartsRemaining.value ? '/img/full_heart.png' : '/img/transparent_empty_heart.png';
};

// Chargement des questions depuis l'API au chargement de la page
onMounted(async () => {
  const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId + '&difficulty=' + difficulteChoisie);
  questionsList = responseAPI.data.results;
  majQuestion();
})

// Affichage des bonnes et mauvaises réponses lorsqu'une réponse est choisie
const afficherReponse = (_selectedReponse, index) => {
  selectedReponse = _selectedReponse;
  if (questionsList[questionEnCours].correct_answer != selectedReponse) {
    mauvaiseReponseCliqueeIndex.value = index;
    heartsRemaining.value -= 1;
  }
  afficherReponseBool.value = true;
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
const depenserIndice = () => {
  affichagePopupIndice.value = false;
  if (reponses.value.length == 2) {
    piecesIndice.value -= 3;
  } else {
    piecesIndice.value -= 1;
  }
  //tirage au sort d'une mauvaise reponse à retirer
  let tirage = Math.floor(Math.random() * (reponses.value.length));
  while (tirage == correctAnswerIndex || reponsesRetireesIndex.value.includes(tirage)) {
    tirage = Math.floor(Math.random() * (reponses.value.length));
  }
  reponsesRetireesIndex.value.push(tirage);
  if (reponses.value.length == reponsesRetireesIndex.value.length + 1) {
    affichageBoutonIndice.value = false;
  }
}

// Passage à la question suivante après visualisation des réponses
const questionSuivante = () => {
  affichageBoutonIndice.value = true;
  //incrementation nb bonnes reponses
  if (questionsList[questionEnCours].correct_answer == selectedReponse && reponsesRetireesIndex.value.length == 0) {
    nombreBonneReponses += 1;
    switch (difficulteChoisie) {
      case "easy":
        if (nombreBonneReponses % 8 == 0) {
          piecesIndice.value += 1;
        }
        break;
      case "medium":
        if (nombreBonneReponses % 5 == 0) {
          piecesIndice.value += 1;
        }
        break;
      case "hard":
        if (nombreBonneReponses % 3 == 0) {
          piecesIndice.value += 1;
        }
        break;
    }
  }
  selectedReponse = null;
  afficherReponseBool.value = false;
  reponsesRetireesIndex.value = [];
  mauvaiseReponseCliqueeIndex.value = null;
  if (questionEnCours < nbQuestionsQuizz - 1) {
    questionEnCours += 1;
    if (questionsList.length == questionEnCours) {
      //on efface en attendant le chargement
      question.value = null;
      reponses.value = null;
      //on charge les 10 questions suivantes
      getQuestions();
    } else {
      majQuestion();
    }

  } else {
    question.value = "FINIIIIIIIIIIIIII";
    reponses.value = "";
  }

}

// Chargement de nouvelles questions lorsque le "stock" est épuisé
const getQuestions = async () => {
  const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId + '&difficulty=' + difficulteChoisie);

  // Ajout des questions à la liste
  questionsList = questionsList.concat(responseAPI.data.results);

  // Mise à jour de l'affichage
  majQuestion();
}

// Changement de la question en cours
function majQuestion() {
  question.value = questionsList[questionEnCours].question;

  const incorrectAnswers = questionsList[questionEnCours].incorrect_answers;
  const correctAnswer = questionsList[questionEnCours].correct_answer;

  reponses.value = incorrectAnswers;
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

  reponses.value.splice(correctAnswerIndex, 0, correctAnswer);
  console.log(correctAnswer); //TODO : penser a enlever
}

const startTest = () => {
    router.push('/test');

}



</script>

<style scoped>
h1 {
  text-shadow: 5px 6px 15px rgba(0, 0, 0, 0.3);
}
</style>