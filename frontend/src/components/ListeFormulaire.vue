<template>
  <button
    @click="$emit('activate')"
    class="btn font-bold py-2 px-4 border"
    :class="{
      'text-white border-transparent': isActive,
      'hover:text-white hover:border-transparent': !isActive
    }"
    :style="{
      backgroundColor: isActive ? color : 'transparent',
      color: isActive ? 'white' : color,
      borderColor: color
    }"
  >
    <template v-if="isImage">
      <img src="/img/infini-rose.png" alt="Infini" class="img-infini" />
    </template>
    <template v-else>
      {{ txt }}
    </template>
  </button>
</template>

<script setup>
defineProps({
  txt: String,
  isImage: Boolean,
  isActive: Boolean,
  color: String
});

const emit = defineEmits(['activate']);
</script>

<style scoped>
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 50px;
  border-radius: 255px 25px 225px 25px/25px 225px 25px 255px;
  margin-bottom: 10px;
}
.img-infini {
  width: 30px;
  height: auto;
}
</style>
