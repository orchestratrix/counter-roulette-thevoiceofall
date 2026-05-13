<template>
  <div class="confetti-container" v-if="active" aria-hidden="true">
    <div v-for="piece in pieces" :key="`p-${piece.id}`" class="confetti-piece" :class="piece.shape"
      :style="piece.style" />
    <div v-for="star in stars" :key="`s-${star.id}`" class="confetti-star" :style="star.style">★</div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
  count: { type: Number, default: 80 },
  duration: { type: Number, default: 6000 }
})

const pieces = ref([])
const stars = ref([])
let timeoutId = null

const COLORS = ['#0749BF', '#FFCC29', '#E63946', '#36C0E8', '#ffffff', '#ffd95e']
const SHAPES = ['rect', 'square', 'circle']

function generate() {
  pieces.value = Array.from({ length: props.count }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 2
    const dur = 3 + Math.random() * 3
    const w = 6 + Math.random() * 10
    const h = w * (0.3 + Math.random() * 1.5)
    const rotation = Math.random() * 360
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    const horizontalDrift = (Math.random() - 0.5) * 200
    return {
      id: i,
      shape,
      style: {
        left: `${left}%`,
        width: `${w}px`,
        height: `${shape === 'circle' || shape === 'square' ? w : h}px`,
        backgroundColor: color,
        animationDelay: `${delay}s`,
        animationDuration: `${dur}s`,
        '--rotation': `${rotation}deg`,
        '--drift': `${horizontalDrift}px`
      }
    }
  })

  stars.value = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${16 + Math.random() * 20}px`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${1.5 + Math.random() * 2}s`
    }
  }))
}

watch(() => props.active, (val) => {
  if (val) {
    generate()
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      pieces.value = []
      stars.value = []
    }, props.duration)
  } else {
    pieces.value = []
    stars.value = []
  }
}, { immediate: true })

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
  pieces.value = []
  stars.value = []
})
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -30px;
  animation-name: confettiFall;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  opacity: 0.95;
  will-change: transform;
}

.confetti-piece.rect {
  border-radius: 2px;
}

.confetti-piece.square {
  border-radius: 1px;
}

.confetti-piece.circle {
  border-radius: 50%;
}

.confetti-star {
  position: absolute;
  color: #FFCC29;
  text-shadow: 0 0 8px rgba(255, 204, 41, 0.9);
  animation-name: starTwinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  pointer-events: none;
  will-change: opacity, transform;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-30px) translateX(0) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(calc(var(--rotation) + 720deg));
    opacity: 0.3;
  }
}

@keyframes starTwinkle {

  0%,
  100% {
    opacity: 0;
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.4);
  }
}
</style>