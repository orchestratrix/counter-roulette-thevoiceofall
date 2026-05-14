<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent
        transition-show="scale" transition-hide="fade">
        <q-card v-if="question" class="question-card">
            <!-- Header con categoría -->
            <div class="card-header" :class="categoryClass">
                <div class="header-left">
                    <div class="question-number">#{{ question.id }}</div>
                    <div class="header-meta">
                        <div class="category-label">Categoría</div>
                        <div class="category-name">{{ question.category }}</div>
                    </div>
                </div>
                <q-icon :name="question.icon" class="header-icon" />
            </div>

            <q-card-section class="card-body">
                <!-- Enunciado / contexto -->
                <div class="block-label">
                    <q-icon name="mdi-information-outline" />
                    Enunciado
                </div>
                <p class="formulation">{{ question.formulation }}</p>

                <q-separator class="separator" />

                <!-- Pregunta -->
                <div class="block-label question">
                    <q-icon name="mdi-help-circle" />
                    Pregunta
                </div>
                <p class="question-text">{{ question.question }}</p>
            </q-card-section>

            <q-card-actions class="card-actions" align="right">
                <q-btn unelevated no-caps size="lg" color="secondary" text-color="dark" icon="mdi-check-circle"
                    label="Finalizar pregunta" @click="$emit('close')" class="close-btn" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    question: { type: Object, default: null }
})

defineEmits(['update:modelValue', 'close'])

const categoryClass = computed(() => {
    if (!props.question) return ''
    const map = {
        'GOBIERNO ESCOLAR': 'cat-gobierno',
        'PARTICIPACIÓN ESTUDIANTIL': 'cat-participacion',
        'ÉTICA': 'cat-etica'
    }
    return map[props.question.category] || ''
})
</script>

<style scoped>
.question-card {
    min-width: 360px;
    max-width: 640px;
    width: 90vw;
    border-radius: 16px !important;
    overflow: hidden;
    background: #0A1F4D;
    color: white;
    border: 2px solid rgba(255, 204, 41, 0.3);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    position: relative;
    overflow: hidden;
}

.card-header.cat-gobierno {
    background: linear-gradient(135deg, #E63946 0%, #c1232f 100%);
}

.card-header.cat-participacion {
    background: linear-gradient(135deg, #0749BF 0%, #0530a0 100%);
}

.card-header.cat-etica {
    background: linear-gradient(135deg, #FFCC29 0%, #e6b520 100%);
    color: #0A1F4D !important;
}

.card-header.cat-etica .category-label,
.card-header.cat-etica .question-number {
    color: rgba(10, 31, 77, 0.65) !important;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.question-number {
    font-size: 2.4rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1;
    letter-spacing: -1px;
    font-family: 'Arial Black', sans-serif;
}

.header-meta {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.category-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 700;
}

.category-name {
    font-size: 1.05rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
}

.header-icon {
    font-size: 2.6rem;
    opacity: 0.85;
}

.card-body {
    padding: 28px 28px 16px !important;
}

.block-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(54, 192, 232, 0.85);
    font-weight: 700;
    margin-bottom: 8px;
}

.block-label .q-icon {
    font-size: 1rem;
}

.block-label.question {
    color: #FFCC29;
}

.formulation {
    font-size: 1.05rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, 0.88);
    margin: 0 0 20px 0;
    font-style: italic;
}

.separator {
    background-color: rgba(255, 204, 41, 0.25) !important;
    margin: 4px 0 20px;
}

.question-text {
    font-size: 1.35rem;
    line-height: 1.45;
    color: white;
    font-weight: 700;
    margin: 0;
}

.card-actions {
    padding: 12px 24px 24px !important;
    background-color: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 204, 41, 0.15);
}

.close-btn {
    padding: 10px 28px !important;
    font-weight: 800 !important;
    border-radius: 999px !important;
    box-shadow: 0 4px 16px rgba(255, 204, 41, 0.35) !important;
}
</style>