import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from './views/HomeView.vue'
import MapView from './views/MapView.vue'
import BoardView from './views/BoardView.vue'
import SignInView from './views/SignInView.vue'
import SignUpView from './views/SignUpView.vue'
import WritingView from './views/WritingView.vue'
import ModifyingView from './views/ModifyingView.vue'
import ArticleView from './views/ArticleView.vue'
import MyPageView from './views/MyPageView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/map',
        name: 'map',
        component: MapView
    },
    {
        path: '/board',
        name: 'board',
        component: BoardView
    },
    {
        path: '/signin',
        name: 'signin',
        component: SignInView
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUpView
    },
    {
        path: '/board/writing',
        name: 'writing',
        component: WritingView
    },
    {
        path: '/board/modifying',
        name: 'modifying',
        component: ModifyingView
    },
    {
        path: '/board/article',
        name: 'article',
        component: ArticleView
    },
    {
        path: '/mypage',
        name: 'mypage',
        component: MyPageView
    }
]

const router = new VueRouter(
    {
        mode: 'history',
        routes
    }
)
  
export default router