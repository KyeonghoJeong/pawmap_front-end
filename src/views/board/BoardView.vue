<template>
    <!-- div-board-container는 게시판 구성 요소를 담기 위한 div -->
    <div class="div-board-container">
        <!-- 게시판 위에 메시지 출력을 위한 컴포넌트 -->
        <BoardTitleComponent></BoardTitleComponent>

        <!-- 게시판 구성요소 중 테이블을 담을 div -->
        <div class="div-board-table">
            <table class="table table-hover table-bordered table-sm">
            <thead class="table-secondary">
                <!-- 게시판 헤더 설정 -->
                <!-- 각 클래스는 테이블 헤더 비율 설정 및 정렬을 위한 클래스 -->
                <tr>
                    <th scope="col" class="th-col-board-num">#</th>
                    <th scope="col" class="th-col-board-title">제목</th>
                    <th scope="col" class="th-col-board-nickname">닉네임</th>
                    <th scope="col" class="th-col-board-date">날짜</th>
                </tr>
            </thead>
            <!-- 데이터 로드 완료 여부를 가지고 있는 AreArticlesAndCommentsLoaded가 true인 경우만 테이블 바디 출력 -->
            <tbody v-if="AreArticlesAndCommentsLoaded">
                <!-- 테이블 row 반복문으로 출력 -->
                <!-- articles는 백엔드로부터 받은 게시글 데이터 -->
                <tr v-for="(article, index) in articles" :key="article.articleId">
                    <th scope="row" class="th-col-board-num">{{article.articleId}}</th>
                    <!-- row에서 제목 부분은 클릭 시 게시글의 내용을 출력해야 하므로 toArticle을 호출 -->
                    <!-- commentNumbers의 index는 articles의 index와 일치, 해당 게시글의 댓글 수를 백엔드에서 받아와서 제목 옆에 출력 -->
                    <td><span class="span-board-title" @click="toArticle(article.articleId)">{{article.title}} <span style="color:#fd7e14">[{{commentNumbers[index]}}]</span></span></td>
                    <td class="th-col-board-nickname">{{article.nickname}}</td>
                    <td class="th-col-board-date">{{article.postDate}}</td>
                </tr>
            </tbody>
            </table>
        </div>
        <!-- div-board-bottom-container는 테이블 하단 검색바, 셀렉트, 글쓰기 버튼을 담을 div -->
        <div class="div-board-bottom-container">
            <!-- div-board-bottom-search는 검색바 div와 셀렉트 div를 담고 정렬을 하기 위한 div -->
            <div class="div-board-bottom-search">
                <!-- div-board-bottom-input는 검색바 비율(사이즈) 지정을 위한 div -->
                <div class="div-board-bottom-input">
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
                <!-- div-board-bottom-select는 셀렉트 비율(사이즈) 지정을 위한 div -->
                <div class="div-board-bottom-select">
                    <!-- selectedOption은 셀렉트에서 선택된 옵션값을 저장 -->
                    <select class="form-select" aria-label="Default select example" v-model="selectedOption">
                        <!-- select 메뉴 기본값 설정 -->
                        <option :value="'제목+내용'">제목+내용</option>
                        <!-- v-for을 사용하여 searchOptions에서 검색 옵션을 반복문으로 출력, 제목+내용 포함 X -->
                        <option v-for="option in searchOptions" :value="option" :key="option">{{ option }}</option>
                    </select>
                </div>
            </div>
            <!-- div-board-bottom-btn 버튼의 비율(사이즈) 및 위치 지정을 위한 div -->
            <!-- 버튼 클릭 시 toWriting 메소드 호출 -->
            <div class="div-board-bottom-btn">
                <button type="button" class="btn button-board-writing" @click="toWriting">글쓰기</button>
            </div>
        </div>
        <!-- div-board-pagination은 페이지네이션 메뉴를 담고 정렬하기 위한 div -->
        <div class="div-board-pagination">
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
import BoardTitleComponent from '../../components/board/BoardTitleComponent.vue'

import axios from 'axios'

