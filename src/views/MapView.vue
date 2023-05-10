<template>
<div>
    <div class="div-search-and-select">
        <div class="div-search-in-map">
            <form class="search-in-map">
                <div class="input-group">
                    <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="동 이름을 검색하세요" aria-label="keyword" aria-describedby="basic-addon1" style="height:50px">
                </div>
            </form>
        </div>
        <div class="div-select-in-map">
            <select class="form-select select-in-map" v-on:click="getSido()" v-model="selectedSido" aria-label="Default select example">
                <option :value="[]" selected>시 선택</option>
                <option v-for="item in optionSido" :value="item" :key="item.sidoId">{{ item.sidoName }}</option>
            </select>
            <select class="form-select select-in-map" v-on:click="getSigungu()" v-model="selectedSigungu" aria-label="Default select example">
                <option :value="[]" selected>구 선택</option>
                <option v-for="item in optionSigungu" :value="item" :key="item.sigunguId">{{ item.sigunguName }}</option>
            </select>
            <select class="form-select select-in-map" v-on:click="getEmd()" v-model="selectedEmd" aria-label="Default select example">
                <option :value="[]" selected>동 선택</option>
                <option v-for="item in optionEmd" :value="item" :key="item.emdId">{{ item.emdName }}</option>
            </select>
            <select class="form-select select-in-map" v-model="selectedCat" v-on:click="getCat()" aria-label="Default select example">
                <option value="" selected>카테고리 선택</option>
                <option v-for="item in optionCat" :value="item" :key="item">{{ item }}</option>
            </select>
        </div>
    </div>
    <div class="div-list-and-map">
        <div class="div-list">
            <div class="card card-in-list" v-if="facility && facility[0]" style="overflow:scroll; max-height: 100%;">
                <div class="card-body" v-for="(facility, index) in facility" :key="index" style="border: 1px solid #EBEBFF;">
                    <h5 class="card-title">{{facility.facilityName}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{facility.basicInfo}}</h6>
                    <p class="card-text">{{facility.roadAddr}}</p>
                </div>

                <div style="display:flex; flex-direction: column; align-items: center">
                    <nav aria-label="Page navigation example" style="margin-top: 6.5%">
                        <ul class="pagination pagination-sm">
                            <li class="page-item">
                                <button :class="['page-link', isPrevDisabled ? 'disabled' : '']" aria-label="Previous" @click="setPrevPageNum">
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>

                            <li v-for="i in pageNumbers" :key="i" :class="['page-item', pageActive === i ? 'active' : '']" @click="pageActive = i">
                                <button class="page-link" @click="getFacilityContent(i-1)">{{i}}</button>
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
        </div>
        <div class="div-map">
            <div id="map"></div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
    data(){
        return {
            emd: '',
            cat: '',
            facility: [],
            facilityLocation: [],
            markerPositions: [],
            markers: [],
            map: null,
            iw: '',
            checkParam: false,
            optionSido: [],
            optionSigungu: [],
            optionEmd: [],
            optionCat: ['동물병원', 
                        '동물약국', 
                        '문예회관', 
                        '미술관', 
                        '미용', 
                        '박물관', 
                        '반려동물용품', 
                        '식당', 
                        '여행지', 
                        '위탁관리', 
                        '카페', 
                        '펜션', 
                        '호텔'],
            selectedSido: [],
            selectedSigungu: [],
            selectedEmd: [],
            selectedCat: '',
            requestSido: '',
            requestSigungu: '',
            requestEmd: '',
            requestCat: '',
            pageActive: 1,
            totalPages: '',
            contentKey: '',
            contentUrl: '',
            startNum: 0,
            endNum: 0,
        }
    },
    methods: {
        initMap() {
            const container = document.getElementById('map');
            let options = {
                center: new kakao.maps.LatLng(37.566535, 126.9779692),
                level: 4,
            };

            if(this.checkParam === true){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition((position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        options = {
                            center: new kakao.maps.LatLng(lat, lng),
                            level: 4,
                        };

                        this.map = new kakao.maps.Map(container, options);

                        kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                            if(this.map.getLevel() >= 1){
                                this.displayMarker(this.markerPositions);
                            }
                        });

                        kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                            this.displayMarker(this.markerPositions);
                        });
                    })
                }
            }else{
                if(typeof this.emd !== 'undefined'){
                    axios.get('http://localhost:8090/facility/single/location', {params:{emd: this.emd}})
                    .then(response =>{
                        this.facilityLocation = response.data;

                        options = {
                            center: new kakao.maps.LatLng(this.facilityLocation[0].lat, this.facilityLocation[0].lng),
                            level: 4,
                        };

                        this.map = new kakao.maps.Map(container, options);

                        for(var i = 0; i < this.facilityLocation.length; i++){
                            this.markerPositions.push([
                                this.facilityLocation[i].facilityName,
                                this.facilityLocation[i].lat, 
                                this.facilityLocation[i].lng
                            ]);
                        }

                        this.displayMarker(this.markerPositions);

                        kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                            if(this.map.getLevel() >= 1){
                                this.displayMarker(this.markerPositions);
                            }
                        });

                        kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                            this.displayMarker(this.markerPositions);
                        });
                    })
                    .catch(error =>{
                        console.log(error);
                    })
                }else if(typeof this.cat !== 'undefined'){
                    axios.get('http://localhost:8090/facility/single/location', {params:{cat: this.cat}})
                    .then(response =>{
                        this.facilityLocation = response.data;

                        options = {
                            center: new kakao.maps.LatLng(this.facilityLocation[0].lat, this.facilityLocation[0].lng),
                            level: 4,
                        };

                        this.map = new kakao.maps.Map(container, options);

                        for(var i = 0; i < this.facilityLocation.length; i++){
                            this.markerPositions.push([
                                this.facilityLocation[i].facilityName,
                                this.facilityLocation[i].lat, 
                                this.facilityLocation[i].lng
                            ]);
                        }

                        this.displayMarker(this.markerPositions);

                        kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                            if(this.map.getLevel() >= 1){
                                this.displayMarker(this.markerPositions);
                            }
                        });

                        kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                            this.displayMarker(this.markerPositions);
                        });
                    })
                    .catch(error =>{
                        console.log(error);
                    })
                }
            }
        },
        displayMarker(markerPositions) {
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => marker.setMap(null));
            }

            const neLat = this.map.getBounds().getNorthEast().getLat();
            const neLng = this.map.getBounds().getNorthEast().getLng();
            const swLat = this.map.getBounds().getSouthWest().getLat();
            const swLng = this.map.getBounds().getSouthWest().getLng();

            markerPositions.forEach((position) => {
                if((position[1] >= swLat && position[1] <= neLat) && (position[2] >= swLng && position[2] <= neLng)){
                    const marker = new kakao.maps.Marker({
                        map: this.map,
                        position: new kakao.maps.LatLng(position[1], position[2]),
                        title: position[0]
                    })
                    this.markers.push(marker);

                    const iwContent = `<div style="padding:5px;"><div class="card-body" style="border: 1px solid #EBEBFF;"><h5 class="card-title">${position[0]}</h5></div></div>`, iwRemovable = true;
                
                    const infowindow = new kakao.maps.InfoWindow({
                        content: iwContent,
                        removable: iwRemovable
                    });

                    kakao.maps.event.addListener(marker, 'click', () => {                    
                        if (this.iw) {
                            this.iw.close();
                        }

                        this.iw = infowindow;
                        infowindow.open(this.map, marker);
                    });

                    kakao.maps.event.addListener(this.map, 'click', () => {
                        infowindow.close();
                    });
                }
            })
        },
        getSido(){
            axios.get('http://localhost:8090/district/sido')
            .then(response =>{
                this.optionSido = response.data;
            })
            .catch(error =>{
                console.log(error);
            })

            if(this.selectedSido.length !== 0 && this.requestSido !== this.selectedSido.sidoName){
                this.requestSido = this.selectedSido.sidoName;

                axios.get('http://localhost:8090/facility/group', {params:{sido: this.selectedSido.sidoName}})
                .then(response => {
                    this.facility = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        getSigungu(){
            if(this.selectedSido.length !== 0){
                axios.get('http://localhost:8090/district/sigungu', {params:{sidoId: this.selectedSido.sidoId}})
                .then(response =>{
                    this.optionSigungu = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }

            if(this.selectedSigungu.length !== 0 && this.requestSigungu !== this.selectedSigungu.sigunguName){
                this.requestSigungu = this.selectedSigungu.sigunguName;

                axios.get('http://localhost:8090/facility/group', 
                    {params:{
                        sido: this.selectedSido.sidoName,
                        sigungu: this.selectedSigungu.sigunguName}})
                .then(response => {
                    this.facility = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        getEmd(){
            if(this.selectedSigungu.length !== 0){
                axios.get('http://localhost:8090/district/emd', {params:{sigunguId: this.selectedSigungu.sigunguId}})
                .then(response =>{
                    this.optionEmd = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }

            if(this.selectedEmd.length !== 0 && this.requestEmd !== this.selectedEmd.emdName){
                this.requestEmd = this.selectedEmd.emdName;

                axios.get('http://localhost:8090/facility/group', 
                    {params:{
                        sido: this.selectedSido.sidoName,
                        sigungu: this.selectedSigungu.sigunguName,
                        emd: this.selectedEmd.emdName}})
                .then(response => {
                    this.facility = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        getCat(){
            if(this.selectedCat !== '' && this.requestCat !== this.selectedCat){
                this.requestCat = this.selectedCat;

                if(this.selectedSido.length === 0 && this.selectedSigungu.length === 0 && this.selectedEmd.length === 0){
                    axios.get('http://localhost:8090/facility/single', {params:{cat: this.selectedCat, page: 0, size: 10}})
                    .then(response =>{
                        this.facility = response.data.content;
                        this.totalPages = response.data.totalPages;
                        this.contentKey = 'singleCat';

                        if(this.totalPages != 0){
                            this.startNum = 1;
                            this.endNum = this.totalPages;
                            if(this.endNum > 5){
                                this.endNum = 5;
                            }
                        }
                        this.pageActive = this.startNum;

                        this.cat = this.selectedCat;
                    })
                    .catch(error =>{
                        console.log(error);
                    })

                    axios.get('http://localhost:8090/facility/single/location', {params:{cat: this.selectedCat}})
                    .then(response =>{
                        this.facilityLocation = response.data;
                        
                        this.markerPositions = [];
                        for(var k = 0; k < this.facilityLocation.length; k++){
                            this.markerPositions.push([
                                this.facilityLocation[k].facilityName,
                                this.facilityLocation[k].lat, 
                                this.facilityLocation[k].lng
                            ]);
                        }

                        this.displayMarker(this.markerPositions);

                        kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                            if(this.map.getLevel() >= 1){
                                this.displayMarker(this.markerPositions);
                            }
                        });

                        kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                            this.displayMarker(this.markerPositions);
                        });
                    })
                }else{
                    axios.get('http://localhost:8090/facility/group', 
                        {params:{
                            sido: this.selectedSido.sidoName,
                            sigungu: this.selectedSigungu.sigunguName,
                            emd: this.selectedEmd.emdName,
                            cat: this.selectedCat}})
                    .then(response => {
                        this.facility = response.data;
                        console.log(this.facility);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            }
        },
        setPrevPageNum(){
            this.startNum = this.startNum - 5;
            this.endNum = this.startNum + 4;
            this.pageActive = this.endNum;
            this.getFacilityContent(this.endNum-1);
        },
        setNextPageNum(){
            if(this.endNum === 0){
                this.startNum = this.startNum + 6;
            }else{
                this.startNum = this.endNum + 1;
            }
            
            this.endNum = this.startNum + 4;
            if(this.endNum > this.totalPages){
                this.endNum = this.totalPages;
            }

            this.pageActive = this.startNum;
            this.getFacilityContent(this.startNum-1);
        },
        getFacilityContent(i){
            if(this.contentKey === 'singleEmd'){
                this.contentUrl = `http://localhost:8090/facility/single?emd=${this.emd}&page=${i}&size=10`;
            }else if(this.contentKey === 'singleCat'){
                this.contentUrl = `http://localhost:8090/facility/single?cat=${this.cat}&page=${i}&size=10`;
            }

            console.log(this.contentUrl);
            axios.get(this.contentUrl)
            .then(response => {
                this.facility = response.data.content;
                console.log(this.facility);
            })
            .catch(error => {
                console.log(error);
            })
        },
    },
    computed:{
      isPrevDisabled(){
        return this.startNum <= 5;
      },
      isNextDisabled(){
        return this.startNum+5 >= this.totalPages;
      },
      pageNumbers(){
        let numbers = [];
        let start = this.startNum;
        let end = this.endNum;

        if(this.startNum === 0){
            start = 1;
            end = this.totalPages;
            if(end > 5){
                end = 5;
            }
        }

        for(let i=start; i<=end; i++){
            numbers.push(i);
        }

        return numbers;
      }
    },
    created() {
        this.emd = this.$route.query.emd
        this.cat = this.$route.query.cat

        if(typeof this.emd !== 'undefined'){
            axios.get('http://localhost:8090/facility/single', {params:{emd: this.emd, page: 0, size: 10}})
            .then(response => {
                this.facility = response.data.content;
                this.totalPages = response.data.totalPages;
                this.contentKey = 'singleEmd';
            })
            .catch(error => {
                console.log(error);
            })
        }

        if(typeof this.cat !== 'undefined'){
            axios.get('http://localhost:8090/facility/single', {params:{cat: this.cat, page: 0, size: 10}})
            .then(response =>{
                this.facility = response.data.content;
                this.totalPages = response.data.totalPages;
                this.contentKey = 'singleCat';
            })
            .catch(error =>{
                console.log(error);
            })
        }

        if(typeof this.emd === 'undefined' && typeof this.cat === 'undefined'){
            this.checkParam = true;
        }
    },
    mounted() {
        if(!window.kakao || !window.kakao.maps){
            const script = document.createElement("script");
            script.src = 
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=52ab0e36c22fd3c43884e5698628abe2";

            /* global kakao */
            script.addEventListener("load", () => {
                kakao.maps.load(this.initMap);
            });

            document.head.appendChild(script);
        }else {
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
        margin-left: 3%;
        margin-right: 3%;
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
    @media screen and (max-width: 992px){
        .div-search-and-select{
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .div-search-in-map{
            border-style: solid;
            border-width: 1px;
            border-color: rgb(219, 219, 219);
            width: 100%;
            display: flex;
            align-items: center;
        }
        .search-in-map{
            width: 100%;
            margin-top: 2%;
            margin-bottom: 2%;
            margin-left: 1.5%;
            margin-right: 1.5%;
        }
        .div-select-in-map{
            border-style: solid;
            border-width: 1px;
            border-color: rgb(219, 219, 219);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 2%;
            padding-left: 2%;
            padding-right: 1%;
        }
        .select-in-map{
            height: 50%;
            width: 100%;
            margin-bottom: 2%;
        }
        .div-list-and-map{
            display: flex;
            flex-direction: column;
            height: 65vh;
        }
        .div-list{
            border-style: solid;
            border-width: 1px;
            border-color: rgb(219, 219, 219);
            width: 100%;
            height: 50vh;
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
            width: 100%;
            height: 100%;
        }
        #map{
            width: 100%;
            height: 100%;
        }
    }
</style>