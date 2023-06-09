<template>
    <div class="div-board-mine">
        <div class="div-board-table">
            <table class="table table-hover table-bordered table-sm div-board-table-table">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="writing-category">카테고리</th>
                    <th scope="col" class="writing-place">이름</th>
                    <th scope="col" class="writing-address">주소</th>
                    <th scope="col" class="writing-del">삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(bookmarkInfo, index) in bookmarkInfos" :key="bookmarkInfo.facilityId">
                    <th scope="row" class="category-in-board">{{bookmarkInfo.cat}}</th>
                    <td class="place-in-board">{{bookmarkInfo.facilityName}}</td>
                    <td>{{bookmarkInfo.roadAddr}}</td>
                    <td class="del-in-board"><input class="form-check-input" type="checkbox" :value="bookmarkInfo.facilityId" v-model="checkedBookmarks[index]"></td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="div-board-bottom-del-btn">
            <button type="button" class="btn div-board-bottom-btn-btn" @click="deleteBookmark">삭제</button>
        </div>
        <div class="div-board-paging">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                        <button class="page-link" @click="getBookmarkInfos(i-1)">{{i}}</button>
                    </li>

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
            bookmarkInfos: [],
            checkedBookmarks: [],
            checkedFacilities: [],
            totalPages: '',
            pageActive: 1,
            startNum: 0,
            endNum: 0,
        }
    },
    methods:{
        requestBookmarkInfo(){
            axios.get('http://localhost:8090/api/bookmark', {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                params: {page: 0, size: 10}
            })
            .then(response => {
                if(response.data === 'Invalid'){ // accessToken 만료
                    // accessToken 재발급을 위해 refreshToken 전송
                    axios.get('http://localhost:8090/api/member/reissuance', {
                        withCredentials: true
                    })
                    .then(response => {
                        if(response.data === 'Invalid'){
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");
                            
                            localStorage.removeItem("accessToken");
                            window.location.href = "/signin";
                        }else{
                            localStorage.removeItem("accessToken");
                            localStorage.setItem("accessToken", response.data.accessToken);

                            this.requestBookmarkInfo();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }else{
                    this.bookmarkInfos = response.data.content;
                    this.totalPages = response.data.totalPages;
                }
            })
            .catch(error => {
                console.log(error);
            })
        },
        // 이전 버튼 클릭 시 startNum, endNum 재설정을 위한 메소드
        setPrevPageNum(){
            // isPrevDisabled()에 의해 startNum이 5 이하인 경우는 신경 X
            this.startNum = this.startNum - 5; // 시작 번호는 현재 시작 번호 - 5
            this.endNum = this.startNum + 4; // 마지막 번호는 현재 시작 번호 + 4
            this.pageActive = this.endNum; // 이전 버튼 클릭 시 선택 중인 페이지 표시를 위해 선택한 페이지 번호 리턴
            this.getBookmarkInfos(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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
            this.getBookmarkInfos(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        getBookmarkInfos(i){
            axios.get('http://localhost:8090/api/bookmark', {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                params: {page: i, size: 10}
            })
            .then(response => {
                if(response.data === 'Invalid'){
                    axios.get('http://localhost:8090/api/member/reissuance', {
                        withCredentials: true
                    })
                    .then(response => {
                        if(response.data === 'Invalid'){
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");
                            
                            localStorage.removeItem("accessToken");
                            window.location.href = "/signin";
                        }else{
                            localStorage.removeItem("accessToken");
                            localStorage.setItem("accessToken", response.data.accessToken);

                            this.getBookmarkInfos(i);
                        }
                    })
                    .catch(error =>{
                        console.log(error);
                    })
                }else{
                    this.bookmarkInfos = response.data.content;
                }
            })
            .catch(error => {
                console.log(error);
            })
        },
        deleteBookmark(){
            for(let i=0; i<this.bookmarkInfos.length; i++){
                if(this.checkedBookmarks[i] === true){
                    this.checkedFacilities.push(this.bookmarkInfos[i].facilityId);
                }
            }

            axios.delete('http://localhost:8090/api/bookmark', {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                data: this.checkedFacilities
            })
            .then(response => {
                if(response.data === 'Invalid'){
                    axios.get('http://localhost:8090/api/member/reissuance', {
                        withCredentials: true
                    })
                    .then(response => {
                        if(response.data === 'Invalid'){
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                            localStorage.removeItem("accessToken");
                            window.location.href = "/signin";
                        }else{
                            localStorage.removeItem("accessToken");
                            localStorage.setItem("accessToken", response.data.accessToken);

                            this.deleteBookmark();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }else{
                    alert("북마크가 삭제되었습니다.");

                    this.$router.go(this.$router.currentRoute);
                }
            })
            .catch(error => {
                console.log(error);
            })            
        }
    },
    computed:{
      // 맨 첫 페이지 이전 버튼 동작 중지를 위해 startNum이 5 이하인 경우 false 리턴
      isPrevDisabled(){
        return this.startNum <= 5;
      },
      // startNum + 5를 하면 다음 페이지 배열의 시작 페이지 번호인데 총 페이지 수를 넘을 경우 false 리턴
      isNextDisabled(){
        return this.startNum+5 > this.totalPages;
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
    created(){
        this.requestBookmarkInfo();
    }
}
</script>

<style>
    .writing-category{
        width: 20%;
        text-align: center;
    }
    .writing-place{
        width: 20%;
        text-align: center;
    }
    .writing-address{
        width: 50%;
        text-align: center;
    }
    .writing-del{
        width: 10%;
        text-align: center;
    }

    .category-in-board{
        text-align: center;
    }
    .place-in-board{
        text-align: center;
    }
    .del-in-board{
        text-align: center;
    }

    .div-board-bottom-del-btn{
        width: 60%;
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 3%;
    }

    @media screen and (max-width: 992px){
        .div-board-bottom-del-btn{
            width: 100%;
        }
    }
</style>