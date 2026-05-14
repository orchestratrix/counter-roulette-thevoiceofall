import { createRouter, createWebHistory } from 'vue-router'
import mainLayout from '../layouts/mainLayout.vue'
import homeView from '../views/homeView.vue'
import semifinalView from '../views/semifinalView.vue'
import finalView from '../views/finalView.vue'

const routes = [
  {
    path: '/',
    component: mainLayout,
    children: [
      { path: '', name: 'home', component: homeView },
      {
        path: 'semifinal-norte',
        name: 'semifinal-norte',
        component: semifinalView,
        props: { region: 'zona norte' }
      },
      {
        path: 'semifinal-andina',
        name: 'semifinal-andina',
        component: semifinalView,
        props: { region: 'zona andina' }
      },
      { path: 'final', name: 'final', component: finalView }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})