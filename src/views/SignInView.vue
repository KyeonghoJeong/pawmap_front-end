<template>
    <div>
        <form class="form-signin">
            <div class="div-signin">
                <h1 class="h3 mb-3 font-weight-normal">로그인</h1><br>
                <p>서비스 이용을 위해 로그인해주세요.</p><br>
                <label for="input-signup-id-id" class="sr-only label-singin-input-id">아이디</label>
                <input type="text" pattern="[A-Za-z0-9]+" id="input-signup-id-id" class="form-control" placeholder="아이디 입력" required autofocus><br>
                <label for="input-signup-id-pw" class="sr-only label-singin-input-pw">비밀번호</label>
                <input type="password" id="input-signup-id-pw" class="form-control" placeholder="비밀번호 입력" required><br>
                <div class="checkbox mb-3 checkbox-signin-saveid">
                    <label style="margin-right: auto;"><input type="checkbox" value="remember-me"> 아이디 저장</label>
                    <router-link to="/signup" class="router-link-signin-signup">회원가입</router-link>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit" style="width:100%">로그인</button>
            </div>
        </form>
  </div>
</template>

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