import { defineStore } from 'pinia'

export const participantsData = [
  // CARIBE
  { id: '01', region: 'Caribe', name: 'Gabriangeli Marrero', 
    photo: '/officials/barranquilla.png', age: 19, 
    institution: 'I.E.D MARCO FIDEL SUÁREZ', city: 'Barranquilla',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '02', region: 'Caribe', name: 'Giselle Paola Jiménez', 
    photo: '/officials/santamarta.png', age: 19, 
    institution: 'C.E DIVINA ENSEÑANZA', city: 'Santa Marta',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '03', region: 'Caribe', name: 'Manuel Cantillo', 
    photo: '/officials/orihueca.png', age: 19, 
    institution: 'I.E.R RODRIGO VIVES DE ANDREIS - COLEGIO RURAL', 
    city: 'Orihueca',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '04', region: 'Caribe', name: 'Ana Victoria Garizao', 
    photo: '/officials/laspiedras.png', age: 19, 
    institution: 'I.E.T.A LAS PIEDRAS - COLEGIO NEGRITUDES', 
    city: 'Las Piedras',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  // ANDINA
  { id: '05', region: 'Andina', name: 'Alexandra Ariza Puentes', 
    photo: '/officials/nuestrasrasalud.png', age: 19, 
    institution: 'NUESTRA SEÑORA DE LA SALUD', city: 'Supatá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '06', region: 'Andina', name: 'David Gerónimo Peñuela Pinzón', 
    photo: '/officials/militar.png', age: 18, 
    institution: 'MILITAR LICEO SOCIAL COMPARTIR', city: 'Sasaima',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '07', region: 'Andina', name: 'Martina Santos', 
    photo: '/officials/jaime.png', age: 17, 
    institution: 'JAIME NIÑO DIEZ', city: 'Bogotá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '08', region: 'Andina', name: 'Leydi López', 
    photo: '/officials/jhon.png', age: 16, 
    institution: 'JOHN F KENNEDY', city: 'Bogotá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } }
]

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    participants: participantsData
  }),

  getters: {
    byRegion: (state) => (region) => {
      return state.participants.filter(p => p.region.toLowerCase() === region.toLowerCase())
    },

    byId: (state) => (id) => {
      return state.participants.find(p => p.id === id)
    },

    totalPoints: (state) => (id) => {
      const p = state.participants.find(x => x.id === id)
      if (!p) return 0
      return p.scores.correctAnswers + (p.scores.oralRating ?? 0)
    }
  },

  actions: {
    addCorrect(id) {
      const p = this.participants.find(x => x.id === id)
      if (p) p.scores.correctAnswers++
    },
    addWrong(id) {
      const p = this.participants.find(x => x.id === id)
      if (p) p.scores.wrongAnswers++
    },
    removeCorrect(id) {
      const p = this.participants.find(x => x.id === id)
      if (p) p.scores.correctAnswers = Math.max(0, p.scores.correctAnswers - 1)
    },
    removeWrong(id) {
      const p = this.participants.find(x => x.id === id)
      if (p) p.scores.wrongAnswers = Math.max(0, p.scores.wrongAnswers - 1)
    },
    setOralRating(id, rating) {
      const p = this.participants.find(x => x.id === id)
      if (!p) return
      if (rating >= 1 && rating <= 5) {
        p.scores.oralRating = Math.floor(rating)
      } else {
        p.scores.oralRating = null
      }
    },
    resetScores() {
      this.participants.forEach(p => {
        p.scores.correctAnswers = 0
        p.scores.wrongAnswers = 0
        p.scores.oralRating = null
      })
    },
    resetParticipant(id) {
      const p = this.participants.find(x => x.id === id)
      if (p) {
        p.scores.correctAnswers = 0
        p.scores.wrongAnswers = 0
        p.scores.oralRating = null
      }
    }
  },

  persist: true
})