import { reactive } from 'vue';

export const store = reactive({
  categoryId: '', //id de la catégorie des questions
  categoryName: '', // Nom de la catégorie des questions
  difficulty: '', // Difficulté des questions
  nbQuestions: 0, // Nombre de questions par quizz
});
