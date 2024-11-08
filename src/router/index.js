import { 
    createMemoryHistory, 
    createRouter, 
    createWebHistory 
} from "vue-router";

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/:page',
        name: 'test',
        component: () => import('../views/TestView.vue'),
        props: true
    }
]

const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory("/") : createWebHistory('/'),
    routes, 
})

export default router