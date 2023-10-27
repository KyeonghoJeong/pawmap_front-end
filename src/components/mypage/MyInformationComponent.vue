<template>
    <!-- 회원정보 수정 form을 담을 div -->
    <div class="div-MemberInfo-container">
        <!-- 회원정보 수정 양식 프레임 div -->
        <div class="div-MemberInfo-memberinfo">
            <!-- 수정 버튼 클릭 시 updatePassword 메소드 호출 -->
            <form @submit.prevent="updatePassword">
                <h1 class="h3 mb-3 font-weight-normal">회원정보 수정</h1><br>
                
                <p>비밀번호를 변경할 수 있습니다.</p><br>
                
                <div class="div-MemberInfo-id">
                    <label for="id-p-MemberInfo-id" class="sr-only label-MemberInfo-id">아이디&nbsp;&nbsp;</label>
                    <p id="id-p-MemberInfo-id">{{this.member.memberId}}</p><br><br>
                </div>
                
                <div class="div-MemberInfo-nickname">
                    <label for="id-p-MemberInfo-nickname" class="sr-only label-MemberInfo-nickname">닉네임&nbsp;&nbsp;</label>
                    <p id="id-p-MemberInfo-nickname">{{this.member.nickname}}</p><br><br>
                </div>
                
                <div class="div-MemberInfo-email">
                    <label for="id-p-MemberInfo-email" class="sr-only label-MemberInfo-email">이메일&nbsp;&nbsp;</label>
                    <p id="id-p-MemberInfo-email">{{this.member.email}}</p><br><br>
                </div>
                
                <label for="id-div-MemberInfo-pw" class="sr-only label-MemberInfo-pw">비밀번호 변경</label><br><br>
                
                <div id="id-div-MemberInfo-pw">
                    <!-- 패턴 지정으로 비밀번호 유효성 검사, password1과 password2는 일치하는지 확인하는 데 사용 -->
                    <input v-model="password1" type="password" class="form-control" oninvalid="setCustomValidity('비밀번호는 8글자 이상의 영어 알파벳, 숫자, 특수문자의 조합으로 만들어주세요.')" oninput="setCustomValidity('')" placeholder="신규 비밀번호" required><br>
                    <input v-model="password2" type="password" class="form-control" oninvalid="setCustomValidity('비밀번호는 8글자 이상의 영어 알파벳, 숫자, 특수문자의 조합으로 만들어주세요.')" oninput="setCustomValidity('')" placeholder="비밀번호 확인" required><br>
                    <!-- password는 현재 비밀번호 -->
                    <input v-model="password" type="password" class="form-control" placeholder="현재 비밀번호" required><br>
                    <div class="div-MemberInfo-delAcc">
                        <!-- 회원탈퇴 클릭 시 회원탈퇴 페이지로 이동 -->
                        <router-link to="/my-page/delete-account" class="router-MemberInfo-delAcc">회원탈퇴</router-link>
                    </div><br>
                </div>
                
                <button class="btn btn-lg btn-primary btn-block button-MemberInfo-mod" type="submit">확인</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            member: '', // 회원정보 저장
            password: '', // 현재 비밀번호
            newPassword: '', // 새로운 비밀번호
            password1: '',
            password2: '',
        }
    },
    methods:{
        // accessToken 재발급 메소드
        async getAccessToken(){
            // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
            // axios의 동기적 동작을 위해 async/await 사용
            try {
                // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                const getAccessTokenResponse = await axios.get('http://localhost:8090/api/auth/access-token', {
                    withCredentials: true
                })

                // 200 => 요청 성공
                if(getAccessTokenResponse.status === 200){
                    // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우
                    // 재발급 받은 accessToken 로컬 스토리지에 저장
                    localStorage.setItem("accessToken", getAccessTokenResponse.data.accessToken);

                    return true; // 성공 => true 리턴
                }
            } catch (error) {
                // 403 => refreshToken 토큰 만료
                if(error.response.status === 403){
                    // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("role");
                }

                return false; // 실패 => false 리턴
            }
        },
        // 회원정보 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async getMember(){
            try {
                // accessToken으로 get 요청
                const getMemberResponse = await axios.get('http://localhost:8090/api/member', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                })

                // 200 => 요청 성공
                if(getMemberResponse.status === 200){
                    this.member = getMemberResponse.data; // 회원정보 저장
                }
            } catch (error) {
                // 403 => accessToken 토큰 만료
                if(error.response.status === 403){
                    // accessToken 재발급 메소드 호출 => true면 성공
                    const isNewAccessTokenLoaded = await this.getAccessToken();
                    
                    if(isNewAccessTokenLoaded){
                        try {
                            // accessToken으로 get 재요청
                            const reGetMemberResponse = await axios.get('http://localhost:8090/api/member', {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // 200 => 재요청 성공
                            if(reGetMemberResponse.status === 200){
                                this.member = reGetMemberResponse.data; // 회원정보 저장
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }else{
                        // 로그인 만료 알림
                        alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                        // header 메뉴 갱신을 위해 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }
                }
            }
        },
        // 비밀번호 변경 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async updatePassword(){
            // 패스워드 패턴은 영어 알파벳 + 숫자 + 특수문자 각각을 하나 이상 반드시 포함
            const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-+-={}|,.<>/?\\[\]])[a-zA-Z0-9!@#$%^&*()-+-={}|,.<>/?\\[\]]+$/;
            const minLength = 8;

            if(this.password1 === this.password2) {
                this.newPassword = this.password1; // 새 비밀번호

                if(pattern.test(this.newPassword) && this.newPassword.length >= minLength){
                    // 패턴에 부합하고 최소 길이보다 길 때 비밀번호 수정 put 요청
                    try {
                        // accessToken + 회원 아이디 + 비밀번호로 put 요청
                        const updatePasswordResponse = await axios.put('http://localhost:8090/api/member/pw', {
                            pw: this.password,
                            newPw: this.newPassword
                        },{
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                        })

                        // 200 => 요청 성공
                        if(updatePasswordResponse.status === 200){
                            if(updatePasswordResponse.data === true){
                                // true => 입력한 현재 비밀번호가 일치하는 경우
                                alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
                                
                                // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                                localStorage.removeItem("accessToken");
                                localStorage.removeItem("role");

                                // header 메뉴 갱신을 위해 새로고침
                                this.$router.go(this.$router.currentRoute);
                            }else{
                                // false => 입력한 현재 비밀번호가 일치하지 않는 경우
                                alert("현재 비밀번호가 잘못되었습니다.");
                            }
                        }
                    } catch (error) {
                        // 403 => accessToken 토큰 만료
                        if(error.response.status === 403){
                            // accessToken 재발급 메소드 호출 => true면 성공
                            const isNewAccessTokenLoaded = await this.getAccessToken();
                            
                            if(isNewAccessTokenLoaded){
                                try {
                                    // accessToken + 회원 아이디 + 비밀번호로 put 재요청
                                    const reUpdatePasswordResponse = await axios.put('http://localhost:8090/api/member/pw', {
                                        pw: this.password,
                                        newPw: this.newPassword
                                    },{
                                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                                    })

                                    // 200 => 재요청 성공
                                    if(reUpdatePasswordResponse.status === 200){
                                        if(reUpdatePasswordResponse.data === true){
                                            // true => 입력한 현재 비밀번호가 일치하는 경우
                                            alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
                            
                                            // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                                            localStorage.removeItem("accessToken");
                                            localStorage.removeItem("role");

                                            // header 메뉴 갱신을 위해 새로고침
                                            this.$router.go(this.$router.currentRoute);
                                        }else{
                                            // false => 입력한 현재 비밀번호가 일치하지 않는 경우
                                            alert("현재 비밀번호가 잘못되었습니다.");
                                        }
                                    }
                                } catch (error) {
                                    console.log(error);
                                }
                            }else{
                                // 로그인 만료 알림
                                alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                                // header 메뉴 갱신을 위해 새로고침
                                this.$router.go(this.$router.currentRoute);
                            }
                        }
                    }
                }else{
                    // 패턴에 부합하지 않고 최소 길이보다 작을 때 false 리턴
                    if(!pattern.test(this.newPassword)){
                        alert("비밀번호는 영어 알파벳, 숫자, 특수문자의 조합으로 만들어주세요.");
                    }else if(this.newPassword.length < minLength){
                        alert("비밀번호는 8글자 이상으로 만들어주세요.");
                    }
                }
            }else{
                // 두 입력 비밀번호가 다른 경우
                alert("신규 비밀번호와 비밀번호 확인의 내용이 다릅니다.");

                // false => 실제 현재 비밀번호와 입력한 현재 비밀번호가 일치하지 않는 경우
                //alert("현재 비밀번호가 잘못되었습니다.");
            }
        }
    },
    mounted(){
        this.getMember();
    }
}
</script>

