import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const initialQuestions = [
    {
        id: 1,
        category: 'GRAN FINAL',
        icon: 'mdi-cellphone-off',
        formulation: 'Cada vez más estudiantes pasan gran parte del tiempo usando el celular durante clases o actividades escolares.',
        question: '¿Cómo abordarías esta situación sin que los estudiantes sientan que solo se les está prohibiendo o castigando?'
    },
    {
        id: 2,
        category: 'GRAN FINAL',
        icon: 'mdi-heart-pulse',
        formulation: 'Muchos estudiantes sienten estrés por las tareas, exámenes y problemas personales.',
        question: '¿Qué iniciativas propondrías para apoyar el bienestar emocional dentro del colegio?'
    },
    {
        id: 3,
        category: 'GRAN FINAL',
        icon: 'mdi-palette',
        formulation: 'Hay compañeros que tienen talento para el deporte, el arte o la música, pero sienten que esas habilidades son relegadas a un segundo nivel de importancia en la institución.',
        question: '¿Qué harías para darles más espacio y reconocimiento?'
    },
    {
        id: 4,
        category: 'GRAN FINAL',
        icon: 'mdi-lightbulb-on',
        formulation: 'Si pudieras cambiar una sola cosa de la vida estudiantil actual para mejorar el día a día de los jóvenes en los colegios.',
        question: '¿Qué cambiarías y por qué?'
    },
    {
        id: 5,
        category: 'GRAN FINAL',
        icon: 'mdi-ear-hearing',
        formulation: 'Como personero estudiantil.',
        question: '¿Cómo garantizas que las opiniones de todos los estudiantes sean escuchadas y tomadas en cuenta?'
    },
    {
        id: 6,
        category: 'GRAN FINAL',
        icon: 'mdi-handshake',
        formulation: 'Si en tu colegio hay un problema de convivencia entre la comunidad estudiantil.',
        question: '¿Qué propondrías para mejorar el bienestar común?'
    },
    {
        id: 7,
        category: 'GRAN FINAL',
        icon: 'mdi-shield-account',
        formulation: 'En tu colegio comienza a presentarse un caso de bullying y discriminación contra un estudiante, mientras muchos compañeros prefieren quedarse callados por miedo o indiferencia.',
        question: '¿Cómo actuarías frente a esta situación y qué propondrías para evitar que vuelva a repetirse dentro de la comunidad educativa?'
    },
    {
        id: 8,
        category: 'GRAN FINAL',
        icon: 'mdi-school',
        formulation: 'Se acerca el final del calendario escolar, y el índice de estudiantes que van perdiendo el año es muy alto.',
        question: '¿Qué plan implementarías para mejorar la situación?'
    }
]

export const useQuestionsStore = defineStore('questions', () => {
    const questions = ref(JSON.parse(JSON.stringify(initialQuestions)))
    const usedIds = ref([])

    // Getters
    const available = computed(() =>
        questions.value.filter(q => !usedIds.value.includes(q.id))
    )

    const used = computed(() =>
        questions.value.filter(q => usedIds.value.includes(q.id))
    )

    const isExhausted = computed(() => available.value.length === 0)

    const byId = (id) => questions.value.find(q => q.id === id)

    // Actions
    function markAsUsed(id) {
        if (!usedIds.value.includes(id)) {
            usedIds.value.push(id)
        }
    }

    function resetAll() {
        usedIds.value = []
    }

    return {
        // state
        questions,
        usedIds,
        // getters
        available,
        used,
        isExhausted,
        byId,
        // actions
        markAsUsed,
        resetAll
    }
}, {
    persist: true
})