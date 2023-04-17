<template>
<div>
    <div class="div-search-and-select">
        <div class="div-search-in-map">
            <form class="container search-in-map">
                <div class="input-group">
                    <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="장소를 입력하세요" aria-label="keyword" aria-describedby="basic-addon1" style="height:50px">
                </div>
            </form>
        </div>
        <div class="div-select-in-map">
            <select class="form-select select-in-map" aria-label="Default select example">
                <option selected>시를 선택하세요</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <select class="form-select select-in-map" aria-label="Default select example">
                <option selected>구를 선택하세요</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <select class="form-select select-in-map" aria-label="Default select example">
                <option selected>동을 선택하세요</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            <select class="form-select select-in-map" aria-label="Default select example">
                <option selected>카테고리를 선택하세요</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
        </div>
    </div>
    <div class="div-list-and-map">
        <div class="div-list">
            <div class="card card-in-list">
                <div class="card-body">
                    <h5 class="card-title">장소명</h5>
                    <h6 class="card-subtitle mb-2 text-muted">카테고리</h6>
                    <p class="card-text">주소</p>
                    <a href="#" class="card-link">자세히보기</a>
                </div>
            </div>
        </div>
        <div class="div-map">
            <div id="map"></div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return {
            map: null,
        }
    },
    methods: {
        initMap() {
            const container = document.getElementById("map");
            const options = {
                center: new kakao.maps.LatLng(37.5026543, 126.750366, 16),
                level: 5,
            };
            this.map = new kakao.maps.Map(container, options);
        }
    },
    mounted() {
        if(!window.kakao || !window.kakao.maps){
            const script = document.createElement("script");
            script.src = 
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=66547760b8e0c139b3bd1770f83f9bce";

            /* global kakao */
            script.addEventListener("load", () => {
                kakao.maps.load(this.initMap);
            });

            document.head.appendChild(script);
        }else {
            console.log("이미 로딩됨 ", window.kakao);
            this.initMap();
        }
    }
}
</script>

<style>
    .div-search-and-select{
        display: flex;
        width: 100%;
    }
    .div-search-in-map{
        border-style: solid;
        border-width: 1px;
        border-color: rgb(219, 219, 219);
        width: 20%;
    }
    .search-in-map{
        margin-top: 3%;
        margin-bottom: 3%;
    }
    .div-select-in-map{
        border-style: solid;
        border-width: 1px;
        border-color: rgb(219, 219, 219);
        width: 80%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 1%;
    }
    .select-in-map{
        height: 50%;
        width: 20%;
        margin-right: 1%;
    }
    .div-list-and-map{
        display: flex;
        height: 65vh
    }
    .div-list{
        border-style: solid;
        border-width: 1px;
        border-color: rgb(219, 219, 219);
        width: 20%; 
    }
    .card-in-list{
        width: 100%;
        border-width: 1px;
        border-color: rgb(219, 219, 219);
        border-top-color: white;
        border-right-color: white;
    }
    .div-map{
        border-style: solid;
        border-width: 1px;
        border-color: rgb(219, 219, 219);
        width: 80%;
    }
    #map{
        width: 100%;
        height: 100%;
    }
</style>