<template>
  <div
    class="participant-card"
    :class="{
      'pulse-green': pulseGreen,
      'shake-red': shakeRed,
      'is-finalist': isFinalist,
      'is-champion': isChampion,
      'is-eliminated': isEliminated,
      'is-leader': isLeader && !isFinalist && !isEliminated
    }"
  >
    <!-- Holograma de finalista -->
    <div class="holo-overlay" v-if="isFinalist || isChampion" aria-hidden="true"></div>

    <!-- Sello esquina superior -->
    <div class="corner-stamp" v-if="isFinalist || isChampion">
      <q-icon :name="isChampion ? 'mdi-crown' : 'mdi-star-four-points'" />
      <span>{{ isChampion ? 'CAMPEÓN' : 'FINALISTA' }}</span>
    </div>

    <div class="card-content">
      <div class="top-section">
        <div class="card-number">
          <span class="num-bg">{{ participant?.id }}</span>
        </div>
        <div class="flag" aria-hidden="true">
          <span class="flag-stripe yellow"></span>
          <span class="flag-stripe blue"></span>
          <span class="flag-stripe red"></span>
        </div>
      </div>

      <div class="photo-section">
        <div class="photo-frame">
          <img
            :src="participant?.photo"
            :alt="participant?.name"
            @error="onImageError"
          />
          <div class="photo-shine" aria-hidden="true"></div>
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
          <span class="correct" title="Aciertos">
            <q-icon name="mdi-check-circle" />
            {{ participant?.scores.correctAnswers }}
          </span>
          <span class="wrong" title="Errores">
            <q-icon name="mdi-close-circle" />
            {{ participant?.scores.wrongAnswers }}
          </span>
          <span class="oral" v-if="participant?.scores.oralRating" title="Nota oral">
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

