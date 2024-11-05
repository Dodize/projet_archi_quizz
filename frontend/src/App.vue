<template>
  <div id="app" class="content p-4 min-h-screen text-xl text-customBlue-300">
    <router-view />
  </div>
</template>

<script setup>
// Aucune logique spécifique ici
</script>

<style>
.content {
  /* construction du theme du background */
  background:
    linear-gradient(135deg, #89CFF0, #9B59B6),
    linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: cover, 30px 30px, 30px 30px;
    background-blend-mode: overlay;
}
</style>
