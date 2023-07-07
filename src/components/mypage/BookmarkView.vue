<template>
    <!-- 북마크 테이블 div, 버튼 div, pagination div를 담을 컨테이너 div -->
    <div class="div-bookmark-container">
        <!-- 북마크 테이블 div -->
        <div class="div-bookmark-table">
            <table class="table table-hover table-bordered table-sm">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="th-bookmark-cat">카테고리</th>
                    <th scope="col" class="th-bookmark-name">이름</th>
                    <th scope="col" class="th-bookmark-addr">주소</th>
                    <th scope="col" class="th-bookmark-del">삭제</th>
                </tr>
            </thead>
            <tbody>
                <!-- 북마크 수만큼 반복, 인덱스 포함-->
                <tr v-for="(bookmarkInfo, index) in bookmarks" :key="bookmarkInfo.facilityId">
                    <th scope="row" class="th-bookmark-cat">{{bookmarkInfo.cat}}</th>
                    <td class="th-bookmark-name">{{bookmarkInfo.facilityName}}</td>
                    <td>{{bookmarkInfo.roadAddr}}</td>
                    <!-- 배열에 체크박스로 체크한 북마크의 인덱스로 v-model로 값 저장 -->
                    <td class="th-bookmark-del"><input class="form-check-input" type="checkbox" :value="bookmarkInfo.facilityId" v-model="checkedBookmarkIndex[index]"></td>
                </tr>
            </tbody>
            </table>
        </div>
        <!-- 버튼 div -->
        <div class="div-bookmark-btn">
            <button type="button" class="btn btn-bookmark-del" @click="deleteBookmark">삭제</button>
        </div>
        <!-- 페이지네이션 메뉴를 담고 정렬하기 위한 div -->
        <div class="div-bookmark-pagination">
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
                        <button class="page-link" @click="getBookmarks(i-1)">{{i}}</button>
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
            bookmarks: [], // 회원이 등록한 북마크를 저장할 배열
            checkedBookmarkIndex: [], // 체크박스로 체크한 북마크의 인덱스로 값을 저장할 배열
            checkedBookmarks: [], // 삭제할 북마크를 저장할 배열
            totalPages: '', // 총 북마크 페이지 수
            pageActive: 1, // pagination 초기 선택 페이지
            startNum: 0, // pagination 초기 시작 숫자 
            endNum: 0, // pagination 초기 마지막 숫자
        }
    },
    methods:{
        // 회원이 등록한 북마크 요청 메소드
        // 동기적 동작을 위해 async 지정
        async getBookmarks(page){
            try {
                // accessToken으로 북마크 get 요청
                const getBookmarksResponse = await axios.get('http://localhost:8090/api/bookmarks', {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                    params: {page: page, size: 10}
                })

                // 응답 결과 유효하지 않은 acccessToken인 경우
                if(getBookmarksResponse.data === 'invalidAccessToken'){
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

                        // accessToken으로 북마크 get 재요청
                        const reGetBookmarksResponse = await axios.get('http://localhost:8090/api/bookmarks', {
                            headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                            params: {page: 0, size: 10}
                        })

                        // accessToken이 유효한 경우 => post 요청 성공
                        if(reGetBookmarksResponse.data !== 'invalidAccessToken'){
                            this.bookmarks = reGetBookmarksResponse.data.content;
                            this.totalPages = reGetBookmarksResponse.data.totalPages;
                        }
                    }
                }else{
                    this.bookmarks = getBookmarksResponse.data.content;
                    this.totalPages = getBookmarksResponse.data.totalPages;
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 회원이 등록한 북마크 삭제 메소드
        // 동기적 동작을 위해 async 지정
        async deleteBookmark(){
            if(confirm("정말 삭제하시겠습니까?")){
                // 삭제할 북마크 배열 초기화
                this.checkedBookmarks = [];

                // 현재 북마크 배열에 저장되어 있는 북마크 수 만큼 반복
                for(let i=0; i<this.bookmarks.length; i++){
                    if(this.checkedBookmarkIndex[i] === true){
                        // checkedBookmarkIndex[i]가 true이면 체크박스 체크를 의미
                        // checkedBookmarkIndex와 bookmarks의 인덱스는 같으므로 checkedBookmarks에 삭제할 북마크의 시설 id를 push
                        this.checkedBookmarks.push(this.bookmarks[i].facilityId);
                    }
                }

                try {
                    // accessToken + 체크한 시설 id로 delete 요청
                    const deleteBookmarkResponse = await axios.delete('http://localhost:8090/api/bookmark', {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                        data: this.checkedBookmarks
                    })

                    // 응답 결과 유효하지 않은 acccessToken인 경우
                    if(deleteBookmarkResponse.data === 'invalidAccessToken'){
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

                            // accessToken + 체크한 시설 id로 delete 재요청
                            const reDeleteBookmarkResponse = await axios.delete('http://localhost:8090/api/bookmark', {
                                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                                data: this.checkedBookmarks
                            })

                            // accessToken이 유효한 경우 => 재요청 성공
                            if(reDeleteBookmarkResponse.data !== 'invalidAccessToken'){
                                this.$router.go(this.$router.currentRoute); // 새로고침
                            }
                        }
                    }else{
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
            this.getBookmarks(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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
            this.getBookmarks(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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

        // 시작 번호 ~ 마지막 번호까지 1씩 증가시켜서 numbers 배열에 넣기 (ex: 1, 2, 3, 4, 5 / 6, 7, 8, 9, 10)
        for(let i=start; i<=end; i++){
            numbers.push(i);
        }

        return numbers; // numbers 리턴
      }
    },
    mounted(){
        this.getBookmarks(0);
    }
}
</script>

<style>
    /* 북마크 테이블 div, 버튼 div, pagination div를 담을 컨테이너 div */
    .div-bookmark-container{
        /* 북마크 테이블 div, 버튼 div, pagination div 가운데 세로 정렬 */
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    /* 북마크 테이블 div */
    .div-bookmark-table{
        width: 60%; /* 너비 지정 */
    }
    /* 테이블 항목 가운데 정렬 */
    .th-bookmark-cat, .th-bookmark-name, .th-bookmark-addr, .th-bookmark-del{
        text-align: center;
    }
    /* 각 테이블 항목 너비 조절 */
    .th-bookmark-cat{
        width: 20%;
    }
    .th-bookmark-name{
        width: 20%;
    }
    .th-bookmark-addr{
        width: 50%;
    }
    .th-bookmark-del{
        width: 10%;
    }
    /* 버튼 div */
    .div-bookmark-btn{
        width: 60%; /* 너비 지정 */
        /* 오른쪽 끝 정렬 */
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 15px;
    }
    /* 버튼 색, 크기 변경 */
    .btn-bookmark-del{
        width: 80px;
        background-color: #fd7e14; 
        color: white;
    }
    .div-bookmark-pagination{ /* pagination을 담을 div */
        width: 60%; /* 너비 설정 */
        display: flex; /* flex 정렬 */
        flex-direction: column; /* column 정렬 */
        align-items: center; /* pagination 가운데 정렬 */
    }
    .page-link{ /* pagination에서 이전/다음 버튼 제외한 각 버튼 */
        color: black;
    }
    .pagination .page-item.active .page-link {
        /* 콤마가 없으면 조합  */
        /* ul pagination => li page-item이 active일 때 => button page-link 색 변경 */
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
    }
</style>