export default {
    components:{
        BoardTitleComponent
    },
    data(){
        return{
            articles: [], // 해당 페이지에 해당하는 게시글 데이터를 백엔드에서 받아와서 저장할 배열
            AreArticlesAndCommentsLoaded: false, // 전체 게시글 로드 완료 여부
            totalPages: '', // pagination을 위해 총 페이지 수를 백엔드에서 받아와서 저장할 변수
            page: '', // 쿼리로 받을 페이지 숫자
            pageActive: 1, // 첫 활성화 페이지 번호는 1로 초기화
            startNum: 0, // pagination 시 첫 페이지 출력인 경우 0
            endNum: 0, // pagination 시 첫 페이지 출력인 경우 0
            articleIds: [], // 제목 옆에 댓글 수 출력을 위해 각 게시글의 ID를 저장할 배열 
            commentNumbers: [], // 각 게시글의 댓글 수를 저장할 배열
            searchOptions: ['제목', '내용', '닉네임'], // select 옵션
            selectedOption: '제목+내용', // 제목+내용은 기본값으로 선택된 옵션으로 지정
            searchQuery: '', // 검색바에 검색한 내용을 저장할 변수
            title: '', // 백엔드에서 게시글 조회 시 쿼리를 위한 제목 변수
            writing: '', // 백엔드에서 게시글 조회 시 쿼리를 위한 내용 변수
            nickname: '', // 백엔드에서 게시글 조회 시 쿼리를 위한 닉네임 변수
            memberId: '', // 백엔드에서 특정 회원의 게시글만 조회 시 쿼리를 위한 아이디 변수
        }
    },
    methods:{
        // 페이지 번호에 맞는 게시글 목록을 조회하기 위한 메소드
        // 동기적 동작을 위해 async/await 사용
        async getArticles(page){
            this.AreArticlesAndCommentsLoaded = false; // 데이터 로드 전 다시 false 지정

            try {
                const getArticlesResponse = await axios.get('http://localhost:8090/api/board/articles', {
                    params: {
                        title: this.title,
                        writing: this.writing,
                        nickname: this.nickname,
                        memberId: this.memberId,
                        page: page, 
                        size: 10
                    }
                })

                this.articles = getArticlesResponse.data.content; // 게시글 목록 저장
                this.totalPages = getArticlesResponse.data.totalPages; // 총 페이지수 저장

                // 댓글수 표기를 위한 코드
                this.articleIds = []; // 초기화
                //articles에 들어있는 게시글 아이디를 articleIds의 동일한 인덱스에 저장
                for(let i=0; i<this.articles.length; i++){
                    this.articleIds.push(this.articles[i].articleId);
                }

                // get 요청에 array을 같이 보내기 위해서 배열 내의 값들을 콤마로 결합
                const articleIdsString = this.articleIds.join(',');

                const commentNumbersResponse = await axios.get('http://localhost:8090/api/board/article/comment/numbers', {
                    params: {articleIds: articleIdsString}
                })

                this.commentNumbers = commentNumbersResponse.data; // 각 게시글의 댓글수 저장

                this.AreArticlesAndCommentsLoaded = true; // 데이터 로드 완료

                this.$router.replace({query: {page: page + 1}}).catch(()=>{}); // 쿼리 변경
            } catch (error) {
                console.log(error);
            }
        },
        // 검색 시 게시판 하단의 검색바와 셀렉트의 값에 따라 게시글 요청을 위한 파라미터의 값을 설정하고 게시물을 요청하는 메소드
        getArticlesByQuery(){
            // selectedOption은 현재 선택한 셀렉트 옵션
            // searchQuery는 검색바에 검색한 내용

            if(this.selectedOption === '제목+내용'){
                this.title = this.searchQuery;
                this.writing = this.searchQuery;

                this.nickname = '';
                this.memberId = '';
            }else if(this.selectedOption === '제목'){
                this.title = this.searchQuery;

                this.writing = '';
                this.nickname = '';
                this.memberId = '';
            }else if(this.selectedOption === '내용'){
                this.writing = this.searchQuery;

                this.title = '';
                this.nickname = '';
                this.memberId = '';
            }else if(this.selectedOption === '닉네임'){
                this.nickname = this.searchQuery;

                this.title = '';
                this.writing = '';
                this.memberId = '';
            }

            this.pageActive = 1; // 검색 시 pagination의 첫 페이지 버튼 활성화

            this.getArticles(0); // 설정한 파라미터 대로 게시글 목록을 요청하기 위한 메소드 호출
        },
        // 테이블에서 제목 클릭 시 호출 메소드
        toArticle(articleId){
            // 매개변수로 게시글 id를 받아서 쿼리와 같이 보냄
            this.$router.push({ path: '/board/article', query: {articleId: articleId}});
        },
        // 글쓰기 버튼 클릭 시 호출 메소드
        toWriting(){
            if(localStorage.getItem("accessToken") !== null){
                // 글쓰기 페이지로 이동
                this.$router.push('/board/post-article');
            }else{
                // 로그인 상태가 아닌 경우 로그인 요청
                alert("게시글 등록을 위해서는 로그인해야 합니다.");
            }
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
            if(this.startNum == 0){
                return this.startNum+6 > this.totalPages;
            }else{
                return this.startNum+5 > this.totalPages;
            }
        },
        // 페이지 5개 단위로 출력을 위해 numbers 배열에 5개씩 담아 리턴
        pageNumbers(){
            let numbers = []; // 페이지 번호를 담을 배열 초기화

            if(this.page <= this.totalPages){
                // 요청 페이지 숫자가 데이터의 총 페이지 수보다 같거나 작을 때만 숫자 생성

                // startNum = 0, endNum = 0인 경우 고려
                // 이후 같은 패턴 반복
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
            }
            
            return numbers; // numbers 리턴
        }
    },
    created(){
        this.page = this.$route.query.page;
        // pagination 시작 번호 설정
        if(this.page > 0){
            this.pageActive = parseInt(this.page);
        }
    },
    mounted(){
        // url의 쿼리와 연동하여 페이지 번호로 게시글 요청하는 메소드
        this.getArticles(this.page - 1);
    }
}
</script>

