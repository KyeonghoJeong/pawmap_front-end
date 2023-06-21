<template>
<!-- 헤더 부분 담을 div -->
<div>
  <!-- 네비게이션 바 -->
  <!-- lg는 버튼 적용되는 크기, nav-header-header는 네비게이션 컬러 변경을 위한 클래스 -->
  <nav class="navbar navbar-expand-lg navbar-dark nav-header-header">
    <!-- 버튼 등 콘텐츠 담을 div -->
    <!-- container-fluid는 viewpoint full width -->
    <div class="container-fluid">
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

          <!-- authority 변수를 참조하여 권한 확인 후 권한에 맞게 메뉴 출력 -->
          <!-- 권한이 'ROLE_USER'인 경우 메뉴는 지도, 게시판, 로그인, 가입 -->
          <!-- 권한이 'ROLE_MEMBER'인 경우 메뉴는 지도, 게시판, 로그아웃, 마이페이지 -->
          <!-- 권한이 'ROLE_ADMIN'인 경우 메뉴는 지도, 게시판, 로그아웃, 마이페이지, 관리페이지 -->

          <!-- 메뉴를 클릭 시 해당하는 라우터 링크로 이동 -->
          <!-- 로그인, 로그아웃 메뉴는 signIn, signOut 메소드 실행 -->
          <li v-if="this.authority === 'ROLE_USER' || this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/map" class="nav-link active router-header-menu">지도</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_USER' || this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/board" class="nav-link active router-header-menu">게시판</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_USER'" class="nav-item">
            <span @click="signIn" class="nav-link active router-header-menu">로그인</span>
          </li>
          <li v-if="this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <span @click="signOut" class="nav-link active router-header-menu">로그아웃</span>
          </li>
          <li v-if="this.authority === 'ROLE_USER'" class="nav-item">
            <router-link to="/signup" class="nav-link active router-header-menu">가입</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_MEMBER' || this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/mypage?tab=bookmark" class="nav-link active router-header-menu">마이페이지</router-link>
          </li>
          <li v-if="this.authority === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin?tab=members" class="nav-link active router-header-menu">관리페이지</router-link>
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
    // 헤더 컴포넌트 렌더링 시 권한 확인 및 설정 메소드
    setAuthority(){
      // accessToken을 백엔드로 보내서 유효성 확인 및 권한명 수신
      axios.get('http://localhost:8090/api/member/authority',{
          headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
      })
      .then(response => {
        if(response.data === 'Invalid'){
          // accessToken이 유효하지 않은 경우 refreshToken을 이용 accessToken 재발급
          axios.get('http://localhost:8090/api/member/reissuance', {
            withCredentials: true
          })
          .then(response => {
            if(response.data === 'Invalid'){
              // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
              localStorage.removeItem("accessToken");

              // refreshToken도 유효하지 않은 경우 사용자에게 재로그인 요청
              if(confirm("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.")){
                // 확인 시 로그인 페이지로 이동
                this.$router.push({path: "/signin"});
              }

            }else{
              // accessToken 재발급 성공
              // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
              localStorage.removeItem("accessToken");
              // 재발급 받은 accessToken 로컬 스토리지에 저장
              localStorage.setItem("accessToken", response.data.accessToken);

              // 권한명 수신을 위해 재귀 요청 => 두 번째 재귀 요청 시 반드시 권한명 수신되므로 무한루프 X
              this.setAuthority();
            }
          })
          .catch(error => {
            console.log(error);
          })
        }else{
          // accessToken이 유요한 경우 권한명 받기
          this.authority = response.data;
        }
      })
      .catch(error => {
        console.log(error);
      })
    },
    // 로그인 메소드
    signIn(){
      // 로그인 후 이전 페이지로 돌아가기 위해 store에 path 저장
      this.$store.commit('updateBeforePage', this.$route.path);

      // 라우터 현재 path로 재이동 에러 방지를 위해 이미 path가 /signin인 경우 이동 X
      if(this.$route.path !== '/signin'){
        this.$router.push({path: 'signin'});
      }
    },
    // 로그아웃 메소드
    signOut(){
      // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
      localStorage.removeItem("accessToken");
      // 유저로 권한 변경
      this.authority = 'ROLE_USER';
      
      // 새로고침
      this.$router.go(this.$router.currentRoute);
    },
  },
  created() {
    // 로그인 되어 있는 경우 (회원 또는 관리자)
    // 로컬 스토리지에서 accessToken 확인 후 null 값이 아니면 권한 설정 메소드 호출
    if(localStorage.getItem("accessToken") !== null){
      this.setAuthority();
    }
  },
}
</script>

<style>
.nav-header-header{
  background-color: #fd7e14;
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