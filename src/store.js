import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    emd: '',
    cat: '',
    title: '',
    writing: '',
  },
  mutations:{
    updateEmd(state, data){
      state.emd = data;
    },
    updateCat(state, data){
      state.cat = data;
    },
    updateArticleId(state, data){
      state.articleId = data;
    },
    updateTitle(state, data){
      state.title = data;
    },
    updateWriting(state, data){
      state.writing = data;
    }
  },
  getters:{
    getArticleId: (state) => {
      return state.articleId;
    },
    getTitle: (state) => {
      return state.title;
    },
    getWriting: (state) => {
      return state.writing;
    }
  }
})