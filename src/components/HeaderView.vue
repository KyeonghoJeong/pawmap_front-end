<template>
<div>

  <nav class="navbar navbar-expand-sm navbar-dark custom-navbar">
    <div class="container-fluid">

      <router-link to="/" class="navbar-brand custom-brand" style="font-size:35px">
        <img src="../assets/images/map.png" alt="icon" width="35" height="35" class="d-inline-block align-text-top">
        pawmap
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto custom-navbar-nav">
          <li class="nav-item">
            <router-link to="/test" class="nav-link active navbar-link">
              지도
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/test" class="nav-link active navbar-link">
              게시판
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/test" class="nav-link active navbar-link">
              갤러리
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/test" class="nav-link active navbar-link">
              로그아웃
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/test" class="nav-link active navbar-link">
              마이페이지
            </router-link>
          </li>
        </ul>
      </div>
      
    </div>
  </nav>

</div>
</template>

<style>
.custom-navbar{
  background-color: #fd7e14;
}
.custom-brand{
  font-size: 25px !important;
  font-weight: bold;
}
.navbar-collapse{
  font-size: 14px;
}
.navbar-link:hover{
  font-weight: bold;
}
@media screen and (max-width: 576px){
  .custom-navbar-nav{
    align-items: center;
  }
}
</style>