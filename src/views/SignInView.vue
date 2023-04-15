<template>
    <body>
        <form class="form-signin custom-signin">
            <div class="container-signin">
                <h1 class="h3 mb-3 font-weight-normal">로그인</h1><br>
                <p>서비스 이용을 위해 로그인해주세요.</p><br>
                <label for="inputEmail" class="sr-only">아이디</label>
                <input type="email" id="inputEmail" class="form-control" placeholder="아이디 입력" required autofocus><br>
                <label for="inputPassword" class="sr-only">비밀번호</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="비밀번호 입력" required><br>
                <div class="checkbox mb-3">
                    <label>
                    <input type="checkbox" value="remember-me"> 아이디 저장
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit" style="width:100%">로그인</button>
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