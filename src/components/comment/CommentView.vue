<template>
    <div>
        <!-- 댓글 데이터 전부 수신 완료 시에만 출력 -->
        <div v-if="isCommentsLoaded">
            <!-- 작성 정보 div + 댓글 div 담는 div, 댓글 수 만큼 반복 -->
            <div v-for="comment in comments" :key="comment.cmtId" class="div-comment-comment">
                <!-- 작성 정보 div -->
                <div class="div-comment-info">
                    <div>
                        <!-- 닉네임 span, 작성일 -->
                        <span class="span-comment-nickname">{{comment.nickname}}</span>&nbsp;<span class="span-comment-date">{{comment.postDate}}</span>
                    </div>
                    <!-- 수정, 삭제 span을 담을 div, 현재 로그인 중인 회원(memberId)과 댓글의 memberId가 일치하는 경우만 출력 -->
                    <div v-if="memberId === comment.memberId">
                        <!-- 수정 메뉴 클릭 시 해당 댓글의 수정 컴포넌트가 열리도록 매개변수로 댓글 id를 받음 -->
                        <span class="span-comment-update" @click="openUpdatingCommentMenu(comment.cmtId)">수정</span>&nbsp;
                        <span class="span-comment-delete" @click="deleteComment(comment.cmtId)">삭제</span>
                    </div>
                </div>
                <!-- commentId 변수는 댓글 내용 div를 출력할 지, 댓글 수정 div를 출력할 지를 결정 -->
                <!-- commentId가 ''일 때 수정 메뉴를 클릭하지 않은 상태이지만 수정 메뉴 클릭 시 나머지 다른 댓글 출력을 위해 댓글 id와 비교함 -->
                <div v-if="commentId !== comment.cmtId" class="div-comment-writing">{{comment.writing}}</div>
                <!-- 수정 메뉴를 클릭하면 commentId는 해당 댓글의 id가 할당되고 둘이 같은 경우 수정 div가 출력 됨 -->
                <div v-if="commentId === comment.cmtId">
                    <!-- UpdatingCommentView에서 취소 버튼을 누르는 경우 CommentView 컴포넌트로 true 전송 -->
                    <!-- closeUpdatingCommentMenu 메소드 실행해서 수정 메뉴 닫기 -->
                    <UpdatingCommentView :writing="comment.writing" :cmtId="comment.cmtId" @closeUpdatingCommentMenu="closeUpdatingCommentMenu"></UpdatingCommentView>
                </div>
            </div>
        </div>

        <!-- div-board-pagination은 페이지네이션 메뉴를 담고 정렬하기 위한 div -->
        <div class="div-comment-pagination">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <!-- computed에서 isPrevDisabled 계산 후 true면 비활성화, false면 활성화 -->
                    <!-- 클릭 시 setPrevPageNum 메소드 호출하여 새로 page 번호를 만들어 출력하고 해당하는 페이지의 게시글 출력 -->
                    <li class="page-item">
                        <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <!-- computed에서 pageNumbers 메소드로 만든 페이지 번호를 반복문으로 출력 -->
                    <!-- 페이지 번호 클릭 시 pageActive = i로 저장하고 둘이 같을 때 active 즉, 선택한 페이지 번호는 active로 출력 -->
                    <!-- 페이지 번호 클릭 시 getArticles 메소드에 해당하는 페이지 번호(i-1)의 게시글 데이터를 백엔드로부터 받아와 출력 -->
                    <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                        <button class="page-link" @click="getCommentInfos(i-1)">{{i}}</button>
                    </li>

                    <!-- computed에서 isNextDisabled 계산 후 true면 비활성화, false면 활성화 -->
                    <!-- 클릭 시 setNextPageNum 메소드 호출하여 새로 page 번호를 만들어 출력하고 해당하는 페이지의 게시글 출력 -->
                    <li class="page-item">
                        <button :class="['page-link', isNextDisabled ? 'disabled' : '']" aria-label="Next" @click="setNextPageNum">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

// 댓글 수정 컴포넌트 임포트
import UpdatingCommentView from '/src/components/comment/UpdatingCommentView.vue'

