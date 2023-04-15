<template>
<div>
  <HeaderView></HeaderView>
  <router-view></router-view>
  <FooterView></FooterView>
</div>
</template>

<script>
import HeaderView from './components/HeaderView.vue'
import FooterView from './components/FooterView.vue'

export default {
  components: {
    HeaderView,
    FooterView
  }
}
</script>