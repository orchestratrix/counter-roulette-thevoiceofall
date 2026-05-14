<template>
    <div class="roulette-container">
        <!-- Halo de luz ambiental detrás de la ruleta -->
        <div class="ambient-glow" aria-hidden="true"></div>

        <!-- Puntero superior (flecha que indica el ganador) -->
        <div class="pointer" :class="{ 'is-spinning': isSpinning }" aria-hidden="true">
            <svg viewBox="0 0 40 50" width="44" height="55">
                <defs>
                    <linearGradient id="pointerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#FFE066" />
                        <stop offset="50%" stop-color="#FFCC29" />
                        <stop offset="100%" stop-color="#e6b520" />
                    </linearGradient>
                </defs>
                <path d="M 20 50 L 0 5 Q 20 -5 40 5 Z" fill="url(#pointerGradient)" stroke="#0A1F4D"
                    stroke-width="2.5" />
                <circle cx="20" cy="10" r="4.5" fill="#0A1F4D" />
                <circle cx="20" cy="10" r="2" fill="#FFCC29" />
            </svg>
        </div>

        <!-- Ruleta SVG -->
        <div class="wheel-wrapper">
            <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="wheel" :style="wheelStyle" @transitionend="onSpinEnd">
                <defs>
                    <!-- Gradientes para cada color de sector -->
                    <radialGradient id="gradRed" cx="50%" cy="30%" r="80%">
                        <stop offset="0%" stop-color="#ff5560" />
                        <stop offset="60%" stop-color="#E63946" />
                        <stop offset="100%" stop-color="#a82530" />
                    </radialGradient>
                    <radialGradient id="gradBlue" cx="50%" cy="30%" r="80%">
                        <stop offset="0%" stop-color="#2767d9" />
                        <stop offset="60%" stop-color="#0749BF" />
                        <stop offset="100%" stop-color="#03306e" />
                    </radialGradient>
                    <radialGradient id="gradYellow" cx="50%" cy="30%" r="80%">
                        <stop offset="0%" stop-color="#ffe066" />
                        <stop offset="60%" stop-color="#FFCC29" />
                        <stop offset="100%" stop-color="#c99a10" />
                    </radialGradient>

                    <!-- Filtro de sombra interior para los sectores -->
                    <filter id="sectorShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                        <feOffset dx="0" dy="2" result="offsetblur" />
                        <feFlood flood-color="#000" flood-opacity="0.35" />
                        <feComposite in2="offsetblur" operator="in" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <!-- Patrón de bombillos en el borde dorado -->
                    <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#fff" />
                        <stop offset="40%" stop-color="#FFCC29" />
                        <stop offset="100%" stop-color="#a87f10" />
                    </radialGradient>
                </defs>

                <!-- Anillo decorativo exterior dorado -->
                <circle :cx="CENTER" :cy="CENTER" :r="OUTER_RADIUS + 18" fill="#0A1F4D" />
                <circle :cx="CENTER" :cy="CENTER" :r="OUTER_RADIUS + 14" fill="#FFCC29" />
                <circle :cx="CENTER" :cy="CENTER" :r="OUTER_RADIUS + 10" fill="#0A1F4D" />
                <circle :cx="CENTER" :cy="CENTER" :r="OUTER_RADIUS + 6" fill="#FFCC29" />

                <!-- Bombillos en el borde -->
                <circle v-for="bulb in bulbs" :key="`bulb-${bulb.id}`" :cx="bulb.x" :cy="bulb.y" r="5"
                    fill="url(#bulbGlow)" :class="{ 'bulb-flicker': isSpinning }"
                    :style="{ animationDelay: `${bulb.delay}s` }" />

                <!-- Sectores -->
                <g v-for="sector in sectors" :key="`sector-${sector.question.id}`" class="sector-group">
                    <path :d="sector.path" :fill="sector.gradient" stroke="#FFCC29" stroke-width="2.5"
                        stroke-linejoin="round" filter="url(#sectorShadow)" />

                    <!-- Línea separadora con brillo -->
                    <line :x1="sector.dividerStart.x" :y1="sector.dividerStart.y" :x2="sector.dividerEnd.x"
                        :y2="sector.dividerEnd.y" stroke="#FFCC29" stroke-width="1.5" opacity="0.85" />

                    <!-- Número del sector -->
                    <text :x="sector.numberPos.x" :y="sector.numberPos.y" :fill="sector.textColor"
                        :font-size="numberFontSize" font-weight="900" text-anchor="middle" dominant-baseline="middle"
                        :transform="`rotate(${sector.textRotation} ${sector.numberPos.x} ${sector.numberPos.y})`"
                        font-family="Arial Black, sans-serif" class="sector-number">
                        {{ sector.question.id }}
                    </text>

                    <!-- Icono del sector -->
                    <foreignObject :x="sector.iconPos.x - iconBoxSize / 2" :y="sector.iconPos.y - iconBoxSize / 2"
                        :width="iconBoxSize" :height="iconBoxSize"
                        :transform="`rotate(${sector.textRotation} ${sector.iconPos.x} ${sector.iconPos.y})`">
                        <div class="sector-icon-wrapper" :style="{ color: sector.textColor }">
                            <q-icon :name="sector.question.icon" :size="`${iconBoxSize * 0.75}px`" />
                        </div>
                    </foreignObject>
                </g>

                <!-- Centro de la ruleta -->
                <circle :cx="CENTER" :cy="CENTER" :r="INNER_RADIUS + 14" fill="#0A1F4D" />
                <circle :cx="CENTER" :cy="CENTER" :r="INNER_RADIUS + 10" fill="#FFCC29" />
                <circle :cx="CENTER" :cy="CENTER" :r="INNER_RADIUS + 4" fill="#0A1F4D" />
                <circle :cx="CENTER" :cy="CENTER" :r="INNER_RADIUS" fill="#0A1F4D" stroke="#FFCC29"
                    stroke-width="1.5" />
            </svg>

            <!-- Logo central -->
            <div class="center-logo">
                <slot name="center">
                    <img src="../assets/icon.jpeg" alt="Logo" />
                </slot>
            </div>

            <!-- Click overlay sobre toda la ruleta -->
            <button class="spin-trigger" :disabled="disabled || isSpinning || availableQuestions.length === 0"
                @click="spin" aria-label="Girar la ruleta">
                <span v-if="!isSpinning && availableQuestions.length > 0" class="spin-hint">
                    <q-icon name="mdi-gesture-tap" />
                    Toca para girar
                </span>
            </button>
        </div>
        <audio ref="spinAudio" src="/sounds/spin.mp3" preload="auto" />
        <audio ref="dingAudio" src="/sounds/ding.mp3" preload="auto" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    availableQuestions: { type: Array, required: true },
    disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['spin-end'])

