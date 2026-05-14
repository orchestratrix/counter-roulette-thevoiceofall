<script setup>
import { computed } from 'vue'
import { useParticipantsStore } from '../store/participants'

const store = useParticipantsStore()
const state = computed(() => store.tournamentState)

const STATE_LABELS = {
  pendiente: 'Pendiente',
  'en curso': 'En curso',
  definida: 'Definida',
  lista: 'Lista',
  coronado: 'Coronado'
}

function stateLabel(s) {
  return STATE_LABELS[s] || s
}

const finalSub = computed(() => {
  if (state.value.final === 'coronado') return 'Campeón coronado'
  if (state.value.final === 'lista') return 'Lista para jugar'
  return 'Aguardando finalistas'
})

function slug(s) {
  if (!s) return ''
  return s.replace(/\s+/g, '-')
}
</script>

<template>
  <div class="home-container">
    <div class="hero">
      <img class="portada-logo" src="../assets/icon.jpeg" alt="La Voz de Todos" />
      <div class="hero-subtitle">Marcador oficial · La Voz de Todos T1</div>
    </div>

    <div class="state-strip">
      <div class="state-card" :class="`state-${slug(state.norte)}`">
        <div class="state-label">Zona Norte</div>
        <div class="state-value">{{ stateLabel(state.norte) }}</div>
      </div>
      <div class="state-card" :class="`state-${slug(state.andina)}`">
        <div class="state-label">Zona Andina</div>
        <div class="state-value">{{ stateLabel(state.andina) }}</div>
      </div>
      <div class="state-card" :class="`state-${slug(state.final)}`">
        <div class="state-label">Final</div>
        <div class="state-value">{{ stateLabel(state.final) }}</div>
      </div>
    </div>

    <div class="buttons-container">
      <q-btn class="region-btn norte" to="/semifinal-norte" unelevated no-caps>
        <div class="btn-content">
          <q-icon name="mdi-waves" size="2.5rem" />
          <div>
            <div class="btn-title">Zona Norte</div>
            <div class="btn-sub">4 participantes</div>
          </div>
        </div>
      </q-btn>

      <q-btn class="region-btn andina" to="/semifinal-andina" unelevated no-caps>
        <div class="btn-content">
          <q-icon name="mdi-terrain" size="2.5rem" />
          <div>
            <div class="btn-title">Zona Andina</div>
            <div class="btn-sub">4 participantes</div>
          </div>
        </div>
      </q-btn>

      <q-btn class="region-btn final" to="/final" unelevated no-caps>
        <div class="btn-content">
          <q-icon name="mdi-trophy-variant" size="2.5rem" />
          <div>
            <div class="btn-title">Gran Final</div>
            <div class="btn-sub">{{ finalSub }}</div>
          </div>
        </div>
      </q-btn>

      <q-btn class="region-btn roulette" to="/roulette" unelevated no-caps>
        <div class="btn-content">
          <q-icon name="mdi-poker-chip" size="2.5rem" />
          <div>
            <div class="btn-title">Ruleta</div>
          </div>
        </div>
      </q-btn>
    </div>

    <div class="footer-note">
      Congreso de la República · Cámara de Representantes · 2026
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  gap: 32px;
}

.hero {
  text-align: center;
}

.portada-logo {
  height: 250px;
  width: 250px;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.state-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.state-card {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 10px;
  min-width: 130px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.state-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
}

.state-value {
  font-size: 1rem;
  font-weight: 700;
  margin-top: 4px;
  color: white;
}

.state-pendiente .state-value {
  color: rgba(255, 255, 255, 0.5);
}

.state-card.state-en-curso {
  border-color: rgba(255, 204, 41, 0.5);
}

.state-card.state-en-curso .state-value {
  color: #FFCC29;
}

.state-card.state-definida,
.state-card.state-lista {
  border-color: rgba(33, 186, 69, 0.5);
}

.state-card.state-definida .state-value,
.state-card.state-lista .state-value {
  color: #21BA45;
}

.state-card.state-coronado {
  background: linear-gradient(135deg, rgba(255, 204, 41, 0.2), rgba(255, 204, 41, 0.05));
  border-color: #FFCC29;
}

.state-card.state-coronado .state-value {
  color: #FFCC29;
}

.buttons-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1100px;
}

.region-btn {
  height: 130px;
  border-radius: 16px !important;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.region-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
}

.region-btn.norte {
  background: linear-gradient(135deg, #0749BF 0%, #4a7fd9 100%) !important;
  color: white !important;
}

.region-btn.andina {
  background: linear-gradient(135deg, #FFCC29 0%, #ffe17a 100%) !important;
  color: #0A1F4D !important;
}

.region-btn.final {
  background: linear-gradient(135deg, #E63946 0%, #ef6b75 100%) !important;
  color: white !important;
}

.region-btn.roulette {
  background: linear-gradient(135deg, #0749BF 0%, #4a7fd9 100%) !important;
  color: white !important;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  gap: 16px;
  padding: 0 10px;
}

.btn-title {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.btn-sub {
  font-size: 0.85rem;
  opacity: 0.85;
  font-weight: 500;
  margin-top: 2px;
  text-align: left;
}

.footer-note {
  margin-top: 12px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  letter-spacing: 0.5px;
}
</style>