const onImageError = (e) => {
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
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)
  display: flex
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, opacity 0.5s ease, filter 0.5s ease
  border: 2px solid rgba(54, 192, 232, 0.2)

  // Patrón de líneas diagonales como fondo del logo
  &::before
    content: ''
    position: absolute
    inset: 0
    background-image: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.015) 8px, rgba(255,255,255,0.015) 9px)
    pointer-events: none
    z-index: 0

  &:hover:not(.is-eliminated)
    transform: translateY(-4px) scale(1.01)
    box-shadow: 0 16px 40px rgba(7, 73, 191, 0.5), 0 6px 14px rgba(0,0,0,0.4)

  // Estados especiales
  &.pulse-green
    animation: pulseGreen 0.4s cubic-bezier(0.4, 0, 0.2, 1)

  &.shake-red
    animation: shakeRed 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)

  &.is-leader
    border-color: rgba(54, 192, 232, 0.7)
    box-shadow: 0 0 0 1px rgba(54, 192, 232, 0.5), 0 12px 32px rgba(54, 192, 232, 0.25), 0 4px 10px rgba(0, 0, 0, 0.3)

  &.is-finalist
    border: 3px solid $secondary
    animation: finalistGlow 2.5s ease-in-out infinite
    transform: scale(1.02)

  &.is-champion
    border: 3px solid $secondary
    animation: championGlow 1.8s ease-in-out infinite
    transform: scale(1.03)

  &.is-eliminated
    filter: grayscale(0.85) brightness(0.55)
    opacity: 0.5
    transform: scale(0.97)

  // Overlay holográfico para finalistas/campeones
  .holo-overlay
    position: absolute
    inset: 0
    background: linear-gradient(125deg, transparent 30%, rgba(255, 204, 41, 0.18) 45%, rgba(54, 192, 232, 0.2) 50%, rgba(255, 204, 41, 0.18) 55%, transparent 70%)
    background-size: 300% 300%
    animation: holoShine 4s linear infinite
    pointer-events: none
    z-index: 2
    mix-blend-mode: overlay

  .corner-stamp
    position: absolute
    top: 14px
    right: -38px
    transform: rotate(38deg)
    background: linear-gradient(135deg, $secondary 0%, #ffd95e 50%, $secondary 100%)
    color: $dark
    padding: 4px 44px
    font-size: 0.7rem
    font-weight: 900
    letter-spacing: 1.5px
    z-index: 5
    box-shadow: 0 3px 10px rgba(0,0,0,0.4)
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
      position: relative

      .num-bg
        font-size: 4.2rem
        font-weight: 900
        background: linear-gradient(180deg, rgba(54, 192, 232, 0.85) 0%, rgba(54, 192, 232, 0.35) 100%)
        -webkit-background-clip: text
        background-clip: text
        color: transparent
        line-height: 0.85
        letter-spacing: -3px
        font-family: 'Arial Black', sans-serif
        text-shadow: 0 2px 0 rgba(0,0,0,0.2)
        filter: drop-shadow(0 0 12px rgba(54, 192, 232, 0.4))

    .flag
      display: flex
      flex-direction: column
      gap: 2px
      margin-top: 8px
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5))

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
      box-shadow: 0 6px 18px rgba(0,0,0,0.5)
      border: 2px solid rgba(255, 204, 41, 0.35)
      background: linear-gradient(135deg, rgba(255, 204, 41, 0.1), rgba(54, 192, 232, 0.1))

      img
        width: 100%
        height: 240px
        object-fit: cover
        display: block
        background-color: rgba(255,255,255,0.05)

      .photo-shine
        position: absolute
        inset: 0
        background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)
        pointer-events: none

  .info-section
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.25) 100%)
    color: white
    padding: 12px 14px
    text-align: center
    backdrop-filter: blur(4px)
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
      text-shadow: 0 2px 4px rgba(0,0,0,0.6)

    .details
      font-size: 0.75rem
      opacity: 0.85
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
        color: rgba(255,255,255,0.4)

      .institution
        color: rgba(255,255,255,0.75)

  .footer-section
    padding: 8px 12px
    text-align: center
    font-size: 0.72rem
    color: rgba(54, 192, 232, 0.9)
    font-weight: 700
    text-transform: uppercase
    letter-spacing: 1px
    background-color: rgba(0,0,0,0.2)
    display: flex
    align-items: center
    justify-content: center
    gap: 4px

  .score-section
    padding: 14px 12px 16px
    text-align: center
    background: linear-gradient(180deg, rgba(255, 204, 41, 0.08) 0%, rgba(255, 204, 41, 0.02) 100%)
    border-top: 1px solid rgba(255, 204, 41, 0.2)

    .total-score
      display: flex
      align-items: baseline
      justify-content: center
      gap: 6px

      .score-number
        font-size: 3.2rem
        font-weight: 900
        background: linear-gradient(180deg, $secondary 0%, #e6a800 100%)
        -webkit-background-clip: text
        background-clip: text
        color: transparent
        line-height: 1
        text-shadow: 0 2px 8px rgba(255, 204, 41, 0.3)
        filter: drop-shadow(0 2px 6px rgba(255, 204, 41, 0.4))

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
  0%
    transform: scale(1)
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5)
  50%
    transform: scale(1.04)
    box-shadow: 0 0 30px rgba(77, 213, 113, 0.6), 0 12px 32px rgba(0, 0, 0, 0.5)
  100%
    transform: scale(1)
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5)

@keyframes shakeRed
  0%, 100%
    transform: translateX(0)
  15%
    transform: translateX(-10px)
    box-shadow: 0 0 24px rgba(255, 91, 110, 0.5), 0 12px 32px rgba(0, 0, 0, 0.5)
  30%
    transform: translateX(10px)
  45%
    transform: translateX(-8px)
  60%
    transform: translateX(8px)
  75%
    transform: translateX(-4px)

@keyframes finalistGlow
  0%, 100%
    box-shadow: 0 0 24px rgba(255, 204, 41, 0.55), 0 12px 32px rgba(0, 0, 0, 0.5)
  50%
    box-shadow: 0 0 48px rgba(255, 204, 41, 0.85), 0 16px 40px rgba(255, 204, 41, 0.3)

@keyframes championGlow
  0%, 100%
    box-shadow: 0 0 32px rgba(255, 204, 41, 0.7), 0 0 60px rgba(255, 204, 41, 0.4), 0 12px 32px rgba(0, 0, 0, 0.6)
    border-color: $secondary
  50%
    box-shadow: 0 0 64px rgba(255, 204, 41, 1), 0 0 100px rgba(255, 204, 41, 0.6), 0 16px 50px rgba(255, 204, 41, 0.5)
    border-color: #ffd95e

@keyframes holoShine
  0%
    background-position: -100% -100%
  100%
    background-position: 200% 200%
</style>