// Constantes de geometría
const SIZE = 600
const CENTER = SIZE / 2
const OUTER_RADIUS = 270
const INNER_RADIUS = 95

// Paleta del logo
const GRADIENTS = ['url(#gradRed)', 'url(#gradBlue)', 'url(#gradYellow)']
const COLORS = ['#E63946', '#0749BF', '#FFCC29']
const TEXT_ON_LIGHT = '#0A1F4D'
const TEXT_ON_DARK = '#FFFFFF'

const rotation = ref(0)
const isSpinning = ref(false)
const targetQuestion = ref(null)
const spinAudio = ref(null)
const dingAudio = ref(null)

// Bombillos en el borde dorado (decorativos, no rotan con la rueda)
const bulbs = computed(() => {
    const count = 24
    const ringRadius = OUTER_RADIUS + 14
    return Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 360
        const pos = polarToCartesian(angle, ringRadius)
        return {
            id: i,
            x: pos.x,
            y: pos.y,
            delay: (i % 6) * 0.15
        }
    })
})

// Tamaños tipográficos adaptativos
const numberFontSize = computed(() => {
    const count = props.availableQuestions.length
    if (count >= 12) return 32
    if (count >= 8) return 40
    if (count >= 5) return 50
    return 60
})

const iconBoxSize = computed(() => {
    const count = props.availableQuestions.length
    if (count >= 12) return 38
    if (count >= 8) return 48
    if (count >= 5) return 58
    return 70
})

// Helpers de geometría
function polarToCartesian(angleDeg, radius) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180
    return {
        x: CENTER + radius * Math.cos(angleRad),
        y: CENTER + radius * Math.sin(angleRad)
    }
}

