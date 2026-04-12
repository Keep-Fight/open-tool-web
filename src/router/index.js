import {createRouter, createWebHistory} from 'vue-router'
import App from "../App.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: '',
            redirect : '/home',
            component: () => import('../components/layout/Layout.vue'),
            children: [
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import('../views/HomeView/index.vue'),
                },
                {
                    path: 'tools',
                    name: 'Tools',
                    component: () => import('../views/ToolsView/index.vue'),
                },
                {
                    path: 'notes',
                    name: 'Notes',
                    component: () => import('../views/NotesView/index.vue'),
                },
                {
                    path: 'files',
                    name: 'files',
                    component: () => import('../views/FilesView/index.vue'),
                },
            ]
        }
    ]
})

export default router
