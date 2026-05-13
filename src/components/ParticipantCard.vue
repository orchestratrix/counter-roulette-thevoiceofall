<template>
  <div 
    class="participant-card" 
    :class="{ 
      'pulse-green': pulseGreen, 
      'shake-red': shakeRed 
    }"
    ref="cardRef"
  >
    <div class="card-content">
      <div class="top-section">
        <div class="age-number">{{ participant.age }}</div>
        <div class="flag">🇨🇴</div>
      </div>
      
      <div class="photo-section">
        <img :src="participant.avatar" :alt="`${participant.name} ${participant.lastName}`" />
      </div>
      
      <div class="info-section">
        <div class="name">{{ participant.name }} {{ participant.lastName }}</div>
        <div class="details">{{ participant.age }} años · {{ participant.city }}</div>
      </div>
      
      <div class="footer-section">
        {{ participant.city }} · {{ participant.region }}
      </div>
      
      <div class="score-section">
        <div class="total-score">
          <transition name="score" mode="out-in">
            <span :key="totalPoints" class="score-number">{{ animatedTotalPoints.currentValue }}</span>
          </transition>
        </div>
        <div class="sub-scores">
          <span class="correct">✓ {{ participant.correctAnswers }}</span>
          <span class="wrong">✗ {{ participant.wrongAnswers }}</span>
          <span class="oral" v-if="participant.oralRating">
            ⭐ {{ participant.oralRating }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="controls-section" v-if="showControls">
      <ParticipantControls :participant-id="participantId" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useParticipantsStore } from '../store/participants'
import ParticipantControls from './ParticipantControls.vue'
import { useAnimatedNumber } from '../composables/useAnimatedNumber'

export default {
  name: 'ParticipantCard',
  components: {
    ParticipantControls
  },
  props: {
    participantId: {
      type: String,
      required: true
    },
    showControls: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useParticipantsStore()
    const pulseGreen = ref(false)
    const shakeRed = ref(false)
    const cardRef = ref(null)
    
    const participant = computed(() => store.byId(props.participantId))
    const totalPoints = computed(() => store.totalPoints(props.participantId))
    const animatedTotalPoints = useAnimatedNumber(totalPoints)
    
    // Animation handlers
    const triggerPulseGreen = () => {
      pulseGreen.value = true
      setTimeout(() => {
        pulseGreen.value = false
      }, 300)
    }
    
    const triggerShakeRed = () => {
      shakeRed.value = true
      setTimeout(() => {
        shakeRed.value = false
      }, 400)
    }
    
    // Watch for changes to trigger animations
    const previousCorrect = ref(participant.value?.correctAnswers || 0)
    const previousWrong = ref(participant.value?.wrongAnswers || 0)
    
    const unwatchCorrect = store.$subscribe((mutation, state) => {
      const currentParticipant = state.participants.find(p => p.id === props.participantId)
      if (currentParticipant && currentParticipant.correctAnswers > previousCorrect.value) {
        triggerPulseGreen()
      }
      previousCorrect.value = currentParticipant?.correctAnswers || 0
    })
    
    const unwatchWrong = store.$subscribe((mutation, state) => {
      const currentParticipant = state.participants.find(p => p.id === props.participantId)
      if (currentParticipant && currentParticipant.wrongAnswers > previousWrong.value) {
        triggerShakeRed()
      }
      previousWrong.value = currentParticipant?.wrongAnswers || 0
    })
    
    // Clean up watchers
    onUnmounted(() => {
      unwatchCorrect()
      unwatchWrong()
    })
    
    return {
      participant,
      totalPoints,
      animatedTotalPoints,
      pulseGreen,
      shakeRed,
      cardRef
    }
  }
}
</script>

<style lang="sass">
@import '../quasar-variables.sass'

.participant-card
  position: relative
  background-color: $card-bg
  border-radius: 8px
  overflow: hidden
  min-width: 280px
  width: 100%
  max-width: 380px
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
  display: flex
  transition: transform 0.3s ease
  
  &.pulse-green
    animation: pulseGreen 0.3s ease
  
  &.shake-red
    animation: shakeRed 0.4s ease
  
  .card-content
    flex: 1
    display: flex
    flex-direction: column
  
  .top-section
    display: flex
    justify-content: space-between
    padding: 12px
    
    .age-number
      font-size: 3rem
      font-weight: bold
      color: rgba(0, 0, 0, 0.1)
      
    .flag
      font-size: 1.5rem
  
  .photo-section
    display: flex
    justify-content: center
    padding: 0 12px
    
    img
      width: 100%
      max-width: 200px
      height: 250px
      object-fit: cover
      border-radius: 4px
  
  .info-section
    background-color: $dark
    color: white
    padding: 12px
    text-align: center
    
    .name
      font-weight: bold
      text-transform: uppercase
      margin-bottom: 4px
    
    .details
      font-size: 0.9rem
      opacity: 0.8
  
  .footer-section
    padding: 8px 12px
    text-align: center
    font-size: 0.8rem
    color: rgba(0, 0, 0, 0.6)
  
  .score-section
    padding: 12px
    text-align: center
    
    .total-score
      .score-number
        font-size: 2.5rem
        font-weight: bold
        color: $primary
    
    .sub-scores
      display: flex
      justify-content: center
      gap: 12px
      margin-top: 8px
      font-size: 0.9rem
      
      .correct
        color: green
      
      .wrong
        color: red
      
      .oral
        color: #FFD700
  
  .controls-section
    width: 80px
    border-left: 1px solid rgba(0, 0, 0, 0.1)

@keyframes pulseGreen
  0%
    transform: scale(1)
  50%
    transform: scale(1.05)
  100%
    transform: scale(1)

@keyframes shakeRed
  0%, 100%
    transform: translateX(0)
  25%
    transform: translateX(-10px)
  75%
    transform: translateX(10px)

// Transitions
.score-enter-active, .score-leave-active
  transition: all 0.5s ease

.score-enter-from
  opacity: 0
  transform: scale(1.2)

.score-leave-to
  opacity: 0
  transform: scale(0.8)
</style>