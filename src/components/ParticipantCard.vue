<template>
  <div class="participant-card" :class="cardClasses">
    <div class="holo-overlay" v-if="isFinalist || isChampion" aria-hidden="true"></div>

    <div class="corner-stamp" v-if="isFinalist || isChampion">
      <q-icon :name="isChampion ? 'mdi-crown' : 'mdi-star-four-points'" />
      <span>{{ isChampion ? 'CAMPEÓN' : 'FINALISTA' }}</span>
    </div>

    <div class="card-content">
      <div class="top-section">
        <div class="card-number">{{ participant?.id }}</div>
        <div class="flag" aria-hidden="true">
          <span class="flag-stripe yellow"></span>
          <span class="flag-stripe blue"></span>
          <span class="flag-stripe red"></span>
        </div>
      </div>

      <div class="photo-section">
        <div class="photo-frame">
          <img :src="participant?.photo" :alt="participant?.name" @error="onImageError" />
        </div>
      </div>

      <div class="info-section">
        <div class="name">{{ participant?.name }}</div>
        <div class="details">
          <span class="age">{{ participant?.age }} años</span>
          <span class="dot">·</span>
          <span class="institution">{{ participant?.institution }}</span>
        </div>
      </div>

      <div class="footer-section">
        <q-icon name="mdi-map-marker" size="0.85rem" />
        <span>{{ participant?.city }} · {{ capitalizedRegion }}</span>
      </div>

      <div class="score-section">
        <div class="total-score">
          <span class="score-number">{{ animatedTotalPoints.currentValue }}</span>
          <span class="score-label">pts</span>
        </div>
        <div class="sub-scores">
          <span class="correct">
            <q-icon name="mdi-check-circle" />
            {{ participant?.scores.correctAnswers }}
          </span>
          <span class="wrong">
            <q-icon name="mdi-close-circle" />
            {{ participant?.scores.wrongAnswers }}
          </span>
          <span class="oral" v-if="participant?.scores.oralRating">
            <q-icon name="mdi-star" />
            {{ participant.scores.oralRating }}
          </span>
        </div>
      </div>
    </div>

    <div class="controls-section" v-if="showControls">
      <ParticipantControls :participant-id="participantId" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useParticipantsStore } from '../store/participants'
import { useAnimatedNumber } from '../composables/useAnimatedNumber'
import ParticipantControls from './ParticipantControls.vue'

const props = defineProps({
  participantId: { type: String, required: true },
  showControls: { type: Boolean, default: false },
  isFinalist: { type: Boolean, default: false },
  isChampion: { type: Boolean, default: false },
  isEliminated: { type: Boolean, default: false },
  isLeader: { type: Boolean, default: false }
})

const store = useParticipantsStore()
const pulseGreen = ref(false)
const shakeRed = ref(false)

const participant = computed(() => store.byId(props.participantId))
const totalPoints = computed(() => store.totalPoints(props.participantId))
const animatedTotalPoints = useAnimatedNumber(totalPoints)

const capitalizedRegion = computed(() => {
  const r = participant.value?.region || ''
  return r.charAt(0).toUpperCase() + r.slice(1)
})

const cardClasses = computed(() => ({
  'pulse-green': pulseGreen.value,
  'shake-red': shakeRed.value,
  'is-finalist': props.isFinalist,
  'is-champion': props.isChampion,
  'is-eliminated': props.isEliminated,
  'is-leader': props.isLeader && !props.isFinalist && !props.isEliminated
}))

function onImageError(e) {
  e.target.style.opacity = '0.3'
}

const previousCorrect = ref(participant.value?.scores?.correctAnswers || 0)
const previousWrong = ref(participant.value?.scores?.wrongAnswers || 0)

watch(
  () => participant.value?.scores?.correctAnswers,
  (newVal) => {
    if (newVal > previousCorrect.value) {
      pulseGreen.value = true
      setTimeout(() => { pulseGreen.value = false }, 400)
    }
    previousCorrect.value = newVal
  }
)

watch(
  () => participant.value?.scores?.wrongAnswers,
  (newVal) => {
    if (newVal > previousWrong.value) {
      shakeRed.value = true
      setTimeout(() => { shakeRed.value = false }, 500)
    }
    previousWrong.value = newVal
  }
)
</script>

<style lang="sass" scoped>
@import '../quasar-variables.sass'

.participant-card
  position: relative
  background: linear-gradient(160deg, #1a4eb8 0%, #0d2b6e 45%, #0a1f4d 100%)
  border-radius: 16px
  overflow: hidden
  min-width: 280px
  width: 100%
  max-width: 380px
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4)
  display: flex
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.4s ease, filter 0.4s ease
  border: 2px solid rgba(54, 192, 232, 0.2)
  will-change: transform

  &:hover:not(.is-eliminated)
    transform: translateY(-3px)

  &.pulse-green
    animation: pulseGreen 0.4s ease

  &.shake-red
    animation: shakeRed 0.5s ease

  &.is-leader
    border-color: rgba(54, 192, 232, 0.7)
    box-shadow: 0 0 0 1px rgba(54, 192, 232, 0.5), 0 8px 24px rgba(54, 192, 232, 0.2)

  &.is-finalist
    border: 3px solid $secondary
    animation: finalistGlow 3s ease-in-out infinite
    transform: scale(1.02)

  &.is-champion
    border: 3px solid $secondary
    animation: championGlow 2s ease-in-out infinite
    transform: scale(1.03)

  &.is-eliminated
    filter: grayscale(0.85) brightness(0.55)
    opacity: 0.5
    transform: scale(0.97)

