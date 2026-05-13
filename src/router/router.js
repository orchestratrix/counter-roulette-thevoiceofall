import { createRouter, createWebHistory } from 'vue-router'
import mainLayout from '../layouts/mainLayout.vue'
import homeView from '../views/homeView.vue'
import semifinalView from '../views/semifinalView.vue'
import finalView from '../views/finalView.vue'

const routes = [
  { path: '/', component: mainLayout, children: [
    { path: '', component: homeView },
    { path: 'semifinal-caribe', component: semifinalView, props: { region: 'caribe' } },
    { path: 'semifinal-andina', component: semifinalView, props: { region: 'andina' } },
    { path: 'final', component: finalView }
  ]}
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})