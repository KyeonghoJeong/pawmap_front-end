<template>
    <!-- 게시글 테이블 div, 검색 기능 div, 삭제 버튼 div, pagination div를 담을 컨테이너 div -->
    <div class="div-MyArticles-container">
        <!-- 게시판 구성요소 중 테이블을 담을 div -->
        <div class="div-MyArticles-table">
            <table class="table table-hover table-bordered table-sm">
            <thead class="table-secondary">
                <!-- 게시판 헤더 설정 -->
                <!-- 각 클래스는 테이블 헤더 비율 설정 및 정렬을 위한 클래스 -->
                <tr>
                    <th scope="col" class="th-MyArticles-num">#</th>
                    <th scope="col" class="th-MyArticles-title">제목</th>
                    <th scope="col" class="th-MyArticles-nickname">닉네임</th>
                    <th scope="col" class="th-MyArticles-date">날짜</th>
                    <th scope="col" class="th-MyArticles-del">삭제</th>
                </tr>
            </thead>
            <!-- 데이터 로드 완료 여부를 가지고 있는 AreArticlesAndCommentsLoaded가 true인 경우만 테이블 바디 출력 -->
            <tbody v-if="AreArticlesAndCommentsLoaded">
                <!-- 테이블 row 반복문으로 출력 -->
                <!-- articles는 백엔드로부터 받은 게시글 데이터 -->
                <tr v-for="(article, index) in articles" :key="article.articleId">
                    <th scope="row" class="th-MyArticles-num">{{article.articleId}}</th>
                    <!-- row에서 제목 부분은 클릭 시 게시글의 내용을 출력해야 하므로 toArticle을 호출 -->
                    <!-- commentNumbers의 index는 articles의 index와 일치, 해당 게시글의 댓글 수를 백엔드에서 받아와서 제목 옆에 출력 -->
                    <td><span class="span-MyArticles-title" @click="toArticle(article.articleId)">{{article.title}} <span style="color:#fd7e14">[{{commentNumbers[index]}}]</span></span></td>
                    <td class="th-MyArticles-nickname">{{article.nickname}}</td>
                    <td class="th-MyArticles-date">{{article.postDate}}</td>
                    <!-- 배열에 체크박스로 체크한 게시글의 인덱스로 v-model로 값 저장 -->
                    <td class="th-MyArticles-del"><input type="checkbox" :v-model="article.articleId" v-model="checkedArticleIndex[index]"></td>
                </tr>
            </tbody>
            </table>
        </div>
        <!-- 테이블 하단 검색바, 셀렉트, 삭제 버튼을 담을 div -->
        <div class="div-MyArticles-bottom-container">
            <!-- 검색바 div와 셀렉트 div를 담고 정렬을 하기 위한 div -->
            <div class="div-MyArticles-bottom-search">
                <!-- 검색바 비율(사이즈) 지정을 위한 div -->
                <div class="div-MyArticles-bottom-input">
                    <!-- 검색 시 getArticlesByQuery 메소드 호출 -->
                    <form @submit.prevent="getArticlesByQuery">
                        <div class="input-group">
                            <input type="text" class="form-control" aria-label="keyword" aria-describedby="basic-addon1" v-model="searchQuery">
                            <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
                <!-- 셀렉트 비율(사이즈) 지정을 위한 div -->
                <div class="div-MyArticles-bottom-select">
                    <!-- selectedOption은 셀렉트에서 선택된 옵션값을 저장 -->
                    <select class="form-select" aria-label="Default select example" v-model="selectedOption">
                        <!-- select 메뉴 기본값 설정 -->
                        <option :value="'제목+내용'">제목+내용</option>
                        <!-- v-for을 사용하여 searchOptions에서 검색 옵션을 반복문으로 출력, 제목+내용 포함 X -->
                        <option v-for="option in searchOptions" :value="option" :key="option">{{ option }}</option>
                    </select>
                </div>
            </div>
            <!-- 삭제 버튼의 비율(사이즈) 및 위치 지정을 위한 div -->
            <!-- 삭제 버튼 클릭 시 deleteArticles 메소드 호출 -->
            <div class="div-MyArticles-bottom-btn">
                <button type="button" class="btn button-MyArticles-del" @click="deleteArticles">삭제</button>
            </div>
        </div>
        <!-- 페이지네이션 메뉴를 담고 정렬하기 위한 div -->
        <div class="div-MyArticles-pagination">
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
                        <button class="page-link" @click="getArticles(i-1)">{{i}}</button>
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

