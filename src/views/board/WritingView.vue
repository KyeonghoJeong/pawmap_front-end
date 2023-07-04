<template>
    <!-- 전체적인 div들을 담을 div -->
    <div class="div-writing-container">
        <!-- 게시판 안내 메시지 컴포넌트 -->
        <BoardTitleView></BoardTitleView>
        <!-- form을 담을 div -->
        <div class="div-writing-main">
            <!-- 제목, 내용을 제출할 form -->
            <!-- 등록 버튼 클릭 시 postArticle 메소드 호출 -->
            <form @submit.prevent="postArticle" class="form-writing-writing">
                <div class="mb-3">
                    <!-- 제목 입력 input => 데이터는 title 변수에 저장 -->
                    <input type="text" class="form-control" placeholder="제목을 입력하세요." maxlength="40" required v-model="title" autofocus>
                </div>
                <div class="mb-3 div-writing-writing">
                    <!-- 내용 입력 input => 데이터는 writing 변수에 저장 -->
                    <textarea class="form-control textarea-writing-writing" placeholder="내용을 입력하세요." maxlength="1000" required v-model="writing"></textarea>
                </div>
                <div class="div-writing-btn">
                    <!-- 등록 버튼 -->
                    <button type="submit" class="btn btn-writing-confirm">등록</button>
                </div>
            </form>
        </div>
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
            title: '', // 제목
            writing: '', // 내용
        }
    },
    methods:{
        // 게시글 등록 메소드
        postArticle(){
            // 게시글 등록을 위해 백엔드에 post 요청
            axios.post('http://localhost:8090/api/board/article', {
                title: this.title, // 제목
                writing: this.writing // 내용
            }, {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`} // accessToken 보내기
            })
            .then(response => {
                // 유효하지 않은 accessToken
                if(response.data === 'invalidAccessToken'){
                    // accessToken 재발급 요청
                    axios.get('http://localhost:8090/api/member/accesstoken', {
                        withCredentials: true // 쿠키로 refreshToken 보내기
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
                                // 로그인 후 보고 있던 페이지로 돌아오기 위해 현재 페이지 경로 저장 
                                this.$store.commit('setBeforePage', this.$route.fullPath);

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
    .div-writing-container{ /* 전체적인 div들을 담을 div */
        /* 상하좌우 간격 조절 */
        padding-top: 6.5%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        /* flex 정렬 후 게시판 안내 메시지, form column 정렬 및 가운데 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-writing-main{ /* 글쓰기 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 80%; /* 너비 지정 */
        height: 50vh; /* 높이 지정 */
    }
    .form-writing-writing{ /* 글쓰기 form div */
        width: 100%; /* 글쓰기 div 내부 100% 채우기 */
        padding: 1%; /* 상하좌우 간격 조절 */
    }
    .div-writing-writing{ /* 내용 입력 div */
        height: 36vh; /* 높이 지정 */
    }
    .textarea-writing-writing{ /* 내용 입력 textarea 설정 */
        height: 36.5vh; /* 높이 지정 */
        resize: none; /* 크기 조절 금지 */
    }
    .div-writing-btn{ /* 등록 버튼을 담는 div */
        /* flex 정렬 후 맨 오른쪽 끝에 버튼 배치 */
        display: flex;
        flex-direction: row-reverse;
    }
    .btn-writing-confirm{ /* 버튼 색, 너비 지정 */
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }
    /* width가 992px 이하면 재조정 */
    @media screen and (max-width: 992px){
        .div-writing-main{ /* 글쓰기 div */
            width: 100%; /* 너비 재지정 */
        }
    }
</style>