<!-- css 클래스 명명 규칙 -->
<!-- 태그-파일-목적 -->
<template>
<div>
  <div class="wrapper">
    <HeaderView></HeaderView>
    <div class="content"><router-view></router-view></div>
    <FooterView></FooterView>
  </div>
</div>
</template>

<script>
import HeaderView from './components/basics/HeaderView.vue'
import FooterView from './components/basics/FooterView.vue'

export default {
  components: {
    HeaderView,
    FooterView
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
}
</style>