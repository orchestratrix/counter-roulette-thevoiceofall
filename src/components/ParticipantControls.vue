<template>
  <div class="participant-controls">
    <div class="control-group">
      <q-btn 
        dense 
        round 
        color="green" 
        icon="mdi-check-circle" 
        @click="addCorrect"
        class="control-btn"
      />
      <q-btn 
        dense 
        round 
        color="red" 
        icon="mdi-close-circle" 
        @click="addWrong"
        class="control-btn"
      />
    </div>
    
    <div class="control-group">
      <q-btn 
        dense 
        round 
        flat 
        color="grey" 
        icon="mdi-minus-circle" 
        @click="removeCorrect"
        class="control-btn small"
      />
      <q-btn 
        dense 
        round 
        flat 
        color="grey" 
        icon="mdi-minus-circle" 
        @click="removeWrong"
        class="control-btn small"
      />
    </div>
    
    <div class="rating-control">
      <q-rating
        v-model="localOralRating"
        :max="5"
        size="1.5em"
        color="yellow"
        icon="star"
        :icon-selected="['star', 'star', 'star', 'star', 'star']"
        no-dimming
      />
    </div>
    
    <div class="reset-control">
      <q-btn 
        dense 
        round 
        flat 
        color="grey" 
        icon="mdi-restart" 
        @click="confirmReset"
        class="control-btn"
      />
    </div>
    
    <q-dialog v-model="showResetDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar reinicio</div>
          <div class="text-body1">¿Estás seguro de que deseas reiniciar los puntajes de este participante?</div>
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
    const localOralRating = ref(store.byId(props.participantId)?.oralRating || null)
    
    // Watch for changes in the store and update local rating
    watch(
      () => store.byId(props.participantId)?.oralRating,
      (newRating) => {
        localOralRating.value = newRating
      }
    )
    
    const addCorrect = () => {
      store.addCorrect(props.participantId)
    }
    
    const addWrong = () => {
      store.addWrong(props.participantId)
    }
    
    const removeCorrect = () => {
      store.removeCorrect(props.participantId)
    }
    
    const removeWrong = () => {
      store.removeWrong(props.participantId)
    }
    
    const setOralRating = (rating) => {
      store.setOralRating(props.participantId, rating)
    }
    
    // Watch local rating changes and update store
    watch(localOralRating, (newRating) => {
      setOralRating(newRating)
    })
    
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
  
.control-group
  display: flex
  gap: 4px
  justify-content: center
  
.control-btn
  &.small
    transform: scale(0.8)
    
.rating-control
  display: flex
  justify-content: center
  padding: 4px 0
  
.reset-control
  display: flex
  justify-content: center
</style>