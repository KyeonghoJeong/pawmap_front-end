<template>
    <div>
        <form class="form-signup" @submit.prevent="confirm">
            <div class="div-signup">
                <div><h1 class="h3 mb-3 font-weight-normal">회원정보 입력</h1><br></div>
                <div><p>회원가입을 위해 정보를 입력해주세요.</p><br></div>
                <div><label for="input-signup-id-id" class="sr-only label-signup-input-id">아이디</label></div>
                <div id="input-signup-id-id" class="div-signup-id">
                    <input type="text" v-model="memberId" class="form-control input-signup-id" placeholder="아이디 입력" pattern="[A-Za-z0-9]+" minlength="5" maxlength="15" oninvalid="setCustomValidity('아이디는 5글자 이상 15글자 이하의 영어, 숫자로 만들어주세요.')" oninput="setCustomValidity('')" autofocus required><br>
                    <button class="btn btn-sm btn-primary btn-block btn-signup-id" type="button" @click=checkId>중복 확인</button>
                </div>
                <div><label for="input-signup-id-pw" class="sr-only label-signup-input-pw">비밀번호</label></div>
                <div id="input-signup-id-pw" class="div-signup-pw">
                    <input type="password" class="form-control" placeholder="비밀번호 입력" v-model="pw1" minlength="8" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" required><br>
                    <input type="password" class="form-control" placeholder="비밀번호 확인" v-model="pw2" minlength="8" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" required><br>
                </div>
                <div><label for="input-signup-id-nickname" class="sr-only label-signup-input-nickname">닉네임</label></div>
                <div id="input-signup-id-nickname" class="div-signup-nickname">
                    <input type="text" v-model="nickname" class="form-control input-signup-nickname" placeholder="닉네임 입력" pattern="[A-Za-z0-9가-힣]+" minlength="2" maxlength="10" oninvalid="setCustomValidity('닉네임은 2글자 이상 10글자 이하의 한국어, 영어, 숫자로 만들어주세요.')" oninput="setCustomValidity('')" required><br>
                    <button class="btn btn-sm btn-primary btn-block btn-signup-nickname" type="button" @click=checkNickname>중복 확인</button>
                </div>
                <div><label for="input-signup-id-email" class="sr-only label-signup-input-email">이메일</label></div>
                <div id="input-signup-id-email" class="div-signup-email">
                    <input type="email" v-model="email" class="form-control input-signup-email" placeholder="이메일 입력" required><br><br>
                    <button class="btn btn-sm btn-primary btn-block btn-signup-email" type="button" @click=checkEmail>이메일 인증</button>
                </div>
                <div class="div-signup-certifyEmail">
                    <input type="text" v-model="userCode" class="form-control input-signup-certifyEmail" placeholder="인증코드 입력" required><br><br>
                    <button class="btn btn-sm btn-primary btn-block btn-signup-certifyEmail" type="button" @click=certifyEmail>인증 확인</button>
                </div>
                <div class="div-signup-confirm"><button class="btn btn-lg btn-primary btn-block btn-signup-confirm" type="submit">확인</button></div>
            </div>
        </form>
  </div>
</template>

<script>
import axios from 'axios';

