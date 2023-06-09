<template>
    <div class="div-board">
        <BoardTitleView></BoardTitleView>

        <div class="div-board-table">
            <table class="table table-hover table-bordered table-sm div-board-table-table">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="writing-num">#</th>
                    <th scope="col" class="writing-title">제목</th>
                    <th scope="col" class="writing-nickname">닉네임</th>
                    <th scope="col" class="writing-date">날짜</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(article, index) in articles" :key="article.articleId">
                    <th scope="row" class="num-in-board">{{article.articleId}}</th>
                    <td><span class="board-title" @click="toArticle(article.articleId)">{{article.title}} <span style="color:red" v-if="commentNumbers[index] !== 0">[{{commentNumbers[index]}}]</span></span></td>
                    <td class="nickname-in-board">{{article.nickname}}</td>
                    <td class="date-in-board">{{article.postDate}}</td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="div-board-bottom-set">
            <div class="div-board-bottom-scset">
                <div class="div-board-bottom-search">
                    <form>
                        <div class="input-group">
                            <input type="text" class="form-control" aria-label="keyword" aria-describedby="basic-addon1">
                            <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="div-board-bottom-category">
                    <select class="form-select" aria-label="Default select example">
                        <option value="1">제목</option>
                        <option value="2">내용</option>
                        <option value="3">닉네임</option>
                    </select>
                </div>
            </div>
            <div class="div-board-bottom-btn">
                <button type="button" class="btn div-board-bottom-btn-btn" @click="toWriting">글쓰기</button>
            </div>
        </div>
        <div class="div-board-paging">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                        <button class="page-link" @click="getBoardInfos(i-1)">{{i}}</button>
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
import BoardTitleView from '../components/BoardTitleView.vue'

import axios from 'axios'

export default {
    components:{
        BoardTitleView
    },
    data(){
        return{
            articles: [],
            totalPages: '',
            pageActive: 1,
            startNum: 0,
            endNum: 0,
            articleIds: [],
            commentNumbers: [],
        }
    },
    methods:{
        toWriting(){
            if(localStorage.getItem("accessToken") !== null){
                this.$router.push('/board/writing');
            }else{
                alert("로그인 해주세요.");
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
            this.getBoardInfos(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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
            this.getBoardInfos(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        getBoardInfos(i){
            axios.get('http://localhost:8090/api/board/articles', {
                params: {page: i, size: 10}
            })
            .then(response => {
                this.articles = response.data.content;
                this.totalPages = response.data.totalPages;

                this.articleIds = [];
                for(let i=0; i<this.articles.length; i++){
                    this.articleIds.push(this.articles[i].articleId);
                }

                axios.post('http://localhost:8090/api/board/article/comment/numbers', this.articleIds)
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
    },
    computed:{
        // 맨 첫 페이지 이전 버튼 동작 중지를 위해 startNum이 5 이하인 경우 false 리턴
        isPrevDisabled(){
            return this.startNum <= 5;
        },
        // startNum + 5를 하면 다음 페이지 배열의 시작 페이지 번호인데 총 페이지 수를 넘을 경우 false 리턴
        isNextDisabled(){
            return this.startNum+5 > this.totalPages;
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
        axios.get('http://localhost:8090/api/board/articles', {
            params: {page: 0, size: 10}
        })
        .then(response => {
            this.articles = response.data.content;
            this.totalPages = response.data.totalPages;

            for(let i=0; i<this.articles.length; i++){
                this.articleIds.push(this.articles[i].articleId);
            }

            axios.post('http://localhost:8090/api/board/article/comment/numbers', this.articleIds)
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
    }
}
</script>

<style>
    .div-board{
        padding-top: 7%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .div-board-table{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-board-bottom-set{
        width: 60%;
        display:flex;
        margin-bottom: 1.5%;
    }
    .div-board-paging{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .div-board-table-table{
        width: 100%;
    }
    .div-board-bottom-scset{
        width: 50%;
        display:flex;
    }
    .div-board-bottom-search{
        width: 70%;
        margin-right: 2%;
    }
    .div-board-bottom-category{
        width: 30%;
    }
    .div-board-bottom-btn{
        width: 50%;
        display: flex;
        flex-direction: row-reverse;
    }
    .div-board-bottom-btn-btn{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }
    .writing-num{
        width: 15%;
        text-align: center;
    }
    .writing-title{
        width: 45%;
        text-align: center;
    }
    .writing-nickname{
        width: 15%;
        text-align: center;
    }
    .writing-date{
        width: 25%;
        text-align: center;
    }
    .num-in-board{
        text-align: center;
    }
    .date-in-board{
        text-align: center;
    }
    .nickname-in-board{
        text-align: center;
    }
    .page-link{
        color: black;
    }
    .pagination .page-item.active .page-link {
        background-color: #fd7e14;
        border-color: rgb(225, 228, 232);
    }
    td .board-title:hover{
        text-decoration: underline;
        cursor: pointer;
    }

    @media screen and (max-width: 992px){
        .div-board-table{
            width: 100%;
        }
        .div-board-bottom-set{
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-bottom: 3%;
        }

        .div-board-bottom-scset{
            width: 100%;
            margin-bottom: 3%;
        }
        .div-board-bottom-btn{
            width: 100%;
        }
        .div-board-bottom-search{
            width: 70%;
        }
        .div-board-bottom-category{
            width: 30%;
            margin-top: 0%;
        }
        .div-board-table-table{
            width: 100%;
        }
    }
</style>