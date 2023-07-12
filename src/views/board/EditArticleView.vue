<template>
    <!-- 전체적인 div들을 담을 div -->
    <div class="div-Modifying-container">
        <!-- 게시판 안내 메시지 컴포넌트 -->
        <BoardTitleComponent></BoardTitleComponent>
        <!-- form을 담을 div -->
        <div v-if="isArticleLoaded" class="div-Modifying-form">
            <div class="div-Modifying-writing">
                <!-- 제목, 내용을 제출할 form -->
                <!-- 등록 버튼 클릭 시 postArticle 메소드 호출 -->
                <form @submit.prevent="updateArticle">
                    <div class="mb-3">
                        <!-- 제목 입력 input => 데이터는 title 변수에 저장 -->
                        <input type="text" class="form-control" placeholder="제목을 입력하세요." maxlength="30" required v-model="title" >
                    </div>
                    <div class="mb-3">
                        <!-- 내용 입력 input => 데이터는 writing 변수에 저장 -->
                        <textarea class="form-control textarea-Modifying-writing" placeholder="내용을 입력하세요." maxlength="650" required v-model="writing"></textarea>
                    </div>
                    <div class="div-Modifying-btn">
                        <!-- 등록 버튼 -->
                        <button type="submit" class="btn btn-Modifying-confirm">등록</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import BoardTitleComponent from '../../components/board/BoardTitleComponent.vue'

import axios from 'axios'

export default {
    components:{
        BoardTitleComponent
    },
    data(){
        return{
            isArticleLoaded: false,
            articleId: '',
            title: '',
            writing: '',
        }
    },
    methods:{
        getArticle(){
            // get 요청
            axios.get('http://localhost:8090/api/board/article', {
                params:{articleId: this.articleId}
            })
            .then(response => {
                // 게시글 데이터 저장
                this.title = response.data.title;
                this.writing = response.data.writing;

                // 게시글 데이터 수신 완료 여부 true
                this.isArticleLoaded = true;
            })
            .catch(error => {
                console.log(error);
            })
        },
        // accessToken 재발급 메소드
        async getAccessToken(){
            // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
            // axios의 동기적 동작을 위해 async/await 사용
            try {
                // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                const getAccessTokenResponse = await axios.get('http://localhost:8090/api/auth/access-token', {
                    withCredentials: true
                })

                // 200 => 요청 성공
                if(getAccessTokenResponse.status === 200){
                    // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우
                    // 재발급 받은 accessToken 로컬 스토리지에 저장
                    localStorage.setItem("accessToken", getAccessTokenResponse.data.accessToken);

                    return true; // 성공 => true 리턴
                }
            } catch (error) {
                // 403 => refreshToken 토큰 만료
                if(error.response.status === 403){
                    // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("role");
                }

                return false; // 실패 => false 리턴
            }
        },
        // 게시글 수정 메소드
        // 동기적 동작을 위해 async/await 사용
        async updateArticle(){
            try {
                // accessToken + 게시글 id + 제목 + 내용으로 게시글 수정 put 요청
                const updateArticleResponse = await axios.put('http://localhost:8090/api/board/article', {
                    articleId: this.articleId,
                    title: this.title, 
                    writing: this.writing
                }, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                })

                // 200 => 요청 성공
                if(updateArticleResponse.status === 200){
                    // 게시글 수정 후 해당 게시글로 이동
                    this.$router.push({path: '/board/article', query: {articleId: this.articleId}});
                }
            } catch (error) {
                // 403 => accessToken 토큰 만료
                if(error.response.status === 403){
                    // accessToken 재발급 메소드 호출 => true면 성공
                    const isNewAccessTokenLoaded = await this.getAccessToken();
                    
                    if(isNewAccessTokenLoaded){
                        try {
                            // accessToken + 게시글 id + 제목 + 내용으로 게시글 수정 put 재요청
                            const reUpdateArticleResponse = await axios.put('http://localhost:8090/api/board/article', {
                                articleId: this.articleId,
                                title: this.title, 
                                writing: this.writing
                            }, {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // 200 => 재요청 성공
                            if(reUpdateArticleResponse.status === 200){
                                // 게시글 수정 후 해당 게시글로 이동
                                this.$router.push({path: '/board/article', query: {articleId: this.articleId}});
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }else{
                        // 로그인 만료 알림
                        alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                        // header 메뉴 갱신을 위해 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }
                }
            }
        }
    },
    created(){
        this.articleId = this.$route.query.articleId;
    },
    mounted(){
        this.getArticle();
    }
}
</script>

<style>
    .div-Modifying-container{ /* 전체적인 div들을 담을 div */
        /* 상하좌우 간격 조절 */
        padding-top: 5%;
        /* flex 정렬 후 게시판 안내 메시지, form column 정렬 및 가운데 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-Modifying-form{ /* 글쓰기 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 60%; /* 너비 지정 */
    }
    .div-Modifying-writing{ /* 글쓰기 form div */
        padding: 1%; /* 상하좌우 간격 조절 */
    }
    .textarea-Modifying-writing{ /* 내용 입력 textarea 설정 */
        height: 32vh; /* 높이 지정 */
        resize: none; /* 크기 조절 금지 */
    }
    .div-Modifying-btn{ /* 등록 버튼을 담는 div */
        /* flex 정렬 후 맨 오른쪽 끝에 버튼 배치 */
        display: flex;
        flex-direction: row-reverse;
    }
    .btn-Modifying-confirm{ /* 버튼 색, 너비 지정 */
        width: 80px;
        background-color: #fd7e14;
        color: white;
    }
    .btn-Modifying-confirm:hover{ /* 버튼 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    /* width가 992px 이하면 재조정 */
    @media screen and (max-width: 992px){
        .div-Modifying-form{ /* 글쓰기 div */
            width: 60%; /* 너비 재지정 */
        }
    }
</style>