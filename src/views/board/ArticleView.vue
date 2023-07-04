<template>
    <!-- 전체 div를 담을 div -->
    <div class="div-article-container">
        <!-- 게시판 안내 메시지 컴포넌트 -->
        <BoardTitleView></BoardTitleView>
        <!-- 게시글 출력 요소 div들을 담을 div -->
        <div v-if="isArticleLoaded" class="div-article-main">
            <!-- 제목 관련 div들을 담을 div -->
            <div class="div-article-title">
                <!-- 제목 카테고리 div -->
                <div class="div-article-title-cat">
                    제목
                </div>
                <!-- 제목 div -->
                <div>
                    <!-- 게시글 데이터 article에서 제목 가져오기 -->
                    {{this.article.title}}
                </div>
            </div>
            <!-- 작성일 관련 div들을 담을 div -->
            <div class="div-article-date">
                <!-- 작성일 카테고리 div -->
                <div class="div-article-date-cat">
                    작성일
                </div>
                <!-- 작성일 div -->
                <div>
                    <!-- 게시글 데이터 article에서 작성일 가져오기 -->
                     {{this.article.postDate}}
                </div>
            </div>
            <!-- 닉네임 관련 div들을 담을 div -->
            <div class="div-article-nickname">
                <!-- 닉네임 카테고리 div -->
                <div class="div-article-nickname-cat">
                    닉네임
                </div>
                <!-- 닉네임 div -->
                <div>
                    <!-- 게시글 데이터 article에서 닉네임 가져오기 -->
                     {{this.article.nickname}}
                </div>
            </div>
            <!-- 게시글 내용 관련 div들을 담을 div -->
            <div class="div-article-content">
                <!-- 게시글 데이터 article에서 내용 가져오기 -->
                 {{this.article.writing}}
            </div>

            <!-- 수정, 삭제 기능을 담을 div -->
            <!-- isItsMember 변수는 해당 게시글 작성자와 현재 로그인 중인 작성자가 일치할 경우 true -->
            <div v-if="isItsMember === true" class="div-article-functions">
                <!-- 수정, 삭제 span 클릭 시 이벤트로 메소드 호출 -->
                <span class="span-article-delete" @click="deleteArticle">삭제</span>&nbsp;&nbsp;
                <span class="span-article-update" @click="updateArticle">수정</span>    
            </div>

            <!-- 버튼을 담기 위한 div -->
            <!-- 수정, 삭제 메뉴가 없을 때 간격 유지를 위해 style 추가 -->
            <div class="div-article-btn" :style="{ 'margin-top': isItsMember ? '0' : '24px' }">
                <!-- 클릭 시 게시판으로 돌아가는 버튼 -->
                <button type="button" class="btn btn-article-board" @click="toBoard">목록</button>
            </div>
            <!-- 댓글 출력 컴포넌트 -->
            <CommentView :articleId="articleId" :memberId="memberId"></CommentView>
            <!-- 댓글 작성 컴포넌트 -->
            <WritingCommentView :articleId="articleId"></WritingCommentView>
        </div>
    </div>
</template>

<script>
import BoardTitleView from '../../components/board/BoardTitleView.vue'
import CommentView from '../../components/comment/CommentView.vue'
import WritingCommentView from '../../components/comment/WritingCommentView.vue'

import axios from 'axios'

