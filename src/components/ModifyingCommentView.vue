<template>
<form @submit.prevent="modifyComment">
    <div class="div-posting-cmtbox">
        <div class="form-floating div-posting-cmtbox-input" style="display:flex; flex-direction: column; align-items: center;">
            <textarea class="form-control" style="height: 8vh; width: 64.5vh;" maxlength="300" v-model="newWriting" required></textarea>
        </div>
        <div class="div-modifyingcmt-btns">
            <button type="submit" class="btn div-modifyingcmt-btns-btn">등록</button>&nbsp;
        </div>
    </div>
</form>
</template>

<script>
import axios from 'axios'

export default{
    props: {
        writing:{
            type: String,
            required: true,
        },
        cmtId:{
            type: Number,
            required: true,
        }
    },
    data(){
        return{
            newWriting: '',
        }
    },
    methods:{
        modifyComment(){
            axios.put('http://localhost:8090/api/board/article/comment', {
                cmtId: this.cmtId,
                writing: this.newWriting
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

                            this.modifyComment();
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
    created(){
        this.newWriting = this.writing;
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
.div-modifyingcmt-btns{
    margin-top: 1%;
    margin-right: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
.div-modifyingcmt-btns-btn{
    background-color: #fd7e14;
    color: white;
    width: 80px;
}
</style>