<template>
  <div class="relative">

    <!-- Avatar + username ou "Login" selon si connecté -->
    <div @click="ouvrirCompte"
          class="cursor-pointer transition-all hover:scale-110 hover:shadow-lg absolute top-3 right-4 flex items-center bg-boxGrey w-36 border-amber-500 rounded-lg p-2 space-x-2">
      <img 
        src="/img/panda.png" 
        alt="Icône" 
        class="h-10 w-10"/>
      <p class="text-sm font-semibold text-gray-700">Username</p>
    </div>

<!-- coeur sur vous -->
  <div class="grid grid-cols-[1fr_5fr]">
    <!-- Affichage des coeurs -->
    <div class="w-36 ml-2.5">
      <div class="grid grid-cols-3">
        <img v-for="(index) in 3" :key="index" :src="getHeartImage(index)" class="h-12" alt="Heart" />
      </div>
      <div class="test flex items-center  bg-boxGrey w-36 border-amber-500 rounded-lg m-5 ml-0">
        <img src="/img/piece-de-monnaie.png" class="h-12" alt="Coin" /> 
        <div class="flex justify-center w-full">
          <p class="ml-2">0</p>
        </div>
        
    </div>
    </div>

    <!-- Contenu "quizz box" -->
    <div class="flex">
      <div class="overflow-y-auto mt-2.5 bg-boxGrey p-7 pb-4 rounded-2xl w-4/5 text-center shadow-2xl h-128">
        <h1 class="text-center mb-6 mt-0 text-5xl font-extrabold">{{ categorie }}</h1>
        <p v-html="question" class="text-center mb-2"></p>
        <ul class="">
          <li v-for="(reponse, index) in reponses" :key="index" class="flex justify-center">
            <button type="button" @click="afficherReponse(reponse, index)"
              class="px-6 py-3 text-lg rounded-3xl shadow-md duration-200 ease-linear transform border-2e mt-2 mb-2 text-white font-semibold w-72"
              :class="{
                'bg-green-500 border-green-500': correctAnswerIndex === index && afficherReponseBool,
                'bg-red-500 border-red-500': mauvaiseReponseCliqueeIndex === index && afficherReponseBool,
                'bg-[#B0B0B0] border-[#B0B0B0]': afficherReponseBool && index !== correctAnswerIndex && index !== mauvaiseReponseCliqueeIndex,
                'cursor-pointer transition-all hover:scale-110 hover:shadow-lg': !afficherReponseBool,
                'bg-[#007bff] border-white': index === 0 && !afficherReponseBool,
                'bg-[#ff1493] border-white': index === 1 && !afficherReponseBool && reponses.length == 4,
                'bg-[#ff6700] border-white': index === 2 && !afficherReponseBool,
                'bg-[#32cd32] border-white': (index === 3 || (index === 1 && reponses.length == 2)) && !afficherReponseBool,
              }" :disabled="afficherReponseBool === true" v-html="reponse">
            </button>

            <!-- check sign
  <svg :class="afficherReponseBool === false || afficherReponseBool && correctAnswerIndex !== index ? 'hidden' : '' " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg> -->

          </li>
        </ul>
        <!-- Bouton next -->
        <div class="flex justify-end">
          <button type="button" @click="questionSuivante"
            class="rounded-full w-32 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :class="!afficherReponseBool ? 'invisible' : ''">
            Next <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 inline">
              <path fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                clip-rule="evenodd" />
            </svg>
          </button>

        </div>

      </div>
    </div>
    <!-- ICI -->
  </div>
</div>
</template>

<script async setup>
import axios from 'axios';
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';

// Variables globales
const router = useRouter();

const props = defineProps({
  category: String,
  difficulty: String,
  nbQuestions: [String, Number],
});

//TODO : parametres a brancher avec Elodie
const categorieId = 17;
const nbQuestionsParAPI = 10; //nombre de tirages de questions a chaque appel API
const nbQuestionsQuizz = 15; //nombre de questions au total dans le quizz

const progressWidth = ref(50);

const question = ref("");
const reponses = ref([]);
const categorie = ref("Science") //TODO : dynamique !

let questionsList;
let questionEnCours = 0;

let correctAnswerIndex; // l'index du bouton contenant la bonne reponse
let afficherReponseBool = ref(false);
let mauvaiseReponseCliqueeIndex = ref(null);

const heartsRemaining = ref(3); //nombre de coeur au début de la partie

const getHeartImage = (index) => {
  console.log(heartsRemaining.value)
  return index <= heartsRemaining.value ? '/img/full_heart.png' : '/img/transparent_empty_heart.png';
};

// Action pour aller sur la page de connexion (pour l'instant
// TODO : connexion si pas connecté, infos du compte si connecté
const ouvrirCompte = () => {
  router.push('/connection');
};

onMounted(async () => {
  const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId);
  questionsList = responseAPI.data.results;

  majQuestion();
})

const afficherReponse = (selectedReponse, index) => {
  if (questionsList[questionEnCours].correct_answer != selectedReponse) {
    mauvaiseReponseCliqueeIndex.value = index;
    heartsRemaining.value -= 1;
  }
  afficherReponseBool.value = true;
}

const questionSuivante = () => {
  afficherReponseBool.value = false;
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

const getQuestions = async () => {
  const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId);

  // Ajout des questions à la liste
  questionsList = questionsList.concat(responseAPI.data.results);

  // Mise à jour de l'affichage
  majQuestion();
}

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



</script>

<style scoped>
h1 {
  text-shadow: 5px 6px 15px rgba(0, 0, 0, 0.3);
}



.test {
  background-color: rgb(255 237 197 / 61%)
}
</style>