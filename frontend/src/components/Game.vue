<template>
    <div>
      <h2>Bienvenue dans le jeu !</h2>
      <p>Catégorie : {{ category }}</p>
      <p>Difficulté : {{ difficulty }}</p>
      <p>Nombre de questions : {{ nbQuestions }}</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    category: String,
    difficulty: String,
    nbQuestions: [String, Number],
  });
  </script>
  