function buildSectorPath(startAngle, endAngle) {
    const start = polarToCartesian(startAngle, OUTER_RADIUS)
    const end = polarToCartesian(endAngle, OUTER_RADIUS)
    const innerStart = polarToCartesian(endAngle, INNER_RADIUS)
    const innerEnd = polarToCartesian(startAngle, INNER_RADIUS)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return [
        `M ${start.x} ${start.y}`,
        `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
        'Z'
    ].join(' ')
}

// Sectores
const sectors = computed(() => {
    const n = props.availableQuestions.length
    if (n === 0) return []

    const anglePerSector = 360 / n

    return props.availableQuestions.map((question, index) => {
        const startAngle = index * anglePerSector
        const endAngle = startAngle + anglePerSector
        const midAngle = startAngle + anglePerSector / 2

        const gradient = GRADIENTS[index % GRADIENTS.length]
        const baseColor = COLORS[index % COLORS.length]
        const textColor = baseColor === '#FFCC29' ? TEXT_ON_LIGHT : TEXT_ON_DARK

        const numberRadius = OUTER_RADIUS - (OUTER_RADIUS - INNER_RADIUS) * 0.30
        const numberPos = polarToCartesian(midAngle, numberRadius)

        const iconRadius = INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * 0.42
        const iconPos = polarToCartesian(midAngle, iconRadius)

        // Líneas divisorias entre sectores
        const dividerStart = polarToCartesian(startAngle, INNER_RADIUS)
        const dividerEnd = polarToCartesian(startAngle, OUTER_RADIUS)

        return {
            question,
            index,
            startAngle,
            endAngle,
            midAngle,
            gradient,
            color: baseColor,
            textColor,
            path: buildSectorPath(startAngle, endAngle),
            numberPos,
            iconPos,
            dividerStart,
            dividerEnd,
            textRotation: midAngle
        }
    })
})

// Estilo de rotación
const wheelStyle = computed(() => ({
    transform: `rotate(${rotation.value}deg)`,
    transition: isSpinning.value
        ? 'transform 5s cubic-bezier(0.17, 0.67, 0.21, 1)'
        : 'none'
}))

// Lógica de giro
function spin() {
    if (isSpinning.value || props.availableQuestions.length === 0) return

    const randomIndex = Math.floor(Math.random() * props.availableQuestions.length)
    const winnerSector = sectors.value[randomIndex]
    targetQuestion.value = winnerSector.question

    const targetSectorAngle = -winnerSector.midAngle

    const fullSpins = 5 + Math.floor(Math.random() * 3)
    const extraDegrees = fullSpins * 360

    const currentRotationNormalized = rotation.value % 360
    const currentBase = rotation.value - currentRotationNormalized
    const newRotation = currentBase + extraDegrees + targetSectorAngle

    const finalRotation = newRotation > rotation.value
        ? newRotation
        : newRotation + 360

    isSpinning.value = true
    rotation.value = finalRotation

    if (spinAudio.value) {
        spinAudio.value.currentTime = 0
        spinAudio.value.volume = 0.7
        spinAudio.value.play().catch(() => { /* autoplay bloqueado */ })
    }
}

function onSpinEnd() {
    if (!isSpinning.value) return
    isSpinning.value = false

    if (spinAudio.value) {
        spinAudio.value.pause()
        spinAudio.value.currentTime = 0
    }

    if (dingAudio.value) {
        dingAudio.value.currentTime = 0
        dingAudio.value.volume = 0.85
        dingAudio.value.play().catch(() => { /* autoplay bloqueado */ })
    }

    emit('spin-end', targetQuestion.value)
}

defineExpose({ isSpinning })
</script>

<style scoped>
.roulette-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    padding: 70px 20px 30px;
    user-select: none;
}

.ambient-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 110%;
    height: 110%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(255, 204, 41, 0.15) 0%, rgba(7, 73, 191, 0.08) 40%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: ambientPulse 4s ease-in-out infinite;
}

.pointer {
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6));
    pointer-events: none;
    transition: transform 0.2s ease;
}

.pointer.is-spinning {
    animation: pointerWiggle 0.15s ease-in-out infinite;
}

.wheel-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    max-width: 620px;
    z-index: 1;
}

.wheel {
    width: 100%;
    height: 100%;
    display: block;
    filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 30px rgba(255, 204, 41, 0.2));
    will-change: transform;
}

.sector-number {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    letter-spacing: -1px;
}

.bulb-flicker {
    animation: bulbFlicker 0.6s ease-in-out infinite;
}

.center-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 26%;
    height: 26%;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6), inset 0 0 0 4px #FFCC29, 0 0 30px rgba(255, 204, 41, 0.4);
    z-index: 5;
    pointer-events: none;
    background-color: #0A1F4D;
}

.center-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.spin-trigger {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 4;
    transition: transform 0.2s ease;
}

.spin-trigger:disabled {
    cursor: not-allowed;
}

.spin-trigger:hover:not(:disabled) {
    transform: scale(1.01);
}

.spin-trigger:hover:not(:disabled)~.wheel {
    filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 50px rgba(255, 204, 41, 0.4));
}

.spin-hint {
    position: absolute;
    bottom: 6%;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(10, 31, 77, 0.95), rgba(7, 73, 191, 0.95));
    color: #FFCC29;
    padding: 10px 22px;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    border: 2px solid rgba(255, 204, 41, 0.5);
    pointer-events: none;
    animation: hintPulse 2s ease-in-out infinite;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
}

.spin-hint .q-icon {
    font-size: 1.2rem;
}

.sector-icon-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35));
}

@keyframes hintPulse {

    0%,
    100% {
        opacity: 0.9;
        transform: translateX(-50%) scale(1);
    }

    50% {
        opacity: 1;
        transform: translateX(-50%) scale(1.06);
    }
}

@keyframes pointerWiggle {

    0%,
    100% {
        transform: translateX(-50%) rotate(0deg);
    }

    25% {
        transform: translateX(-50%) rotate(-6deg);
    }

    75% {
        transform: translateX(-50%) rotate(6deg);
    }
}

@keyframes bulbFlicker {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.45;
    }
}

@keyframes ambientPulse {

    0%,
    100% {
        opacity: 0.7;
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.05);
    }
}
</style>