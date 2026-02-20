import { createRouter, createWebHistory } from 'vue-router'
import ListInspection from '@/pages/ListInspection.vue'
import CreateInspection from '@/pages/CreateInspection.vue'
import DetailInspection from '@/pages/DetailInspection.vue'

const routes = [
  {
    path: '/',
    redirect: '/inspections'
  },
  {
    path: '/inspections',
    name: 'ListInspection',
    component: ListInspection
  },
  {
    path: '/inspections/create',
    name: 'CreateInspection',
    component: CreateInspection
  },
  {
    path: '/inspections/:id',
    name: 'DetailInspection',
    component: DetailInspection,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
