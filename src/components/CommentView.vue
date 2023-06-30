<template>
    <div>
        <div class="div-posting-inc">
            <div v-for="comment in comments" :key="comment.cmtId" class="div-posting-inc-cmt">
                <div class="div-posting-inc-cmt-i">
                    <span class="div-posting-inc-cmt-i-nickname">{{comment.nickname}}</span>
                    <div style="display:flex;">
                        <div v-if="memberId === comment.memberId">
                            <span class="p-posting-mnd-m" @click="modifyComment(comment.cmtId)">수정</span>&nbsp;
                            <span class="p-posting-mnd-d" @click="deleteComment(comment.cmtId)">삭제</span>&nbsp;&nbsp;
                        </div>
                        <span>{{comment.postDate}}</span>
                    </div>
                </div>
                <div v-if="modifying !== comment.cmtId" class="div-posting-inc-cmt-c">{{comment.writing}}</div>
                <div v-if="modifying === comment.cmtId">
                    <div>
                        <div style="display:flex; justify-content:end;"> 
                            <span class="p-posting-mnd-d" style=" margin-top:1%; margin-right:1%;" @click="cancleModifying">취소</span>&nbsp;&nbsp;
                        </div>
                    </div>
                    <ModifyingCommentView :writing="comment.writing" :cmtId="comment.cmtId"/>
                </div>
            </div>
        </div>

        <div style="padding-top: 2.2%; padding-bottom: 1%; margin-bottom: 2.5%; display:flex; flex-direction: column; align-items:center; 
            border-style: solid; border-color: rgb(203, 204, 206);
            border-top: 0; border-left: 0; border-right: 0; border-bottom: 1px solid rgba(203, 204, 206, 1)">
            <div class="div-board-paging">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item">
                            <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>

                        <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                            <button class="page-link" @click="getCommentInfos(i-1)">{{i}}</button>
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
    </div>
</template>

<script>
import axios from 'axios'

import ModifyingCommentView from './ModifyingCommentView.vue'

export default{
    props: {
        articleId: {
            type: String,
            required: true
        },
        memberId:{
            type: String,
            required: true
        }
    },
    components:{
        ModifyingCommentView,
    },
    data(){
        return{
            comments: [],
            totalPages: '',
            modifying: '',
            pageActive: 1,
            startNum: 0,
            endNum: 0,
        }
    },
    methods:{
        getComments(articleId){
            axios.get('http://localhost:8090/api/board/article/comments', {
                params: {articleId: articleId, page: 0, size: 10}
            })
            .then(response => {
                this.comments = response.data.content;
                this.totalPages = response.data.totalPages;
            })
            .catch(error => {
                console.log(error);
            })          
        },
        modifyComment(cmtId){
            this.modifying = cmtId;
        },
        deleteComment(cmtId){
            if(confirm("정말 삭제하시겠습니까?")){
                axios.delete(`http://localhost:8090/api/board/article/comment?cmtId=${cmtId}`, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                })
                .then(response => {
                    if(response.data === 'invalidAccessToken'){
                        axios.get('http://localhost:8090/api/member/accesstoken', {
                            withCredentials: true
                        })
                        .then(response => {
                            // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                            if(response.data === 'invalidVRefreshToken'){
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
                                this.deleteComment();
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }else{
                        this.$router.go(this.$router.currentRoute);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        cancleModifying(){
            this.modifying = '';
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
        getCommentInfos(i){
            axios.get('http://localhost:8090/api/board/article/comments', {
                params: {articleId: this.articleId, page: i, size: 10}
            })
            .then(response => {
                this.comments = response.data.content;
                this.totalPages = response.data.totalPages;
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
        this.getComments(this.articleId);
    }
}
</script>

<style>
    .div-posting-inc{
        height: 15%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
        border-bottom-color: white;
    }
    .div-posting-inc-cmt{
        margin: 1%;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(203, 204, 206);
        overflow: auto;
    }
    .div-posting-inc-cmt-i{
        padding: 1%;
        display: flex;
        justify-content: space-between;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-inc-cmt-i-nickname{
        font-weight: bold;
        color: rgb(81, 145, 195);
    }
    .div-posting-inc-cmt-c{
        padding: 1%;
        display: flex;
        height: 8vh;
    }
</style>