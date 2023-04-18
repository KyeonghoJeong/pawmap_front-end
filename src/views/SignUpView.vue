<template>
    <div>
        <form class="form-signin custom-signin">
            <div class="container-signin">
                <h1 class="h3 mb-3 font-weight-normal">회원정보 입력</h1><br>
                <p>회원가입을 위해 정보를 입력해주세요.</p><br>
                <label for="inputId" class="sr-only custom-labels">아이디</label>
                <input type="text" pattern="[A-Za-z0-9]+" id="inputId" class="form-control" placeholder="아이디 입력" required autofocus><br>
                <label for="inputNickName" class="sr-only custom-labels">닉네임</label>
                <input type="text" pattern="[A-Za-z0-9]+" id="inputNickName" class="form-control" placeholder="닉네임 입력" required autofocus><br>
                <label for="inputPassword-SignUp" class="sr-only custom-labels">비밀번호</label>
                <input type="inputPassword-SignUp" id="inputPassword" class="form-control" placeholder="비밀번호 입력" required><br>
                <input type="inputPassword-SignUp" id="inputPassword" class="form-control" placeholder="비밀번호 확인" required><br><br>
                <button class="btn btn-lg btn-primary btn-block" type="submit" style="width:100%">확인</button>
            </div>
        </form>
  </div>
</template>