<style>
    .div-MemberInfo-container{ /* 회원정보 수정 form을 담을 div */
        /* 회원정보 수정 양식 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1%;
    }
    .div-MemberInfo-memberinfo{ /* 회원정보 수정 양식 프레임 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 30%; /* 너비 지정 */
        padding: 3%; /* 상하좌우 간격 조절 */
        font-size: 0.8rem; /* 폰트 크기 */
    }
    .div-MemberInfo-id, .div-MemberInfo-nickname, .div-MemberInfo-email{
        /* 내부 label, p 정렬 */
        display: flex;
        /* justify-content: space-between; */
    }
    .label-MemberInfo-id, .label-MemberInfo-nickname, .label-MemberInfo-email, .label-MemberInfo-pw{
        font-weight: bold; /* label 폰트 굵기 */
    }
    .div-MemberInfo-delAcc{ /* 내부 회원탈퇴 메뉴 정렬 */
        display:flex; justify-content: flex-end; /* 오른쪽 끝에 정렬 */
    }
    .router-MemberInfo-delAcc{ /* 회원탈퇴 메뉴 */
        margin-left: auto;
        color: black;
        font-weight: bold;
        text-decoration: none;
    }
    .button-MemberInfo-mod{ /* 수정 버튼 색, 사이즈 변경 */
        width: 100%;
        background-color: #fd7e14;
        border-color: #fd7e14;
        color: white;
    }
    .button-MemberInfo-mod:hover{ /* 버튼 마우스오버시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    /* width가 992px 이하 시 재설정 */
    @media screen and (max-width: 992px){
        .div-MemberInfo-memberinfo{
            width: 50%;
        }
    }
    /* 너비가 576 이하 시 div 재조정 */
    @media screen and (max-width: 576px){
        .div-MemberInfo-email{
            display: none;
        }
        .div-MemberInfo-memberinfo{
            width: 70%;
        }
    }
</style>