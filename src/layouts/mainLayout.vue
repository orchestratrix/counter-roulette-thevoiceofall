<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="app-header">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="brand">
            <q-avatar size="40px" class="brand-avatar">
              <img src="../assets/icon.jpeg" alt="Logo" />
            </q-avatar>
            <div class="brand-text">
              <div class="brand-title">La Voz de Todos — Marcador</div>
              <div class="brand-subtitle">
                Temporada 1 · Semifinales Regionales
              </div>
            </div>
          </div>
        </q-toolbar-title>

        <q-btn
          flat dense round
          icon="mdi-restart"
          @click="confirmReset"
          v-if="hasAnyScores"
        >
          <q-tooltip>Reiniciar todo el torneo</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      behavior="mobile"
      bordered
      class="app-drawer"
    >
      <div class="drawer-header">
        <div class="drawer-title">Navegación</div>
      </div>
      <q-list>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="mdi-home" />
          </q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/semifinal-caribe">
          <q-item-section avatar>
            <q-icon name="mdi-waves" />
          </q-item-section>
          <q-item-section>Semifinal Caribe</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/semifinal-andina">
          <q-item-section avatar>
            <q-icon name="mdi-terrain" />
          </q-item-section>
          <q-item-section>Semifinal Andina</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/final">
          <q-item-section avatar>
            <q-icon name="mdi-trophy-variant" />
          </q-item-section>
          <q-item-section>Gran Final</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="layout-bg">
        <router-view />
      </div>
    </q-page-container>

    <q-dialog v-model="showResetDialog">
      <q-card style="min-width: 360px">
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">Reiniciar torneo</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1">
            ¿Reiniciar puntajes de los 8 participantes y descoronar campeón?
          </div>
          <div class="text-caption text-grey-7 q-mt-sm">
            Esta acción no se puede deshacer.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            unelevated label="Reiniciar todo"
            color="negative"
            @click="resetAll"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useParticipantsStore } from '../store/participants'

const leftDrawerOpen = ref(false)
const showResetDialog = ref(false)
const store = useParticipantsStore()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const hasAnyScores = computed(() =>
  store.participants.some(p =>
    p.scores.correctAnswers > 0 ||
    p.scores.wrongAnswers > 0 ||
    p.scores.oralRating !== null
  ) || store.championId !== null
)

const confirmReset = () => {
  showResetDialog.value = true
}

const resetAll = () => {
  store.resetScores()
  showResetDialog.value = false
}
</script>

<style lang="sass" scoped>
@import '../quasar-variables.sass'

.app-header
  background: linear-gradient(135deg, $dark 0%, $primary 100%) !important

  .brand
    display: flex
    align-items: center
    gap: 12px

    .brand-avatar
      border: 2px solid rgba(255,255,255,0.3)

    .brand-text
      .brand-title
        font-size: 1.05rem
        font-weight: 800
        line-height: 1.1
        letter-spacing: 0.3px

      .brand-subtitle
        font-size: 0.75rem
        opacity: 0.85
        font-weight: 500
        margin-top: 2px

.app-drawer
  background-color: $dark-page

  .drawer-header
    padding: 20px 16px
    border-bottom: 1px solid rgba(255,255,255,0.1)

    .drawer-title
      font-size: 0.8rem
      text-transform: uppercase
      letter-spacing: 2px
      color: rgba(255,255,255,0.5)
      font-weight: 700

.layout-bg
  padding: 0
  background: linear-gradient(180deg, $dark-page 0%, #020816 100%)
  color: white
  min-height: 100vh

</style>