export default {
    data(){
        return{
            articles: [], // 게시글 저장할 배열
            AreArticlesAndCommentsLoaded: false, // 전체 게시글 로드 완료 여부
            totalPages: '', // 총 게시글 페이지 수
            pageActive: 1, // pagination 초기 선택 페이지
            startNum: 0, // pagination 초기 시작 숫자
            endNum: 0, // pagination 초기 마지막 숫자
            articleIds: [], // 게시글 id 저장 배열 => 각 게시글의 댓글 수를 요청하기 위함
            commentNumbers: [], // 각 게시글의 댓글 수를 저장할 배열
            searchOptions: ['제목', '내용'], // 게시글 검색 select 옵션
            selectedOption: '제목+내용', // 게시글 검색 select 초기 선택 옵션
            searchQuery: '', // 검색어 저장
            title: '', // 게시글 요청 시 검색 옵션이 제목인 경우 검색어를 저장
            writing: '', // 게시글 요청 시 검색 옵션이 내용인 경우 검색어를 저장
            nickname: '', // 게시글 요청 시 검색 옵션이 닉네임인 경우 검색어를 저장
            memberId: '', // 로그인 중인 회원 id
            checkedArticleIndex: [], // 삭제할 게시글의 인덱스 체크 용도
            checkedArticleIds: [], // 삭제할 게시글의 id 저장
        }
    },
    methods:{
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
        // 로그인중인 회원의 아이디를 요청하는 메소드
        // 동기적 동작을 위해 async/await 사용
        async getArticlesByMemberId(){
            try {
                // accessToken으로 로그인중인 회원의 id get 요청
                const getArticlesByMemberIdResponse = await axios.get('http://localhost:8090/api/member/member-id', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                })

                // 200 => 요청 성공
                if(getArticlesByMemberIdResponse.status === 200){
                    this.memberId = getArticlesByMemberIdResponse.data; // 회원 아이디 설정
                    this.getArticles(0); // 게시글 요청
                }
            } catch (error) {
                // 403 => accessToken 토큰 만료
                if(error.response.status === 403){
                    // accessToken 재발급 메소드 호출 => true면 성공
                    const isNewAccessTokenLoaded = await this.getAccessToken();
                    
                    if(isNewAccessTokenLoaded){
                        try {
                            // accessToken으로 로그인중인 회원의 id 재요청
                            const reGetArticlesByMemberIdResponse = await axios.get('http://localhost:8090/api/member/member-id', {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // 200 => 재요청 성공
                            if(reGetArticlesByMemberIdResponse.status === 200){
                                this.memberId = reGetArticlesByMemberIdResponse.data; // 회원 아이디 설정
                                this.getArticles(0); // 게시글 요청
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
        },
        // 페이지 번호에 맞는 게시글 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async getArticles(page){
            this.AreArticlesAndCommentsLoaded = false; // 데이터 로드 전 다시 false 지정
            this.checkedArticleIndex = []; // 체크박스 초기화

            try {
                // 각 검색 옵션 + 회원 id + pagination 옵션으로 게시글 get 요청
                const getArticlesResponse = await axios.get('http://localhost:8090/api/board/articles', {
                    params: {
                        title: this.title,
                        writing: this.writing,
                        nickname: this.nickname,
                        memberId: this.memberId,
                        page: page, 
                        size: 10
                    }
                });

                this.articles = getArticlesResponse.data.content; // 게시글 데이터
                this.totalPages = getArticlesResponse.data.totalPages; // 총 게시글 페이지 수

                this.articleIds = []; // 게시글 id 저장 배열 초기화

                // 게시글 수만큼 반복
                for(let i=0; i<this.articles.length; i++){
                    this.articleIds.push(this.articles[i].articleId); // 모든 게시글의 id 저장
                }

                // get 요청으로 array를 보내기 위해서 배열 내의 값들을 콤마로 결합
                const articleIdsString = this.articleIds.join(',');

                // 각 게시글의 댓글 수 get 요청
                const commentNumbersResponse = await axios.get('http://localhost:8090/api/board/article/comment/numbers', {
                    params: {articleIds: articleIdsString}
                })

                // 각 게시글의 댓글 수 저장
                // articles와 commentNumbers의 값은 인덱스가 동일하게 매치
                this.commentNumbers = commentNumbersResponse.data;

                this.AreArticlesAndCommentsLoaded = true; // 데이터 로드 완료
            } catch (error) {
                console.log(error);
            }
        },
        // 여러 게시글 삭제 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async deleteArticles(){
            // 삭제할 게시글 배열 초기화
            this.checkedArticleIds = [];

            // 현재 게시글 배열에 저장되어 있는 게시글 수 만큼 반복
            for(let i=0; i<this.articles.length; i++){
                if(this.checkedArticleIndex[i] === true){
                    // checkedArticleIndex[i]가 true이면 체크박스 체크를 의미
                    // checkedArticleIndex bookmarks의 인덱스는 같으므로 checkedArticleIds 삭제할 북마크의 시설 id를 push
                    this.checkedArticleIds.push(this.articles[i].articleId);
                }
            }

            const checkedArticleIdsString = this.checkedArticleIds.join(','); // param으로 전달하기 위해 String으로 만들기

            if(this.checkedArticleIds.length === 0){
                alert("선택된 게시글이 없습니다.");
            }else{
                if(confirm("정말 삭제하시겠습니까?")){
                    try {
                        // accessToken + 체크한 게시글 id로 delete 요청
                        const deleteArticlesResponse = await axios.delete('http://localhost:8090/api/member/articles', {
                            params :{articleIds: checkedArticleIdsString},
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                        })

                        // 200 => 요청 성공
                        if(deleteArticlesResponse.status === 200){
                            this.$router.go(this.$router.currentRoute); // 삭제 후 새로고침
                        }
                    } catch (error) {
                        // 403 => accessToken 토큰 만료
                        if(error.response.status === 403){
                            // accessToken 재발급 메소드 호출 => true면 성공
                            const isNewAccessTokenLoaded = await this.getAccessToken();
                            
                            if(isNewAccessTokenLoaded){
                                try {
                                    // accessToken + 체크한 게시글 id로 delete 재요청
                                    const reDeleteArticlesResponse = await axios.delete('http://localhost:8090/api/member/articles', {
                                        params :{articleIds: checkedArticleIdsString},
                                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                                    })

                                    // 200 => 재요청 성공
                                    if(reDeleteArticlesResponse.status === 200){
                                        this.$router.go(this.$router.currentRoute); // 삭제 후 새로고침
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
            }
        },
        // 게시글 제목 클릭 시 이동 메소드
        toArticle(articleId){
            this.$router.push({ path: '/board/article', query: {articleId: articleId}});
        },
        // 검색 시 검색어 + select 메뉴로 게시글 요청 시 보낼 파라미터 값 설정하는 메소드
        getArticlesByQuery(){
            if(this.selectedOption === '제목+내용'){
                this.title = this.searchQuery;
                this.writing = this.searchQuery;

                this.nickname = '';
            }else if(this.selectedOption === '제목'){
                this.title = this.searchQuery;

                this.writing = '';
                this.nickname = '';
            }else if(this.selectedOption === '내용'){
                this.writing = this.searchQuery;

                this.title = '';
                this.nickname = '';
            }else if(this.selectedOption === '닉네임'){
                this.nickname = this.searchQuery;

                this.title = '';
                this.writing = '';
            }

            this.pageActive = 1; // 검색 후 초기 선택 페이지 번호 1로 설정

            this.getArticles(0);
        },
        setPrevPageNum(){
            // isPrevDisabled()에 의해 startNum이 5 이하인 경우는 신경 X
            this.startNum = this.startNum - 5; // 시작 번호는 현재 시작 번호 - 5
            this.endNum = this.startNum + 4; // 마지막 번호는 현재 시작 번호 + 4
            this.pageActive = this.endNum; // 이전 버튼 클릭 시 선택 중인 페이지 표시를 위해 선택한 페이지 번호 리턴
            this.getArticles(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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
            this.getArticles(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
    },
    computed:{
        // 맨 첫 페이지 이전 버튼 동작 중지를 위해 startNum이 5 이하인 경우 false 리턴
        isPrevDisabled(){
            return this.startNum <= 5;
        },
        // startNum + 5를 하면 다음 페이지 배열의 시작 페이지 번호인데 총 페이지 수를 넘을 경우 false 리턴
        isNextDisabled(){
            // 처음 시작 시
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

            let numbers = [];
            let start = this.startNum;
            let end = this.endNum;

            // startNum이 0이면 맨 처음 페이지 배열에 해당
            if(this.startNum === 0){
                start = 1; // 맨 처음 페이지 배열 시작 페이지 번호를 1로 설정
                end = this.totalPages; // 총 페이지 배열의 수가 하나를 넘지 않는 경우 시작 페이지의 마지막 번호를 총 페이지 수로 설정
                if(end > 5){ // 총 페이지 배열의 수가 하나 이상인 경우 시작 페이지의 마지막 번호를 첫 번째 페이지 배열의 마지막 번호인 5로 설정
                    end = 5;
                }
            }

            for(let i=start; i<=end; i++){
                numbers.push(i);
            }

            return numbers;
        }
    },
    mounted(){
        // 회원 아이디로 해당 회원의 게시글만 요청하는 메소드 호출 => 계속 사용할 mebmerId 설정
        this.getArticlesByMemberId();
    }
}
</script>

<style>
    /* 게시글 테이블 div, 검색 기능 div, 삭제 버튼 div, pagination div를 담을 컨테이너 div */
    .div-MyArticles-container{
        /* 게시판 구성 요소 (테이블, 검색바+셀렉트+글쓰기 버튼, 페이지네이션) 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 게시판 구성요소 중 테이블을 담을 div */
    .div-MyArticles-table{
        width: 60%; /* 너비 지정 */
    }
    /* 테이블 항목 가운데 정렬 */
    .th-MyArticles-num, .th-MyArticles-title, .th-MyArticles-nickname, .th-MyArticles-date, .th-MyArticles-del{
        text-align: center;
    }
    /* 각 테이블 항목 너비 조절 */
    .th-MyArticles-num{
        width: 15%;
    }
    .th-MyArticles-title{
        width: 35%;
    }
    .th-MyArticles-nickname{
        width: 15%;
    }
    .th-MyArticles-date{
        width: 25%;
    }
    .th-MyArticles-del{
        width: 10%;
    }
    .span-MyArticles-title:hover{ /* 테이블 로우 마우스오버 효과 및 정렬 */
        text-decoration: underline;
        cursor: pointer;
    }
    .div-MyArticles-bottom-container{ /* 테이블 하단 검색바, 셀렉트, 글쓰기 버튼을 담는 div */
        width: 60%;
        display:flex; /* 하단 메뉴 div 정렬 */
        margin-bottom: 15px;
    }
    .div-MyArticles-bottom-search{
        width: 50%; /* 검색 메뉴 50% + 글쓰기 버튼 50% */
        display: flex;
    }
    .div-MyArticles-bottom-input{
        width: 57%; /* 검색바 60% + 셀렉트 40% */
        margin-right: 3%; /* 검색바와 셀렉트 사이의 간격 */
    }
    .div-MyArticles-bottom-select{
        width: 40%; /* 검색바 60% + 셀렉트 40% */
    }
    .div-MyArticles-bottom-btn{
        width: 50%; /* 검색 메뉴 50% + 글쓰기 버튼 50% */
        display: flex;
        flex-direction: row-reverse; /* 버튼 우측 끝에 배치 */
    }
    .button-MyArticles-del{ /* 버튼 색, 비율(사이즈) 지정 */
        width: 80px;
        background-color: #fd7e14;
        color: white;
    }
    .button-MyArticles-del:hover{ /* 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    .div-MyArticles-pagination{ /* pagination을 담을 div */
        width: 60%; /* 너비 설정 */
        display: flex; /* flex 정렬 */
        flex-direction: column; /* column 정렬 */
        align-items: center; /* pagination 가운데 정렬 */
    }
    /* width가 992px 이하면 div 재조정 */
    @media screen and (max-width: 992px){
        .th-MyArticles-num, .th-MyArticles-nickname, .th-MyArticles-date{
            /* 게시글 번호, 날짜 가리기 */
            display: none;
        }
        .div-MyArticles-bottom-container{ /* 검색 div + 버튼 div를 담을 div */
            width: 60%; /* 너비 100%로 변경 */
            display: flex; /* flex 정렬로 변경 */
            flex-direction: column; /* column 정렬로 변경해서 검색 메뉴, select 메뉴 수직 정렬 */
            margin-bottom: 3%; /* pagination과의 간격 조절 */
        }
        .div-MyArticles-bottom-search{ /* 검색바 div + select div 담을 div */
            width: 100%; /* 너비 100%로 변경 */
            margin-bottom: 3%; /* 버튼과의 간격 조절 */
        }
        .div-MyArticles-bottom-input{ /* 검색바 div */
            width: 60%; /* 너비 70% */
        }
        .div-MyArticles-bottom-select{ /* select div */
            width: 40%; /* 너비 30% */
        }
        .div-MyArticles-bottom-btn{ /* 버튼 div */
            width: 100%; /* 너비 100% */
        }
    }
</style>