<template>
  <div class="semifinal-container">
    <div class="header">
      <h1>Semifinal Regional — {{ region }}</h1>
      <q-btn 
        label="Volver al inicio" 
        color="primary" 
        @click="goHome"
        class="back-button"
      />
    </div>
    
    <div class="participants-grid">
      <ParticipantCard 
        v-for="participant in participants" 
        :key="participant.id"
        :participant-id="participant.id"
        :show-controls="true"
        class="participant-card-item"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useParticipantsStore } from '../store/participants'
import { useRouter } from 'vue-router'
import ParticipantCard from '../components/ParticipantCard.vue'

export default {
  name: 'SemifinalView',
  components: {
    ParticipantCard
  },
  props: {
    region: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useParticipantsStore()
    const router = useRouter()
    
    const participants = computed(() => store.byRegion(props.region))
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      participants,
      goHome
    }
  }
}
</script>

<style lang="sass" scoped>
.semifinal-container
  padding: 20px
  
  .header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 20px
    
    h1
      margin: 0
      
    .back-button
      margin-left: 20px
  
  .participants-grid
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
    gap: 20px
    
    @media (min-width: 1366px)
      grid-template-columns: repeat(4, 1fr)
    
    @media (max-width: 1365px) and (min-width: 768px)
      grid-template-columns: repeat(2, 1fr)
    
    .participant-card-item
      margin: 0 auto
</style>