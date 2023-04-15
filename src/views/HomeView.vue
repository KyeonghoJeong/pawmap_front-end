<template>
<div>

    <div>
        <nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
            <div class="container custom-container-message">
                <h1 class="display-6 custom-display-6">어떤 장소를 찾으세요?</h1>
            </div>
        </nav>
    </div>

    <div>
        <nav class="navbar navbar-expand-sm navbar-dark custom-navbar">
            <form class="container custom-container-search">
                <div class="input-group">
                    <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="장소를 입력하세요" aria-label="keyword" aria-describedby="basic-addon1" style="height:50px">
                </div>
            </form>
        </nav>
    </div>

    <div class="row row-cols-1 row-cols-md-4 g-4 custom-card-row">
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/veterinarian.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">동물병원</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/pharmacy.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">동물약국</h5>
                </div>
                </div>
            </router-link> 
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/toy.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">동물용품</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/sleep.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">위탁관리</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/beauty.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">미용</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/cafe.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">카페</h5>
                </div>
                </div>
            </router-link> 
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/villa.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">펜션</h5>
                </div>
                </div>
            </router-link>
        </div>
        <div class="col">
            <router-link to="/test" class="nav-link active navbar-link">
                <div class="card">
                <img src="../assets/images/etc.jpg" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title custom-card-title">기타</h5>
                </div>
                </div>
            </router-link>
        </div>
    </div>

</div>
</template>

<style>
.custom-container-message{
    width: 55%;
    padding-top: 80px;
    padding-bottom: 37px;
}
.custom-display-6{
    color: white;
}
.custom-container-search{
    width: 55%;
    padding-bottom: 55px;
}
.custom-card-title{
    font-size: 110%;
    text-align: center;
    font-weight: bold !important;
}
.custom-card-row{
    margin-top: 2.5%;
    margin-left: 23%;
    margin-right: 23%;
    margin-bottom: 4%;
}

@media screen and (max-width: 992px){
    .custom-container-message{
        width: 60%;
        padding-top: 5px;
        padding-bottom: 0px;
    }
    .custom-container-search{
        width: 60%;
        padding-bottom: 5px;
    }
    .custom-card-title{
        font-size: 100%;
    }
    .custom-card-row{
        margin-top: 1%;
        margin-left: 22%;
        margin-right: 22%;
    }
    .row-cols-md-4 > * {
        width: 50%;
        max-width: 50%;
    }
}

@media screen and (max-width: 576px){
    .custom-container-message{
        width: 80%;
        padding-top: 5px;
        padding-bottom: 0px;
    }
    .custom-container-search{
        width: 80%;
        padding-bottom: 5px;
    }
    .custom-card-row{
        margin-left: 12%;
        margin-right: 12%;
    }
}
</style>