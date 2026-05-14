import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const initialParticipants = [
  // CARIBE
  {
    id: '01', region: 'zona norte', name: 'Gabriangeli Marrero',
    photo: '/officials/barranquilla.png', age: 17,
    institution: 'I.E.D MARCO FIDEL SUÁREZ', city: 'Barranquilla',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  {
    id: '02', region: 'zona norte', name: 'Manuel Cantillo',
    photo: '/officials/orihueca.png', age: 17,
    institution: 'I.E.R RODRIGO VIVES DE ANDREIS - COLEGIO RURAL',
    city: 'Orihueca',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  {
    id: '03', region: 'zona norte', name: 'Giselle Paola Jiménez',
    photo: '/officials/santamarta.png', age: 16,
    institution: 'C.E DIVINA ENSEÑANZA', city: 'Santa Marta',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  {
    id: '04', region: 'zona norte', name: 'Ana Victoria Garizao',
    photo: '/officials/laspiedras.png', age: 17,
    institution: 'I.E.T.A LAS PIEDRAS - COLEGIO NEGRITUDES',
    city: 'Las Piedras',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  // ANDINA
  {
    id: '05', region: 'zona andina', name: 'Alexandra Ariza Puentes',
    photo: '/officials/nuestrasrasalud.png', age: 15,
    institution: 'NUESTRA SEÑORA DE LA SALUD', city: 'Supatá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  {
    id: '06', region: 'zona andina', name: 'Martina Santos',
    photo: '/officials/jaime.png', age: 16,
    institution: 'JAIME NIÑO DIEZ', city: 'Bogotá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  {
    id: '07', region: 'zona andina', name: 'David Gerónimo Peñuela Pinzón',
    photo: '/officials/militar.png', age: 16,
    institution: 'MILITAR LICEO SOCIAL COMPARTIR', city: 'Sasaima',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  },
  {
    id: '08', region: 'zona andina', name: 'Leydi López',
    photo: '/officials/jhon.png', age: 18,
    institution: 'JOHN F KENNEDY', city: 'Bogotá',
    scores: { correctAnswers: 0, wrongAnswers: 0, oralRating: null }
  }
]

export const useParticipantsStore = defineStore('participants', () => {
  const participants = ref(JSON.parse(JSON.stringify(initialParticipants)))
  const championId = ref(null)
  const finalistNorteId = ref(null)
  const finalistAndinaId = ref(null)

  // Helpers internos
  const findById = (id) => participants.value.find(p => p.id === id)
  const calcTotal = (p) => p.scores.correctAnswers + (p.scores.oralRating ?? 0)

  // Getters como computed/funciones
  const byRegion = (region) =>
    participants.value.filter(p => p.region.toLowerCase() === region.toLowerCase())

  const byId = (id) => findById(id)

  const totalPoints = (id) => {
    const p = findById(id)
    return p ? calcTotal(p) : 0
  }

  const leaderByRegion = (region) => {
    const regional = byRegion(region)
    if (regional.length === 0) return null

    const withTotals = regional.map(p => ({ participant: p, total: calcTotal(p) }))
    const max = Math.max(...withTotals.map(x => x.total))
    const top = withTotals.filter(x => x.total === max)

    if (top.length > 1 || max === 0) return null
    return top[0].participant
  }

  const finalistByRegion = (region) => {
    const id = region.toLowerCase() === 'zona norte'
      ? finalistNorteId.value
      : finalistAndinaId.value
    return id ? findById(id) : null
  }

  const finalists = computed(() => [
    finalistByRegion('zona norte'),
    finalistByRegion('zona andina')
  ])

  const tournamentState = computed(() => {
    const hasScores = (region) =>
      byRegion(region).some(p =>
        p.scores.correctAnswers > 0 ||
        p.scores.wrongAnswers > 0 ||
        p.scores.oralRating !== null
      )

    const norteStarted = hasScores('zona norte')
    const andinaStarted = hasScores('zona andina')
    const norteFinalist = !!finalistNorteId.value
    const andinaFinalist = !!finalistAndinaId.value

    return {
      norte: norteFinalist ? 'definida'
        : norteStarted ? 'en curso'
          : 'pendiente',
      andina: andinaFinalist ? 'definida'
        : andinaStarted ? 'en curso'
          : 'pendiente',
      final: (norteFinalist && andinaFinalist)
        ? (championId.value ? 'coronado' : 'lista')
        : 'pendiente'
    }
  })

  // Actions
  function addCorrect(id) {
    const p = findById(id)
    if (p) p.scores.correctAnswers++
  }

  function addWrong(id) {
    const p = findById(id)
    if (p) p.scores.wrongAnswers++
  }

  function removeCorrect(id) {
    const p = findById(id)
    if (p) p.scores.correctAnswers = Math.max(0, p.scores.correctAnswers - 1)
  }

  function removeWrong(id) {
    const p = findById(id)
    if (p) p.scores.wrongAnswers = Math.max(0, p.scores.wrongAnswers - 1)
  }

  function setOralRating(id, rating) {
    const p = findById(id)
    if (!p) return
    p.scores.oralRating = (rating >= 1 && rating <= 5) ? Math.floor(rating) : null
  }

  function resetParticipantScores(id) {
    const p = findById(id)
    if (p) {
      p.scores.correctAnswers = 0
      p.scores.wrongAnswers = 0
      p.scores.oralRating = null
    }
  }

  function resetScores() {
    participants.value.forEach(p => {
      p.scores.correctAnswers = 0
      p.scores.wrongAnswers = 0
      p.scores.oralRating = null
    })
    championId.value = null
    finalistNorteId.value = null
    finalistAndinaId.value = null
  }

  // Asigna finalista de una región Y reinicia su score para la final
  function assignFinalist(id) {
    const p = findById(id)
    if (!p) return

    resetParticipantScores(id)

    if (p.region === 'zona norte') finalistNorteId.value = id
    else if (p.region === 'zona andina') finalistAndinaId.value = id
  }

  function clearFinalist(region) {
    if (region.toLowerCase() === 'zona norte') finalistCaribeId.value = null
    else if (region.toLowerCase() === 'zona andina') finalistAndinaId.value = null
    championId.value = null
  }

  function crownChampion(id) {
    championId.value = id
  }

  function resetChampion() {
    championId.value = null
  }

  return {
    // state
    participants,
    championId,
    finalistNorteId,
    finalistAndinaId,
    // getters
    byRegion,
    byId,
    totalPoints,
    leaderByRegion,
    finalistByRegion,
    finalists,
    tournamentState,
    // actions
    addCorrect,
    addWrong,
    removeCorrect,
    removeWrong,
    setOralRating,
    resetParticipantScores,
    resetScores,
    assignFinalist,
    clearFinalist,
    crownChampion,
    resetChampion
  }
}, {
  persist: true
})