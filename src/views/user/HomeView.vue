<template>
<div>
    <!-- 상단 메시지와 검색바를 담을 div -->
    <div>
        <!-- nav-home-main은 상단 메시지와 검색바 정렬을 위한 클래스 -->
        <nav class="navbar navbar-expand-lg navbar-dark nav-home-main">
            <!-- div-home-message는 위, 아래 간격 조절을 위한 클래스 -->
            <div class="div-home-message">
                <!-- h1-home-message는 h1의 위치, 폰트 설정 클래스 -->
                <h1 class="display-6 h1-home-message">반려동물과 함께하세요</h1>
            </div>
            <!-- div-home-search는 검색바를 담기 위한 div -->
            <div class="div-home-search">
                <!-- 검색 시 toMapWithEmd 메소드 호출 -->
                <form @submit.prevent="toMapWithEmd" class="form-home-search">
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg>
                        </span>
                        <input type="text" v-model="emd" class="form-control" placeholder="동 이름을 검색하세요" aria-label="keyword" aria-describedby="basic-addon1" style="height:50px">
                    </div>
                </form>
            </div>
        </nav>
    </div>
    <!-- 카테고리 카드 담을 div -->
    <!-- h5-home-category는 카드 내부 폰트 설정을 위한 클래스 -->
    <div class="row row-cols-1 row-cols-md-4 g-4 div-home-category">
        <!-- v-for를 사용하여 categories 배열에 들어있는 카테고리 수만큼 반복 -->
        <div class="col" v-for="(category, index) in categories" :key="index">
            <!-- 카드 클릭 시 라우터로 이동하고 쿼리를 통해 카테고리명 전달 -->
            <router-link :to="{ path: '/map', query: {cat: category}}" class="nav-link active navbar-link">
                <div class="card div-home-card">
                    <!-- 카테고리명과 사진 파일 이름을 일치시켜서 출력 -->
                    <img :src="require(`/src/assets/images/${category}.jpg`)" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title h5-home-category">{{category}}</h5>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return{
            emd: '', // 읍면동 검색 시 저장 변수
            cat: '', // 카테고리 클릭 시 저장 변수
            categories: ['동물병원', '동물약국', '동물용품', '위탁관리', '미용', '카페', '펜션', '여행지'], // 카테고리 이름 배열
        }
    },
    methods:{
        toMapWithEmd(){
            // 검색한 읍면동 이름이 DB 테이블에 등록되어 있는 지 유효성 확인
            axios.get('http://localhost:8090/api/facilities/availability', {params:{emd: this.emd}})
            .then(response =>{
                const count = response.data;

                // 수신한 count의 값이 0이면 검색한 읍면동 이름이 DB 테이블에 등록되어 있지 않은 경우로 안내 메시지 출력 
                if(count == 0){
                    alert("존재하지 않는 동 이름입니다.");
                }else{
                    // 수신한 count의 값이 0이 아니면 검색한 읍면동 이름이 DB 테이블에 등록되어 있는 경우
                    // 해당 읍면동 이름을 쿼리로 /map에 전달
                    this.$router.push({ path: "/map", query: {emd: this.emd}});
                }
            })
            .catch(error =>{
                console.log(error);
            })
        }
    }
}
</script>

<style>
/* 레이아웃 flex, 내부의 div, form column 형식으로 정렬*/
.nav-home-main{
    background-color: #fd7e14;
    display: flex;
    flex-direction: column;
}
.h1-home-message{
    padding-left: 22%;
    color: white;
}
.div-home-message{
    width: 100%;
    padding-top: 4.85%;
    padding-bottom: 2.25%;
}
/* 검색바 정렬 */
.div-home-search{
    width: 100%;
    padding-bottom: 3.35%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
/* 검색바 너비 설정 */
.form-home-search{
    width: 55%;
}
/* 카드 크기 설정 */
.div-home-category{
    margin-top: 2%;
    margin-left: 23%;
    margin-right: 23%;
    margin-bottom: 2%;
}
.div-home-card {
    border-color: rgb(219, 219, 219);

    background-color: #fd7e14;
    color: white;

    /* background-color: white;
    color: black; */
}
.div-home-card:hover{
    background-color: white;
    color: #fd7e14;

    /* background-color: #fd7e14;
    color: white; */
}
/* 카드 내부 폰트 설정 */
.h5-home-category{
    font-size: 1.1rem;
    text-align: center;
}
/* 너비 992px 이하 시 컴포넌트 설정 변경 */
@media screen and (max-width: 992px){
    /* 상단 메시지 위 여백 제거 */
    .div-home-message{
        width: 100%;
        padding-top: 0%;
    }
    /* 상단 메시지 가운데 정렬 */
    .h1-home-message{
        padding-left: 0%;
        text-align: center;
        color: white;
    }
    /* 카드 폰트 크기 수정 */
    .h5-home-category{
        font-size: 1rem;
    }
    /* row-cols-md-4 클래스 하위의 모든 카드 크기 수정하여 배치되는 카드 수 수정 */
    .row-cols-md-4 > * {
        width: 50%;
        max-width: 50%;
    }
}
/* 너비 576px 이하 시 컴포넌트 설정 변경 */
@media screen and (max-width: 576px){
    /* 검색바 크기 수정 */
    .h1-home-message{
        font-size: 1.5rem;
    }
    .form-home-search{
        width: 70%;
    }
    /* 카드 크기 수정 */
    .div-home-category{
        margin-left: 12%;
        margin-right: 12%;
    }
}
</style>