<template>
<div>
  <HeaderView/>
  <div>
    <nav id="main" class="navbar navbar-expand-sm navbar-dark custom-navbar">
      <form class="container-fluid" style="width:1000px; padding-top:150px">
        <div class="input-group">
          <span class="input-group-text" id="basic-addon1">@</span>
          <input type="text" class="form-control" placeholder="키워드를 입력하세요" aria-label="keyword" aria-describedby="basic-addon1" style="width:3px">
        </div>
      </form>
    </nav>
  </div>
</div>
</template>

<script>
import HeaderView from './components/HeaderView.vue'

export default {
  components: {
    HeaderView
  }
}
</script>

<style>
#main {
  height: 300px;
}
</style>
