<template>
    <div>
        <form class="form-signin form-info" @submit.prevent="deleteAccount" >
            <div class="div-info">
                <div><h1 class="h3 mb-3 font-weight-normal">회원탈퇴</h1><br></div>
                <div><p>회원탈퇴를 위해 비밀번호를 입력해주세요.</p><br></div>
                <div class="div-info-id">
                    <label for="p-info-id-id" class="sr-only label-info-id">아이디</label>
                    <p id="p-info-id-id">&nbsp;{{this.member.memberId}}</p><br><br>
                </div>
                <div class="div-info-nickname">
                    <label for="p-info-id-nickname" class="sr-only label-info-nickname">닉네임</label>
                    <p id="p-info-id-nickname">&nbsp;{{this.member.nickname}}</p><br><br>
                </div>
                <div class="div-info-email">
                    <label for="p-info-id-email" class="sr-only label-info-email">이메일</label>
                    <p id="p-info-id-email">&nbsp;{{this.member.email}}</p><br><br>
                </div>
                <label for="div-info-id-pw" class="sr-only label-info-pw">비밀번호</label><br><br>
                <div id="div-info-id-pw">
                    <input v-model="tempPassword1" type="password" class="form-control" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" placeholder="비밀번호 입력" required><br>
                    <input v-model="tempPassword2" type="password" class="form-control" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" placeholder="비밀번호 확인" required><br>
                </div>
                <div><button class="btn btn-lg btn-primary btn-block btn-info-confirm" type="submit" style="width:100%">회원탈퇴</button></div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            member: [],
            password: '',
            newPassword: '',
            tempPassword1: '',
            tempPassword2: '',
        }
    },
    methods:{
        getMember(){
            axios.get('http://localhost:8090/api/member', {
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
                            this.getMember();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }else{
                    this.member = response.data;
                }
            })
            .catch(error => {
                console.log(error);
            })
        },
        deleteAccount(){
            if(this.tempPassword1 !== this.tempPassword2){
                alert("비밀번호가 같지 않습니다.");
            }else{
                if(confirm("정말 회원탈퇴 하시겠습니까?")){
                    this.newPassword = this.tempPassword1;

                    axios.put('http://localhost:8090/api/member/deletion', {
                        memberId: this.member.memberId,
                        pw: this.newPassword
                    })
                    .then(response => {
                        if(response.data === 'Success'){
                            axios.delete(`http://localhost:8090/api/bookmarks?memberId=${this.member.memberId}`)
                            .then(response => {
                                if(response.data === 'Success'){
                                    alert("회원탈퇴가 완료되었습니다.");

                                    localStorage.removeItem("accessToken");
                                    window.location.href = "/";
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        }
                    })
                    .catch(error => {
                        if(error.response.status === 403){
                            alert("잘못된 비밀번호입니다.");
                        }
                    })
                }
            }
        }
    },
    created(){
        this.getMember();
    }
}
</script>

<style>
.form-info{
    margin-top: 4.4%;
    margin-bottom: 4.4%;
    margin-left: 33%;
}
.div-info{
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
.div-info-id, .div-info-nickname, .div-info-email{
    display:flex;
}
.label-info-id, .label-info-nickname, .label-info-email, .label-info-pw {
    font-weight: bold;
}
.btn-info-confirm{
    width: 100%;
    background-color: #fd7e14;
    border-color: #fd7e14;
}
.btn-info-confirm:hover{
    width: 100%;
    background-color: white;
    border-color: white;
    color: #fd7e14;
}
.router-info-deleteAcc{
    color: black;
    font-weight: bold;
    text-decoration: none;
}
.router-info-deleteAcc:hover{
    cursor: pointer;
}
</style>