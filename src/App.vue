<!-- css 클래스 명명 규칙 -->
<!-- 태그-파일-목적 -->
<template>
<div>
  <div class="wrapper">
    <HeaderComponent></HeaderComponent>
    <div class="content"><router-view></router-view></div>
    <FooterComponent></FooterComponent>
  </div>
</div>
</template>

<script>
import HeaderComponent from './components/basics/HeaderComponent.vue'
import FooterComponent from './components/basics/FooterComponent.vue'

export default {
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>

<style>
  /* header, content, footer 정렬 후 최소 높이 100vh로 고정 */
  .wrapper{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .content{
    flex: 1; /* wrapper에 따른 비율 조정 */
    padding-bottom: 0px;
  }
</style>