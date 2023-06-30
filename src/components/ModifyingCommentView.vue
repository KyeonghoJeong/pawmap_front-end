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