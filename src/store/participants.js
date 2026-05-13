import { defineStore } from 'pinia'

export const participantsData = [
  // CARIBE
  { id: '01', region: 'caribe', name: 'Gabriangeli Marrero',
    photo: '/officials/barranquilla.png', age: 19,
    institution: 'I.E.D MARCO FIDEL SUÁREZ', city: 'Barranquilla',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '02', region: 'caribe', name: 'Giselle Paola Jiménez',
    photo: '/officials/santamarta.png', age: 19,
    institution: 'C.E DIVINA ENSEÑANZA', city: 'Santa Marta',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '03', region: 'caribe', name: 'Manuel Cantillo',
    photo: '/officials/orihueca.png', age: 19,
    institution: 'I.E.R RODRIGO VIVES DE ANDREIS - COLEGIO RURAL',
    city: 'Orihueca',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '04', region: 'caribe', name: 'Ana Victoria Garizao',
    photo: '/officials/laspiedras.png', age: 17,
    institution: 'I.E.T.A LAS PIEDRAS - COLEGIO NEGRITUDES',
    city: 'Las Piedras',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  // ANDINA
  { id: '05', region: 'andina', name: 'Alexandra Ariza Puentes',
    photo: '/officials/nuestrasrasalud.png', age: 19,
    institution: 'NUESTRA SEÑORA DE LA SALUD', city: 'Supatá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '06', region: 'andina', name: 'David Gerónimo Peñuela Pinzón',
    photo: '/officials/militar.png', age: 18,
    institution: 'MILITAR LICEO SOCIAL COMPARTIR', city: 'Sasaima',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '07', region: 'andina', name: 'Martina Santos',
    photo: '/officials/jaime.png', age: 17,
    institution: 'JAIME NIÑO DIEZ', city: 'Bogotá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } },
  { id: '08', region: 'andina', name: 'Leydi López',
    photo: '/officials/jhon.png', age: 16,
    institution: 'JOHN F KENNEDY', city: 'Bogotá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null } }
]

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    participants: participantsData,
    championId: null,
    finalistCaribeId: null,
    finalistAndinaId: null
  }),

  getters: {
    byRegion: (state) => (region) => {
      return state.participants.filter(
        p => p.region.toLowerCase() === region.toLowerCase()
      )
    },

    byId: (state) => (id) => {
      return state.participants.find(p => p.id === id)
    },

    totalPoints: (state) => (id) => {
      const p = state.participants.find(x => x.id === id)
      if (!p) return 0
      return p.scores.correctAnswers + (p.scores.oralRating ?? 0)
    },

    // Líder actual de la región (sugerencia, no decisión final)
    leaderByRegion(state) {
      return (region) => {
        const regional = state.participants.filter(
          p => p.region.toLowerCase() === region.toLowerCase()
        )
        if (regional.length === 0) return null

        const withTotals = regional.map(p => ({
          participant: p,
          total: p.scores.correctAnswers + (p.scores.oralRating ?? 0)
        }))

        const max = Math.max(...withTotals.map(x => x.total))
        const top = withTotals.filter(x => x.total === max)

        if (top.length > 1 || max === 0) return null
        return top[0].participant
      }
    },

    // Finalista CONFIRMADO de la región (asignado por el operador)
    finalistByRegion(state) {
      return (region) => {
        const id = region.toLowerCase() === 'caribe'
          ? state.finalistCaribeId
          : state.finalistAndinaId
        if (!id) return null
        return state.participants.find(p => p.id === id) || null
      }
    },

    finalists() {
      return [
        this.finalistByRegion('caribe'),
        this.finalistByRegion('andina')
      ]
    },

    tournamentState(state) {
      const hasScores = (region) => {
        return state.participants
          .filter(p => p.region.toLowerCase() === region.toLowerCase())
          .some(p => p.scores.correctAnswers > 0 ||
                     p.scores.wrongAnswers > 0 ||
                     p.scores.oralRating !== null)
      }

      const caribeStarted = hasScores('caribe')
      const andinaStarted = hasScores('andina')
      const caribeFinalist = !!state.finalistCaribeId
      const andinaFinalist = !!state.finalistAndinaId

      return {
        caribe: !caribeStarted ? 'pendiente'
              : caribeFinalist ? 'definida'
              : 'en curso',
        andina: !andinaStarted ? 'pendiente'
              : andinaFinalist ? 'definida'
              : 'en curso',
        final: (caribeFinalist && andinaFinalist)
              ? (state.championId ? 'coronado' : 'lista')
              : 'pendiente'
      }
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
      this.championId = null
      this.finalistCaribeId = null
      this.finalistAndinaId = null
    },
    resetParticipant(id) {
      const p = this.participants.find(x => x.id === id)
      if (p) {
        p.scores.correctAnswers = 0
        p.scores.wrongAnswers = 0
        p.scores.oralRating = null
      }
    },
    // Asigna finalista de una región (acción explícita del operador)
    assignFinalist(id) {
      const p = this.participants.find(x => x.id === id)
      if (!p) return
      if (p.region === 'caribe') this.finalistCaribeId = id
      else if (p.region === 'andina') this.finalistAndinaId = id
    },
    clearFinalist(region) {
      if (region.toLowerCase() === 'caribe') this.finalistCaribeId = null
      else if (region.toLowerCase() === 'andina') this.finalistAndinaId = null
      // Si descalifico finalista, también descorono
      this.championId = null
    },
    crownChampion(id) {
      this.championId = id
    },
    resetChampion() {
      this.championId = null
    }
  },

  persist: true
})