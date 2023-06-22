<template>
    <div class="div-members">
        <div class="div-board-table" style="width:70%;">
            <table class="table table-hover table-bordered table-sm">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="th-members-id">아이디</th>
                    <th scope="col" class="th-members-nickname">닉네임</th>
                    <th scope="col" class="th-members-email">이메일</th>
                    <th scope="col" class="th-members-bandate">차단날짜</th>
                    <th scope="col" class="th-members-ban">차단</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="member in members" :key="member.memberId">
                    <th style="text-align: center;" scope="row" class="category-in-board">{{member.memberId}}</th>
                    <td style="text-align: center;" class="place-in-board">{{member.nickname}}</td>
                    <td>{{member.email}}</td>
                    <td style="text-align: center;" v-if="member.banDate === null">N/A</td>
                    <td style="text-align: center;" v-if="member.banDate !== null">{{member.banDate}}</td>
                    <td style="text-align: center;" v-if="member.banDate === null"><button type="button" class="btn div-board-bottom-btn-btn btn-sm" @click="updateBanDate(member.memberId, 'ban')">차단</button></td>
                    <td style="text-align: center;" v-if="member.banDate !== null"><button type="button" class="btn div-board-bottom-btn-btn btn-sm" @click="updateBanDate(member.memberId, 'unban')">해제</button></td>
                </tr>
            </tbody>
            </table>
        </div>
        
        <div class="div-board-paging" style="margin-top: 2%;">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>

                    <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                        <button class="page-link" @click="getMembers(i-1)">{{i}}</button>
                    </li>

                    <li class="page-item">
                        <button :class="['page-link', isNextDisabled ? 'disabled' : '']" aria-label="Next" @click="setNextPageNum">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="div-board-bottom-scset" style="margin-top: 2%;">
            <div class="div-board-bottom-search">
                <form @submit.prevent="setValues">
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
            <div class="div-board-bottom-category">
                <select class="form-select" aria-label="Default select example" v-model="selectedOption">
                    <option :value="'아이디'">아이디</option>
                    <option v-for="option in searchOptions" :value="option" :key="option">{{ option }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return{
            members: [],
            totalPages: '',
            pageActive: 1,
            startNum: 0,
            endNum: 0,
            searchOptions: ['닉네임', '이메일'],
            selectedOption: '아이디',
            memberId: '',
            nickname: '',
            email: '',
            searchQuery: '',
        }
    },
    methods:{
        getMembers(page){
            axios.get('http://localhost:8090/api/members', {
                headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
                params: {
                    memberId: this.memberId,
                    nickname: this.nickname,
                    email: this.email,
                    page: page, 
                    size: 10,
                }
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

                            this.getMembers(page);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }else{
                    this.members = response.data.content;
                    this.totalPages = response.data.totalPages;
                }
            })
            .catch(error => {
                console.log(error);
            })
        },
        setValues(){
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
        updateBanDate(memberId, order){
            let message = '';

            if(order === 'ban'){
                message = '차단';
            }else{
                message = '차단 해제';
            }

            if(confirm("정말 해당 유저를 "+message+"하시겠습니까?")){
                axios.put('http://localhost:8090/api/member/ban', {
                    memberId: memberId,
                    order: order,
                }, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
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

                                this.updateBanDate(memberId, order);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }else{
                        alert("해당 유저가 "+message+"되었습니다.");

                        this.$router.go(this.$router.currentRoute);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
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
    created(){
        this.getMembers(0);
    }
}
</script>

<style>
    .div-members{
        padding-top: 4.3%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .th-members-id{
        width: 20%;
        text-align: center;
    }
    .th-members-nickname{
        width: 20%;
        text-align: center;
    }
    .th-members-email{
        width: 20%;
        text-align: center;
    }
    .th-members-bandate{
        width: 20%;
        text-align: center;
    }
    .th-members-ban{
        width: 20%;
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