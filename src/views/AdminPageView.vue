<template>
    <!-- 타이틀 div, 네비게이션 탭 div, 네비게이션 탭 선택 시 출력할 컴포넌트 div를 담을 div -->
    <div class="mp div-AdminPage-container">
        <!-- 타이틀 div -->
        <div class="div-AdminPage-title">
            <h1>관리페이지</h1>
        </div>

        <!-- 네비게이션 탭 div -->
        <div class="div-AdminPage-tab">
            <!-- ul - li - span 구조 -->
            <ul class="nav nav-tabs nav-justified">
                <!-- activatedTab 변수의 값이 각 span에 할당된 값과 같으면 active 클래스 적용 -->
                <!-- span 클릭 시 getComponent 호출, 매개변수는 각 탭에 해당하는 쿼리 -->
                <li class="nav-item li-AdminPage">
                    <span class="nav-link span-AdminPage-tab" v-bind:class="{ active: activatedTab === 'articleManagement' }" @click="getComponent('articleManagement')">게시글 관리</span>
                </li>
                <li class="nav-item li-AdminPage">
                    <span class="nav-link span-AdminPage-tab" v-bind:class="{ active: activatedTab === 'memberManagement' }" @click="getComponent('memberManagement')">회원 관리</span>
                </li>
            </ul>
        </div>

        <!-- 네비게이션 탭 선택 시 출력할 컴포넌트 div -->
        <div class="div-AdminPage-component">
            <component v-bind:is="activatedComponent"></component>
        </div>
    </div>
</template>

<script>
import ArticleManagementView from '/src/components/admin/ArticleManagementView.vue'
import MemberManagementView from '/src/components/admin/MemberManagementView.vue'

export default {
    data(){
        return{
            activatedTab: '', // 선택한 탭 이름을 저장할 변수
            activatedComponent: '', // 선택한 탭의 컴포넌트 이름을 저장할 변수
        }
    },
    methods:{
        // 매개변수(쿼리)에 따라 선택한 탭을 바꾸고 해당 컴포넌트로 이동하는 메소드
        getComponent(query){
            if(query === 'articleManagement'){
                this.activatedTab = 'articleManagement';
                this.activatedComponent = 'ArticleManagementView';
            }else if(query === 'memberManagement'){
                this.activatedTab = 'memberManagement';
                this.activatedComponent = 'MemberManagementView';
            }
        }
    },
    components:{
        ArticleManagementView, // 게시글 관리 컴포넌트
        MemberManagementView, // 회원 관리 컴포넌트
    },
    created(){
        // 관리페이지 메뉴 클릭 시 저장 된 쿼리가 있으면 저장 된 쿼리로 설정 없으면 게시글 관리로 설정
        if(localStorage.getItem("adminQuery")){
            this.getComponent(localStorage.getItem("adminQuery"));

            localStorage.removeItem("adminQuery"); // 삭제
        }else{
            this.getComponent('articleManagement');
        }
    }
}

</script>

<style>
    /* 타이틀 div, 네비게이션 탭 div, 네비게이션 탭 선택 시 출력할 컴포넌트 div를 담을 div */
    .div-AdminPage-container{
        /* 각 자식 div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 타이틀 div */
    .div-AdminPage-title{
        /* 타이틀 div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 위, 아래 간격 조절 */
        margin-top: 5%;
        margin-bottom: 2%;
    }
    /* 네비게이션 탭 div */
    .div-AdminPage-tab{
        width: 40%; /* 탭 너비 지정 */
        margin-bottom: 3%;
    }
    /* 탭 리스트 */
    .li-AdminPage{
        text-align: center; /* 탭 리스트 텍스트 가운데 정렬 */
        width: 33%; /* 각 탭 비율 조정 */
        color: black; /* 글자색 변경 */
    }
    /* 선택 중인 탭 색 변경 */
    .li-AdminPage .nav-link.active{
        background-color: #fd7e14; 
        color: white;
    }
    /* 리스트 내부 span 글자 색 변경 */
    .span-AdminPage-tab{
        color: black;
    }
    /* 리스트 내부 span 마우스오버 시 색 및 커서 변경 */
    .span-AdminPage-tab:hover {
        cursor: pointer;
        background-color: #fd7e14;
        color: white;
    }
    /* 컴포넌트 div 너비 지정 */
    .div-AdminPage-component{
        width: 100%;
    }
    /* width가 992px 이하면 div 재조정 */
    @media screen and (max-width: 992px){
        .div-AdminPage-tab{
            /* 탭 너비 변경 */
            width: 70%;
        }
    }
</style>