<style>
    .div-board-container{
        /* padding으로 게시판 간격 조절 */
        padding-top: 5%;
        /* 게시판 구성 요소 (테이블, 검색바+셀렉트+글쓰기 버튼, 페이지네이션) 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-board-table{
        width: 60%; /* 화면 비율 지정 */
    }
    /* 테이블 헤더 비율 설정 및 정렬 */
    .th-col-board-num{
        width: 15%;
        text-align: center;
    }
    .th-col-board-title{
        width: 45%;
        text-align: center;
    }
    .th-col-board-nickname{
        width: 15%;
        text-align: center;
        /* white-space: nowrap; */
    }
    .th-col-board-date{
        width: 25%;
        text-align: center;
    }
    /* 테이블 로우 마우스오버 효과 및 정렬 */
    .span-board-title:hover{
        text-decoration: underline;
        cursor: pointer;
    }
    /* 테이블 하단 검색바, 셀렉트, 글쓰기 버튼을 담는 div */
    .div-board-bottom-container{
        width: 60%;
        display:flex; /* 하단 메뉴 div 정렬 */
        margin-bottom: 1.2%;
    }
    .div-board-bottom-search{
        width: 50%; /* 검색 메뉴 50% + 글쓰기 버튼 50% */
        display:flex;
    }
    .div-board-bottom-input{
        width: 57%; /* 검색바 60% + 셀렉트 40% */
        margin-right: 3%; /* 검색바와 셀렉트 사이의 간격 */
    }
    .div-board-bottom-select{
        width: 40%; /* 검색바 60% + 셀렉트 40% */
    }
    .div-board-bottom-btn{
        width: 50%; /* 검색 메뉴 50% + 글쓰기 버튼 50% */
        display: flex;
        flex-direction: row-reverse; /* 버튼 우측 끝에 배치 */
    }
    .button-board-writing{ /* 버튼 색, 비율(사이즈) 지정 */
        width: 80px;
        background-color: #fd7e14;
        color: white;
    }
    .button-board-writing:hover{ /* 글쓰기 버튼 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    .div-board-pagination{ /* pagination을 담을 div */
        width: 60%; /* 너비 설정 */
        display: flex; /* flex 정렬 */
        flex-direction: column; /* column 정렬 */
        align-items: center; /* pagination 가운데 정렬 */
    }
    /* width가 992px 이하면 div 재조정 */
    @media screen and (max-width: 992px){
        .th-col-board-num, .th-col-board-date{
            /* 게시글 번호, 날짜 가리기 */
            display: none;
        }
        .div-board-table{ /* 테이블 div */
            width: 60%; /* 다시 너비 100%로 변경 */
        }
        .div-board-bottom-container{ /* 검색 div + 버튼 div를 담을 div */
            width: 60%; /* 너비 100%로 변경 */
            display: flex; /* flex 정렬로 변경 */
            flex-direction: column; /* column 정렬로 변경해서 검색 메뉴, select 메뉴 수직 정렬 */
            margin-bottom: 3%; /* pagination과의 간격 조절 */
        }
        .div-board-bottom-search{ /* 검색바 div + select div 담을 div */
            width: 100%; /* 너비 100%로 변경 */
            margin-bottom: 3%; /* 버튼과의 간격 조절 */
        }
        .div-board-bottom-input{ /* 검색바 div */
            width: 60%; /* 너비 70% */
        }
        .div-board-bottom-select{ /* select div */
            width: 40%; /* 너비 30% */
        }
        .div-board-bottom-btn{ /* 버튼 div */
            width: 100%; /* 너비 100% */
        }
    }
</style>