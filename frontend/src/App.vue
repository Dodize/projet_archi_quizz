<template>
    <div class="w-36">
    <div class="grid grid-cols-3">
      <img class="h-12 max-w-16" src="./media/img/heart.png " alt="Heart representing first life" />
      <img class="h-12 max-w-16" src="./media/img/heart.png " alt="Heart representing second life" />
      <img class="h-12 max-w-16" src="./media/img/heart.png " alt="Heart representing third life" />

    </div>
  </div>
  <div class="flex justify-center">
  
  <div class="question_reponses w-128">
    <h1 class="text-center mb-4 mt-0">{{ categorie }}</h1>
    <p v-html="question" class="text-center mb-4"></p>
    <ul class="">
      <li v-for="(reponse, index) in reponses" :key="index" class="flex justify-center">
        <button type="button" 
  @click="afficherReponse(reponse, index)" 
  class="mt-2 mb-2 text-blue-700 font-semibold py-2 px-4 border border-2 rounded w-60"
  :class="(afficherReponseBool === true && correctAnswerIndex === index ? 
    'bg-green-500 text-white border-green-500' : 
    (mauvaiseReponseCliqueeIndex === index ? 
    'bg-red-500 text-white border-red-500' : 
    'bg-transparent border-blue-500' + (afficherReponseBool === false ? ' hover:bg-blue-500 hover:border-transparent hover:text-white' : '')
    ))"
  :disabled="afficherReponseBool === true" 
  v-html="reponse">
</button>



      </li>
      
    </ul>
    <div class="flex justify-end">
      <button type="button" @click="questionSuivante"
    class="rounded-full w-32 ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    :class="!afficherReponseBool? 'hidden' : ''">
    Next <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 inline">
  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clip-rule="evenodd" />
</svg>
</button>
    </div>
    
  </div>


  </div>
  
</template>

<script async setup>
import axios from 'axios';
import { ref, onMounted } from "vue"

//TODO : parametres a brancher avec Elodie
const categorieId = 17;
const nbQuestionsParAPI = 10; //nombre de tirages de questions a chaque appel API
const nbQuestionsQuizz = 15; //nombre de questions au total dans le quizz

let question = ref("");
const reponses = ref([]);
const categorie = ref("Science") //TODO : dynamique !

let questionsList;
let questionEnCours = 0;

let correctAnswerIndex; // l'index du bouton contenant la bonne reponse
let afficherReponseBool = ref(false);
let mauvaiseReponseCliqueeIndex = ref(null);

onMounted(async () => {
  const responseAPI = await axios.get('https://opentdb.com/api.php?amount=' + nbQuestionsParAPI + '&category=' + categorieId);
  questionsList = responseAPI.data.results;

  majQuestion();
})

const afficherReponse = (selectedReponse, index) => {
  if (questionsList[questionEnCours].correct_answer == selectedReponse) {
    console.log("YES")
  } else {
    mauvaiseReponseCliqueeIndex.value = index;
  }
  afficherReponseBool.value = true;
  console.log(correctAnswerIndex)
}

const questionSuivante = () => {
  afficherReponseBool.value = false;
  mauvaiseReponseCliqueeIndex.value = null;
  if (questionEnCours < nbQuestionsQuizz - 1) {
    questionEnCours += 1;
    if (questionsList.length == questionEnCours) {
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
  correctAnswerIndex = Math.floor(Math.random() * (incorrectAnswers.length + 1));
  reponses.value.splice(correctAnswerIndex, 0, correctAnswer);
  console.log(correctAnswer); //TODO : penser a enlever
}



</script>

<style scoped>
.hearts {
  max-width: 2%;
}

.text {
  font-family: 'Caveat', cursive;
}

h1 {
  font-family: "Cabin Sketch", cursive;
  font-size: 70px; /* Larger than "Navbars" */
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #333;
}



</style>
