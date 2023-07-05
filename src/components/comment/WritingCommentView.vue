<template>
    <div>
        <!-- 댓글 작성 form -->
        <form @submit.prevent="postComment">
            <!-- 댓글 작성 div -->
            <div class="form-floating div-writingComment-writing">
                <!-- textarea 최대 길이 지정 및 required 지정, 데이터 입력 시 writing 변수에 저장 -->
                <textarea class="form-control textarea-writingComment" placeholder="댓글을 남겨보세요." maxlength="300" v-model="writing" required></textarea>
                <label for="floatingTextarea2">댓글을 남겨보세요.</label>
            </div>
            <!-- 댓글 등록 버튼 div -->
            <div class="div-writingComment-btns">
                <!-- 등록 버튼 클릭 시 submit -->
                <button type="submit" class="btn btn-writingComment-post">등록</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'

export default{
    // CommentView(부모)로부터 게시글 id 받기
    props: {
        articleId: {
            type: String
        }
    },
    data(){
        return{
            writing: '', // 댓글 내용 저장할 변수
        }
    },
    methods:{
        // 댓글 등록 메소드
        // axios의 동기적 동작을 위해 async/await 사용
        async postComment(){
            if(localStorage.getItem("accessToken") === null){
                // 로그인 상태가 아닌 경우 로그인 요청
                alert("댓글 등록을 위해서는 로그인하셔야 합니다.");
                
                // 유저에게 바로 로그인 페이지로 이동할 지 묻기
                if(confirm("로그인 하시겠습니까?")){
                    // 로그인 후 현재 페이지로 돌아오기 위해 로컬 스토리지에 현재 페이지 주소 저장
                    localStorage.setItem("previousPage", this.$route.fullPath);
                    
                    // 로그인 페이지로 이동
                    this.$router.push('/signin');
                }
            }else{
                try {
                    // accessToken + 게시글 id + 댓글 내용으로 post 요청
                    const postCommentResponse = await axios.post('http://localhost:8090/api/board/article/comment', {
                        articleId: this.articleId,
                        writing: this.writing
                    }, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })

                    // 응답 결과 유효하지 않은 acccessToken인 경우
                    if(postCommentResponse.data === 'invalidAccessToken'){
                        // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                        localStorage.removeItem("accessToken");

                        // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
                        // axios의 동기적 동작을 위해 async/await 사용
                        // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                        const getNewAccessTokenResponse = await axios.get('http://localhost:8090/api/member/accesstoken', {
                            withCredentials: true
                        })

                        // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                        if(getNewAccessTokenResponse.data === 'invalidRefreshToken'){
                            // 로그인 만료 알림
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                            // 유저에게 바로 로그인 페이지로 이동할지 묻기
                            if(confirm("다시 로그인하시겠습니까?")){
                                // 로그인 후 보고 있던 페이지로 돌아오기 위해 현재 페이지 경로 저장 
                                localStorage.setItem("previousPage", this.$route.fullPath);

                                // 확인 버튼 누른 경우 로그인 페이지로 이동
                                this.$router.push({path: "/signin"});
                            }

                            // header 메뉴 갱신을 위해 새로고침
                            this.$router.go(this.$router.currentRoute);
                        }else{
                            // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                            // 재발급 받은 accessToken 로컬 스토리지에 저장
                            localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                            // accessToken + 게시글 id + 댓글 내용으로 post 재요청
                            const rePostCommentResponse = await axios.post('http://localhost:8090/api/board/article/comment', {
                                articleId: this.articleId,
                                writing: this.writing
                            }, {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // accessToken이 유효한 경우 => delete 요청 성공
                            if(rePostCommentResponse.data !== 'invalidAccessToken'){
                                // 댓글 등록 후 페이지 새로고침
                                this.$router.go(this.$router.currentRoute);
                            }
                        }
                    }else{
                        // 댓글 등록 후 페이지 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}
</script>

<style>
    /* 댓글 작성 div, 댓글 등록 버튼 div를 담을 div */
    .div-writingComment-writing{
        padding: 1%; /* 상하좌우 패딩 추가 */
    }
    /* 댓글 작성 textarea 클래스 */
    .textarea-writingComment{
        height: 100px !important; /* 높이 지정 */
    }
    /* 버튼 div */
    .div-writingComment-btns{
        width: 100%; /* 너비 100% 채우기 */
        /* 우측 끝 정렬 */
        display: flex;
        justify-content: flex-end;
        /* 오른쪽, 아래 패딩 추가 */
        padding-right: 1%;
        padding-bottom: 1%;
    }
    /* 버튼 클래스 => 색, 너비 지정 */
    .btn-writingComment-post{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }
</style>