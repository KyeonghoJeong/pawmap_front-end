<template>
    <div class="div-DeletingAccount-container">
        <div class="div-DeletingAccount-deletingaccount">
            <!-- 확인 버튼 클릭 시 deleteAccount 메소드 호출 -->
            <form @submit.prevent="deleteAccount">
                <h1 class="h3 mb-3 font-weight-normal">회원탈퇴</h1><br>
                
                <p>회원탈퇴를 위해 비밀번호를 입력해주세요.</p><br>
                
                <label for="id-div-DeletingAccount-pw" class="sr-only label-DeletingAccount-pw">비밀번호</label><br><br>
                <div id="id-div-DeletingAccount-pw">
                    <!-- password1와 password2에 비밀번호 입력, 비밀번호 확인 값 저장 -->
                    <input v-model="password1" type="password" class="form-control" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" placeholder="비밀번호 입력" required><br>
                    <input v-model="password2" type="password" class="form-control" oninvalid="setCustomValidity('비밀번호는 8글자 이상으로 숫자와 특수문자를 반드시 포함시켜주세요.')" oninput="setCustomValidity('')" placeholder="비밀번호 확인" required><br>
                </div>

                <div class="div-DeletingAccount-confirm">
                    <button class="btn btn-lg btn-primary btn-block button-DeletingAccount-confirm" type="submit">확인</button>
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
            password: '', // 최종 입력 비밀번호
            password1: '', // 입력 비밀번호 1
            password2: '', // 입력 비밀번호 2
        }
    },
    methods:{
        // 회원탈퇴 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async deleteAccount(){
            if(this.password1 !== this.password2){
                // 비밀번호 입력 값과 비밀번호 확인 값이 다를 때
                alert("비밀번호가 같지 않습니다.");
            }else{
                // 비밀번호 입력 값과 비밀번호 확인 값이 같을 때
                if(confirm("정말 회원탈퇴 하시겠습니까?")){
                    this.password = this.password1;

                    try {
                        // accessToken + 입력 비밀번호로 회원탈퇴 put 요청
                        const deleteAccountResponse = await axios.put('http://localhost:8090/api/member/deletion-date', {
                            pw: this.password
                        },{
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                        })

                        // 응답 결과 유효하지 않은 acccessToken인 경우
                        if(deleteAccountResponse.data === 'invalidAccessToken'){
                            // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
                            // axios의 동기적 동작을 위해 async/await 사용
                            // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                            const getNewAccessTokenResponse = await axios.get('http://localhost:8090/api/auth/access-token', {
                                withCredentials: true
                            })

                            // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                            if(getNewAccessTokenResponse.data === 'invalidRefreshToken'){
                                // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                                localStorage.removeItem("accessToken");
                                localStorage.removeItem("role");

                                // 로그인 만료 알림
                                alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                                // header 메뉴 갱신을 위해 새로고침
                                this.$router.go(this.$router.currentRoute);
                            }else{
                                // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                                // 재발급 받은 accessToken 로컬 스토리지에 저장
                                localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                                // accessToken + 입력 비밀번호로 회원탈퇴 put 재요청
                                const reDeleteAccountResponse = await axios.put('http://localhost:8090/api/member/deletion-date', {
                                    pw: this.password
                                },{
                                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                                })

                                // accessToken이 유효한 경우 => 재요청 성공
                                if(reDeleteAccountResponse.data !== 'invalidAccessToken'){
                                    // 이전 과정에서 토큰 인증되었으므로 바로 토큰 검증없이 삭제 요청
                                    const deleteBookmarksResponse = await axios.delete('http://localhost:8090/api/member/bookmarks', {
                                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                                    });

                                    // 요청 및 응답 성공 시
                                    if(deleteBookmarksResponse.status === 200){
                                        alert("회원탈퇴가 완료되었습니다.");

                                        // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                                        localStorage.removeItem("accessToken");
                                        localStorage.removeItem("role");

                                        this.$router.go(this.$router.currentRoute); // 새로고침
                                    }
                                }
                            }   
                        }else{
                            // 이전 과정에서 토큰 인증되었으므로 바로 토큰 검증없이 삭제 요청
                            const deleteBookmarksResponse = await axios.delete('http://localhost:8090/api/member/bookmarks', {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            });

                            // 요청 및 응답 성공 시
                            if(deleteBookmarksResponse.status === 200){
                                alert("회원탈퇴가 완료되었습니다.");

                                // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                                localStorage.removeItem("accessToken");
                                localStorage.removeItem("role");

                                this.$router.go(this.$router.currentRoute); // 새로고침
                            }
                        }
                    } catch (error) {
                        if(error.response.status === 403){
                            alert("잘못된 비밀번호입니다.");
                        }else{
                            console.log(error);
                        }
                    }
                }
            }
        }
    },
}
</script>

<style>
    .div-DeletingAccount-container{ /* 회원탈퇴 양식을 담을 div */
        padding-top: 6.5%; /* 상단 패딩 */
        margin-bottom: 5%; /* 하단 마진 */
        /* 회원탈퇴 양식 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-DeletingAccount-deletingaccount{ /* 회원탈퇴 양식 전체를 담을 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 30%; /* 너비 지정 */
        padding: 3%; /* 상하좌우 간격 조절 */
        font-size: 0.8rem; /* 폰트 크기 */
    }
    .label-DeletingAccount-pw {
        /* 비밀번호 label 폰트 굵게 */
        font-weight: bold;
    }
    .div-DeletingAccount-confirm{
        /* 버튼 위에 마진 추가 */
        margin-top: 7%;
    }
    .button-DeletingAccount-confirm{
        /* 확인 버튼 너비 및 색 지정 */
        width: 100%;
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .button-DeletingAccount-confirm:hover{
        /* 확인 버튼 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    /* 너비가 992 이하 시 div 재조정 */
    @media screen and (max-width: 992px){
        .div-DeletingAccount-deletingaccount{
            width: 50%;
        }
    }
    /* 너비가 576 이하 시 div 재조정 */
    @media screen and (max-width: 576px){
        .div-DeletingAccount-deletingaccount{
            width: 70%;
        }
    }
</style>