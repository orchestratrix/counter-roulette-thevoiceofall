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
        <div class="card-number">{{ participant.id }}</div>
        <div class="flag">🇨🇴</div>
      </div>
      
      <div class="photo-section">
        <img :src="participant.photo" :alt="participant.name" />
      </div>
      
      <div class="info-section">
        <div class="name">{{ participant.name }}</div>
        <div class="details">{{ participant.age }} años · {{ participant.institution }}</div>
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
          <span class="correct">✓ {{ participant.scores.correctAnswers }}</span>
          <span class="wrong">✗ {{ participant.scores.wrongAnswers }}</span>
          <span class="oral" v-if="participant.scores.oralRating">
            ⭐ {{ participant.scores.oralRating }}
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
import { ref, computed, onUnmounted } from 'vue'
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
    
    const triggerPulseGreen = () => {
      pulseGreen.value = true
      setTimeout(() => { pulseGreen.value = false }, 300)
    }
    
    const triggerShakeRed = () => {
      shakeRed.value = true
      setTimeout(() => { shakeRed.value = false }, 400)
    }
    
    const previousCorrect = ref(participant.value?.scores?.correctAnswers || 0)
    const previousWrong = ref(participant.value?.scores?.wrongAnswers || 0)
    
    const unsubscribe = store.$subscribe((mutation, state) => {
      const current = state.participants.find(p => p.id === props.participantId)
      if (!current) return
      
      if (current.scores.correctAnswers > previousCorrect.value) {
        triggerPulseGreen()
      }
      if (current.scores.wrongAnswers > previousWrong.value) {
        triggerShakeRed()
      }
      
      previousCorrect.value = current.scores.correctAnswers
      previousWrong.value = current.scores.wrongAnswers
    })
    
    onUnmounted(() => {
      unsubscribe()
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
    align-items: center
    padding: 12px
    
    .card-number
      font-size: 3rem
      font-weight: bold
      color: rgba(10, 31, 77, 0.25)
      line-height: 1
      
    .flag
      font-size: 1.8rem
  
  .photo-section
    display: flex
    justify-content: center
    padding: 0 12px
    
    img
      width: 100%
      max-width: 220px
      height: 260px
      object-fit: cover
      border-radius: 4px
      background-color: rgba(10, 31, 77, 0.1)
  
  .info-section
    background-color: $dark
    color: white
    padding: 12px
    text-align: center
    margin-top: 8px
    
    .name
      font-weight: bold
      text-transform: uppercase
      margin-bottom: 4px
      font-size: 1rem
    
    .details
      font-size: 0.8rem
      opacity: 0.85
      line-height: 1.3
  
  .footer-section
    padding: 8px 12px
    text-align: center
    font-size: 0.8rem
    color: rgba(10, 31, 77, 0.7)
    font-weight: 500
  
  .score-section
    padding: 12px
    text-align: center
    border-top: 1px solid rgba(10, 31, 77, 0.15)
    
    .total-score
      .score-number
        font-size: 2.8rem
        font-weight: bold
        color: $primary
        line-height: 1
    
    .sub-scores
      display: flex
      justify-content: center
      gap: 14px
      margin-top: 10px
      font-size: 0.95rem
      font-weight: 600
      
      .correct
        color: $positive
      
      .wrong
        color: $negative
      
      .oral
        color: $secondary
  
  .controls-section
    width: 90px
    border-left: 1px solid rgba(10, 31, 77, 0.15)
    display: flex
    align-items: center

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

.score-enter-active, .score-leave-active
  transition: all 0.5s ease

.score-enter-from
  opacity: 0
  transform: scale(1.2)

.score-leave-to
  opacity: 0
  transform: scale(0.8)
</style>