<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useParticipantsStore } from '../store/participants'
import ParticipantCard from '../components/ParticipantCard.vue'
import ConfettiCelebration from '../components/ConfettiCelebration.vue'

const store = useParticipantsStore()
const router = useRouter()

const showCrownDialog = ref(false)
const celebrating = ref(false)

const finalists = computed(() => store.finalists)
const canShowFinal = computed(() => finalists.value[0] && finalists.value[1])

const totalA = computed(() =>
  finalists.value[0] ? store.totalPoints(finalists.value[0].id) : 0
)

const totalB = computed(() =>
  finalists.value[1] ? store.totalPoints(finalists.value[1].id) : 0
)

const isTie = computed(() => totalA.value === totalB.value)
const hasFinalScores = computed(() => totalA.value > 0 || totalB.value > 0)

const finalLeader = computed(() => {
  if (!canShowFinal.value || isTie.value) return null
  return totalA.value > totalB.value ? finalists.value[0] : finalists.value[1]
})

const championName = computed(() => store.byId(store.championId)?.name || '')

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function goHome() {
  router.push('/')
}

function confirmCrown() {
  showCrownDialog.value = true
}

function crownChampion() {
  if (!finalLeader.value) return
  store.crownChampion(finalLeader.value.id)
  showCrownDialog.value = false
  celebrating.value = true
  setTimeout(() => { celebrating.value = false }, 6500)
}

function resetChampion() {
  store.resetChampion()
}
</script>

<template>
  <div class="final-container">
    <div class="header">
      <q-btn flat round dense icon="mdi-arrow-left" color="white" @click="goHome" />
      <div class="header-text">
        <div class="region-tag">Gran Final</div>
        <h1 class="region-title">La Voz de Todos</h1>
      </div>
    </div>

    <div v-if="!canShowFinal" class="warning-panel">
      <q-icon name="mdi-alert-circle" size="3rem" color="warning" />
      <h2>Finalistas no asignados</h2>
      <p v-if="!finalists[0]">
        Falta asignar finalista de la
        <strong>Semifinal Zona Norte</strong>.
      </p>
      <p v-if="!finalists[1]">
        Falta asignar finalista de la
        <strong>Semifinal Zona Andina</strong>.
      </p>
      <p class="hint">
        Ve a cada semifinal y usa el botón <strong>"Asignar Finalista"</strong>
        para confirmar quién pasa.
      </p>
      <div class="warning-actions">
        <q-btn v-if="!finalists[0]" unelevated color="primary" no-caps label="Ir a Semifinal Zona Norte"
          to="/semifinal-norte" />
        <q-btn v-if="!finalists[1]" unelevated color="secondary" text-color="dark" no-caps label="Ir a Semifinal Zona Andina"
          to="/semifinal-andina" />
      </div>
    </div>

    <template v-else>
      <div class="versus-scoreboard">
        <div class="finalist-tag left" :class="{
          'is-winning': finalLeader?.id === finalists[0].id && !isTie,
          'is-losing': finalLeader && finalLeader.id !== finalists[0].id && !isTie && store.championId
        }">
          <div class="finalist-name">{{ finalists[0].name }}</div>
          <div class="finalist-region">{{ capitalize(finalists[0].region) }}</div>
          <div class="finalist-total">{{ totalA }}</div>
        </div>

        <div class="versus-divider">
          <span v-if="!isTie" class="vs-label">VS</span>
          <span v-else class="tie-label">EMPATE</span>
        </div>

        <div class="finalist-tag right" :class="{
          'is-winning': finalLeader?.id === finalists[1].id && !isTie,
          'is-losing': finalLeader && finalLeader.id !== finalists[1].id && !isTie && store.championId
        }">
          <div class="finalist-name">{{ finalists[1].name }}</div>
          <div class="finalist-region">{{ capitalize(finalists[1].region) }}</div>
          <div class="finalist-total">{{ totalB }}</div>
        </div>
      </div>

      <div class="finalists-grid">
        <ParticipantCard :participant-id="finalists[0].id" :show-controls="!store.championId"
          :is-champion="store.championId === finalists[0].id" :is-finalist="!store.championId"
          :is-eliminated="store.championId && store.championId !== finalists[0].id" class="final-card" />
        <ParticipantCard :participant-id="finalists[1].id" :show-controls="!store.championId"
          :is-champion="store.championId === finalists[1].id" :is-finalist="!store.championId"
          :is-eliminated="store.championId && store.championId !== finalists[1].id" class="final-card" />
      </div>

      <div class="action-bar" v-if="finalLeader && !isTie">
        <div v-if="store.championId" class="champion-banner">
          <q-icon name="mdi-crown" size="2.4rem" />
          <div class="banner-text">
            <span class="banner-label">CAMPEÓN</span>
            <span class="banner-name">{{ championName }}</span>
          </div>
          <q-btn flat dense no-caps icon="mdi-restart" label="Descoronar" color="dark" @click="resetChampion" />
        </div>
        <q-btn v-else unelevated no-caps color="secondary" text-color="dark" size="lg" icon="mdi-crown"
          label="Coronar Campeón" class="crown-btn" @click="confirmCrown" />
      </div>

      <div class="tie-warning" v-if="isTie && hasFinalScores">
        <q-icon name="mdi-alert-circle" color="warning" />
        Empate técnico — defínase con preguntas extra
      </div>
    </template>

    <q-dialog v-model="showCrownDialog">
      <q-card class="crown-dialog" style="min-width: 420px">
        <q-card-section class="dialog-header">
          <q-icon name="mdi-crown" size="2.5rem" />
          <div class="text-h6">Coronar Campeón</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1">
            ¿Confirmar a <strong>{{ finalLeader?.name }}</strong>
            como campeón de <em>La Voz de Todos</em>?
          </div>
          <div class="text-caption text-grey-7 q-mt-sm">
            Se activará la ceremonia de coronación.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated label="Coronar" color="secondary" text-color="dark" icon="mdi-crown"
            @click="crownChampion" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div v-if="celebrating" class="coronation-overlay" aria-hidden="true">
      <div class="spotlight"></div>
      <div class="rays"></div>
    </div>

    <ConfettiCelebration :active="celebrating" :duration="6000" />
  </div>
