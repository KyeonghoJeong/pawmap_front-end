import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '/src/views/HomeView.vue'
import MapView from '/src/views/MapView.vue'
import BoardView from '/src/views/board/BoardView.vue'
import SignInView from '/src/views/SignInView.vue'
import SignUpView from '/src/views/SignUpView.vue'
import PostArticleView from '/src/views/board/PostArticleView.vue'
import EditArticleView from '/src/views/board/EditArticleView.vue'
import ArticleView from '/src/views/board/ArticleView.vue'
import MyPageView from '/src/views/MyPageView.vue'
import DeleteAccount from '/src/views/DeleteAccountView.vue'
import AdminView from '/src/views/AdminView.vue'

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
        path: '/sign-in',
        name: 'sign-in',
        component: SignInView,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") === null){
                // 로컬 스토리지에 accessToken이 없는 경우 (비로그인 상태)
                next(); // 페이지 진행
            }else{
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
    {
        path: '/sign-up',
        name: 'sign-up',
        component: SignUpView,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") === null){
                // 로컬 스토리지에 accessToken이 없는 경우 (비로그인 상태)
                next(); // 페이지 진행
            }else{  
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
    {
        path: '/board/post-article',
        name: 'post-article',
        component: PostArticleView,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") !== null){ // 로컬 스토리지에 accessToken이 있는 경우만 접근 허용
                next();
            }else{  
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
    {
        path: '/board/edit-article',
        name: 'edit-article',
        component: EditArticleView,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") !== null){ // 로컬 스토리지에 accessToken이 있는 경우만 접근 허용
                next(); // 페이지 진행
            }else{  
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
    {
        path: '/board/article',
        name: 'article',
        component: ArticleView
    },
    {
        path: '/my-page',
        name: 'my-page',
        component: MyPageView,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") !== null){ // 로컬 스토리지에 accessToken이 있는 경우만 접근 허용
                next(); // 페이지 진행
            }else{  
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
    {
        path: '/my-page/delete-account',
        name: 'delete-account',
        component: DeleteAccount,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") !== null){ // 로컬 스토리지에 accessToken이 있는 경우만 접근 허용
                next(); // 페이지 진행
            }else{  
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView,
        beforeEnter: (to, from, next) => {
            if(localStorage.getItem("accessToken") !== null){ // 로컬 스토리지에 accessToken이 있는 경우만 접근 허용
                if(localStorage.getItem("role") === 'ROLE_ADMIN'){ // 권한이 ROLE_ADMIN인 경우만 접근 허용
                    next(); // 페이지 진행
                }else{
                    next('/'); // 접근 불가인 경우 메인 페이지로 이동
                }
            }else{
                next('/'); // 접근 불가인 경우 메인 페이지로 이동
            }
        }
    },
]

const router = new VueRouter(
    {
        mode: 'history',
        routes
    }
)
  
export default router