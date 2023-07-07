<template>
    <!-- 전체적인 div들을 담을 div -->
    <div class="div-writing-container">
        <!-- 게시판 안내 메시지 컴포넌트 -->
        <BoardTitleView></BoardTitleView>
        <!-- form을 담을 div -->
        <div class="div-writing-form">
            <div class="div-writing-writing">
                <!-- 제목, 내용을 제출할 form -->
                <!-- 등록 버튼 클릭 시 postArticle 메소드 호출 -->
                <form @submit.prevent="postArticle">
                    <div class="mb-3">
                        <!-- 제목 입력 input => 데이터는 title 변수에 저장 -->
                        <input type="text" class="form-control" placeholder="제목을 입력하세요." maxlength="30" required v-model="title" autofocus>
                    </div>
                    <div class="mb-3">
                        <!-- 내용 입력 input => 데이터는 writing 변수에 저장 -->
                        <textarea class="form-control textarea-writing-writing" placeholder="내용을 입력하세요." maxlength="650" required v-model="writing"></textarea>
                    </div>
                    <div class="div-writing-btn">
                        <!-- 등록 버튼 -->
                        <button type="submit" class="btn btn-writing-confirm">등록</button>
                    </div>
                </form>
            </div>
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
        // 동기적 동작을 위해 async/await 사용
        async postArticle(){
            try{
                // accessToken + 제목 + 내용으로 게시글 등록 post 요청
                const postArticleResponse = await axios.post('http://localhost:8090/api/board/article', {
                    title: this.title,
                    writing: this.writing
                }, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`} // accessToken 보내기
                })

                // 응답 결과 유효하지 않은 acccessToken인 경우
                if(postArticleResponse.data === 'invalidAccessToken'){
                    // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
                    // axios의 동기적 동작을 위해 async/await 사용
                    // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                    const getNewAccessTokenResponse = await axios.get('http://localhost:8090/api/member/accesstoken', {
                        withCredentials: true
                    })

                    // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                    if(getNewAccessTokenResponse.data === 'invalidRefreshToken'){
                        // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                        localStorage.removeItem("accessToken");
                        // 기존에 로컬 스토리지에 저장되어 있던 authority 삭제
                        localStorage.removeItem("authority");

                        // 로그인 만료 알림
                        alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                        // 유저에게 바로 로그인 페이지로 이동할지 묻기
                        if(confirm("다시 로그인하시겠습니까?")){
                            // 로그인 후 보고 있던 페이지로 돌아오기 위해 현재 페이지 경로 저장 
                            localStorage.setItem("previousPage", this.$route.fullPath);

                            // 확인 버튼 누른 경우 로그인 페이지로 이동
                            this.$router.push({path: "/signin"});
                        }

                        // 로그인 상태일 때만 볼 수 있는 페이지에서 로그아웃 버튼을 누른 경우는 메인 페이지로 이동
                        if(this.$route.path === "/board/writing"
                            || this.$route.path === "/board/modifying"
                            || this.$route.path === "/mypage" 
                            || this.$route.path === "/mypage/deletingAccount" 
                            || this.$route.path === "/admin"){
                            this.$router.push({path: "/"});
                        }

                        // header 메뉴 갱신을 위해 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }else{
                        // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                        // 재발급 받은 accessToken 로컬 스토리지에 저장
                        localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                        // accessToken + 제목 + 내용으로 게시글 등록 post 재요청
                        const rePostArticleResponse = await axios.post('http://localhost:8090/api/board/article', {
                            title: this.title,
                            writing: this.writing
                        }, {
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`} // accessToken 보내기
                        })

                        // accessToken이 유효한 경우 => 재요청 성공
                        if(rePostArticleResponse.data !== 'invalidAccessToken'){
                            // 게시글 등록 후 게시판으로 이동
                            this.$router.push({path: '/board', query: {page: 1}});
                        }
                    }
                }else{
                    // 게시글 등록 후 게시판으로 이동
                    this.$router.push({path: '/board', query: {page: 1}});
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style>
    .div-writing-container{ /* 전체적인 div들을 담을 div */
        /* 상하좌우 간격 조절 */
        padding-top: 5%;
        /* flex 정렬 후 게시판 안내 메시지, form column 정렬 및 가운데 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-writing-form{ /* 글쓰기 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 60%; /* 너비 지정 */
    }
    .div-writing-writing{ /* 글쓰기 form div */
        padding: 1%; /* 상하좌우 간격 조절 */
    }
    .textarea-writing-writing{ /* 내용 입력 textarea 설정 */
        height: 32vh; /* 높이 지정 */
        resize: none; /* 크기 조절 금지 */
    }
    .div-writing-btn{ /* 등록 버튼을 담는 div */
        /* flex 정렬 후 맨 오른쪽 끝에 버튼 배치 */
        display: flex;
        flex-direction: row-reverse;
    }
    .btn-writing-confirm{ /* 버튼 색, 너비 지정 */
        width: 80px;
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .btn-writing-confirm:hover{ /* 버튼 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    /* width가 992px 이하면 재조정 */
    @media screen and (max-width: 992px){
        .div-writing-form{ /* 글쓰기 div */
            width: 60%; /* 너비 재지정 */
        }
    }
</style>