</template>

<style scoped>
.final-container {
  padding: 16px;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  padding: 16px 8px;
}

.region-tag {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(54, 192, 232, 0.7);
  font-weight: 700;
}

.region-title {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 900;
  color: #FFCC29;
  line-height: 1;
}

.warning-panel {
  background-color: rgba(242, 192, 55, 0.08);
  border: 1px solid rgba(242, 192, 55, 0.4);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 600px;
  margin: 60px auto;
}

.warning-panel h2 {
  margin: 16px 0 8px;
  color: white;
}

.warning-panel p {
  color: rgba(255, 255, 255, 0.8);
  margin: 6px 0;
}

.warning-panel .hint {
  margin-top: 16px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.warning-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.versus-scoreboard {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, rgba(7, 73, 191, 0.25), rgba(7, 73, 191, 0.05));
  border: 1px solid rgba(54, 192, 232, 0.25);
  border-radius: 16px;
  padding: 22px 28px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.finalist-tag {
  text-align: center;
  padding: 14px;
  border-radius: 12px;
  transition: opacity 0.4s ease, filter 0.4s ease;
}

.finalist-tag.is-winning {
  background: linear-gradient(135deg, rgba(255, 204, 41, 0.25), rgba(255, 204, 41, 0.05));
  border: 1px solid rgba(255, 204, 41, 0.5);
}

.finalist-tag.is-losing {
  opacity: 0.45;
  filter: saturate(0.5);
}

.finalist-name {
  font-size: 1.35rem;
  font-weight: 900;
  color: white;
}

.finalist-region {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(54, 192, 232, 0.85);
  margin-top: 4px;
  font-weight: 700;
}

.finalist-total {
  font-size: 4rem;
  font-weight: 900;
  color: #FFCC29;
  line-height: 1;
  margin-top: 8px;
}

.vs-label {
  font-size: 2.2rem;
  font-weight: 900;
  color: rgba(54, 192, 232, 0.6);
  letter-spacing: 2px;
}

.tie-label {
  font-size: 1.1rem;
  color: #F2C037;
  font-weight: 800;
}

.finalists-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  justify-items: center;
  margin-bottom: 32px;
}

.final-card {
  max-width: 420px;
  transform: scale(1.05);
}

@media (max-width: 900px) {
  .finalists-grid {
    grid-template-columns: 1fr;
  }

  .final-card {
    transform: scale(1);
  }
}

.action-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.crown-btn {
  padding: 18px 44px !important;
  font-size: 1.2rem !important;
  font-weight: 900 !important;
  border-radius: 999px !important;
  box-shadow: 0 8px 28px rgba(255, 204, 41, 0.5) !important;
  animation: crownPulse 2s ease-in-out infinite;
  letter-spacing: 0.5px;
}

.champion-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(135deg, #FFCC29 0%, #ffd95e 50%, #FFCC29 100%);
  background-size: 200% 200%;
  animation: bannerShimmer 3s ease-in-out infinite;
  color: #0A1F4D;
  padding: 16px 28px;
  border-radius: 999px;
  box-shadow: 0 12px 36px rgba(255, 204, 41, 0.6);
}

.banner-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.banner-label {
  font-size: 0.7rem;
  letter-spacing: 2.5px;
  font-weight: 800;
  opacity: 0.75;
}

.banner-name {
  font-size: 1.35rem;
  font-weight: 900;
}

.tie-warning {
  text-align: center;
  padding: 16px;
  background-color: rgba(242, 192, 55, 0.1);
  border: 1px solid rgba(242, 192, 55, 0.3);
  border-radius: 10px;
  color: #F2C037;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.crown-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, #FFCC29 0%, #ffd95e 100%);
  color: #0A1F4D;
  display: flex;
  align-items: center;
  gap: 12px;
}

.coronation-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
}

.spotlight {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120vmax;
  height: 120vmax;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 204, 41, 0.3) 0%, rgba(255, 204, 41, 0.12) 25%, transparent 55%);
  animation: spotlightPulse 2s ease-in-out infinite;
  will-change: transform, opacity;
}

.rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150vmax;
  height: 150vmax;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at center, transparent 30%, rgba(255, 204, 41, 0.08) 60%, transparent 80%);
  animation: raysRotate 12s linear infinite;
  will-change: transform;
}

@keyframes crownPulse {

  0%,
  100% {
    box-shadow: 0 8px 28px rgba(255, 204, 41, 0.5), 0 0 0 0 rgba(255, 204, 41, 0.6);
  }

  50% {
    box-shadow: 0 12px 36px rgba(255, 204, 41, 0.7), 0 0 0 18px rgba(255, 204, 41, 0);
  }
}

@keyframes bannerShimmer {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes spotlightPulse {

  0%,
  100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes raysRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>