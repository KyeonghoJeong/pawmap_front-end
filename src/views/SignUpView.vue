<template>
    <div>
        <form class="form-signup" @submit.prevent="checkPassword">
            <div class="div-signup">
                <h1 class="h3 mb-3 font-weight-normal">회원정보 입력</h1><br>
                <p>회원가입을 위해 정보를 입력해주세요.</p><br>
                <label for="input-signup-id-id" class="sr-only label-signup-input-id">아이디</label>
                <input type="text" id="input-signup-id-id" class="form-control" placeholder="아이디 입력" pattern="[A-Za-z0-9]+" minlength="5" maxlength="15" oninvalid="setCustomValidity('아이디는 5글자 이상 15글자 이하의 영어, 숫자로 만들어주세요.')" oninput="setCustomValidity('')" autofocus required><br>
                <label for="input-signup-id-pw" class="sr-only label-signup-input-pw">비밀번호</label>
                <input type="password" class="form-control" placeholder="비밀번호 입력" v-model="pw1" minlength="8" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" required><br>
                <input type="password" class="form-control" placeholder="비밀번호 확인" v-model="pw2" minlength="8" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" required><br>
                <label for="input-signup-id-nickname" class="sr-only label-signup-input-nickname">닉네임</label>
                <input type="text" id="input-signup-id-nickname" class="form-control" placeholder="닉네임 입력" pattern="[A-Za-z0-9가-힣]+" minlength="2" maxlength="10" oninvalid="setCustomValidity('닉네임은 2글자 이상 10글자 이하의 한국어, 영어, 숫자로 만들어주세요.')" oninput="setCustomValidity('')" required><br>
                <label for="input-signup-id-email" class="sr-only label-signup-input-email">이메일</label>
                <input type="email" id="input-signup-id-email" class="form-control" placeholder="이메일 입력" required><br><br>
                <button class="btn btn-lg btn-primary btn-block" type="submit" style="width:100%">확인</button>
            </div>
        </form>
  </div>
</template>

<script>
export default ({
    data(){
        return {
            pw1: '',
            pw2: '',
        }
    },
    methods:{
        checkPassword(){
            if(this.pw1 !== this.pw2){
                alert("비밀번호가 같지 않습니다.");
            }
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