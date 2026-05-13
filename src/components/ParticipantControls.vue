<template>
  <div class="participant-controls">
    <div class="control-group main">
      <q-btn
        dense round unelevated
        color="positive"
        icon="mdi-check"
        @click="addCorrect"
        size="md"
      >
        <q-tooltip>Sumar acierto</q-tooltip>
      </q-btn>
      <q-btn
        dense round unelevated
        color="negative"
        icon="mdi-close"
        @click="addWrong"
        size="md"
      >
        <q-tooltip>Sumar error</q-tooltip>
      </q-btn>
    </div>

    <div class="control-group small">
      <q-btn
        dense round flat
        color="grey-4"
        icon="mdi-minus"
        size="xs"
        @click="removeCorrect"
      >
        <q-tooltip>Restar acierto</q-tooltip>
      </q-btn>
      <q-btn
        dense round flat
        color="grey-4"
        icon="mdi-minus"
        size="xs"
        @click="removeWrong"
      >
        <q-tooltip>Restar error</q-tooltip>
      </q-btn>
    </div>

    <div class="rating-control">
      <q-rating
        v-model="localOralRating"
        :max="5"
        size="1.1em"
        color="yellow-7"
        icon="star_border"
        icon-selected="star"
      />
    </div>

    <div class="reset-control">
      <q-btn
        dense round flat
        color="grey-5"
        icon="mdi-restart"
        size="sm"
        @click="confirmReset"
      >
        <q-tooltip>Reiniciar puntajes</q-tooltip>
      </q-btn>
    </div>

    <q-dialog v-model="showResetDialog">
      <q-card style="min-width: 320px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Confirmar reinicio</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1">
            ¿Reiniciar puntajes de
            <strong>{{ participantName }}</strong>?
          </div>
          <div class="text-caption text-grey-7 q-mt-sm">
            Esta acción no se puede deshacer.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            unelevated label="Reiniciar"
            color="negative"
            @click="resetParticipant"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useParticipantsStore } from '../store/participants'

const props = defineProps({
  participantId: { type: String, required: true }
})

const store = useParticipantsStore()
const showResetDialog = ref(false)

const participantName = computed(
  () => store.byId(props.participantId)?.name || ''
)

const localOralRating = ref(
  store.byId(props.participantId)?.scores?.oralRating || 0
)

watch(
  () => store.byId(props.participantId)?.scores?.oralRating,
  (newRating) => {
    localOralRating.value = newRating || 0
  }
)

watch(localOralRating, (newRating) => {
  store.setOralRating(props.participantId, newRating)
})

const addCorrect = () => store.addCorrect(props.participantId)
const addWrong = () => store.addWrong(props.participantId)
const removeCorrect = () => store.removeCorrect(props.participantId)
const removeWrong = () => store.removeWrong(props.participantId)

const confirmReset = () => {
  showResetDialog.value = true
}

const resetParticipant = () => {
  store.resetParticipant(props.participantId)
  showResetDialog.value = false
}
</script>

<style lang="sass" scoped>
.participant-controls
  display: flex
  flex-direction: column
  gap: 8px
  padding: 6px 4px
  align-items: center
  width: 100%

  .control-group
    display: flex
    flex-direction: column
    gap: 6px
    justify-content: center
    align-items: center

    &.small
      gap: 2px

  .rating-control
    display: flex
    justify-content: center
    padding: 4px 0
    border-top: 1px solid rgba(255,255,255,0.2)
    border-bottom: 1px solid rgba(255,255,255,0.2)
    width: 100%

  .reset-control
    display: flex
    justify-content: center
</style>