<template>
  <div class="semifinal-container">
    <h1>Semifinal {{ region }}</h1>
    <p>Contenido de la semifinal de la región {{ region }} irá aquí.</p>
  </div>
</template>

<script setup>
defineProps({
  region: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.semifinal-container {
  padding: 20px;
}
</style>