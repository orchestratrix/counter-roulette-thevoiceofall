import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const initialQuestions = [
    {
        id: 1,
        category: 'GOBIERNO ESCOLAR',
        icon: 'mdi-bullhorn',
        formulation: 'En muchos colegios los estudiantes sienten que las decisiones importantes ya están tomadas antes de escuchar sus opiniones.',
        question: '¿Qué cree que debería cambiar para que el gobierno escolar tenga una participación más real dentro de las instituciones?'
    },
    {
        id: 2,
        category: 'GOBIERNO ESCOLAR',
        icon: 'mdi-account-group',
        formulation: 'A veces, después de las elecciones, algunos representantes estudiantiles pierden cercanía con quienes los eligieron y dejan de escuchar sus necesidades.',
        question: '¿Qué cree que debería hacer un líder para mantenerse conectado con la comunidad que representa?'
    },
    {
        id: 3,
        category: 'GOBIERNO ESCOLAR',
        icon: 'mdi-lightbulb-on',
        formulation: 'En algunos colegios, los estudiantes sienten que las propuestas del gobierno escolar quedan solo en el papel y no generan cambios visibles.',
        question: '¿Qué cree que hace falta para que las ideas realmente se conviertan en acciones dentro de una institución?'
    },
    {
        id: 4,
        category: 'GOBIERNO ESCOLAR',
        icon: 'mdi-target',
        formulation: 'Hay ocasiones donde los representantes estudiantiles terminan enfocándose más en actividades recreativas que en problemas importantes de la comunidad.',
        question: '¿Cuál cree que debería ser la verdadera prioridad de un gobierno escolar?'
    },
    {
        id: 5,
        category: 'GOBIERNO ESCOLAR',
        icon: 'mdi-magnify',
        formulation: 'En muchos procesos estudiantiles, las campañas se enfocan más en ganar popularidad que en discutir propuestas de fondo.',
        question: '¿Qué cree que debería valorar realmente una comunidad al momento de elegir a sus representantes?'
    },
    {
        id: 6,
        category: 'PARTICIPACIÓN ESTUDIANTIL',
        icon: 'mdi-account-multiple-outline',
        formulation: 'En la mayoría de procesos escolares siempre participan los mismos estudiantes, mientras muchos otros prefieren quedarse al margen.',
        question: '¿Por qué cree que sucede eso y cómo podría cambiarse esa realidad dentro de los colegios?'
    },
    {
        id: 7,
        category: 'PARTICIPACIÓN ESTUDIANTIL',
        icon: 'mdi-cellphone',
        formulation: 'Actualmente muchos jóvenes expresan sus opiniones en redes sociales, pero participan poco en espacios de discusión dentro de sus instituciones.',
        question: '¿Qué cree que hace falta para que los estudiantes vuelvan a involucrarse más en este tipo de escenarios?'
    },
    {
        id: 8,
        category: 'PARTICIPACIÓN ESTUDIANTIL',
        icon: 'mdi-handshake',
        formulation: 'Muchos estudiantes sienten que participar no vale la pena porque las decisiones importantes terminan dependiendo de los adultos.',
        question: '¿Cómo cree que se puede fortalecer la confianza de los jóvenes en estos espacios de participación?'
    },
    {
        id: 9,
        category: 'PARTICIPACIÓN ESTUDIANTIL',
        icon: 'mdi-calendar-check',
        formulation: 'En algunos colegios, los estudiantes solo se interesan por estos procesos cuando hay campañas o elecciones.',
        question: '¿Cómo cree que se podría mantener una participación activa durante todo el año y no solo en época electoral?'
    },
    {
        id: 10,
        category: 'PARTICIPACIÓN ESTUDIANTIL',
        icon: 'mdi-message-text',
        formulation: 'Hay jóvenes que tienen buenas ideas, pero no participan porque sienten miedo a ser juzgados o ignorados por los demás.',
        question: '¿Qué cree que debería cambiar dentro de los colegios para que más estudiantes se animen a expresar lo que piensan?'
    },
    {
        id: 11,
        category: 'ÉTICA',
        icon: 'mdi-scale-balance',
        formulation: 'En ocasiones, algunos líderes hacen promesas muy populares durante campaña aun sabiendo que serán difíciles de cumplir.',
        question: '¿Qué cree que demuestra realmente la ética de una persona cuando asume una posición de liderazgo?'
    },
    {
        id: 12,
        category: 'ÉTICA',
        icon: 'mdi-gavel',
        formulation: 'Muchas veces un líder debe tomar decisiones que pueden beneficiar a unos estudiantes y afectar a otros.',
        question: '¿Cómo cree que una persona debe actuar cuando tiene la responsabilidad de decidir por toda una comunidad?'
    },
    {
        id: 13,
        category: 'ÉTICA',
        icon: 'mdi-shield-account',
        formulation: 'En algunos casos, los líderes reciben presión de sus amigos, compañeros o grupos cercanos para tomar ciertas decisiones.',
        question: '¿Cómo cree que una persona puede mantener su criterio y actuar correctamente en medio de esa presión?'
    },
    {
        id: 14,
        category: 'ÉTICA',
        icon: 'mdi-microphone',
        formulation: 'Muchas veces las personas apoyan a quien habla mejor o tiene más carisma, incluso por encima de quienes tienen propuestas más sólidas.',
        question: '¿Qué cree que dice eso sobre la manera en que elegimos a nuestros líderes?'
    },
    {
        id: 15,
        category: 'ÉTICA',
        icon: 'mdi-account-heart',
        formulation: 'Hay decisiones que pueden ser populares para la mayoría, pero injustas para un grupo pequeño de personas.',
        question: '¿Qué responsabilidad tiene un líder cuando debe tomar decisiones que afectan de manera diferente a su comunidad?'
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