export default{
    // 게시글 컴포넌트(부모)에서 게시글 id, 회원 id 받기
    props: {
        articleId: {
            type: String,
            required: true // 데이터 반드시 필요
        },
        memberId: {
            type: String,
            required: true // 데이터 반드시 필요
        }
    },
    components:{
        UpdatingCommentView,
    },
    data(){
        return{
            comments: [], // 댓글을 저장할 배열
            isCommentsLoaded: false, // 댓글 저장이 완료되었는지 확인하는 변수
            totalPages: '', // 총 댓글 페이지 수
            commentId: '', // 해당 댓글의 id를 저장할 변수
            pageActive: 1, // 첫 페이지 출력시 선택 중인 페이지 숫자
            startNum: 0, // 첫 페이지 출력 시 시작 번호
            endNum: 0, // 첫 페이지 출력시 마지막 번호
        }
    },
    methods:{
        // 게시글에 해당하는 댓글 모두 요청하는 메소드
        getComments(){
            // 게시글 id, pagination 설정
            axios.get('http://localhost:8090/api/board/article/comments', {
                params: {articleId: this.articleId, page: 0, size: 10}
            })
            .then(response => {
                this.comments = response.data.content; // 댓글 데이터
                this.totalPages = response.data.totalPages; // 총 댓글 페이지 수

                this.isCommentsLoaded = true; // 댓글 데이터 수신 완료
            })
            .catch(error => {
                console.log(error);
            })          
        },
        // v-for로 출력 중인 댓글 중에서 수정을 클릭한 댓글의 수정 메뉴를 보여주는 메소드 
        openUpdatingCommentMenu(cmtId){
            // commentId는 현재 수정 메뉴를 클릭한 댓글의 id => v-if로 체크하여 해당 댓글의 수정 메뉴 출력
            this.commentId = cmtId; // 댓글 아이디 지정
        },
        // 댓글 삭제 메소드
        // axios의 동기적 동작을 위해 async/await 사용
        async deleteComment(cmtId){
            // 다시 한번 삭제 확인
            if(confirm("정말 삭제하시겠습니까?")){
                try {
                    // accessToken + 댓글 id로 delete 요청
                    const deleteCommentResponse = await axios.delete(`http://localhost:8090/api/board/article/comment?cmtId=${cmtId}`, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })

                    // 응답 결과 유효하지 않은 acccessToken인 경우
                    if(deleteCommentResponse.data === 'invalidAccessToken'){
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

                            if(this.$route.path === "/mypage" || this.$route.path === "/deletingAccount" || this.$route.path === "/admin"){
                                // 마이페이지, 탈퇴페이지, 관리페이지인 경우는 메인 페이지로 이동
                                this.$router.push({path: "/"});
                            }

                            // header 메뉴 갱신을 위해 새로고침
                            this.$router.go(this.$router.currentRoute);
                        }else{
                            // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                            // 재발급 받은 accessToken 로컬 스토리지에 저장
                            localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                            // accessToken + 댓글 id로 delete 재요청
                            const reDeleteCommentResponse = await axios.delete(`http://localhost:8090/api/board/article/comment?cmtId=${cmtId}`, {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // accessToken이 유효한 경우 => delete 요청 성공
                            if(reDeleteCommentResponse.data !== 'invalidAccessToken'){
                                // 댓글 삭제 후 페이지 새로고침
                                this.$router.go(this.$router.currentRoute);
                            }
                        }
                    }else{
                        // 댓글 삭제 후 페이지 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        // commentId 변수와 해당 댓글 id가 같은 경우 수정 메뉴가 열림
        // 수정 메뉴 닫기 메소드 이므로 commentId 변수를 초기화해서 닫게 만듦
        closeUpdatingCommentMenu(){
            this.commentId = '';
        },
        setPrevPageNum(){
            // isPrevDisabled()에 의해 startNum이 5 이하인 경우는 신경 X
            this.startNum = this.startNum - 5; // 시작 번호는 현재 시작 번호 - 5
            this.endNum = this.startNum + 4; // 마지막 번호는 현재 시작 번호 + 4
            this.pageActive = this.endNum; // 이전 버튼 클릭 시 선택 중인 페이지 표시를 위해 선택한 페이지 번호 리턴
            this.getCommentInfos(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        // 다음 버튼 클릭 시 startNum, endNum 재설정을 위한 메소드
        setNextPageNum(){
            // 페이지를 처음 띄우는 경우 startNum은 0, endNum은 0이므로 startNum은 startNum + 6으로 설정
            // 페이지를 처음 띄우는 경우가 아닌 경우는 startNum은 endNum + 1
            if(this.endNum === 0){
                this.startNum = this.startNum + 6;
            }else{
                this.startNum = this.endNum + 1;
            }
            
            this.endNum = this.startNum + 4; // endNum은 startNum + 4
            // 마지막 페이지로 설정한 번호가 총 페이지 수를 넘는 경우 마지막 페이지 번호를 총 페이지 수로 설정
            if(this.endNum > this.totalPages){
                this.endNum = this.totalPages;
            }

            this.pageActive = this.startNum; // 다음 버튼을 누르면 첫 페이지 번호를 active
            this.getCommentInfos(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        // 페이지 번호 클릭 시 해당하는 페이지의 댓글들을 가져오는 메소드
        getCommentInfos(i){
            this.isCommentsLoaded = false; // 댓글 데이터를 전부 가져왔는지 체크하기 위해 get 요청 전 false로 지정 

            // pagination에서 i(페이지 넘버)를 받아서 해당하는 페이지의 댓글 데이터 get 요청
            axios.get('http://localhost:8090/api/board/article/comments', {
                params: {articleId: this.articleId, page: i, size: 10}
            })
            .then(response => {
                this.comments = response.data.content;
                this.totalPages = response.data.totalPages;

                this.isCommentsLoaded = true; // 댓글 데이터 저장 후 완료의 의미로 true로 변경
            })
            .catch(error => {
                console.log(error);
            }) 
        },
    },
    computed:{
        // 맨 첫 페이지 이전 버튼 동작 중지를 위해 startNum이 5 이하인 경우 false 리턴
        isPrevDisabled(){
            return this.startNum <= 5;
        },
        // startNum + 5를 하면 다음 페이지 배열의 시작 페이지 번호인데 총 페이지 수를 넘을 경우 false 리턴
        isNextDisabled(){
            if(this.startNum == 0){
                return this.startNum+6 > this.totalPages;
            }else{
                return this.startNum+5 > this.totalPages;
            }
        },
        // 페이지 5개 단위로 출력을 위해 numbers 배열에 5개씩 담아 리턴
        pageNumbers(){
            // startNum = 0, endNum = 0인 경우 고려
            // 이후 같은 패턴 반복

            let numbers = []; // 페이지 번호를 담을 배열 초기화
            let start = this.startNum; // 시작 번호
            let end = this.endNum; // 마지막 번호

            // startNum이 0이면 맨 처음 페이지 배열에 해당
            if(this.startNum === 0){
                start = 1; // 맨 처음 페이지 배열 시작 페이지 번호를 1로 설정
                end = this.totalPages; // 총 페이지 배열의 수가 하나를 넘지 않는 경우 시작 페이지의 마지막 번호를 총 페이지 수로 설정
                if(end > 5){ // 총 페이지 배열의 수가 하나 이상인 경우 시작 페이지의 마지막 번호를 첫 번째 페이지 배열의 마지막 번호인 5로 설정
                    end = 5;
                }
            }

            // 시작 번호 ~ 마지막 번호까지 1씩 증가시켜서 numbers 배열에 넣기 (ex: 1, 2, 3, 4, 5 / 6, 7, 8, 9, 10)
            for(let i=start; i<=end; i++){
                numbers.push(i);
            }

            return numbers; // numbers 리턴
        }
    },
    created(){
        // 해당 게시글 id에 맞는 댓글 모두 가져오기
        this.getComments(this.articleId);
    }
}
</script>

<style>
    /* 댓글 데이터를 담을 div */
    .div-comment-comment{
        margin: 1%; /* 상하좌우 간격 */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    /* 댓글 작성자 닉네임, 작성일 등 정보를 담는 div */
    .div-comment-info{
        display: flex;
        justify-content: space-between; /* 댓글 작성 정보 div와 수정/삭제 div 서로 끝으로 정렬 */
        padding: 1%; /* 상하좌우 간격 */
        border-bottom: 1px solid rgb(219, 219, 219); /* 아래 테두리 추가 굵기, 색 설정 */
    }
    /* 닉네임 span  */
    .span-comment-nickname{
        font-weight: bold; /* 굵게 */
        color: rgb(81, 145, 195); /* 색 변경 */
    }
    /* 작성일 span */
    .span-comment-date{
        font-size: 11px; /* 폰트 사이즈 변경 */
    }
    /* 댓글 수정, 삭제 메뉴 span */
    .span-comment-update, .span-comment-delete{
        font-size: 14px; /* 폰트 사이즈 변경 */
        text-decoration: underline; /* 밑줄 */
        font-weight: bold; /* 폰트 굵게 */
    }
    /* 댓글 수정, 삭제 메뉴 span 마우스오버 */
    .span-comment-update:hover, .span-comment-delete:hover{
        cursor: pointer; /* 마우스 커서 변경 */
    }
    /* 댓글 내용 출력 div */
    .div-comment-writing{
        padding: 1%; /* 상하좌우 여백 */
        height: auto; /* 댓글 길이에 따라 div 높이 늘리기 */
        word-wrap: break-word; /* 내용 너비 초과 시 자동 줄바꿈 */
    }
    .div-comment-pagination{
        display:flex; 
        flex-direction: column; 
        align-items:center; 
        border-bottom: 1px solid rgb(219, 219, 219); /* 아래 테두리 추가 굵기, 색 설정 */
        margin-top: 15px;
    }
    .page-link{ /* pagination에서 이전/다음 버튼 제외한 각 버튼 */
        color: black;
    }
    .pagination .page-item.active .page-link {
        /* 콤마가 없으면 조합  */
        /* ul pagination => li page-item이 active일 때 => button page-link 색 변경 */
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
    }
</style>