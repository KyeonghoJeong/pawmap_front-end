<template>
    <div>
        <form class="form-signin" @submit.prevent="signin">
            <div class="div-signin">
                <div><h1 class="h3 mb-3 font-weight-normal">로그인</h1><br></div>
                <div><p>서비스 이용을 위해 로그인해주세요.</p><br></div>
                <div><label for="input-signin-id-id" class="sr-only label-singin-input-id">아이디</label></div>
                <div><input type="text" id="input-signin-id-id" v-model="memberId" class="form-control" placeholder="아이디 입력" required autofocus><br></div>
                <div><label for="input-signin-id-pw" class="sr-only label-singin-input-pw">비밀번호</label></div>
                <div><input type="password" id="input-signin-id-pw" v-model="pw" class="form-control" placeholder="비밀번호 입력" required><br></div>
                <div class="checkbox mb-3 checkbox-signin-saveid">
                    <label style="margin-right: auto;"><input type="checkbox" value="remember-me"> 아이디 저장</label>
                    <router-link to="/signup" class="router-link-signin-signup">회원가입</router-link>
                </div>
                <div><button class="btn btn-lg btn-primary btn-block btn-signin-signin" type="submit" style="width:100%">로그인</button></div>
            </div>
        </form>
  </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            memberId: '',
            pw: '',
        }
    },
    methods:{
        signin(){
            axios.post('http://localhost:8090/api/member/signin', {
                memberId: this.memberId,
                pw: this.pw
            }, {
                withCredentials: true
            })
            .then(response => {
                localStorage.setItem("accessToken", response.data.accessToken);

                window.location.href = "/";
            })
            .catch(error => {
                if(error.response.status === 401){
                    console.log("Invalid username or password");
                }
            })
        }
    }
}
</script>

<style>
.form-signin{
    margin-top: 4.4%;
    margin-bottom: 4.4%;
    margin-left: 33%;
}
.div-signin{
    width: 50%;
    height: 50%;
    border-style: solid;
    border-color: rgb(189, 189, 189);
    border-width: 1px;
    padding-top: 5%;
    padding-bottom: 5%;
    padding-left: 5%;
    padding-right: 5%;
    font-size: 0.8rem;
}
.checkbox-signin-saveid{
    display: flex;
    align-items: center;
}
.router-link-signin-signup{
    margin-left: auto;
    color: black;
    font-weight: bold;
    text-decoration: none;
}
.label-singin-input-id, .label-singin-input-pw{
    font-weight: bold;
}
.btn-signin-signin{
    background-color: #fd7e14;
    border-color: #fd7e14;
}
.btn-signin-signin:hover{
    background-color: white;
    border-color: white;
    color: #fd7e14;
}

@media screen and (max-width: 992px){
    .form-signin{
        margin-left: 28%;
    }
    .div-signin{
        width: 60%;
        height: 60%;
    }
}
@media screen and (max-width: 576px){
    .form-signin{
        margin-left: 16%;
    }
    .div-signin{
        width: 80%;
        height: 80%;
    }
}
</style>