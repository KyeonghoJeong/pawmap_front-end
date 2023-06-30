<template>
    <div class="div-writing">
        <BoardTitleView></BoardTitleView>
        <form @submit.prevent="postArticle" class="form-writing">
            <div class="div-writing-menu">
                <div class="mb-3">
                    <input type="text" class="form-control" placeholder="제목을 입력하세요." maxlength="40" required v-model="title" autofocus>
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
            title: '',
            writing: '',
            settedTitle: '',
            settedWriting: '',
            settedArticleId: '',
        }
    },
    methods:{
        postArticle(){
            axios.post('http://localhost:8090/api/board/article', {
                title: this.title, 
                writing: this.writing
            }, {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
            })
            .then(response => {
                if(response.data === 'invalidAccessToken'){
                    axios.get('http://localhost:8090/api/member/accesstoken', {
                        withCredentials: true
                    })
                    .then(response => {
                        // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                        if(response.data === 'invalidRefreshToken'){
                            // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                            localStorage.removeItem("accessToken");

                            // 로그인 만료 알림
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                            // 유저에게 바로 로그인 페이지로 이동할지 묻기
                            if(confirm("다시 로그인하시겠습니까?")){
                                // 확인 버튼 누른 경우 로그인 페이지로 이동
                                this.$router.push({path: "/signin"});
                            }
                        }else{
                            // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                            // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                            localStorage.removeItem("accessToken");
                            // 재발급 받은 accessToken 로컬 스토리지에 저장
                            localStorage.setItem("accessToken", response.data.accessToken);

                            // 재귀 호출 (반드시 이번 호출 안에 끝나므로 무한루프X)
                            this.postArticle();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }else{
                    this.$router.push({path: '/board'});
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
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