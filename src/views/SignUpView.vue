<template>
    <div class="div-SignUp-container">
        <div class="div-SignUp-signup">
            <!-- 확인 버튼 클릭 시 signUp 메소드 호출 -->
            <form @submit.prevent="signUp">
                <h1 class="h3 mb-3 font-weight-normal">회원정보 입력</h1><br>

                <p>회원가입을 위해 정보를 입력해주세요.</p><br>

                <label for="id-div-SignUp-id" class="sr-only label-SignUp-id">아이디</label>
                <div id="id-div-SignUp-id" class="div-SignUp-id">
                    <!-- memberId에 입력 아이디 저장 -->
                    <input type="text" v-model="memberId" class="form-control input-SignUp-id" placeholder="아이디 입력" oninvalid="setCustomValidity('아이디는 5글자 이상 15글자 이하의 영어 알파벳 또는 영어 알파벳과 숫자의 조합으로 만들어주세요.')" oninput="setCustomValidity('')" autofocus required><br>
                    <!-- 중복 확인 버튼 클릭 시 아이디 유효성 확인 메소드 checkId() 호출 -->
                    <button class="btn btn-sm btn-primary btn-block button-SignUp-id" type="button" @click=checkId>중복 확인</button>
                </div>
                
                <label for="id-div-SignUp-pw" class="sr-only label-SignUp-pw">비밀번호</label>
                <div id="id-div-SignUp-pw" class="div-SignUp-pw">
                    <!-- password1, password2에 비밀번호 입력, 비밀번호 확인의 값 저장 -->
                    <input type="password" class="form-control" placeholder="비밀번호 입력" v-model="password1" oninvalid="setCustomValidity('비밀번호는 8글자 이상의 영어 알파벳, 숫자, 특수문자의 조합으로 만들어주세요.')" oninput="setCustomValidity('')" required><br>
                    <input type="password" class="form-control" placeholder="비밀번호 확인" v-model="password2" oninvalid="setCustomValidity('비밀번호는 8글자 이상의 영어 알파벳, 숫자, 특수문자의 조합으로 만들어주세요.')" oninput="setCustomValidity('')" required><br>
                </div>
                
                <label for="id-div-SignUp-nickname" class="sr-only label-SignUp-nickname">닉네임</label>
                <div id="id-div-SignUp-nickname" class="div-SignUp-nickname">
                    <!-- nickname에 입력 닉네임 저장 -->
                    <input type="text" v-model="nickname" class="form-control input-SignUp-nickname" placeholder="닉네임 입력" oninvalid="setCustomValidity('닉네임은 2글자 이상 10글자 이하의 한국어, 영어 알파벳 또는 한국어, 영어 알파벳, 숫자의 조합으로 만들어주세요.')" oninput="setCustomValidity('')" required><br>
                    <!-- 중복 확인 버튼 클릭 시 닉네임 유효성 확인 메소드 checkNickname() 호출 -->
                    <button class="btn btn-sm btn-primary btn-block button-SignUp-nickname" type="button" @click=checkNickname>중복 확인</button>
                </div>

                <label for="id-div-SignUp-email" class="sr-only label-SignUp-email">이메일</label>
                <div id="id-div-SignUp-email">
                    <div class="div-SignUp-email">
                        <!-- email에 입력 이메일 저장 -->
                        <input type="email" v-model="email" class="form-control input-SignUp-email" placeholder="이메일 입력" required><br><br>
                        <!-- 메일 인증 버튼 클릭 시 이메일 유효성 확인 메소드 checkEmail() 호출 -->
                        <button class="btn btn-sm btn-primary btn-block button-SignUp-email" type="button" @click=checkEmail>메일 인증</button>
                    </div>
                    <div class="div-SignUp-authcode">
                        <!-- inputCode에 입력 인증코드 저장 -->
                        <input type="text" v-model="inputCode" class="form-control input-SignUp-authcode" placeholder="인증코드 입력" required><br><br>
                        <!-- 인증 확인 버튼 클릭 시 인증코드 일치 확인 메소드 certifyEmail() 호출 -->
                        <button class="btn btn-sm btn-primary btn-block button-SignUp-authcode" type="button" @click=certifyEmail>인증 확인</button>
                    </div>
                </div>

                <div class="div-SignUp-confirm">
                    <button class="btn btn-lg btn-primary btn-block button-SignUp-confirm" type="submit">확인</button>
                </div>
            </form>
        </div>
  </div>
