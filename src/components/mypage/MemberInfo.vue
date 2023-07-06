<template>
    <!-- 회원정보 수정 form을 담을 div -->
    <div class="div-MemberInfo-container">
        <!-- 회원정보 수정 양식 프레임 div -->
        <div class="div-MemberInfo-modifying">
            <!-- 수정 버튼 클릭 시 updatePassword 메소드 호출 -->
            <form @submit.prevent="updatePassword">
                <div>
                    <h1 class="h3 mb-3 font-weight-normal">회원정보 수정</h1><br>
                </div>
                <div>
                    <p>비밀번호를 변경할 수 있습니다.</p><br>
                </div>
                <div class="div-MemberInfo-id">
                    <label for="id-p-MemberInfo-id" class="sr-only label-MemberInfo-id">아이디</label>
                    <p id="id-p-MemberInfo-id">&nbsp;&nbsp;{{this.memberInfo.memberId}}</p><br><br>
                </div>
                <div class="div-MemberInfo-nickname">
                    <label for="id-p-MemberInfo-nickname" class="sr-only label-MemberInfo-nickname">닉네임</label>
                    <p id="id-p-MemberInfo-nickname">&nbsp;&nbsp;{{this.memberInfo.nickname}}</p><br><br>
                </div>
                <div class="div-MemberInfo-email">
                    <label for="id-p-MemberInfo-email" class="sr-only label-MemberInfo-email">이메일</label>
                    <p id="id-p-MemberInfo-email">&nbsp;&nbsp;{{this.memberInfo.email}}</p><br><br>
                </div>
                <label for="id-div-MemberInfo-pw" class="sr-only label-MemberInfo-pw">비밀번호 변경</label><br><br>
                <div id="id-div-MemberInfo-pw">
                    <!-- 패턴 지정으로 비밀번호 유효성 검사, tempPassword1과 tempPassword2는 일치하는지 확인하는 데 사용 -->
                    <input v-model="tempPassword1" type="password" class="form-control" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" placeholder="신규 비밀번호" required><br>
                    <input v-model="tempPassword2" type="password" class="form-control" pattern="(?=.*[0-9])(?=.*[!@#$%^&amp;*()_+=\[\]{}~?:;`|/]).*" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" placeholder="비밀번호 확인" required><br>
                    <!-- password는 현재 비밀번호 -->
                    <input v-model="password" type="password" class="form-control" placeholder="현재 비밀번호" required><br>
                    <div class="div-MemberInfo-delAcc">
                        <!-- 회원탈퇴 클릭 시 회원탈퇴 페이지로 이동 -->
                        <router-link to="/deletingAccount" class="router-MemberInfo-delAcc">회원탈퇴</router-link>
                    </div><br>
                </div>
                <div>
                    <button class="btn btn-lg btn-primary btn-block button-MemberInfo-mod" type="submit">수정</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            memberInfo: [], // 회원정보 저장
            password: '', // 현재 비밀번호
            newPassword: '', // 새로운 비밀번호
            tempPassword1: '',
            tempPassword2: '',
        }
    },
    methods:{
        // 회원정보 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async getMember(){
            try {
                // accessToken으로 get 요청
                const getMemberResponse = await axios.get('http://localhost:8090/api/member', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                })

                 // 응답 결과 유효하지 않은 acccessToken인 경우
                if(getMemberResponse.data === 'invalidAccessToken'){
                    // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                    localStorage.removeItem("accessToken");

                    // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
                    // axios의 동기적 동작을 위해 async/await 사용
                    // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                    const getNewAccessTokenResponse = await axios.get('http://localhost:8090/api/member/accesstoken', {
                        withCredentials: true
                    })

                    // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                    if(getNewAccessTokenResponse.data === 'invalidRefreshToken'){
                        // 로그인 만료 알림
                        alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                        // 유저에게 바로 로그인 페이지로 이동할지 묻기
                        if(confirm("다시 로그인하시겠습니까?")){
                            // 로그인 후 보고 있던 페이지로 돌아오기 위해 현재 페이지 경로 저장 
                            localStorage.setItem("previousPage", this.$route.fullPath);

                            // 확인 버튼 누른 경우 로그인 페이지로 이동
                            this.$router.push({path: "/signin"});
                        }

                        if(this.$route.path === "/mypage" || this.$route.path === "/admin"){
                            // 마이페이지 또는 관리페이지인 경우는 메인 페이지로 이동
                            this.$router.push({path: "/"});
                        }

                        // header 메뉴 갱신을 위해 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }else{
                        // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                        // 재발급 받은 accessToken 로컬 스토리지에 저장
                        localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                        // accessToken으로 get 재요청
                        const reGetMemberResponse = await axios.get('http://localhost:8090/api/member', {
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                        })

                        // accessToken이 유효한 경우 => 재요청 성공
                        if(reGetMemberResponse.data !== 'invalidAccessToken'){
                            // 회원정보 저장
                            this.memberInfo = reGetMemberResponse.data;
                        }
                    }
                }else{
                    // 회원정보 저장
                    this.memberInfo = getMemberResponse.data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 비밀번호 변경 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async updatePassword(){
            if(this.tempPassword1 !== this.tempPassword2){
                alert("신규 비밀번호와 비밀번호 확인의 내용이 다릅니다.");
            }else{
                this.newPassword = this.tempPassword1; // 새 비밀번호

                try {
                    // accessToken + 회원 아이디 + 비밀번호로 put 요청
                    const updatePasswordResponse = await axios.put('http://localhost:8090/api/member', {
                        memberId: this.memberInfo.memberId,
                        pw: this.newPassword
                    },{
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })

                    // 응답 결과 유효하지 않은 acccessToken인 경우
                    if(updatePasswordResponse.data === 'invalidAccessToken'){
                        // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                        localStorage.removeItem("accessToken");

                        // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
                        // axios의 동기적 동작을 위해 async/await 사용
                        // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                        const getNewAccessTokenResponse = await axios.get('http://localhost:8090/api/member/accesstoken', {
                            withCredentials: true
                        })

                        // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                        if(getNewAccessTokenResponse.data === 'invalidRefreshToken'){
                            // 로그인 만료 알림
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                            // 유저에게 바로 로그인 페이지로 이동할지 묻기
                            if(confirm("다시 로그인하시겠습니까?")){
                                // 로그인 후 보고 있던 페이지로 돌아오기 위해 현재 페이지 경로 저장 
                                localStorage.setItem("previousPage", this.$route.fullPath);

                                // 확인 버튼 누른 경우 로그인 페이지로 이동
                                this.$router.push({path: "/signin"});
                            }

                            if(this.$route.path === "/mypage" || this.$route.path === "/admin"){
                                // 마이페이지 또는 관리페이지인 경우는 메인 페이지로 이동
                                this.$router.push({path: "/"});
                            }

                            // header 메뉴 갱신을 위해 새로고침
                            this.$router.go(this.$router.currentRoute);
                        }else{
                            // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                            // 재발급 받은 accessToken 로컬 스토리지에 저장
                            localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                            // accessToken + 회원 아이디 + 비밀번호로 put 재요청
                            const reUpdatePasswordResponse = await axios.put('http://localhost:8090/api/member', {
                                memberId: this.memberInfo.memberId,
                                pw: this.newPassword
                            },{
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // accessToken이 유효한 경우 => 재요청 성공
                            if(reUpdatePasswordResponse.data !== 'invalidAccessToken'){
                                alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
                                
                                localStorage.removeItem("accessToken"); // 로컬 스토리지에서 accessToken 삭제
                                this.$router.push({path: "/signin"}); // 로그인 페이지로 이동
                                this.$router.go(this.$router.currentRoute); // 새로고침
                            }
                        }
                    }else{
                        alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
                        
                        localStorage.removeItem("accessToken"); // 로컬 스토리지에서 accessToken 삭제
                        this.$router.push({path: "/signin"}); // 로그인 페이지로 이동
                        this.$router.go(this.$router.currentRoute); // 새로고침
                    }
                } catch (error) {
                    console.log(error);
                }
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
    .div-MemberInfo-modifying{ /* 회원정보 수정 양식 프레임 div */
        width: 30%; /* 너비 지정 */
        padding: 2%; /* 상하좌우 간격 조절 */
        font-size: 0.8rem; /* 폰트 크기 */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
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
    }
    .button-MemberInfo-mod:hover{ /* 버튼 마우스오버시 색 변경 */
        background-color: white;
        border-color: white;
        color: black;
    }
    /* width가 992px 이하 시 재설정 */
    @media screen and (max-width: 992px){
        .div-MemberInfo-modifying{
            width: 60%;
        }
    }
</style>