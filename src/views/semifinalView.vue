<template>
  <div class="semifinal-container">
    <div class="header">
      <div class="header-left">
        <q-btn
          flat round dense
          icon="mdi-arrow-left"
          color="white"
          @click="goHome"
        />
        <div>
          <div class="region-tag">Semifinal Regional</div>
          <h1 class="region-title">{{ capitalizedRegion }}</h1>
        </div>
      </div>

      <div class="header-right">
        <!-- Finalista ya asignado -->
        <div v-if="assignedFinalist" class="assigned-badge">
          <q-icon name="mdi-star-four-points" />
          <div class="badge-text">
            <span class="badge-label">Finalista</span>
            <span class="badge-name">{{ assignedFinalist.name.split(' ')[0] }}</span>
          </div>
          <q-btn
            flat dense round
            icon="mdi-close"
            color="white"
            size="sm"
            @click="confirmClearFinalist"
          >
            <q-tooltip>Quitar finalista</q-tooltip>
          </q-btn>
        </div>

        <!-- Líder actual + botón asignar -->
        <template v-else>
          <div v-if="leader" class="leader-info">
            <q-icon name="mdi-podium-gold" />
            <span>Líder: <strong>{{ leader.name.split(' ')[0] }}</strong></span>
          </div>
          <div v-else-if="hasScores" class="tie-badge">
            <q-icon name="mdi-equal" />
            <span>Empate técnico</span>
          </div>

          <q-btn
            v-if="leader"
            unelevated no-caps
            color="secondary"
            text-color="dark"
            icon="mdi-star-four-points"
            label="Asignar Finalista"
            class="assign-btn"
            @click="confirmAssignFinalist"
          />
        </template>
      </div>
    </div>

    <div class="participants-grid">
      <ParticipantCard
        v-for="participant in participants"
        :key="participant.id"
        :participant-id="participant.id"
        :show-controls="!assignedFinalist || assignedFinalist.id === participant.id"
        :is-finalist="assignedFinalist?.id === participant.id"
        :is-eliminated="assignedFinalist && assignedFinalist.id !== participant.id"
        :is-leader="!assignedFinalist && leader?.id === participant.id"
        class="participant-card-item"
      />
    </div>

    <!-- Dialog asignar finalista -->
    <q-dialog v-model="showAssignDialog">
      <q-card class="confirm-card" style="min-width: 400px">
        <q-card-section class="bg-secondary text-dark">
          <div class="text-h6">
            <q-icon name="mdi-star-four-points" /> Confirmar finalista
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1">
            ¿Confirmar a <strong>{{ leader?.name }}</strong>
            como finalista de la Semifinal {{ capitalizedRegion }}?
          </div>
          <div class="text-caption text-grey-7 q-mt-sm">
            El resto de participantes quedará eliminado de esta semifinal.
            Esta decisión es reversible.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            unelevated label="Confirmar"
            color="secondary" text-color="dark"
            @click="assignFinalist"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog quitar finalista -->
    <q-dialog v-model="showClearDialog">
      <q-card class="confirm-card" style="min-width: 380px">
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">Quitar finalista</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1">
            ¿Quitar a <strong>{{ assignedFinalist?.name }}</strong>
            como finalista?
          </div>
          <div class="text-caption text-grey-7 q-mt-sm">
            Si ya había campeón coronado, también se descoronará.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            unelevated label="Quitar"
            color="negative"
            @click="clearFinalist"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useParticipantsStore } from '../store/participants'
import ParticipantCard from '../components/ParticipantCard.vue'

const props = defineProps({
  region: { type: String, required: true }
})

const store = useParticipantsStore()
const router = useRouter()

const showAssignDialog = ref(false)
const showClearDialog = ref(false)

const participants = computed(() => store.byRegion(props.region))
const capitalizedRegion = computed(
  () => props.region.charAt(0).toUpperCase() + props.region.slice(1)
)
const leader = computed(() => store.leaderByRegion(props.region))
const assignedFinalist = computed(() => store.finalistByRegion(props.region))

const hasScores = computed(() =>
  participants.value.some(p =>
    p.scores.correctAnswers > 0 ||
    p.scores.wrongAnswers > 0 ||
    p.scores.oralRating !== null
  )
)

const goHome = () => router.push('/')

const confirmAssignFinalist = () => {
  showAssignDialog.value = true
}

const assignFinalist = () => {
  if (leader.value) store.assignFinalist(leader.value.id)
  showAssignDialog.value = false
}

const confirmClearFinalist = () => {
  showClearDialog.value = true
}

const clearFinalist = () => {
  store.clearFinalist(props.region)
  showClearDialog.value = false
}
</script>

<style lang="sass" scoped>
@import '../quasar-variables.sass'

.semifinal-container
  padding: 16px
  max-width: 1600px
  margin: 0 auto

  .header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 28px
    padding: 16px 8px
    border-bottom: 1px solid rgba(54, 192, 232, 0.2)
    flex-wrap: wrap
    gap: 16px

    .header-left
      display: flex
      align-items: center
      gap: 14px

      .region-tag
        font-size: 0.8rem
        text-transform: uppercase
        letter-spacing: 2px
        color: rgba(54, 192, 232, 0.7)
        font-weight: 700

      .region-title
        margin: 0
        font-size: 2.2rem
        font-weight: 900
        background: linear-gradient(135deg, $secondary 0%, #ffd95e 100%)
        -webkit-background-clip: text
        background-clip: text
        color: transparent
        line-height: 1

    .header-right
      display: flex
      align-items: center
      gap: 14px
      flex-wrap: wrap

      .leader-info
        display: inline-flex
        align-items: center
        gap: 8px
        padding: 8px 16px
        border-radius: 999px
        background-color: rgba(54, 192, 232, 0.1)
        border: 1px solid rgba(54, 192, 232, 0.4)
        color: white
        font-weight: 600
        font-size: 0.9rem

        .q-icon
          color: $secondary

      .tie-badge
        display: inline-flex
        align-items: center
        gap: 8px
        padding: 8px 16px
        border-radius: 999px
        background-color: rgba(255,255,255,0.06)
        border: 1px solid rgba(255,255,255,0.15)
        color: rgba(255,255,255,0.7)
        font-weight: 600

      .assigned-badge
        display: inline-flex
        align-items: center
        gap: 10px
        padding: 8px 8px 8px 16px
        border-radius: 999px
        background: linear-gradient(135deg, $secondary 0%, #ffd95e 100%)
        color: $dark
        font-weight: 800
        box-shadow: 0 4px 16px rgba(255, 204, 41, 0.4)
        animation: pulseFinalist 2.5s ease-in-out infinite

        .q-icon
          font-size: 1.3rem

        .badge-text
          display: flex
          flex-direction: column
          line-height: 1.1

          .badge-label
            font-size: 0.7rem
            text-transform: uppercase
            letter-spacing: 1.5px
            opacity: 0.7

          .badge-name
            font-size: 1rem

      .assign-btn
        padding: 8px 18px !important
        font-weight: 800 !important
        border-radius: 999px !important
        box-shadow: 0 4px 16px rgba(255, 204, 41, 0.4) !important

  .participants-grid
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))
    gap: 24px
    justify-items: center

    @media (min-width: 1366px)
      grid-template-columns: repeat(4, 1fr)

    @media (max-width: 1365px) and (min-width: 700px)
      grid-template-columns: repeat(2, 1fr)

@keyframes pulseFinalist
  0%, 100%
    box-shadow: 0 4px 16px rgba(255, 204, 41, 0.4)
  50%
    box-shadow: 0 6px 24px rgba(255, 204, 41, 0.7)
</style>