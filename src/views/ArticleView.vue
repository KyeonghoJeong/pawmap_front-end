<template>
    <div class="div-posting">
        <BoardTitleView></BoardTitleView>
        
        <div class="div-posting-group">
            <div class="div-posting-title">
                <div class="div-posting-title-first">
                    제목
                </div>
                <div class="div-posting-title-second">
                    {{this.article.title}}
                </div>
            </div>
            <div class="div-posting-date">
                <div class="div-posting-date-first">
                    작성일
                </div>
                <div class="div-posting-date-second">
                     {{this.article.postDate}}
                </div>
            </div>
            <div class="div-posting-nickname">
                <div class="div-posting-nickname-first">
                    닉네임
                </div>
                <div class="div-posting-nickname-second">
                     {{this.article.nickname}}
                </div>
            </div>
            <div class="div-posting-content">
                 {{this.article.writing}}
            </div>
            <div class="div-posting-mnd">
                <div class="div-posting-mnd-mnd">
                    <p class="p-posting-mnd-m" @click="modifyArticle">수정</p>&nbsp;&nbsp;
                    <p class="p-posting-mnd-d" @click="deleteArticle">삭제</p>
                </div>
            </div>
            <div class="div-posting-btns">
                <button type="button" class="btn div-posting-btns-btn" @click="toBoard">목록</button>
            </div>
            <div class="div-posting-inc">
                <div class="div-posting-inc-cmt">
                    <div class="div-posting-inc-cmt-i">
                        <span class="div-posting-inc-cmt-i-nickname">홀란드</span>
                        <span>2023-04-19 01:21:00</span>
                    </div>
                    <div class="div-posting-inc-cmt-c">
                        잘 읽었습니다.
                    </div>
                </div>
            </div>
            <div class="div-posting-cmtbox">
                <div class="form-floating div-posting-cmtbox-input">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">댓글을 남겨보세요.</label>
                </div>
                <div class="div-posting-cmtbox-btn">
                    <button type="button" class="btn div-posting-cmtbox-btn-btn">등록</button>
                </div>
            </div>
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
            articleId: '',
            article: '',
            isItsMember: false,
        }
    },
    methods:{  
        mounted(){
            this.isItsMember = this.checkMember();
        },
        toBoard(){
            this.$router.push({path:'/board'});
        },
        modifyArticle(){
            
        },
        deleteArticle(){
            if(localStorage.getItem("accessToken") === null){
                alert("로그인 해주세요.");
            }else{
                if(confirm("정말 삭제하시겠습니까?")){
                    axios.delete(`http://localhost:8090/api/board/article?articleId=${this.articleId}`, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })
                    .then(response => {
                        if(response.data === 'Invalid'){
                            axios.get('http://localhost:8090/api/member/reissuance', {
                                withCredentials: true
                            })
                            .then(response => {
                                if(response.data === 'Invalid'){
                                    alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");
                                    
                                    localStorage.removeItem("accessToken");
                                    window.location.href = "/signin";
                                }else{
                                    localStorage.removeItem("accessToken");
                                    localStorage.setItem("accessToken", response.data.accessToken);

                                    this.deleteArticle();
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        }else{
                            this.$router.push({path:'/board'});
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }   
            }
        },
    },
    created(){
        this.articleId = this.$route.query.articleid;

        axios.get('http://localhost:8090/api/board/article', {params:{articleId: this.articleId}})
        .then(response => {
            this.article = response.data;
        })
        .catch(error => {
            console.log(error);
        })
    }
}
</script>

<style>
    .div-posting{
        padding-top: 7%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .div-posting-group{
        width: 60%;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(203, 204, 206);
    }

    .div-posting-title{
        height: 15%;
        display: flex;
        font-weight: bold;
        padding: 1%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-title-first{
        width: 15%;
    }

    .div-posting-date{
        height: 15%;
        display: flex;
        padding: 1%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-date-first{
        width: 15%;
    }

    .div-posting-nickname{
        height: 15%;
        display: flex;
        padding: 1%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-nickname-first{
        width: 15%;
    }

    .div-posting-content{
        height: 20vh;
        padding: 1%;
        overflow-y: auto;
    }

    .div-posting-mnd{
        padding-right: 2%;
        display: flex;
        flex-direction: row-reverse;
    }
    .div-posting-mnd-mnd{
        display: flex;
        font-weight: bold;
    }
    .p-posting-mnd-m{
        text-decoration: underline;
    }
    .p-posting-mnd-m:hover{
        cursor:pointer;
    }
    .p-posting-mnd-d{
        text-decoration: underline;
    }
    .p-posting-mnd-d:hover{
        cursor:pointer;
    }
    .div-posting-mnd a{
        color: black;
    }

    .div-posting-btns{
        height: 15%;
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
    .div-posting-btns button{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }

    .div-posting-inc{
        height: 15%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-inc-cmt{
        margin: 1%;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(203, 204, 206);
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

    .div-posting-cmtbox{
        height: 15%;
        padding: 1%;
        display: flex;
        flex-direction: column;
    }
    .div-posting-cmtbox-btn{
        margin-top: 1%;
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
    }
    .div-posting-cmtbox-btn-btn{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }

    @media screen and (max-width: 992px){
        .div-posting-group{
            width: 100%;
        }
    }
</style>