.holo-overlay
  position: absolute
  inset: 0
  background: linear-gradient(125deg, transparent 35%, rgba(255, 204, 41, 0.15) 50%, transparent 65%)
  background-size: 200% 200%
  animation: holoShine 5s linear infinite
  pointer-events: none
  z-index: 2

.corner-stamp
  position: absolute
  top: 14px
  right: -38px
  transform: rotate(38deg)
  background: linear-gradient(135deg, $secondary 0%, #ffd95e 100%)
  color: $dark
  padding: 4px 44px
  font-size: 0.7rem
  font-weight: 900
  letter-spacing: 1.5px
  z-index: 5
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4)
  display: flex
  align-items: center
  gap: 4px

  .q-icon
    font-size: 0.85rem

.card-content
  flex: 1
  display: flex
  flex-direction: column
  position: relative
  z-index: 1

.top-section
  display: flex
  justify-content: space-between
  align-items: flex-start
  padding: 14px 16px 0

.card-number
  font-size: 4.2rem
  font-weight: 900
  color: rgba(54, 192, 232, 0.6)
  line-height: 0.85
  letter-spacing: -3px
  font-family: 'Arial Black', sans-serif

.flag
  display: flex
  flex-direction: column
  gap: 2px
  margin-top: 8px

  .flag-stripe
    width: 28px
    height: 6px
    border-radius: 1px

    &.yellow
      background-color: $secondary
      height: 12px

    &.blue
      background-color: #003893

    &.red
      background-color: $accent

.photo-section
  display: flex
  justify-content: center
  padding: 6px 18px 14px

.photo-frame
  position: relative
  width: 100%
  max-width: 230px
  border-radius: 10px
  overflow: hidden
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4)
  border: 2px solid rgba(255, 204, 41, 0.35)

  img
    width: 100%
    height: 240px
    object-fit: cover
    display: block
    background-color: rgba(255, 255, 255, 0.05)

.info-section
  background: rgba(0, 0, 0, 0.35)
  color: white
  padding: 12px 14px
  text-align: center
  border-top: 1px solid rgba(255, 204, 41, 0.25)
  border-bottom: 1px solid rgba(255, 204, 41, 0.15)

.name
  font-weight: 900
  text-transform: uppercase
  margin-bottom: 4px
  font-size: 1.05rem
  letter-spacing: 0.5px
  line-height: 1.15
  color: white

.details
  font-size: 0.75rem
  line-height: 1.3
  display: flex
  flex-wrap: wrap
  justify-content: center
  align-items: center
  gap: 4px

  .age
    color: $secondary
    font-weight: 700

  .dot
    color: rgba(255, 255, 255, 0.4)

  .institution
    color: rgba(255, 255, 255, 0.75)

.footer-section
  padding: 8px 12px
  text-align: center
  font-size: 0.72rem
  color: rgba(54, 192, 232, 0.9)
  font-weight: 700
  text-transform: uppercase
  letter-spacing: 1px
  background-color: rgba(0, 0, 0, 0.2)
  display: flex
  align-items: center
  justify-content: center
  gap: 4px

.score-section
  padding: 14px 12px 16px
  text-align: center
  background-color: rgba(255, 204, 41, 0.05)
  border-top: 1px solid rgba(255, 204, 41, 0.2)

.total-score
  display: flex
  align-items: baseline
  justify-content: center
  gap: 6px

.score-number
  font-size: 3.2rem
  font-weight: 900
  color: $secondary
  line-height: 1

.score-label
  font-size: 0.85rem
  font-weight: 800
  color: rgba(255, 204, 41, 0.7)
  text-transform: uppercase
  letter-spacing: 1px

.sub-scores
  display: flex
  justify-content: center
  gap: 14px
  margin-top: 10px
  font-size: 0.95rem
  font-weight: 800

  span
    display: inline-flex
    align-items: center
    gap: 3px

.correct
  color: #4dd571

.wrong
  color: #ff5b6e

.oral
  color: $secondary

.controls-section
  width: 76px
  background-color: rgba(0, 0, 0, 0.35)
  border-left: 1px solid rgba(54, 192, 232, 0.2)
  display: flex
  align-items: center
  justify-content: center
  position: relative
  z-index: 3

@keyframes pulseGreen
  0%, 100%
    transform: scale(1)
  50%
    transform: scale(1.04)

@keyframes shakeRed
  0%, 100%
    transform: translateX(0)
  25%
    transform: translateX(-8px)
  75%
    transform: translateX(8px)

@keyframes finalistGlow
  0%, 100%
    box-shadow: 0 0 18px rgba(255, 204, 41, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4)
  50%
    box-shadow: 0 0 32px rgba(255, 204, 41, 0.75), 0 8px 24px rgba(255, 204, 41, 0.2)

@keyframes championGlow
  0%, 100%
    box-shadow: 0 0 24px rgba(255, 204, 41, 0.6), 0 8px 24px rgba(0, 0, 0, 0.5)
  50%
    box-shadow: 0 0 48px rgba(255, 204, 41, 0.9), 0 8px 32px rgba(255, 204, 41, 0.3)

@keyframes holoShine
  0%
    background-position: 0% 0%
  100%
    background-position: 200% 200%
</style>