</template>

<script>
import axios from 'axios';

export default ({
    data(){
        return {
            memberId: '', // 회원 아이디
            password: '', // 비밀번호
            nickname: '', // 닉네임
            email: '', // 이메일
            password1: '', // 비밀번호 입력
            password2: '', // 비밀번호 확인
            validMemberId: false, // 회원 아이디 유효성 확인
            validNickname: false, // 닉네임 유효성 확인
            validEmail: false, // 이메일 유효성 확인
            emailAuthCode: '', // 인증코드
            inputCode: '', // 유저가 입력한 인증코드
        }
    },
    methods:{
        // 아이디 유효성 확인 메소드
        checkId(){
            // 아이디는 영어 알파벳 소문자 또는 대문자를 반드시 포함 => (?=.*[a-zA-Z])
            // 아이디는 영어 알파벳 소문자, 대문자, 숫자만 허용 => [a-zA-Z0-9]
            const pattern = /^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/;
            const minLength = 5; // 아이디 최소 길이
            const maxLength = 15; // 아이디 최대 길이

            if(pattern.test(this.memberId) && this.memberId.length >= minLength && this.memberId.length <= maxLength){
                // 입력한 아이디(memberId)의 패턴, 길이 체크 후 모두 참일 때 중복 확인을 위해 입력 아이디로 get 요청
                axios.get('http://localhost:8090/api/member/member-id/number', {
                    params: {memberId: this.memberId}
                })
                .then(reponse => {
                    if(reponse.data === 0){
                        // 입력 아이디가 DB에 없는 경우
                        alert("사용할 수 있는 아이디입니다.");

                        this.validMemberId = true; // 유효한 아이디 최종 확인(true)
                    }else{
                        // 입력 아이디가 DB에 있는 경우
                        alert("이미 존재하는 아이디입니다.");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }else{
                // 입력 아이디가 조건에 맞지 않는 경우 alert 출력

                if(!pattern.test(this.memberId)){
                    alert("아이디는 영어 알파벳 또는 영어 알파벳과 숫자의 조합으로 만들어주세요.")
                }else if(this.memberId.length < minLength || this.memberId.length > maxLength){
                    alert("아이디는 5글자 이상 15글자 이하로 만들어주세요.")
                }
            }
        },
        // 닉네임 유효성 확인 메소드
        checkNickname(){
            // 닉네임은 영어 알파벳 소문자, 대문자, 한국어 중 하나를 반드시 포함 => (?=.*[a-zA-Z가-힣])
            // 닉네임 영어 알파벳 소문자, 대문자, 한국어, 숫자만 허용
            const pattern = /^(?=.*[a-zA-Z가-힣])[a-zA-Z가-힣0-9]*$/;
            const minLength = 2; // 닉네임 최소 길이
            const maxLength = 10; // 닉네임 최소 길이
            
            if(pattern.test(this.nickname) && this.nickname.length >= minLength && this.nickname.length <= maxLength){
                // 입력한 닉네임(nickname)의 패턴, 길이 체크 후 모두 참일 때 중복 확인을 위해 입력 닉네임으로 get 요청
                axios.get('http://localhost:8090/api/member/nickname/number', {
                    params: {nickname: this.nickname}
                })
                .then(response => {
                    if(response.data === 0){
                        // 입력 닉네임이 DB에 없는 경우
                        alert("사용할 수 있는 닉네임입니다.");

                        this.validNickname = true; // 유효한 닉네임 최종 확인(true)
                    }else{
                        // 입력 닉네임이 DB에 있는 경우
                        alert("이미 존재하는 닉네임입니다.");
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }else{
                // 입력 닉네임이 조건에 맞지 않는 경우 alert 출력
                if(!pattern.test(this.nickname)){
                    alert("닉네임은 한국어, 영어 알파벳 또는 한국어, 영어 알파벳, 숫자의 조합으로 만들어주세요.")
                }else if(this.nickname.length < minLength || this.nickname.length > maxLength){
                    alert("닉네임은 2글자 이상 10글자 이하로 만들어주세요.");
                }
            }
        },
        // 이메일 유효성 확인 메소드
        // 동기적 동작을 위해 async/await 사용
        async checkEmail(){
            // 이메일 패턴은 영어 알파벳 소문자, 영어 알파벳 대문자, 숫자만 포함
            const pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;

            if(pattern.test(this.email)){
                // 입력 이메일이 패턴에 부합하는 경우
                try {
                    // 입력한 이메일(email)의 패턴 체크 후 참일 때 중복 확인을 위해 입력 이메일로 get 요청
                    const checkEmailResponse = await axios.get('http://localhost:8090/api/member/email/number', {
                        params: {email: this.email}
                    });
                    
                    if(checkEmailResponse.data === 0){
                        // 입력 이메일이 DB에 없는 경우

                        // 이메일 인증 요청
                        const getAuthCodeResponse = await axios.get('http://localhost:8090/api/auth/email-auth-code', {
                            params: {email: this.email}
                        });

                        this.emailAuthCode = getAuthCodeResponse.data; // 이메일 인증 코드
                        
                        alert("인증 메일이 발송되었습니다.");
                    }else{
                        // 입력 이메일이 DB에 있는 경우
                        alert("이미 존재하는 이메일입니다.");
                    }
                } catch(error) {
                    console.log(error);
                }
            }else{
                if(this.email === ''){
                    // 이메일 입력하지 않은 경우
                    alert("이메일 주소를 입력해주세요.");
                }else{
                    // 입력 이메일이 패턴에 부합하지 않는 경우 
                    alert("이메일 주소 형식을 확인해주세요.");
                }
            }
        },
        // 이메일 인증 코드를 확인하는 메소드
        certifyEmail(){
            if(this.emailAuthCode == ''){
                alert("메일 인증 버튼을 클릭해서 인증 메일을 발송해주세요.");
            }else{
                // 유저 입력 코드와 이메일 인증 코드를 String으로 형변환해서 비교
                if(String(this.inputCode) === String(this.emailAuthCode)){
                    // 유저 입력 코드와 이메일 인증 코드가 같은 경우
                    this.validEmail = true; // 유효한 이메일 최종 확인(true)
                    
                    alert("이메일 인증이 완료되었습니다.");
                }else{
                    // 유저 입력 코드와 이메일 인증 코드가 다른 경우
                    alert("인증코드가 일치하지 않습니다.");
                }
            }
        },
        // 비밀번호 유효성 확인 메소드
        checkPassword(){
            // 패스워드 패턴은 영어 알파벳 + 숫자 + 특수문자 각각을 하나 이상 반드시 포함
            const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+-={}|,.<>/?\\[\]])[a-zA-Z0-9!@#$%^&*()-+-={}|,.<>/?\\[\]]+$/;
            const minLength = 8;

            if(this.password1 === this.password2){
                // 두 입력 비밀번호가 같은 경우

                this.password = this.password1;

                if(pattern.test(this.password) && this.password.length >= minLength){
                    // 패턴에 부합하고 최소 길이보다 길 때 true 리턴
                    return true;
                }else{
                    // 패턴에 부합하지 않고 최소 길이보다 작을 때 false 리턴
                    if(!pattern.test(this.password)){
                        alert("비밀번호는 영어 알파벳, 숫자, 특수문자의 조합으로 만들어주세요.");
                    }else if(this.password.length < minLength){
                        alert("비밀번호는 8글자 이상으로 만들어주세요.");
                    }

                    return false;
                }
            }else{
                // 두 입력 비밀번호가 다른 경우
                alert("비밀번호 입력과 비밀번호 확인의 내용이 다릅니다.");

                return false;
            }
        },
        // 확인 버튼을 클릭했을 때 최종 확인 후 회원가입을 요청하는 메소드
        signUp(){
            // 아이디, 닉네임, 이메일, 유효성 확인 변수
            // 각 유효성 확인 변수가 모두 true 이고 checkPassword() 메소드를 호출하여 리턴값이 true인 경우 post 요청
            if(this.validMemberId === false){
                alert("아이디 중복을 확인해주세요.");
            }else if(this.validNickname === false){
                alert("닉네임 중복을 확인해주세요.");
            }else if(this.validEmail === false){
                alert("이메일을 인증해주세요.");
            }else {
                if(this.checkPassword()){
                    axios.post('http://localhost:8090/api/auth/member', {
                        memberId: this.memberId,
                        pw: this.password,
                        nickname: this.nickname,
                        email: this.email
                    })
                    .then(response => {
                        if(response.status === 200){
                            alert("회원가입이 완료되었습니다.");

                            this.$router.push('/');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            }
        }
    },
    watch:{
        // 아이디, 닉네임, 이메일, 인증 코드 확인 및 인증 후 재수정하면 인증 초기화 
        memberId: function(){
            this.validMemberId = false;
        },
        nickname: function(){
            this.validNickname = false;
        },
        email: function(){
            this.validEmail = false;
        },
        inputCode: function(){
            this.validEmail = false;
        },
    }
})
</script>


<style>
    .div-SignUp-container{ /* 회원가입 양식을 담을 div */
        padding-top: 6.5%; /* 상단 패딩 */
        margin-bottom: 5%; /* 하단 마진 */
        /* 회원가입 양식 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-SignUp-signup{ /* 회원가입 양식 전체를 담을 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 30%; /* 너비 지정 */
        padding: 3%; /* 상하좌우 간격 조절 */
        font-size: 0.8rem; /* 폰트 크기 */
    }
    .label-SignUp-id, .label-SignUp-pw, .label-SignUp-nickname, .label-SignUp-email{
        /* 아이디, 비밀번호, 닉네임, 이메일 label 폰트 굵게 */
        font-weight: bold;
    }
    .div-SignUp-id, .div-SignUp-nickname, .div-SignUp-email, .div-SignUp-authcode{
        /* 아이디, 닉네임, 이메일, 인증코드 각 div 내부 input 및 button 정렬 */
        display: flex;
        justify-content: space-between;
        margin-bottom: 5%;
    }
    .div-SignUp-pw{
        /* 비밀번호 입력 input + 비밀번호 확인 input 세로 정렬 */
        display: flex;
        flex-direction: column;
    }
    .input-SignUp-id, .input-SignUp-nickname, .input-SignUp-email, .input-SignUp-authcode{
        /* 아이디, 닉네임, 이메일, 인증코드 각 input의 너비 지정 */
        width: 70%;
    }
    .button-SignUp-id, .button-SignUp-nickname, .button-SignUp-email, .button-SignUp-authcode{
        /* 아이디, 닉네임, 이메일, 인증코드 각 버튼의 너비 및 색 지정 */
        width: 25%;
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .button-SignUp-id:hover, .button-SignUp-nickname:hover, .button-SignUp-email:hover, .button-SignUp-authcode:hover{
        /* 아이디, 닉네임, 이메일, 인증코드 각 버튼의 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    .div-SignUp-confirm{
        /* 버튼 위에 마진 추가 */
        margin-top: 12%;
    }
    .button-SignUp-confirm{
        /* 확인 버튼 너비 및 색 지정 */
        width: 100%;
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .button-SignUp-confirm:hover{
        /* 확인 버튼 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    /* 너비가 992 이하 시 div 재조정 */
    @media screen and (max-width: 992px){
        .div-SignUp-signup{
            width: 50%;
        }
    }
    /* 너비가 576 이하 시 div 재조정 */
    @media screen and (max-width: 576px){
        .div-SignUp-signup{
            width: 70%;
        }
    }
</style>