<template>
    <div class="div-SignIn-container">
        <div class="div-SignIn-signin">
            <form @submit.prevent="signIn">
                <h1 class="h3 mb-3 font-weight-normal">로그인</h1><br>
                
                <p>서비스 이용을 위해 로그인해주세요.</p><br>
                
                <label for="id-input-SignIn-id" class="sr-only label-SignIn-id">아이디</label>
                
                <input type="text" id="id-input-SignIn-id" v-model="memberId" class="form-control" placeholder="아이디 입력" required autofocus><br>
                
                <label for="id-input-SignIn-pw" class="sr-only label-SignIn-pw">비밀번호</label>
                
                <input type="password" id="id-input-SignIn-pw" v-model="password" class="form-control" placeholder="비밀번호 입력" required><br>
                
                <div class="div-SignIn-features">
                    <label><input type="checkbox" v-model="checkedId"> 아이디 저장</label>
                    <router-link to="/signup" class="router-SignIn-signup">회원가입</router-link>
                </div>
                
                <button class="btn btn-lg btn-primary btn-block button-SignIn-signin" type="submit">확인</button>
            </form>
        </div>
  </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            memberId: '', // 회원 아이디
            password: '', // 비밀번호
            checkedId: '', // 아이디 저장 여부
        }
    },
    methods:{
        // 로그인 요청 메소드
        signIn(){
            if(this.checkedId === true){
                // 아이디 저장 체크한 경우 로컬 스토리지에 저장
                localStorage.setItem("memberId", this.memberId);
            }else{
                // 체크 해제하고 로그인하는 경우 이전에 로컬 스토리지에 저장한 아이디 삭제
                localStorage.removeItem("memberId");
            }

            const previousPage = localStorage.getItem("previousPage"); // 로컬 스토리지에 이전 페이지 저장

            // 회원 아이디와 비밀번호로 로그인 요청
            axios.post('http://localhost:8090/api/member/signin', {
                memberId: this.memberId,
                pw: this.password
            },{
                withCredentials: true // cookie로 refershToken을 받기위해 필요
            })
            .then(response => {
                // 로컬 스토리지에 accessToken, 권한 저장
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("authority", response.data.authority);

                if(previousPage === '' || previousPage === '/signup'){
                    // 이전 페이지가 없거나 회원가입 페이지인 경우 메인 페이지로 이동
                    this.$router.push({path: '/'});
                }else{
                    // 이전 페이지가 있는 경우 이전 페이지로 이동
                    this.$router.push(previousPage);
                }

                // 헤더 메뉴 갱신을 위해 새로고침
                this.$router.go(this.$router.currentRoute);
            })
            .catch(error => {
                if(error.response.status === 403){
                    alert("아이디 또는 비밀번호가 잘못되었거나 존재하지 않는 회원입니다.");

                    localStorage.removeItem("memberId"); // 로그인 실패 시 저장했던 아이디 삭제
                }
            })

            localStorage.removeItem("previousPage"); // 로그인 완료 후 로컬 스토리지에서 이전 페이지 삭제
        }
    },
    mounted(){
        // 이미 로그인 되어 있는 경우 로그인 페이지로의 접근을 막기 위해 한 페이지 전으로 이동
        if(localStorage.getItem("accessToken") !== null){
            this.$router.go(-1);
        }

        // 저장된 아이디가 있는 경우 input에 출력 (v-model)
        if(localStorage.getItem("memberId") !== null) {
            this.memberId = localStorage.getItem("memberId");
            this.checkedId = true;
        }
    }
}
</script>

<style>
    .div-SignIn-container{ /* 로그인 양식을 담을 div */
        padding-top: 6.5%; /* 상단 패딩 */
        /* 로그인 양식 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-SignIn-signin{ /* 로그인 양식 전체를 담을 div */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
        width: 30%; /* 너비 지정 */
        padding: 3%; /* 상하좌우 간격 조절 */
        font-size: 0.8rem; /* 폰트 크기 */
    }
    .label-SignIn-id, .label-SignIn-pw{ /* 아이디, 비밀번호 폰트 굵게 */
        font-weight: bold;
    }
    .div-SignIn-features{ /* 아이디 저장, 회원가입 메뉴 정렬, 하단 패딩  */
        display: flex;
        margin-bottom: 20px;
    }
    .router-SignIn-signup{
        margin-left: auto; /* 제일 오른쪽에 위치 */
        /* 색, 굵기, 밑줄 제거 */
        color: black;
        font-weight: bold;
        text-decoration: none;
    }
    .button-SignIn-signin{ /* 버튼 너비, 색, 테두리 색 변경 */
        width: 100%;
        background-color: #fd7e14;
        border-color: #fd7e14;
    }
    .button-SignIn-signin:hover{ /* 버튼 마우스오버 시 색, 테두리 색, 글자 색 변경 */
        background-color: white;
        border-color: #fd7e14;
        color: black;
    }
    /* 너비가 992 이하 시 div 재조정 */
    @media screen and (max-width: 992px){
        .div-SignIn-signin{
            width: 50%;
        }
    }
    /* 너비가 576 이하 시 div 재조정 */
    @media screen and (max-width: 576px){
        .div-SignIn-signin{
            width: 70%;
        }
    }
</style>