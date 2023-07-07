<template>
    <!-- 테이블 div, pagination div, 검색 메뉴 div를 담을 컨테이너 div -->
    <div class="div-MemberManagement-container">
        <!-- 테이블 div -->
        <div class="div-MemberManagement-table">
            <table class="table table-hover table-bordered table-sm">
            <thead class="table-secondary">
                <!-- 게시판 헤더 설정 -->
                <!-- 각 클래스는 테이블 헤더 비율 설정 및 정렬을 위한 클래스 -->
                <tr>
                    <th scope="col" class="th-MemberManagement-id">아이디</th>
                    <th scope="col" class="th-MemberManagement-nickname">닉네임</th>
                    <th scope="col" class="th-MemberManagement-email">이메일</th>
                    <th scope="col" class="th-MemberManagement-ban">차단</th>
                </tr>
            </thead>
            <tbody>
                <!-- 테이블 row 반복문으로 출력 -->
                <!-- members는 백엔드로부터 받은 회원들의 정보 데이터 -->
                <tr v-for="member in members" :key="member.memberId">
                    <th scope="row" class="th-MemberManagement-id">{{member.memberId}}</th>
                    <td class="th-MemberManagement-nickname">{{member.nickname}}</td>
                    <td class="td-MemberManagement-email">{{member.email}}</td>
                    <!-- 해당 member 데이터의 banDate가 null인지 아닌지에 따라 다르게 출력 -->
                    <!-- 버튼 클릭 시 banMember 메소드 호출, 파라미터로 ban 또는 unban -->
                    <td class="th-MemberManagement-ban" v-if="member.banDate === null"><button type="button" class="btn btn-sm button-MemberManagement-ban" @click="banMember(member.memberId, 'ban')">차단</button></td>
                    <td class="th-MemberManagement-ban" v-if="member.banDate !== null"><button type="button" class="btn btn-sm button-MemberManagement-unban" @click="banMember(member.memberId, 'unban')">해제</button></td>
                </tr>
            </tbody>
            </table>
        </div>
        <!-- 테이블 하단 검색바, 셀렉트를 담을 div -->
        <div class="div-MemberManagement-bottom-container">
            <!-- 검색바 div와 셀렉트 div를 담고 정렬을 하기 위한 div -->
            <div class="div-MemberManagement-bottom-search">
                <!-- 검색바 비율(사이즈) 지정을 위한 div -->
                <div class="div-MemberManagement-bottom-input">
                    <!-- 검색 시 getArticlesByQuery 메소드 호출 -->
                    <form @submit.prevent="getMembersByQuery">
                        <div class="input-group">
                            <input type="text" class="form-control" aria-label="keyword" aria-describedby="basic-addon1" v-model="searchQuery">
                            <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
                <!-- 셀렉트 비율(사이즈) 지정을 위한 div -->
                <div class="div-MemberManagement-bottom-select">
                    <!-- selectedOption은 셀렉트에서 선택된 옵션값을 저장 -->
                    <select class="form-select" aria-label="Default select example" v-model="selectedOption">
                        <!-- select 메뉴 기본값 설정 -->
                        <option :value="'아이디'">아이디</option>
                        <!-- v-for을 사용하여 searchOptions에서 검색 옵션을 반복문으로 출력, 제목+내용 포함 X -->
                        <option v-for="option in searchOptions" :value="option" :key="option">{{ option }}</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- 페이지네이션 메뉴를 담고 정렬하기 위한 div -->
        <div class="div-MemberManagement-pagination">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <!-- computed에서 isPrevDisabled 계산 후 true면 비활성화, false면 활성화 -->
                    <!-- 클릭 시 setPrevPageNum 메소드 호출하여 새로 page 번호를 만들어 출력하고 해당하는 페이지의 게시글 출력 -->
                    <li class="page-item">
                        <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <!-- computed에서 pageNumbers 메소드로 만든 페이지 번호를 반복문으로 출력 -->
                    <!-- 페이지 번호 클릭 시 pageActive = i로 저장하고 둘이 같을 때 active 즉, 선택한 페이지 번호는 active로 출력 -->
                    <!-- 페이지 번호 클릭 시 getArticles 메소드에 해당하는 페이지 번호(i-1)의 게시글 데이터를 백엔드로부터 받아와 출력 -->
                    <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                        <button class="page-link" @click="getMembers(i-1)">{{i}}</button>
                    </li>

                    <!-- computed에서 isNextDisabled 계산 후 true면 비활성화, false면 활성화 -->
                    <!-- 클릭 시 setNextPageNum 메소드 호출하여 새로 page 번호를 만들어 출력하고 해당하는 페이지의 게시글 출력 -->
                    <li class="page-item">
                        <button :class="['page-link', isNextDisabled ? 'disabled' : '']" aria-label="Next" @click="setNextPageNum">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return{
            members: [], // 모든 회원 정보 저장
            totalPages: '', // 모든 회원 총 페이지 수
            pageActive: 1, // pagination 첫 활성 페이지
            startNum: 0, // pagination 시작 번호
            endNum: 0, // pagination 마지막 번호
            searchOptions: ['닉네임', '이메일'], // 검색 옵션
            selectedOption: '아이디', // 기본 검색 옵션
            memberId: '', // 회원 아이디
            nickname: '', // 닉네임
            email: '', // 이메일
            searchQuery: '', // 검색어
        }
    },
    methods:{
        // 모든 회원의 정보를 요청하는 메소드
        // 동기적 동작을 위해 async/await 사용
        async getMembers(page){
            try {
                // accessToken + 검색 옵션 + pagination 옵션으로 회원 정보 get 요청
                const getMembersResponse = await axios.get('http://localhost:8090/api/members', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                    params: {
                        memberId: this.memberId,
                        nickname: this.nickname,
                        email: this.email,
                        page: page, 
                        size: 10,
                    }
                })

                // 응답 결과 유효하지 않은 acccessToken인 경우
                if(getMembersResponse.data === 'invalidAccessToken'){
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

                        if(this.$route.path === "/mypage" || this.$route.path === "/deletingAccount" || this.$route.path === "/admin"){
                            // 마이페이지, 탈퇴페이지, 관리페이지인 경우는 메인 페이지로 이동
                            this.$router.push({path: "/"});
                        }

                        // header 메뉴 갱신을 위해 새로고침
                        this.$router.go(this.$router.currentRoute);
                    }else{
                        // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                        // 재발급 받은 accessToken 로컬 스토리지에 저장
                        localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                        // accessToken + 검색 옵션 + pagination 옵션으로 회원 정보 get 재요청
                        const reGetMembersResponse = await axios.get('http://localhost:8090/api/members', {
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                            params: {
                                memberId: this.memberId,
                                nickname: this.nickname,
                                email: this.email,
                                page: page, 
                                size: 10,
                            }
                        })

                        // accessToken이 유효한 경우 => 재요청 성공
                        if(reGetMembersResponse.data !== 'invalidAccessToken'){
                            // 회원 정보, 총 페이지 수 저장
                            this.members = reGetMembersResponse.data.content;
                            this.totalPages = reGetMembersResponse.data.totalPages;
                        }
                    }
                }else{
                    // 회원 정보, 총 페이지 수 저장
                    this.members = getMembersResponse.data.content;
                    this.totalPages = getMembersResponse.data.totalPages;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 검색어에 맞게 쿼리를 설정하고 회원 정보를 요청하는 메소드
        getMembersByQuery(){
            // selectedOption은 현재 선택한 셀렉트 옵션
            // searchQuery는 검색바에 검색한 내용

            if(this.selectedOption === '아이디'){
                this.memberId = this.searchQuery;

                this.nickname = '';
                this.email = '';
            }else if(this.selectedOption === '닉네임'){
                this.nickname = this.searchQuery;

                this.memberId = '';
                this.email = '';
            }else if(this.selectedOption === '이메일'){
                this.email = this.searchQuery;

                this.memberId = '';
                this.nickname = '';
            }

            this.pageActive = 1;

            this.getMembers(0);
        },
        // 회원 차단 요청 메소드
        // 동기적 동작을 위해 async/await 사용
        async banMember(memberId, order){
            // 회원 테이블의 banDate 칼럼이 null인 경우 => 차단 X
            // 회원 테이블의 banDate 칼럼에 날짜 데이터가 있는 경우 => 차단 O

            let word = '';

            // 차단 또는 차단 해제 확인 메시지 출력 용도
            if(order === 'ban'){
                word = '차단';
            }else{
                word = '차단 해제';
            }

            if(confirm("해당 회원을 "+word+"하시겠습니까?")){
                try {
                    // accessToken + 회원 아이디 + ban or unban 데이터로 put 요청
                    const banMemberResponse = await axios.put('http://localhost:8090/api/member/ban', {
                        memberId: memberId,
                        order: order,
                    }, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })

                    // 응답 결과 유효하지 않은 acccessToken인 경우
                    if(banMemberResponse.data === 'invalidAccessToken'){
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

                            if(this.$route.path === "/mypage" || this.$route.path === "/deletingAccount" || this.$route.path === "/admin"){
                                // 마이페이지, 탈퇴페이지, 관리페이지인 경우는 메인 페이지로 이동
                                this.$router.push({path: "/"});
                            }

                            // header 메뉴 갱신을 위해 새로고침
                            this.$router.go(this.$router.currentRoute);
                        }else{
                            // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                            // 재발급 받은 accessToken 로컬 스토리지에 저장
                            localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                            // accessToken + 회원 아이디 + ban or unban 데이터로 put 재요청
                            const reBanMemberResponse = await axios.put('http://localhost:8090/api/member/ban', {
                                memberId: memberId,
                                order: order,
                            }, {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                            })

                            // accessToken이 유효한 경우 => 재요청 성공
                            if(reBanMemberResponse.data !== 'invalidAccessToken'){
                                localStorage.setItem("adminQuery", "memberManagement"); // 뒤로가기 시 탭 설정 유지를 위해 저장

                                this.$router.go(this.$router.currentRoute); // 새로고침
                            }
                        }
                    }else{
                        localStorage.setItem("adminQuery", "memberManagement"); // 뒤로가기 시 탭 설정 유지를 위해 저장

                        this.$router.go(this.$router.currentRoute); // 새로고침
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        // 이전 버튼 클릭 시 startNum, endNum 재설정을 위한 메소드
        setPrevPageNum(){
            // isPrevDisabled()에 의해 startNum이 5 이하인 경우는 신경 X
            this.startNum = this.startNum - 5; // 시작 번호는 현재 시작 번호 - 5
            this.endNum = this.startNum + 4; // 마지막 번호는 현재 시작 번호 + 4
            this.pageActive = this.endNum; // 이전 버튼 클릭 시 선택 중인 페이지 표시를 위해 선택한 페이지 번호 리턴
            this.getMembers(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        // 다음 버튼 클릭 시 startNum, endNum 재설정을 위한 메소드
        setNextPageNum(){
            // 페이지를 처음 띄우는 경우 startNum은 0, endNum은 0이므로 startNum은 startNum + 6으로 설정
            // 페이지를 처음 띄우는 경우가 아닌 경우는 startNum은 endNum + 1
            if(this.endNum === 0){
                this.startNum = this.startNum + 6;
            }else{
                this.startNum = this.endNum + 1;
            }
            
            this.endNum = this.startNum + 4; // endNum은 startNum + 4
            // 마지막 페이지로 설정한 번호가 총 페이지 수를 넘는 경우 마지막 페이지 번호를 총 페이지 수로 설정
            if(this.endNum > this.totalPages){
                this.endNum = this.totalPages;
            }

            this.pageActive = this.startNum; // 다음 버튼을 누르면 첫 페이지 번호를 active
            this.getMembers(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
    },
    computed:{
      // 맨 첫 페이지 이전 버튼 동작 중지를 위해 startNum이 5 이하인 경우 false 리턴
      isPrevDisabled(){
        return this.startNum <= 5;
      },
      // startNum + 5를 하면 다음 페이지 배열의 시작 페이지 번호인데 총 페이지 수를 넘을 경우 false 리턴
      isNextDisabled(){
        if(this.startNum == 0){
            return this.startNum+6 > this.totalPages;
        }else{
            return this.startNum+5 > this.totalPages;
        }
      },
      // 페이지 5개 단위로 출력을 위해 numbers 배열에 5개씩 담아 리턴
      pageNumbers(){
        // startNum = 0, endNum = 0인 경우 고려
        // 이후 같은 패턴 반복

        let numbers = [];
        let start = this.startNum;
        let end = this.endNum;

        // startNum이 0이면 맨 처음 페이지 배열에 해당
        if(this.startNum === 0){
            start = 1; // 맨 처음 페이지 배열 시작 페이지 번호를 1로 설정
            end = this.totalPages; // 총 페이지 배열의 수가 하나를 넘지 않는 경우 시작 페이지의 마지막 번호를 총 페이지 수로 설정
            if(end > 5){ // 총 페이지 배열의 수가 하나 이상인 경우 시작 페이지의 마지막 번호를 첫 번째 페이지 배열의 마지막 번호인 5로 설정
                end = 5;
            }
        }

        for(let i=start; i<=end; i++){
            numbers.push(i);
        }

        return numbers;
      }
    },
    mounted(){
        this.getMembers(0);
    }
}
</script>

<style>
    .div-MemberManagement-container{
        /* 테이블, pagination, 검색 메뉴 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-MemberManagement-table{ /* 테이블 div */
        width: 60%; /* 너비 지정 */
    }
    /* 테이블 내부 아이디, 닉네임, 이메일, 차단 날짜, 차단 버튼 가운데 정렬 */
    .th-MemberManagement-id, .th-MemberManagement-nickname, .th-MemberManagement-email, .th-MemberManagement-ban{
        text-align: center;
    }
    /* 각 속성 비율 조정 */
    .th-MemberManagement-id{
        width: 20%;
    }
    .th-MemberManagement-nickname{
        width: 20%;
    }
    .th-MemberManagement-email{
        width: 20%;
    }
    .th-MemberManagement-ban{
        width: 20%;
    }
    .button-MemberManagement-ban, .button-MemberManagement-unban{ /* 차단, 해제 버튼 색 및 사이즈 변경 */
        width: 80px;
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .button-MemberManagement-ban:hover, .button-MemberManagement-unban:hover{ /* 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    .div-MemberManagement-bottom-container{
        width: 60%;
        display: flex; /* 하단 메뉴 div 정렬 */
        flex-direction: row-reverse;
        margin-bottom: 15px;
    }
    .div-MemberManagement-bottom-search{
        width: 50%; /* 검색 메뉴 50% + 글쓰기 버튼 50% */
        display: flex;
    }
    .div-MemberManagement-bottom-input{
        width: 57%; /* 검색바 60% + 셀렉트 40% */
        margin-right: 3%; /* 검색바와 셀렉트 사이의 간격 */
    }
    .div-MemberManagement-bottom-select{
        width: 40%; /* 검색바 60% + 셀렉트 40% */
    }
    .div-MemberManagement-pagination{ /* pagination을 담을 div */
        width: 60%; /* 너비 설정 */
        display: flex; /* flex 정렬 */
        flex-direction: column; /* column 정렬 */
        align-items: center; /* pagination 가운데 정렬 */
    }
    @media screen and (max-width: 992px){
        .div-MemberManagement-bottom-container{ /* 검색 div + 버튼 div를 담을 div */
            width: 60%; /* 너비 100%로 변경 */
            display: flex; /* flex 정렬로 변경 */
            flex-direction: column; /* column 정렬로 변경해서 검색 메뉴, select 메뉴 수직 정렬 */
            margin-bottom: 2%;
        }
        .div-MemberManagement-bottom-search{ /* 검색바 div + select div 담을 div */
            width: 100%; /* 너비 100%로 변경 */
        }
        .div-MemberManagement-bottom-input{ /* 검색바 div */
            width: 60%; /* 너비 70% */
        }
        .div-MemberManagement-bottom-select{ /* select div */
            width: 40%; /* 너비 30% */
        }
        .th-MemberManagement-id, .th-MemberManagement-email, .td-MemberManagement-email{
            /* 아이디, 이메일 감추기 */
            display: none;
        }
    }
</style>