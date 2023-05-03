<template>
<div>
    <!-- 상단 메시지와 검색바를 담을 div -->
    <div>
        <!-- nav-home은 상단 메시지와 검색바 정렬을 위한 클래스 -->
        <nav class="navbar navbar-expand-lg navbar-dark nav-home">
            <!-- div-home-top은 위, 아래 간격 조절을 위한 클래스 -->
            <div class="div-home-top">
                <!-- h1-home은 h1의 위치, 폰트 설정 클래스 -->
                <h1 class="display-6 h1-home">반려동물과 함께하세요</h1>
            </div>
            <!-- div-home-search는  -->
            <div class="div-home-search">
                <form @submit.prevent="redirectMapViewByEmd" class="form-home">
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
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '동물병원'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/veterinarian.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">동물병원</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '동물약국'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/pharmacy.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">동물약국</h5>
                </div>
                </div>
            </router-link> 
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '반려동물용품'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/toy.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">동물용품</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '위탁관리'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/sleep.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">위탁관리</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '미용'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/beauty.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">미용</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '카페'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/cafe.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">카페</h5>
                </div>
                </div>
            </router-link> 
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '펜션'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/villa.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">펜션</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link :to="{ path: '/map', query: {cat: '여행지'}}" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/travel.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title h5-home-category">여행지</h5>
                </div>
                </div>
            </router-link>
        </div>
    </div>
</div>
</template>

<script>
export default{
    data(){
        return{
            emd: '',
            cat: ''
        }
    },
    methods:{
        redirectMapViewByEmd(){
            this.$router.push({ path: "/map", query: {emd: this.emd}});
        }
    }
}
</script>

<style>
/* 레이아웃 flex, 내부의 div, form column 형식으로 정렬*/
.nav-home{
    background-color: #fd7e14;
    display: flex;
    flex-direction: column;
}
.h1-home{
    padding-left: 22%;
    color: white;
}
.div-home-top{
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
.form-home{
    width: 55%;
}
/* 카드 크기 설정 */
.div-home-category{
    margin-top: 2%;
    margin-left: 23%;
    margin-right: 23%;
    margin-bottom: 4%;
}
/* 카드 내부 폰트 크기 설정 */
.h5-home-category{
    font-size: 1.1rem;
    text-align: center;
    font-weight: bold;
}
/* 너비 992px 이하 시 컴포넌트 설정 변경 */
@media screen and (max-width: 992px){
    /* 상단 메시지 위 여백 제거 */
    .div-home-top{
        width: 100%;
        padding-top: 0%;
    }
    /* 상단 메시지 가운데 정렬 */
    .h1-home{
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
    .h1-home{
        font-size: 1.5rem;
    }
    .form-home{
        width: 70%;
    }
    /* 카드 크기 수정 */
    .div-home-category{
        margin-left: 12%;
        margin-right: 12%;
    }
}
</style>