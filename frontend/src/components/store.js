import { reactive } from 'vue';

export const store = reactive({
  categoryId: '0', //id de la catégorie des questions
  categoryName: 'General Knowledge', // Nom de la catégorie des questions
  difficulty: '', // Difficulté des questions
  nbQuestions: 0, // Nombre de questions par quizz
  gameOverReason: 'hearts', // raison de la perte de la partie
  piecesIndice: 0, // nombre de pièce possédé
  heartsRemaining: 3, //nombre de coeur en début de partie
  questionsList: [], // Stocke la liste des questions
  questionEnCours: 0, // Stocke l'indice de la question actuelle

  nombreBonneReponses: 0, // nombre de bonne réponse
  nbIndicesDepenses: 0, // nombre d'indices dépensés dans la partie
  reponsesRetireesIndex: [],
  afficherReponseBool: false,
  mauvaiseReponseCliqueeIndex: null,

});
