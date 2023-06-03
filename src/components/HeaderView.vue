<template>
<!-- 헤더 부분 담을 div -->
<div>
  <!-- 네비게이션 바 -->
  <!-- lg는 버튼 적용되는 크기, nav-header는 네비게이션 컬러 변경 클래스 -->
  <nav class="navbar navbar-expand-lg navbar-dark nav-header">
    <!-- 버튼 등 콘텐츠 담을 div -->
    <!-- container-fluid는 viewpoint full width -->
    <div class="container-fluid">
      <!-- p-header-title은 pawmap 타이틀 디자인 클래스 -->
      <p @click="toHome" class="nav-link active p-header-title">pawmap</p>
      <!-- 토글 버튼 -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- 메뉴 및 토글 버튼 담을 div -->
      <!-- div-header-menu는 메뉴 폰트 사이즈 조절을 위한 클래스 -->
      <div class="collapse navbar-collapse div-header-menu" id="navbarNav">
        <!-- btn-header-menu는 토글 버튼 안 메뉴 정렬을 위한 클래스 -->
        <ul class="navbar-nav ms-auto btn-header-menu">
          <!-- p-header-menu는 마우스오버 시 효과를 위한 클래스 -->
          <li class="nav-item">
            <p @click="toMap" class="nav-link active p-header-menu">지도</p>
          </li>
          <li class="nav-item">
            <p @click="toBoard" class="nav-link active p-header-menu">게시판</p>
          </li>
          <li v-if="this.accessToken === null" class="nav-item">
            <p @click="toSignIn" class="nav-link active p-header-menu">로그인</p>
          </li>
          <li v-if="this.accessToken !== null" class="nav-item">
            <p @click="signOut" class="nav-link active p-header-menu">로그아웃</p>
          </li>
          <li v-if="this.accessToken === null" class="nav-item">
            <p @click="toSignUp" class="nav-link active p-header-menu">가입</p>
          </li>
          <li v-if="this.accessToken !== null" class="nav-item">
            <p @click="toMyPage" class="nav-link active p-header-menu">마이페이지</p>
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
      accessToken: null,
    }
  },
  created() {
    this.accessToken = localStorage.getItem("accessToken");
  },
  methods:{
    toHome(){
      if(window.location.href !== 'http://localhost:8080/'){
        this.$router.push({ path: "/"});
      }
    },
    toMap(){
      if(window.location.href !== 'http://localhost:8080/map'){
        this.$router.push({ path: "/map"});
      }
    },
    toBoard(){
      if(window.location.href !== 'http://localhost:8080/board'){
        this.$router.push({ path: "/board"});
      }
    },
    toSignIn(){
      if(window.location.href !== 'http://localhost:8080/signin'){
        this.$router.push({ path: "/signin"});
      }
    },
    toSignUp(){
      if(window.location.href !== 'http://localhost:8080/signup'){
        this.$router.push({ path: "/signup"});
      }
    },
    toMyPage(){
      if(window.location.href !== 'http://localhost:8080/mypage'){
        this.$router.push({ path: "/mypage"});
      }
    },
    signOut(){
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    },
  }
}
</script>

<style>
.nav-header{
  background-color: #fd7e14;
}
.p-header-title{
  font-size: 1.9rem !important; /* root element의 1.9배 */
  font-weight: bold !important;
  color: white !important;
}
.p-header-title:hover{
  cursor: pointer;
}
.div-header-menu{
  font-size: 0.9rem; /* root element의 0.9배 */
}
.p-header-menu{
  margin-bottom: 0;
}
.p-header-menu:hover{
  font-weight: bold;
  cursor: pointer;
}
/* 너비 576px 이하 시 버튼 메뉴 가운데 정렬 */
@media screen and (max-width: 992px){
  .btn-header-menu{
    align-items: center;
  }
}
</style>