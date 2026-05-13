<script setup>
import { ref, onMounted } from 'vue'

const leftDrawerOpen = ref(false)
const logoExists = ref(false)

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>

<template>
    <q-layout view="hHh lpR fFf">

        <q-header elevated class="bg-primary text-white">
            <q-toolbar>
                <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

                <q-toolbar-title>
                    <q-avatar>
                        <img src="../assets/icon.jpeg" alt="Logo">
                    </q-avatar>
                    <div>
                      <div class="text-h6">La Voz de Todos — Marcador</div>
                      <div class="text-subtitle2">Temporada 1 · Semifinales Regionales</div>
                    </div>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" bordered>
            <div class="buttons">
                <q-btn to="/" label="Home" flat></q-btn>
                <q-btn to="/semifinal-caribe" label="Semifinal Caribe" flat></q-btn>
                <q-btn to="/semifinal-andina" label="Semifinal Andina" flat></q-btn>
                <q-btn to="/final" label="Final" flat></q-btn>
            </div>
        </q-drawer>

        <q-page-container>
            <div class="layout-bg">
                <router-view />
            </div>
        </q-page-container>

    </q-layout>
</template>

<style scoped>
.layout-bg {
  padding: 15px;
  background: black;
  color: white;
  min-height: 100vh;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
</style>