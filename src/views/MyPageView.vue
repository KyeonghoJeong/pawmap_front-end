<template>
    <!-- 타이틀 div, 네비게이션 탭 div, 네비게이션 탭 선택 시 출력할 컴포넌트 div를 담을 div -->
    <div class="div-MyPage-container">
        <!-- 타이틀 div -->
        <div class="div-MyPage-title">
            <h1>마이페이지</h1>
        </div>

        <!-- 네비게이션 탭 div -->
        <div class="div-MyPage-tab">
            <!-- ul - li - span 구조 -->
            <ul class="nav nav-tabs">
                <!-- tab 변수의 값이 각 span에 할당된 값과 같으면 active 클래스 적용 -->
                <!-- span 클릭 시 getComponent 호출, 매개변수는 각 탭에 해당하는 쿼리 -->
                <li class="nav-item li-MyPage">
                    <span class="nav-link span-MyPage-tab" v-bind:class="{ active: activatedtab === 'bookmark' }" @click="getComponent('bookmark')">북마크</span>
                </li>
                <li class="nav-item li-MyPage">
                    <span class="nav-link span-MyPage-tab" v-bind:class="{ active: activatedtab === 'article' }" @click="getComponent('article')">내 게시글</span>
                </li>
                <li class="nav-item li-MyPage">
                    <span class="nav-link span-MyPage-tab" v-bind:class="{ active: activatedtab === 'information' }" @click="getComponent('information')">회원정보</span>
                </li>
            </ul>
        </div>

        <!-- 네비게이션 탭 선택 시 출력할 컴포넌트 div -->
        <div class="div-MyPage-component">
            <component v-bind:is="activatedComponent"></component>
        </div>
    </div>
</template>

<script>
import MyBookmarksComponent from '../components/mypage/MyBookmarksComponent.vue'
import MyArticlesComponent from '../components/mypage/MyArticlesComponent.vue'
import MyInformationComponent from '../components/mypage/MyInformationComponent.vue'

export default {
    data(){
        return{
            activatedtab: '', // 선택한 탭 이름을 저장할 변수
            activatedComponent: '', // 선택한 탭의 컴포넌트 이름을 저장할 변수
        }
    },
    methods:{
        // 매개변수(쿼리)에 따라 선택한 탭을 바꾸고 해당 컴포넌트로 이동하는 메소드
        getComponent(tab){
            if(tab === 'bookmark'){
                this.activatedtab = 'bookmark';
                this.activatedComponent = 'MyBookmarksComponent';
            }else if(tab === 'article'){
                this.activatedtab = 'article';
                this.activatedComponent = 'MyArticlesComponent';
            }else if(tab === 'information'){
                this.activatedtab = 'information';
                this.activatedComponent = 'MyInformationComponent';
            }

            // url 쿼리 바꾸기
            this.$router.replace({query: {tab: tab}}).catch(()=>{});
        }
    },
    components:{
        MyBookmarksComponent, // 북마크 컴포넌트
        MyArticlesComponent, // 내 게시글 컴포넌트
        MyInformationComponent, // 회원정보 컴포넌트
    },
    created(){
        // 쿼리 값으로 탭 선택, 컴포넌트 설정
        this.getComponent(this.$route.query.tab);
    }
}

</script>

<style>
    /* 타이틀 div, 네비게이션 탭 div, 네비게이션 탭 선택 시 출력할 컴포넌트 div를 담을 div */
    .div-MyPage-container{
        /* 각 자식 div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 타이틀 div */
    .div-MyPage-title{
        /* 타이틀 div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 위, 아래 간격 조절 */
        margin-top: 5%;
        margin-bottom: 2%;
    }
    /* 네비게이션 탭 div */
    .div-MyPage-tab{
        width: 60%; /* 탭 너비 지정 */
        margin-bottom: 3%;
    }
    /* 탭 리스트 */
    .li-MyPage{
        text-align: center; /* 탭 리스트 텍스트 가운데 정렬 */
        width: 33%; /* 각 탭 비율 조정 */
    }
    /* 선택 중인 탭 색 변경 */
    .li-MyPage .nav-link.active{
        background-color: #fd7e14;
        color: white;
    }
    /* 리스트 내부 span 글자 색 변경 */
    .span-MyPage-tab{
        color: black;
    }
    /* 리스트 내부 span 마우스오버 시 색 및 커서 변경 */
    .span-MyPage-tab:hover {
        cursor: pointer;
        background-color: #fd7e14;
        color: white;
    }
    /* 컴포넌트 div 너비 지정 */
    .div-MyPage-component{
        width: 100%;
    }
</style>