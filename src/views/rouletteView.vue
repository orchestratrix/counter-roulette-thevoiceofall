<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '../store/questions'
import RouletteWheel from '../components/RouletteWheel.vue'
import QuestionModal from '../components/QuestionModal.vue'

const store = useQuestionsStore()
const router = useRouter()

const modalOpen = ref(false)
const currentQuestion = ref(null)
const showResetDialog = ref(false)

const totalQuestions = computed(() => store.questions.length)
const usedCount = computed(() => store.usedIds.length)
const remainingCount = computed(() => store.available.length)
const progress = computed(() => usedCount.value / totalQuestions.value)

function goHome() {
    router.push('/')
}

function onSpinEnd(question) {
    currentQuestion.value = question
    modalOpen.value = true
}

function onQuestionClosed() {
    if (currentQuestion.value) {
        store.markAsUsed(currentQuestion.value.id)
    }
    modalOpen.value = false
    // Mantenemos currentQuestion mientras se cierra el modal para no romper el render
    setTimeout(() => { currentQuestion.value = null }, 300)
}

function confirmReset() {
    showResetDialog.value = true
}

function resetAll() {
    store.resetAll()
    showResetDialog.value = false
}
</script>

<template>
    <div class="roulette-view">
        <!-- Header con navegación y acciones -->
        <div class="view-header">
            <div class="header-left">
                <q-btn flat round dense icon="mdi-arrow-left" color="white" @click="goHome" />
                <div>
                    <div class="page-tag">Argumentación · Semifinales</div>
                    <h1 class="page-title">La Voz de Todos</h1>
                </div>
            </div>

            <div class="header-right">
                <div class="progress-pill" :class="{ 'is-exhausted': store.isExhausted }">
                    <q-icon :name="store.isExhausted ? 'mdi-check-all' : 'mdi-counter'" />
                    <span>
                        <strong>{{ remainingCount }}</strong> / {{ totalQuestions }} disponibles
                    </span>
                </div>

                <q-btn v-if="usedCount > 0" flat dense no-caps icon="mdi-restart" label="Reiniciar" color="white"
                    @click="confirmReset" class="reset-btn">
                    <q-tooltip>Restaurar las 15 preguntas</q-tooltip>
                </q-btn>
            </div>
        </div>

        <!-- Estado: todas las preguntas usadas -->
        <div v-if="store.isExhausted" class="exhausted-panel">
            <q-icon name="mdi-trophy-award" size="4rem" color="yellow-7" />
            <h2>¡Todas las preguntas fueron usadas!</h2>
            <p>Las 15 preguntas de argumentación se han agotado.</p>
            <q-btn unelevated no-caps size="lg" color="secondary" text-color="dark" icon="mdi-restart"
                label="Reiniciar ruleta" @click="confirmReset" class="exhausted-btn" />
        </div>

        <!-- Ruleta -->
        <template v-else>
            <RouletteWheel :available-questions="store.available" :disabled="modalOpen" @spin-end="onSpinEnd" />

            <!-- Footer informativo -->
            <div class="view-footer">
                <div class="category-legend">
                    <div class="legend-item">
                        <span class="legend-dot" style="background: #E63946"></span>
                        <span>Gobierno Escolar</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot" style="background: #0749BF"></span>
                        <span>Participación Estudiantil</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot" style="background: #FFCC29"></span>
                        <span>Ética</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- Modal de pregunta -->
        <QuestionModal v-model="modalOpen" :question="currentQuestion" @close="onQuestionClosed" />

        <!-- Dialog de confirmación de reinicio -->
        <q-dialog v-model="showResetDialog">
            <q-card class="reset-dialog" style="min-width: 380px">
                <q-card-section class="bg-negative text-white">
                    <div class="text-h6">Reiniciar ruleta</div>
                </q-card-section>
                <q-card-section>
                    <div class="text-body1">
                        ¿Restaurar las <strong>15 preguntas</strong>?
                    </div>
                    <div class="text-caption text-grey-7 q-mt-sm">
                        Todas las casillas usadas volverán a estar disponibles.
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="primary" v-close-popup />
                    <q-btn unelevated label="Reiniciar" color="negative" @click="resetAll" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style scoped>
.roulette-view {
    padding: 16px;
    max-width: 1600px;
    margin: 0 auto;
    min-height: 100vh;
}

.view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 16px 8px;
    border-bottom: 1px solid rgba(54, 192, 232, 0.2);
    flex-wrap: wrap;
    gap: 16px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.page-tag {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(54, 192, 232, 0.7);
    font-weight: 700;
}

.page-title {
    margin: 0;
    font-size: 2rem;
    font-weight: 900;
    color: #FFCC29;
    line-height: 1;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.progress-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    background-color: rgba(54, 192, 232, 0.1);
    border: 1px solid rgba(54, 192, 232, 0.4);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.progress-pill .q-icon {
    color: #FFCC29;
}

.progress-pill.is-exhausted {
    background-color: rgba(33, 186, 69, 0.15);
    border-color: rgba(33, 186, 69, 0.5);
}

.progress-pill.is-exhausted .q-icon {
    color: #21BA45;
}

.reset-btn {
    padding: 6px 16px !important;
    border-radius: 999px !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.exhausted-panel {
    background-color: rgba(255, 204, 41, 0.08);
    border: 1px solid rgba(255, 204, 41, 0.4);
    border-radius: 16px;
    padding: 60px 40px;
    text-align: center;
    max-width: 560px;
    margin: 80px auto;
}

.exhausted-panel h2 {
    margin: 18px 0 8px;
    color: #FFCC29;
    font-size: 1.8rem;
}

.exhausted-panel p {
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 28px 0;
    font-size: 1.05rem;
}

.exhausted-btn {
    padding: 12px 36px !important;
    border-radius: 999px !important;
    font-weight: 800 !important;
    box-shadow: 0 8px 24px rgba(255, 204, 41, 0.4) !important;
}

.view-footer {
    margin-top: 24px;
    padding: 16px;
}

.category-legend {
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
    padding: 14px 20px;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    max-width: 720px;
    margin: 0 auto;
}

.legend-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 600;
}

.legend-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.reset-dialog {
    border-radius: 16px !important;
    overflow: hidden;
}
</style>