export default {
    components:{
        BoardTitleView, // 게시판 안내 메시지 컴포넌트
        CommentView, // 댓글 출력 컴포넌트
        WritingCommentView, // 댓글 작성 컴포넌트
    },
    data(){
        return{
            articleId: '', // 해당 게시글의 id
            article: '', // 해당 게시글 정보(내용)
            isArticleLoaded: false, // 백엔드로부터 해당 게시글 정보(내용)를 전부 받아왔는지 확인
            isItsMember: false, // 현재 로그인 중인 회원과 해당 게시글의 작성자가 일치하는지 확인
            memberId: '',
            isMemberIdLoaded: false,
            comments: [], // 백엔드로부터 해당 게시글의 댓글을 받아서 저장할 배열
            totalPages: '', // 댓글 pagination을 위해 총 댓글 페이지 수를 받을 변수 
        }
    },
    methods:{
        // 목록 버튼 클릭 시 게시판으로 이동하는 메소드
        toBoard(){
            this.$router.push({path:'/board'});
        },
        // 현재 로그인 중인 회원과 해당 게시글의 작성자가 일치하는지 확인하는 메소드
        // axios의 동기적 동작을 위해 async/await 사용
        async checkMember(){
            try {
                // accessToken + 게시글 id로 get 요청
                const checkMemberResponse = await axios.get('http://localhost:8090/api/board/article/membercheck', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                    params: {articleId: this.articleId}
                })

                // 응답 결과 유효하지 않은 acccessToken인 경우
                if(checkMemberResponse.data === 'invalidAccessToken'){
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

                        // accessToken + 게시글 id로 get 재요청
                        const reCheckMemberResponse = await axios.get('http://localhost:8090/api/board/article/membercheck', {
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                            params: {articleId: this.articleId}
                        })

                        this.memberId = reCheckMemberResponse.data.memberId; // accessToken으로 회원 id 받기
                        this.isMemberIdLoaded = true; // 회원 id 받기 확인

                        // DB 테이블에서 해당 회원 id + 게시글 id로 조회 시 해당 게시글이 있는 경우 = count가 1인 경우
                        if(reCheckMemberResponse.data.count === 1){
                            // 현재 로그인 중인 회원과 게시글 작성자가 동일(true)
                            this.isItsMember = true;
                        }
                    }
                }else{
                    this.memberId = checkMemberResponse.data.memberId; // accessToken으로 회원 id 받기
                    this.isMemberIdLoaded = true; // 회원 id 받기 확인

                    // DB 테이블에서 해당 회원 id + 게시글 id로 조회 시 해당 게시글이 있는 경우 = count가 1인 경우
                    if(checkMemberResponse.data.count === 1){
                        // 현재 로그인 중인 회원과 게시글 작성자가 동일(true)
                        this.isItsMember = true;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 게시글 정보(내용)를 가지고 오는 메소드
        getArticle(){
            // get 요청
            axios.get('http://localhost:8090/api/board/article', {params:{articleId: this.articleId}})
            .then(response => {
                // 게시글 데이터 저장
                this.article = response.data;

                // 게시글 데이터 수신 완료 여부 true
                this.isArticleLoaded = true;
            })
            .catch(error => {
                console.log(error);
            })
        },
        // 게시글 수정 메소드
        updateArticle(){
            // 게시글 수정 페이지로 게시글 id와 함께 push
            this.$router.push({path: '/board/modifying', query: {articleId: this.articleId}});
        },
        // 게시글 삭제 메소드
        async deleteArticle(){
            if(confirm("정말 삭제하시겠습니까?")){
                try {
                    // accessToken + 게시글 id로 게시글 삭제 delete 요청
                    const response = axios.delete(`http://localhost:8090/api/board/article?articleId=${this.articleId}`, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })

                    // 응답 결과 유효하지 않은 acccessToken인 경우
                    if(response.data === 'invalidAccessToken'){
                        // accessToken 재발급 await
                        await this.getNewAccessToken(this.deleteArticle);
                    }else{
                        // 삭제 후 게시판 페이지로 이동
                        this.$router.push({path:'/board'});

                        // 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
    },
    created(){
        // 쿼리로 게시글 id 받기
        // 해당 게시글 id로 게시글 정보를 가져오기
        // 현재 로그인 중인 회원의 게시글인지 판단하기
        this.articleId = this.$route.query.articleId;

        // 게시글 정보 가져오기 => 데이터 로딩 대기 필요
        this.getArticle();

        // 로그인 중인 경우
        // 게시글 작성 회원과 로그인 중인 회원이 같은 지 확인 => 데이터 로딩 대기 필요
        if(localStorage.getItem("accessToken") !== null){
            this.checkMember();
        }
    }
}
</script>

<style>
    /* 게시판 안내 메시지 + 게시글 담을 div */
    .div-article-container{
        /* 상하좌우 간격 설정 */
        padding-top: 6.5%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        /* 안내 메시지, 게시글 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 게시글 div */
    .div-article-main{
        width: 80%; /* 너비 지정 */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    /* 제목 전체 div */
    .div-article-title{
        display: flex;
        padding: 1%;
        border-bottom: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    /* 제목 항목 div */
    .div-article-title-cat{
        width: 15%; /* 너비 지정 */
        font-weight: bold; /* 글자 굵게 */
    }
    /* 작성일 전체 div */
    .div-article-date{
        display: flex; /* 정렬 */
        padding: 1%; /* 상하좌우 여백 */
        border-bottom: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    /* 작성일 항목 div */
    .div-article-date-cat{
        width: 15%; /* 너비 지정 */
        font-weight: bold; /* 글자 굵게 */
    }
    /* 닉네임 전체 div */
    .div-article-nickname{
        display: flex; /* 정렬 */
        padding: 1%; /* 상하좌우 여백 */
        border-bottom: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    /* 닉네임 항목 div */
    .div-article-nickname-cat{
        width: 15%; /* 너비 지정 */
        font-weight: bold; /* 글자 굵게 */
    }
    /* 게시글 내용 div */
    .div-article-content{
        padding: 1%; /* 상하좌우 여백 */
        height: auto; /* 높이 컨텐츠에 맞게 오토로 지정 */
        word-wrap: break-word; /* 내용 자동 줄바꿈 */
    }
    /* 수정, 삭제 메뉴 div */
    .div-article-functions{
        padding-right: 2%; /* 우측 간격 */
        /* 반대 정렬, 폰트 굵게 */
        display: flex;
        flex-direction: row-reverse;
        font-weight: bold;
    }
    /* 게시글 수정, 삭제 메뉴 span */
    .span-article-update, .span-article-delete{
        text-decoration: underline; /* 밑줄 */
    }
    /* 게시글 수정, 삭제 메뉴 span 마우스오버 */
    .span-article-update:hover, .span-article-delete:hover{
        cursor: pointer; /* 마우스 커서 변경 */
    }
    /* 목록 버튼 div */
    .div-article-btn{
        padding: 1%; /* 상하좌우 간격 */
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */     
    }
    .btn-article-board{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }
    /* 너비 992px 이하 시 너비 재조정 */
    @media screen and (max-width: 992px){
        .div-article-main{
            width: 100%;
        }
    }
</style>