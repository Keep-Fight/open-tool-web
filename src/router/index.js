import {createRouter, createWebHistory} from 'vue-router'
import App from "../App.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: '',
            redirect: '/home',
            component: () => import('../layout/Layout.vue'),
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import('../views/HomeView.vue'),
                },
                {
                    path: 'tool/:id',
                    name: 'tool-detail',
                    component: () => import('../views/ToolView.vue'),
                    props: true
                },
            ]
        },
        {
            path: '/md',
            name: 'markdown-view',
            component: () => import('../views/MdView.vue'),
        }
    ]
})

export default router
