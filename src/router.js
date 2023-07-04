import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from './views/HomeView.vue'
import MapView from './views/MapView.vue'
import BoardView from './views/board/BoardView.vue'
import SignInView from './views/member/SignInView.vue'
import SignUpView from './views/member/SignUpView.vue'
import WritingView from './views/board/WritingView.vue'
import ModifyingView from './views/board/ModifyingView.vue'
import ArticleView from './views/board/ArticleView.vue'
import MyPageView from './views/MyPageView.vue'
import DeletingAccountView from './views/member/DeletingAccountView.vue'
import AdminPageView from './views/AdminPageView.vue'

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
    },
    {
        path: '/deletingAccount',
        name: 'deletingAccount',
        component: DeletingAccountView
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminPageView
    },
]

const router = new VueRouter(
    {
        mode: 'history',
        routes
    }
)
  
export default router