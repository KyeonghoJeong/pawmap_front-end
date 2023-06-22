<template>
    <div class="div-writing">
        <BoardTitleView></BoardTitleView>
        <form @submit.prevent="putArticle" class="form-writing">
            <div class="div-writing-menu">
                <div class="mb-3">
                    <input type="text" class="form-control" placeholder="제목을 입력하세요." maxlength="40" required v-model="title" >
                </div>
                <div class="mb-3 div-writing-menu-writing">
                    <textarea class="form-control textarea-writing-menu-writing" placeholder="내용을 입력하세요." maxlength="1000" required v-model="writing"></textarea>
                </div>
                <div class="div-writing-menu-btn">
                    <button type="submit" class="btn btn-writing-menu-confirm">등록</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import BoardTitleView from '../../components/board/BoardTitleView.vue'

import axios from 'axios'

export default {
    components:{
        BoardTitleView
    },
    data(){
        return{
            articleId: '',
            title: '',
            writing: '',
        }
    },
    methods:{
        putArticle(){
            axios.put('http://localhost:8090/api/board/article', {
                articleId: this.articleId,
                title: this.title, 
                writing: this.writing
            }, {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
            })
            .then(response => {
                if(response.data === 'Invalid'){
                    axios.get('http://localhost:8090/api/member/reissuance', {
                        withCredentials: true
                    })
                    .then(response => {
                        if(response.data === 'Invalid'){
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");
                            
                            localStorage.removeItem("accessToken");
                            window.location.href = "/signin";
                        }else{
                            localStorage.removeItem("accessToken");
                            localStorage.setItem("accessToken", response.data.accessToken);

                            this.putArticle();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }else{
                    this.$store.commit('updateTitle', '');
                    this.$store.commit('updateWriting', '');
                    this.$store.commit('updateArticleId', '');

                    this.$router.push({path: '/board'});
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
    },
    created(){
        this.articleId = this.$route.query.articleId;
        this.title = this.$store.getters.getTitle;
        this.writing = this.$store.getters.getWriting;
    }
}
</script>

<style>
.div-writing{
    padding-top: 7%;
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-writing{
    width: 60%;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(203, 204, 206);
    padding: 1%;
}

.div-writing-menu{
    display: flex;
    flex-direction: column;
}

.div-writing-menu-writing{
    height: 30vh;
}

.textarea-writing-menu-writing{
    height: 30vh;
    resize: none;
}

.div-writing-menu-btn{
    display: flex;
    flex-direction: row-reverse;
}
.btn-writing-menu-confirm{
    background-color: #fd7e14;
    color: white;
    width: 80px;
}
</style>