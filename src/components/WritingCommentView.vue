<template>
<form @submit.prevent="postComment">
    <div class="div-posting-cmtbox">
        <div class="form-floating div-posting-cmtbox-input">
            <textarea class="form-control" placeholder="댓글을 남겨보세요." style="height: 100px" maxlength="300" v-model="writing" required></textarea>
            <label for="floatingTextarea2">댓글을 남겨보세요.</label>
        </div>
        <div class="div-posting-cmtbox-btn">
            <button type="submit" class="btn div-posting-cmtbox-btn-btn">등록</button>
        </div>
    </div>
</form>
</template>

<script>
import axios from 'axios'

export default{
    props: {
        articleId: {
            type: String
        }
    },
    data(){
        return{
            writing: '',
        }
    },
    methods:{
        postComment(){
            axios.post('http://localhost:8090/api/board/article/comment', {
                articleId: this.articleId,
                title: this.title, 
                writing: this.writing
            }, {
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

                            this.postComment();
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
    }
}
</script>

<style>
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
</style>