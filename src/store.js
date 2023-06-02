import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    emd: '',
    cat: '',
    member: false,
    accessToken: '',
  },
  mutations:{
    updateEmd(state, data){
      state.emd = data;
    },
    updateCat(state, data){
      state.cat = data;
    },
    updateMember(state, data){
      state.member = data;
    },
    updateAccessToken(state, data){
      state.accessToken = data;
    }
  }
})