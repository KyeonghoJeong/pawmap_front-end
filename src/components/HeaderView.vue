<template>
  <nav class="navbar navbar-expand-sm navbar-dark custom-navbar">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" style="font-size: 25px; font-weight: bold; margin-bottom: 6px">pawmap</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" href="#">지도</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#">게시판</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#">갤러리</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#">로그아웃</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="#">마이페이지</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
export default{
    
}
</script>

<style>
.custom-navbar {
  background-color: #fd7e14;
}
.navbar-collapse{
    font-size:14px;
}
.nav-link:hover {
    font-weight: bold;
}
.custom-navbar {
  background-color: #fd7e14;
}
</style>