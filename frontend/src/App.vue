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
    <p>{{ question }}</p>
  </div>
  </div>
  
</template>

<script async setup>
  import axios from 'axios';
  import { ref, onMounted } from "vue"

  let question = ref("");

  onMounted(async () => {
    const response = await axios.get('https://the-trivia-api.com/v2/questions');
    question.value = response.data[0].question.text;
})


</script>

<style scoped>
.hearts {
  max-width: 2%;
}

.text {
  font-family: 'Caveat', cursive;

}

</style>