export default ({
    data(){
        return {
            memberId: '',
            pw: '',
            nickname: '',
            email: '',
            pw1: '',
            pw2: '',
            validMemberId: false,
            validNickname: false,
            validEmail: false,
            authCode: '',
            userCode: '',
        }
    },
    methods:{
        checkId(){
            const pattern = /^[A-Za-z0-9]+$/;
            const minLength = 5;
            const maxLength = 15;

            if(pattern.test(this.memberId) && this.memberId.length >= minLength && this.memberId.length <= maxLength){
                axios.get('http://localhost:8090/api/validation/memberid', {params:{memberId: this.memberId}})
                .then(reponse => {
                    if(reponse.data === 0){
                        alert("사용할 수 있는 아이디입니다.");

                        this.validMemberId = true;
                    }else{
                        alert("이미 존재하는 아이디입니다.");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }else{
                alert("아이디는 5글자 이상 15글자 이하의 영어, 숫자로 만들어주세요.")
            }
        },
        checkNickname(){
            const pattern = /^[A-Za-z0-9가-힣]+$/;
            const minlength = 2;
            const maxlength = 10;
            
            if(pattern.test(this.nickname) && this.nickname.length >= minlength && this.nickname.length <= maxlength){
                axios.get('http://localhost:8090/api/validation/nickname', {params:{nickname: this.nickname}})
                .then(response => {
                    if(response.data === 0){
                        alert("사용할 수 있는 닉네임입니다.");

                        this.validNickname = true;
                    }else{
                        alert("이미 존재하는 닉네임입니다.");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }else{
                alert("닉네임은 2글자 이상 10글자 이하의 한국어, 영어, 숫자로 만들어주세요.")
            }
        },
        checkEmail(){
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(pattern.test(this.email)){
                axios.get('http://localhost:8090/api/validation/email', {params:{email:this.email}})
                .then(response => {
                    if(response.data === 0){
                        axios.get('http://localhost:8090/api/certification/email', {params:{email: this.email}})
                        .then(response => {
                            this.authCode = response.data;
                        })
                        .catch(error => {
                            console.log(error);
                        })

                        alert("인증 메일이 발송되었습니다.");
                    }else{
                        alert("이미 존재하는 이메일입니다.");
                    }
                })
                .catch(error =>{
                    console.log(error);
                })
            }else{
                if(this.email === ''){
                    alert("이메일 주소를 입력해주세요.");
                }else{
                    alert("이메일 주소 형식을 확인해주세요.");
                }
            }
        },
        certifyEmail(){
            if(String(this.userCode) === String(this.authCode)){
                this.validEmail = true;
                
                alert("이메일 인증이 완료되었습니다.");
            }else{
                alert("인증코드가 일치하지 않습니다.");
            }
        },
        checkPassword(){
            if(this.pw1 === this.pw2){
                this.pw = this.pw1;

                return true;
            }else{
                return false;
            }
        },
        confirm(){
            if(this.validMemberId === false){
                alert("아이디 중복을 확인해주세요.");
            }else if(this.checkPassword() === false){
                alert("비밀번호가 같지 않습니다.");
            }else if(this.validNickname === false){
                alert("닉네임 중복을 확인해주세요.");
            }else if(this.validEmail === false){
                alert("이메일을 인증해주세요.");
            }else if(this.checkPassword() && this.validMemberId === true && this.validNickname === true && this.validEmail === true){
                axios.post('http://localhost:8090/api/member/signup', {
                    memberId: this.memberId,
                    pw: this.pw,
                    nickname: this.nickname,
                    email: this.email
                })
                .then(response => {
                    console.log(response.data);

                    alert("회원가입이 완료되었습니다.");

                    this.$router.push('/');
                })
                .catch(error => {
                    console.log(error);
                })
            }
        }
    },
    watch:{
        memberId: function(){
            this.validMemberId = false;
        },
        nickname: function(){
            this.validNickname = false;
        },
        email: function(){
            this.validEmail = false;
        }
    }
})
</script>


<style>
.form-signup{
    margin-top: 4.4%;
    margin-bottom: 4.4%;
    margin-left: 33%;
}
.div-signup{
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
.label-signup-input-id, .label-signup-input-pw, .label-signup-input-nickname, .label-signup-input-email{
    font-weight: bold;
}
.div-signup-id, .div-signup-nickname, .div-signup-email, .div-signup-certifyEmail{
    display: flex;
    justify-content: space-between;
    margin-bottom: 5%;
}
.div-signup-pw{
    display: flex;
    flex-direction: column;
}
.input-signup-id, .input-signup-nickname, .input-signup-email, .input-signup-certifyEmail{
    width: 70%;
}
.btn-signup-id, .btn-signup-nickname, .btn-signup-email, .btn-signup-certifyEmail{
    width: 25%;
    background-color: #fd7e14;
    border-color: #fd7e14;
}
.btn-signup-id:hover, .btn-signup-nickname:hover, .btn-signup-email:hover, .btn-signup-certifyEmail:hover{
    width: 25%;
    background-color: white;
    border-color: white;
    color: #fd7e14;
}
.div-signup-confirm{
    margin-top: 12%;
}
.btn-signup-confirm{
    width: 100%;
    background-color: #fd7e14;
    border-color: #fd7e14;
}
.btn-signup-confirm:hover{
    width: 100%;
    background-color: white;
    border-color: white;
    color: #fd7e14;
}
@media screen and (max-width: 992px){
    .form-signup{
        margin-left: 28%;
    }
    .div-signup{
        width: 60%;
        height: 60%;
    }
}
@media screen and (max-width: 576px){
    .form-signup{
        margin-left: 16%;
    }
    .div-signup{
        width: 80%;
        height: 80%;
    }
}
</style>