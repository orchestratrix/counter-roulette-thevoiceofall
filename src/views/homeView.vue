<template>
  <div class="home-container">
    <div class="buttons-container">
      <q-btn 
        class="region-btn" 
        to="/semifinal-caribe" 
        label="Semifinal Caribe" 
        color="primary" 
        size="xl"
      />
      <q-btn 
        class="region-btn" 
        to="/semifinal-andina" 
        label="Semifinal Andina" 
        color="secondary" 
        size="xl"
      />
      <q-btn 
        class="region-btn" 
        to="/final" 
        label="Gran Final" 
        color="accent" 
        size="xl"
      />
    </div>
  </div>
</template>

<script setup>
// No logic needed for this view
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 400px;
}

.region-btn {
  height: 120px;
  font-size: 1.5rem;
}
</style>