<template>
  <div class="text">BLA blabla</div>
  <div class="w-36">
    <div class="grid grid-cols-3">
    <img
      class="h-12"
      src="./media/img/heart.png "
      alt="Heart representing first life" />
      <img
      class="h-12"
      src="./media/img/heart.png "
      alt="Heart representing second life" />
      <img
      class="h-12"
      src="./media/img/heart.png "
      alt="Heart representing third life" />
    <p>Ceci est un test</p>
  </div>
  </div>
  
</template>

<script setup>
import axios from 'axios';
  const category = "music"
  axios.get('https://the-trivia-api.com/v2/questions')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error fetching trivia questions:', error);
  });

</script>

<style scoped>
.hearts {
  max-width: 2%;
}

.text {
  font-family: 'Caveat', cursive;

}

</style>
