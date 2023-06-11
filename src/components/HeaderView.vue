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
      <router-link to="/" class="nav-link active p-header-title">pawmap</router-link>
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
          <li v-if="this.authority === 'ROLE_USER' || this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/map" class="nav-link active p-header-menu">지도</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_USER' || this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/board" class="nav-link active p-header-menu">게시판</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_USER'" class="nav-item">
            <router-link to="/signin" class="nav-link active p-header-menu">로그인</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <span @click="signOut" class="nav-link active p-header-menu">로그아웃</span>
          </li>
          <li v-if="this.authority === 'ROLE_USER'" class="nav-item">
            <router-link to="/signup" class="nav-link active p-header-menu">가입</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/mypage?tab=bookmark" class="nav-link active p-header-menu">마이페이지</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin?tab=members" class="nav-link active p-header-menu">관리페이지</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
import axios from 'axios'

export default{
  data(){
    return{
      authority: 'ROLE_USER',
    }
  },
  methods:{
    signOut(){
      localStorage.removeItem("accessToken");
      this.authority = 'user';
      
      this.$router.go(this.$router.currentRoute);
    },
    setAuthority(){
      axios.get('http://localhost:8090/api/member/authority',{
          headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
      })
      .then(response => {
        if(response.data === 'Invalid'){
          axios.get('http://localhost:8090/api/member/reissuance', {
            withCredentials: true
          })
          .then(response => {
            if(response.data === 'Invalid'){
              alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

              localStorage.removeItem("accessToken");
              window.location.href = "/signin";
            }else{
              localStorage.removeItem("accessToken");
              localStorage.setItem("accessToken", response.data.accessToken);

              this.setAuthority();
            }
          })
          .catch(error => {
            console.log(error);
          })
        }else{
          this.authority = response.data;
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
  created() {
    if(localStorage.getItem("accessToken") !== null){
      this.setAuthority();
    }
  },
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