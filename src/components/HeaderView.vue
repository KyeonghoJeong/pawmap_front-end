<template>
<!-- 헤더 부분 담을 div -->
<div>
  <!-- 네비게이션 바 -->
  <!-- lg는 버튼 적용되는 크기, nav-header는 네비게이션 컬러 변경 클래스 -->
  <nav class="navbar navbar-expand-lg navbar-dark nav-header">
    <!-- 버튼 등 콘텐츠 담을 div -->
    <!-- container-fluid는 viewpoint full width -->
    <div class="container-fluid">
      <!-- router-header-title은 pawmap 타이틀 디자인 클래스 -->
      <router-link to="/" class="navbar-brand router-header-title">
        pawmap
      </router-link>
      <!-- 토글 버튼 -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- 메뉴 및 토글 버튼 담을 div -->
      <!-- div-header-menu는 메뉴 폰트 사이즈 조절을 위한 클래스 -->
      <div class="collapse navbar-collapse div-header-menu" id="navbarNav">
        <!-- btn-header-menu는 토글 버튼 안 메뉴 정렬을 위한 클래스 -->
        <ul class="navbar-nav ms-auto btn-header-menu">
          <!-- router-header-menu는 마우스오버 시 효과를 위한 클래스 -->
          <li class="nav-item">
            <router-link to="/map" class="nav-link active router-header-menu">
              지도
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/board" class="nav-link active router-header-menu">
              게시판
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signin" class="nav-link active router-header-menu">
              로그인
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/mypage" class="nav-link active router-header-menu">
              가입
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

<style>
.nav-header{
  background-color: #fd7e14;
}
.router-header-title{
  font-size: 1.9rem !important; /* root element의 1.9배 */
  font-weight: bold;
}
.div-header-menu{
  font-size: 0.9rem; /* root element의 0.9배 */
}
.router-header-menu:hover{
  font-weight: bold;
}
/* 너비 576px 이하 시 버튼 메뉴 가운데 정렬 */
@media screen and (max-width: 992px){
  .btn-header-menu{
    align-items: center;
  }
}
</style>