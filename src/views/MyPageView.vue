<template>
    <!-- 타이틀 div, 네비게이션 탭 div, 네비게이션 탭 선택 시 출력할 컴포넌트 div를 담을 div -->
    <div class="div-MyPageView-container">
        <!-- 타이틀 div -->
        <div class="div-MyPageView-title">
            <h1>마이페이지</h1>
        </div>

        <!-- 네비게이션 탭 div -->
        <div class="div-MyPageView-tab">
            <!-- ul - li - span 구조 -->
            <ul class="nav nav-tabs">
                <!-- activeTab 변수의 값이 각 span에 할당된 값과 같으면 active 클래스 적용 -->
                <!-- span 클릭 시 getComponent 호출, 매개변수는 각 탭에 해당하는 쿼리 -->
                <li class="nav-item li-MyPageView">
                    <span class="nav-link span-MyPageView-tab" v-bind:class="{ active: activeTab === 'bookmark' }" @click="getComponent('bookmark')">북마크</span>
                </li>
                <li class="nav-item li-MyPageView">
                    <span class="nav-link span-MyPageView-tab" v-bind:class="{ active: activeTab === 'myArticles' }" @click="getComponent('myArticles')">내 게시글</span>
                </li>
                <li class="nav-item li-MyPageView">
                    <span class="nav-link span-MyPageView-tab" v-bind:class="{ active: activeTab === 'myInfo' }" @click="getComponent('myInfo')">회원정보</span>
                </li>
            </ul>
        </div>

        <!-- 네비게이션 탭 선택 시 출력할 컴포넌트 div -->
        <div class="div-MyPageView-component">
            <component v-bind:is="activeComponent"></component>
        </div>
    </div>
</template>

<script>
import BookmarkView from '../components/mypage/BookmarkView.vue'
import MyArticlesView from '../components/mypage/MyArticlesView.vue'
import MyInfoView from '../components/mypage/MemberInfo.vue'

export default {
    data(){
        return{
            activeTab: '', // 선택한 탭 이름을 저장할 변수
            activeComponent: '', // 선택한 탭의 컴포넌트 이름을 저장할 변수
        }
    },
    methods:{
        // 매개변수(쿼리)에 따라 선택한 탭을 바꾸고 해당 컴포넌트로 이동하는 메소드
        getComponent(query){
            if(query === 'bookmark'){
                this.activeTab = 'bookmark';
                this.activeComponent = 'BookmarkView';
            }else if(query === 'myArticles'){
                this.activeTab = 'myArticles';
                this.activeComponent = 'MyArticlesView';
            }else if(query === 'myInfo'){
                this.activeTab = 'myInfo';
                this.activeComponent = 'MyInfoView';
            }
        }
    },
    components:{
        BookmarkView, // 북마크 컴포넌트
        MyArticlesView, // 내 게시글 컴포넌트
        MyInfoView, // 회원정보 컴포넌트
    },
    created(){
        // 마이페이지 메뉴 클릭 시 첫 탭과 컴포넌트를 북마크로 설정
        this.activeTab = 'bookmark';
        this.activeComponent = 'BookmarkView';
    }
}

</script>

<style>
    /* 타이틀 div, 네비게이션 탭 div, 네비게이션 탭 선택 시 출력할 컴포넌트 div를 담을 div */
    .div-MyPageView-container{
        /* 각 자식 div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 타이틀 div */
    .div-MyPageView-title{
        /* 타이틀 div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 위, 아래 간격 조절 */
        margin-top: 5%;
        margin-bottom: 2%;
    }
    /* 네비게이션 탭 div */
    .div-MyPageView-tab{
        width: 60%; /* 탭 너비 지정 */
        margin-bottom: 3%;
    }
    /* 탭 리스트 */
    .li-MyPageView{
        text-align: center; /* 탭 리스트 텍스트 가운데 정렬 */
        width: 33%; /* 각 탭 비율 조정 */
    }
    /* 선택 중인 탭 색 변경 */
    .li-MyPageView .nav-link.active{
        background-color: #fd7e14; 
        color: white;
    }
    /* 리스트 내부 span 글자 색 변경 */
    .span-MyPageView-tab{
        color: black;
    }
    /* 리스트 내부 span 마우스오버 시 색 및 커서 변경 */
    .span-MyPageView-tab:hover {
        background-color: #fd7e14;
        color: white;
        cursor:pointer;
    }
    /* 컴포넌트 div 너비 지정 */
    .div-MyPageView-component{
        width: 100%;
    }
</style>