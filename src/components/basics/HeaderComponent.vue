<template>
<!-- 헤더 부분 담을 div -->
<div>
  <!-- 네비게이션 바 -->
  <!-- lg는 버튼 적용되는 크기, nav-header-header는 네비게이션 컬러 변경을 위한 클래스 -->
  <nav class="navbar navbar-expand-lg navbar-dark nav-header-header">
    <!-- 버튼 등 콘텐츠 담을 div -->
    <!-- container-fluid는 viewpoint full width -->
    <div class="container-fluid div-header-title">
      <!-- router-header-title은 pawmap 타이틀 디자인 클래스 -->
      <router-link to="/" class="nav-link active router-header-title">pawmap</router-link>
      <!-- 토글 버튼 -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- 메뉴 및 토글 버튼 담을 div -->
      <!-- div-header-menu는 메뉴 폰트 사이즈 조절을 위한 클래스 -->
      <div class="collapse navbar-collapse div-header-menu" id="navbarNav">
        <!-- ul-header-menu는 토글 버튼 안 메뉴 정렬을 위한 클래스 -->
        <ul class="navbar-nav ms-auto ul-header-menu">
          <!-- router-header-menu는 마우스오버 시 효과를 위한 클래스 -->

          <!-- role 변수를 참조하여 권한 확인 후 권한에 맞게 메뉴 출력 -->
          <!-- 권한이 'ROLE_USER'인 경우 메뉴는 지도, 게시판, 로그인, 가입 -->
          <!-- 권한이 'ROLE_MEMBER'인 경우 메뉴는 지도, 게시판, 로그아웃, 마이페이지 -->
          <!-- 권한이 'ROLE_ADMIN'인 경우 메뉴는 지도, 게시판, 로그아웃, 마이페이지, 관리페이지 -->

          <!-- 메뉴를 클릭 시 해당하는 라우터 링크로 이동 -->
          <!-- 로그인, 로그아웃 메뉴는 signIn, signOut 메소드 실행 -->
          <li v-if="this.role === 'ROLE_USER' || this.role === 'ROLE_MEMBER' || this.role === 'ROLE_ADMIN'" class="nav-item">
            <span @click="toMap" class="nav-link active router-header-menu">지도</span>
          </li>
          <li v-if="this.role === 'ROLE_USER' || this.role === 'ROLE_MEMBER' || this.role === 'ROLE_ADMIN'" class="nav-item">
            <span @click="toBoard" class="nav-link active router-header-menu">게시판</span>
          </li>
          <li v-if="this.role === 'ROLE_MEMBER' || this.role === 'ROLE_ADMIN'" class="nav-item">
            <span @click="toMyPage" class="nav-link active router-header-menu">마이페이지</span>
          </li>
          <li v-if="this.role === 'ROLE_ADMIN'" class="nav-item">
            <span @click="toAdmin" class="nav-link active router-header-menu">관리페이지</span>
          </li>
          <li v-if="this.role === 'ROLE_USER'" class="nav-item">
            <span @click="toSignIn" class="nav-link active router-header-menu">로그인</span>
          </li>
          <li v-if="this.role === 'ROLE_MEMBER' || this.role === 'ROLE_ADMIN'" class="nav-item">
            <span @click="signOut" class="nav-link active router-header-menu">로그아웃</span>
          </li>
          <li v-if="this.role === 'ROLE_USER'" class="nav-item">
            <span @click="toSignUp" class="nav-link active router-header-menu">가입</span>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
export default{
  data(){
    return{
      role: '',
    }
  },
  methods:{
    // 지도 메뉴 이동 메소드
    toMap(){
      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /map인 경우 이동 X
      if(this.$route.path !== '/map'){
        this.$router.push({path: '/map'});
      }else{
        this.$router.go(this.$router.currentRoute); // 이미 해당 메뉴 페이지에 접속중인 경우 새로고침
      }
    },
    // 게시판 메뉴 이동 메소드
    toBoard(){
      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /board인 경우 이동 X
      if(this.$route.path !== '/board'){
        this.$router.push({path: '/board', query: {page: 1}});
      }else{
        this.$router.go(this.$router.currentRoute); // 이미 해당 메뉴 페이지에 접속중인 경우 새로고침
      }
    },
    // 로그인 메소드
    toSignIn(){
      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /signin인 경우 이동 X
      if(this.$route.path !== '/sign-in'){
        // 로그인 후 이전 페이지로 돌아가기 위해 로컬 스토리지에 fullPath 저장
        localStorage.setItem("previousPage", this.$route.fullPath);
        this.$router.push({path: '/sign-in'});
      }else{
        this.$router.go(this.$router.currentRoute); // 이미 해당 메뉴 페이지에 접속중인 경우 새로고침
      }
    },
    // 로그아웃 메소드
    signOut(){
      // 로그아웃 확인
      if(confirm("로그아웃 하시겠습니까?")){
        // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");

        this.$router.go(this.$router.currentRoute); // 헤더 갱신을 위해 새로고침
      }
    },
    // 회원가입 메뉴 이동 메소드
    toSignUp(){
      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /signup인 경우 이동 X
      if(this.$route.path !== '/sign-up'){
        this.$router.push({path: '/sign-up'});
      }else{
        this.$router.go(this.$router.currentRoute); // 이미 해당 메뉴 페이지에 접속중인 경우 새로고침
      }
    },
    // 마이페이지 메뉴 이동 메소드
    toMyPage(){
      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /mypage인 경우 이동 X
      if(this.$route.path !== '/my-page'){
        this.$router.push({path: '/my-page', query: {tab: 'bookmark'}});
      }else{
        this.$router.go(this.$router.currentRoute); // 이미 해당 메뉴 페이지에 접속중인 경우 새로고침
      }
    },
    // 관리페이지 메뉴 이동 메소드
    toAdmin(){
      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /admin인 경우 이동 X
      if(this.$route.path !== '/admin'){
        this.$router.push({path: '/admin', query: {tab: 'article'}});
      }else{
        this.$router.go(this.$router.currentRoute); // 이미 해당 메뉴 페이지에 접속중인 경우 새로고침
      }
    }
  },
  created() {
    // 권한 설정 => 순차 적용
    this.role = 'ROLE_USER'; // 1. 비회원

    // 로컬 스토리지에서 accessToken 확인 후 null 값이 아니면 로그인 상태
    if(localStorage.getItem("accessToken") !== null){
      this.role = 'ROLE_MEMBER'; // 2. 회원

      // 권한 조회 결과 ROLE_ADMIN인 경우
      if(localStorage.getItem("role") === 'ROLE_ADMIN'){
        this.role = 'ROLE_ADMIN'; // 3. 관리자 
      }
    }
  },
}
</script>

<style>
  .nav-header-header{
    background-color: #fd7e14;
  }
  .div-header-title{
    margin-bottom: 10px;
  }
  .router-header-title{
    font-size: 1.9rem !important; /* root element의 1.9배 */
    font-weight: bold !important;
    color: white !important;
  }
  .router-header-title:hover{
    cursor: pointer;
  }
  .div-header-menu{
    padding-top: 10px;
    font-size: 0.9rem; /* root element의 0.9배 */
  }
  /* 메뉴 마우스 오버 시에 폰트 굵기, 커서 변경 */
  .router-header-menu:hover{
    font-weight: bold;
    cursor: pointer;
  }
  /* 너비 576px 이하 시 버튼 메뉴 가운데 정렬 */
  @media screen and (max-width: 992px){
    .ul-header-menu{
      align-items: center;
    }
  }
</style>