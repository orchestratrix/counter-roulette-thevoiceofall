<template>
  <div class="participant-controls">
    <div class="control-group">
      <q-btn 
        dense round
        color="positive"
        icon="mdi-check-circle"
        @click="addCorrect"
        class="control-btn"
      />
      <q-btn 
        dense round
        color="negative"
        icon="mdi-close-circle"
        @click="addWrong"
        class="control-btn"
      />
    </div>
    
    <div class="control-group">
      <q-btn 
        dense round flat
        color="grey-7"
        icon="mdi-minus"
        size="sm"
        @click="removeCorrect"
        class="control-btn small"
      />
      <q-btn 
        dense round flat
        color="grey-7"
        icon="mdi-minus"
        size="sm"
        @click="removeWrong"
        class="control-btn small"
      />
    </div>
    
    <div class="rating-control">
      <q-rating
        v-model="localOralRating"
        :max="5"
        size="1.2em"
        color="yellow-7"
        icon="star_border"
        icon-selected="star"
      />
    </div>
    
    <div class="reset-control">
      <q-btn 
        dense round flat
        color="grey-7"
        icon="mdi-restart"
        size="sm"
        @click="confirmReset"
      />
    </div>
    
    <q-dialog v-model="showResetDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar reinicio</div>
          <div class="text-body1">¿Reiniciar puntajes de este participante?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Reiniciar" color="negative" @click="resetParticipant" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useParticipantsStore } from '../store/participants'

export default {
  name: 'ParticipantControls',
  props: {
    participantId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useParticipantsStore()
    const showResetDialog = ref(false)
    
    // FIX: lee de scores.oralRating, no de oralRating plano
    const localOralRating = ref(store.byId(props.participantId)?.scores?.oralRating || 0)
    
    // FIX: watch sobre scores.oralRating
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
    
    return {
      localOralRating,
      showResetDialog,
      addCorrect,
      addWrong,
      removeCorrect,
      removeWrong,
      confirmReset,
      resetParticipant
    }
  }
}
</script>

<style lang="sass" scoped>
.participant-controls
  display: flex
  flex-direction: column
  gap: 8px
  padding: 8px
  align-items: center

.control-group
  display: flex
  gap: 4px
  justify-content: center

.control-btn
  &.small
    transform: scale(0.85)

.rating-control
  display: flex
  justify-content: center
  padding: 4px 0

.reset-control
  display: flex
  justify-content: center
</style>