import { defineStore } from 'pinia'
import piniaPLuginPersistedstate from 'pinia-plugin-persistedstate'

// Datos de los participantes
const participantsData = [
  { id: 'caribe-01', region: 'caribe', name: 'Ana Sofía', lastName: 'Pérez', age: 24, city: 'Cartagena', avatar: 'public/officials/caribe-01.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'caribe-02', region: 'caribe', name: 'Carlos', lastName: 'Gómez', age: 27, city: 'Barranquilla', avatar: 'public/officials/caribe-02.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'caribe-03', region: 'caribe', name: 'Valentina', lastName: 'Rodríguez', age: 22, city: 'Santa Marta', avatar: 'public/officials/caribe-03.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'caribe-04', region: 'caribe', name: 'Mateo', lastName: 'Jiménez', age: 26, city: 'Montería', avatar: 'public/officials/caribe-04.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'andina-01', region: 'andina', name: 'Mariana', lastName: 'López', age: 25, city: 'Bogotá', avatar: 'public/officials/andina-01.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'andina-02', region: 'andina', name: 'Juan David', lastName: 'Ramírez', age: 28, city: 'Medellín', avatar: 'public/officials/andina-02.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'andina-03', region: 'andina', name: 'Isabella', lastName: 'García', age: 23, city: 'Cali', avatar: 'public/officials/andina-03.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null },
  { id: 'andina-04', region: 'andina', name: 'Sebastián', lastName: 'Martínez', age: 29, city: 'Manizales', avatar: 'public/officials/andina-04.jpg', correctAnswers: 0, wrongAnswers: 0, oralRating: null }
]

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    participants: participantsData
  }),
  
  getters: {
    byRegion: (state) => (region) => {
      return state.participants.filter(participant => participant.region === region)
    },
    
    byId: (state) => (id) => {
      return state.participants.find(participant => participant.id === id)
    },
    
    totalPoints: (state) => (id) => {
      const participant = state.byId(id)
      if (!participant) return 0
      return participant.correctAnswers + (participant.oralRating ?? 0)
    }
  },
  
  actions: {
    // Actions preparadas para Issue #2 (stubs)
    addCorrect(id) {
      const participant = this.byId(id)
      if (participant) participant.correctAnswers++
    },
    
    addWrong(id) {
      const participant = this.byId(id)
      if (participant) participant.wrongAnswers++
    },
    
    removeCorrect(id) {
      const participant = this.byId(id)
      if (participant) participant.correctAnswers = Math.max(0, participant.correctAnswers - 1)
    },
    
    removeWrong(id) {
      const participant = this.byId(id)
      if (participant) participant.wrongAnswers = Math.max(0, participant.wrongAnswers - 1)
    },
    
    setOralRating(id, rating) {
      const participant = this.byId(id)
      if (participant && rating >= 1 && rating <= 5) {
        participant.oralRating = Math.floor(rating)
      } else if (participant) {
        participant.oralRating = null
      }
    },
    
    resetScores() {
      this.participants.forEach(participant => {
        participant.correctAnswers = 0
        participant.wrongAnswers = 0
        participant.oralRating = null
      })
    },
    
    resetParticipant(id) {
      const participant = this.byId(id)
      if (participant) {
        participant.correctAnswers = 0
        participant.wrongAnswers = 0
        participant.oralRating = null
      }
    }
  },
  
  persist: true
})