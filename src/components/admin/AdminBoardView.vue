<template>
    <div class="div-adminboard">
        <div class="div-adminboard-table">
            <table class="table table-hover table-bordered table-sm div-adminboard-table-table">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="th-headers-num">#</th>
                    <th scope="col" class="th-headers-title">제목</th>
                    <th scope="col" class="th-headers-nickname">닉네임</th>
                    <th scope="col" class="th-headers-date">날짜</th>
                    <th scope="col" class="th-headers-deletion">삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(article, index) in articles" :key="article.articleId">
                    <th scope="row" class="th-contents-num">{{article.articleId}}</th>
                    <td><span class="span-contents-title" @click="toArticle(article.articleId)">{{article.title}} <span style="color:red" v-if="commentNumbers[index] !== 0">[{{commentNumbers[index]}}]</span></span></td>
                    <td class="td-contents-nickname">{{article.nickname}}</td>
                    <td class="td-contents-date">{{article.postDate}}</td>
                    <td class="td-contents-deletion"><input class="form-check-input" type="checkbox" :v-model="article.articleId" v-model="checkedArticleNumbers[index]"></td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="div-adminboard-bottom-set">
            <div class="div-adminboard-bottom-scset">
                <div class="div-adminboard-bottom-search">
                    <form @submit.prevent="setValues">
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
                <div class="div-adminboard-bottom-category">
                    <select class="form-select" aria-label="Default select example" v-model="selectedOption">
                        <option :value="'제목+내용'">제목+내용</option>
                        <option v-for="option in searchOptions" :value="option" :key="option">{{ option }}</option>
                    </select>
                </div>
            </div>
            <div class="div-adminboard-bottom-btn">
                <button type="button" class="btn div-adminboard-bottom-btn-btn" @click="deleteArticles">삭제</button>
            </div>
        </div>
        <div class="div-adminboard-paging">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                        <button class="page-link" @click="getArticles(i-1)">{{i}}</button>
                    </li>

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
            articles: [],
            totalPages: '',
            pageActive: 1,
            startNum: 0,
            endNum: 0,
            articleIds: [],
            commentNumbers: [],
            searchOptions: ['제목', '내용', '닉네임'],
            selectedOption: '제목+내용',
            searchQuery: '',
            title: '',
            writing: '',
            nickname: '',
            memberId: '',
            checkedArticleNumbers: [],
            checkedArticles: [],
        }
    },
    methods:{
        deleteArticles(){
            if(confirm("정말 삭제하시겠습니까?")){
                this.checkedArticles = [];

                for(let i=0; i<this.articles.length; i++){
                    if(this.checkedArticleNumbers[i] === true){
                        this.checkedArticles.push(this.articles[i].articleId);
                    }
                }

                axios.delete('http://localhost:8090/api/board/articles', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                    data: this.checkedArticles
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
                                this.deleteArticles();
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }else{
                        alert("게시글이 삭제되었습니다.");

                        this.$router.go(this.$router.currentRoute);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        toArticle(articleId){
            this.$router.push({ path: '/board/article', query: {articleId: articleId}});
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
        getArticles(page){
            axios.get('http://localhost:8090/api/board/articles', {
                params: {
                    title: this.title,
                    writing: this.writing,
                    nickname: this.nickname,
                    memberId: this.memberId,
                    page: page, 
                    size: 10
                }
            })
            .then(response => {
                this.articles = response.data.content;
                this.totalPages = response.data.totalPages;

                this.articleIds = [];
                for(let i=0; i<this.articles.length; i++){
                    this.articleIds.push(this.articles[i].articleId);
                }

                axios.post('http://localhost:8090/api/board/articles/comments/numbers', this.articleIds)
                .then(response => {
                    this.commentNumbers = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            })
        },
        setValues(){
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

            this.pageActive = 1;

            this.getArticles(0);
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
    created(){
        this.getArticles(0);
    }
}
</script>

<style>
    .div-adminboard{
        padding-top: 4.3%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .div-adminboard-table{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-adminboard-bottom-set{
        width: 60%;
        display:flex;
        margin-bottom: 1.5%;
    }
    .div-adminboard-paging{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .div-adminboard-table-table{
        width: 100%;
    }
    .div-adminboard-bottom-scset{
        width: 50%;
        display:flex;
    }
    .div-adminboard-bottom-search{
        width: 60%;
        margin-right: 2%;
    }
    .div-adminboard-bottom-category{
        width: 40%;
    }
    .div-adminboard-bottom-btn{
        width: 50%;
        display: flex;
        flex-direction: row-reverse;
    }
    .div-adminboard-bottom-btn-btn{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }
    .th-headers-num{
        width: 15%;
        text-align: center;
    }
    .th-headers-title{
        width: 35%;
        text-align: center;
    }
    .th-headers-nickname{
        width: 15%;
        text-align: center;
    }
    .th-headers-date{
        width: 25%;
        text-align: center;
    }
    .th-headers-deletion{
        width: 10%;
        text-align: center;
    }

    .th-contents-num{
        text-align: center;
    }
    .td-contents-date{
        text-align: center;
    }
    .td-contents-nickname{
        text-align: center;
    }
    .td-contents-deletion{
        text-align: center;
    }

    .page-link{
        color: black;
    }
    .pagination .page-item.active .page-link {
        background-color: #fd7e14;
        border-color: rgb(225, 228, 232);
    }
    .span-contents-title:hover{
        text-decoration: underline;
        cursor: pointer;
    }

    @media screen and (max-width: 992px){
        .div-adminboard-table{
            width: 100%;
        }
        .div-adminboard-bottom-set{
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-bottom: 3%;
        }

        .div-adminboard-bottom-scset{
            width: 100%;
            margin-bottom: 3%;
        }
        .div-adminboard-bottom-btn{
            width: 100%;
        }
        .div-adminboard-bottom-search{
            width: 70%;
        }
        .div-adminboard-bottom-category{
            width: 30%;
            margin-top: 0%;
        }
        .div-adminboard-table-table{
            width: 100%;
        }
    }
</style>