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
                <option v-for="item in optionSido" :value="item" :key="item.sido_id">{{ item.sido_name }}</option>
            </select>
            <select class="form-select select-in-map" v-on:click="getSigungu()" v-model="selectedSigungu" aria-label="Default select example">
                <option :value="[]" selected>구 선택</option>
                <option v-for="item in optionSigungu" :value="item" :key="item.sigungu_id">{{ item.sigungu_name }}</option>
            </select>
            <select class="form-select select-in-map" v-on:click="getEmd()" v-model="selectedEmd" aria-label="Default select example">
                <option :value="[]" selected>동 선택</option>
                <option v-for="item in optionEmd" :value="item" :key="item.emd_id">{{ item.emd_name }}</option>
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
                <div class="card-body" v-for="(facility, index) in limitedFacilities" :key="index" style="border: 1px solid #EBEBFF;">
                    <h5 class="card-title">{{facility.facility_name}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{facility.basic_info}}</h6>
                    <p class="card-text">{{facility.road_addr}}</p>
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
            checkFacilityData: false,
            checkMarkerData: false,
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
        }
    },
    methods: {
        initMap() {
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(37.566535, 126.9779692),
                level: 4,
            };
            
            if(this.checkParam === true){
                this.map = new kakao.maps.Map(container, options);

                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition((position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        const locPosition = new kakao.maps.LatLng(lat, lng);
                        
                        this.map.setCenter(locPosition);
                    })
                }
            }else{
                this.$watch('checkMarkerData', (value) => {
                    if (value === true){
                        this.map = new kakao.maps.Map(container, options);

                        const locPosition = new kakao.maps.LatLng(this.facility[0].lat, this.facility[0].lng);
                        this.map.setCenter(locPosition);
                        this.displayMarker(this.markerPositions);

                        kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                            if(this.map.getLevel() >= 1){
                                this.displayMarker(this.markerPositions);
                            }
                        });
                    }
                });
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
                if((position[2] >= swLat && position[2] <= neLat) && (position[3] >= swLng && position[3] <= neLng)){
                    const marker = new kakao.maps.Marker({
                        map: this.map,
                        position: new kakao.maps.LatLng(position[2], position[3]),
                        title: position[1]
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

            if(this.selectedSido.length !== 0 && this.requestSido !== this.selectedSido.sido_name){
                this.requestSido = this.selectedSido.sido_name;

                axios.get('http://localhost:8090/facility/group', {params:{sido: this.selectedSido.sido_name}})
                .then(response => {
                    this.facility = response.data;
                    console.log(this.facility);
                    this.checkFacilityData = true;
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        getSigungu(){
            if(this.selectedSido.length !== 0){
                axios.get('http://localhost:8090/district/sigungu', {params:{sido_id: this.selectedSido.sido_id}})
                .then(response =>{
                    this.optionSigungu = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }

            if(this.selectedSigungu.length !== 0 && this.requestSigungu !== this.selectedSigungu.sigungu_name){
                this.requestSigungu = this.selectedSigungu.sigungu_name;

                axios.get('http://localhost:8090/facility/group', 
                    {params:{
                        sido: this.selectedSido.sido_name,
                        sigungu: this.selectedSigungu.sigungu_name}})
                .then(response => {
                    this.facility = response.data;
                    console.log(this.facility);
                    this.checkFacilityData = true;
                })
                .catch(error => {
                    console.log(error);
                })
            }
        },
        getEmd(){
            if(this.selectedSigungu.length !== 0){
                axios.get('http://localhost:8090/district/emd', {params:{sigungu_id: this.selectedSigungu.sigungu_id}})
                .then(response =>{
                    this.optionEmd = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }

            if(this.selectedEmd.length !== 0 && this.requestEmd !== this.selectedEmd.emd_name){
                this.requestEmd = this.selectedEmd.emd_name;

                axios.get('http://localhost:8090/facility/group', 
                    {params:{
                        sido: this.selectedSido.sido_name,
                        sigungu: this.selectedSigungu.sigungu_name,
                        emd: this.selectedEmd.emd_name}})
                .then(response => {
                    this.facility = response.data;
                    console.log(this.facility);
                    this.checkFacilityData = true;
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
                    axios.get('http://localhost:8090/facility/single', {params:{cat: this.selectedCat}})
                    .then(response =>{
                        this.facility = [];
                        this.facility = response.data;
                        console.log(this.facility);

                        this.markerPositions = [];
                        for(var k = 0; k < this.facility.length; k++){
                            this.markerPositions.push([
                                this.facility[k].facility_id,
                                this.facility[k].facility_name,
                                this.facility[k].lat, 
                                this.facility[k].lng
                            ]);
                        }

                        this.displayMarker(this.markerPositions);

                        kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                            if(this.map.getLevel() >= 1){
                                this.displayMarker(this.markerPositions);
                            }
                        });
                    })
                    .catch(error =>{
                        console.log(error);
                    })
                }else{
                    axios.get('http://localhost:8090/facility/group', 
                        {params:{
                            sido: this.selectedSido.sido_name,
                            sigungu: this.selectedSigungu.sigungu_name,
                            emd: this.selectedEmd.emd_name,
                            cat: this.selectedCat}})
                    .then(response => {
                        this.facility = response.data;
                        console.log(this.facility);
                        this.checkFacilityData = true;
                    })
                    .catch(error => {
                        console.log(error);
                    })
                }
            }
        }
    },
    computed:{
      limitedFacilities(){
        return this.facility.slice(0, 10);
      }  
    },
    created() {
        this.emd = this.$route.query.emd
        this.cat = this.$route.query.cat

        if(typeof this.emd !== 'undefined'){
            axios.get('http://localhost:8090/facility/single', {params:{emd: this.emd}})
            .then(response => {
                this.facility = [];
                this.facility = response.data;
                console.log(this.facility);
                this.checkFacilityData = true;
            })
            .catch(error => {
                console.log(error);
            })
        }

        if(typeof this.cat !== 'undefined'){
            axios.get('http://localhost:8090/facility/single', {params:{cat: this.cat}})
            .then(response =>{
                this.facility = [];
                this.facility = response.data;
                console.log(this.facility);
                this.checkFacilityData = true;
            })
            .catch(error =>{
                console.log(error);
            })
        }

        if(typeof this.emd === 'undefined' && typeof this.cat === 'undefined'){
            this.checkParam = true;
        }

        this.$watch('checkFacilityData', (value) => {
            if (value === true) {
                this.markerPositions = [];
                for(var k = 0; k < this.facility.length; k++){
                    this.markerPositions.push([
                        this.facility[k].facility_id,
                        this.facility[k].facility_name,
                        this.facility[k].lat, 
                        this.facility[k].lng
                    ]);
                }
                this.checkMarkerData = true;
            }
        });
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