<template>
    <body>
        <form class="form-signin custom-signin">
            <div class="container-signin">
                <h1 class="h3 mb-3 font-weight-normal">회원정보 입력</h1><br>
                <p>회원가입을 위해 정보를 입력해주세요.</p><br>
                <label for="inputId" class="sr-only custom-labels">아이디</label>
                <input type="text" pattern="[A-Za-z0-9]+" id="inputId" class="form-control" placeholder="아이디 입력" required autofocus><br>
                <label for="inputNickName" class="sr-only custom-labels">닉네임</label>
                <input type="text" pattern="[A-Za-z0-9]+" id="inputNickName" class="form-control" placeholder="닉네임 입력" required autofocus><br>
                <label for="inputPassword" class="sr-only custom-labels">비밀번호</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="비밀번호 입력" required><br>
                <input type="password" id="inputPassword" class="form-control" placeholder="비밀번호 확인" required><br><br>
                <button class="btn btn-lg btn-primary btn-block" type="submit" style="width:100%">확인</button>
            </div>
        </form>
  </body>
</template>

<style>
.custom-signin{
    margin-top: 4.4%;
    margin-bottom: 4.4%;
    margin-left: 33%;
}
.container-signin{
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
.custom-checkbox-saveid{
    display: flex;
    align-items: center;
}
.custom-router-link-signup{
    margin-left: auto;
    color: black;
    font-weight: bold;
    text-decoration: none;
}

@media screen and (max-width: 992px){
    .custom-signin{
        margin-left: 28%;
    }
    .container-signin{
        width: 60%;
        height: 60%;
    }
}
@media screen and (max-width: 576px){
    .custom-signin{
        margin-left: 16%;
    }
    .container-signin{
        width: 80%;
        height: 80%;
    }
}
</style>