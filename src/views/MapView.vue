<template>
<div>
    <div class="div-search-and-select">
        <div class="div-search-in-map">
            <form class="search-in-map" @submit.prevent="setMapByEmd()">
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
        <div class="div-select-in-map">
            <select class="form-select select-in-map" v-model="selectedCat" @change="getCat()" aria-label="Default select example">
                <option value="" selected>카테고리 선택</option>
                <option v-for="item in optionCat" :value="item" :key="item">{{ item }}</option>
            </select>
            <select class="form-select select-in-map" v-model="selectedSido" @click="getSido()" @change="getFacilityBySido()" aria-label="Default select example">
                <option value="" selected>시도 선택</option>
                <option v-for="item in optionSido" :value="item" :key="item.sidoId">{{ item.sidoName }}</option>
            </select>
            <select class="form-select select-in-map" v-model="selectedSigungu" @click="getSigungu()" @change="getFacilityBySigungu()" aria-label="Default select example">
                <option value="" selected>시군구 선택</option>
                <option v-for="item in optionSigungu" :value="item" :key="item.sigunguId">{{ item.sigunguName }}</option>
            </select>
            <select class="form-select select-in-map" v-model="selectedEmd" @click="getEmd()" @change="getFacilityByEmd()" aria-label="Default select example">
                <option value="" selected>읍면동 선택</option>
                <option v-for="item in optionEmd" :value="item" :key="item.emdId">{{ item.emdName }}</option>
            </select>
        </div>
    </div>
    <div class="div-list-and-map">
        <div class="div-list">
            <div class="card card-in-list" ref="scrollController" v-if="facilityList && facilityList[0]" style="overflow:scroll; max-height: 100%;">
                <div class="card-body" v-for="(facility, index) in facilityList" :key="index" style="border: 1px solid #EBEBFF;">
                    <div style="display: flex; align-items: center; margin-bottom:8px;">
                        <div style="font-weight:bold; font-size: 18px">{{facility.facilityName}}</div>
                        <div style="font-size: 11px">&nbsp;&nbsp;{{facility.cat}}</div>
                    </div>
                    <div style="font-size: 11px">{{facility.roadAddr}}</div>
                    <div style="font-size: 11px;">(지번) {{facility.landAddr}}</div>
                    <div style="display: flex; margin-top:8px; font-size: 11px">
                        <div style="font-weight:bold;">기본정보&nbsp;</div>
                        <div>{{facility.basicInfo}}</div>
                    </div>
                    <div style="display: flex; font-size: 11px">
                        <div style="font-weight:bold;">영업시간&nbsp;</div>
                        <div>{{facility.businessHr}}</div>
                    </div>
                    <div style="display: flex; font-size: 11px">
                        <div style="font-weight:bold;">전화번호&nbsp;</div>
                        <div style="color:green">{{facility.phoneNum}}</div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                        <button style="background:white; color:blue; border:none; padding:0px; margin-right:15px; font-size: 12px;">북마크</button>
                        <button style="background:white; color:blue; border:none; padding:0px; font-size: 12px;" @click="showOverlay(facility)">상세보기</button>
                    </div>
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
            size: 10,
            emd: '',
            cat: '', // MapView로 이동 시 카테고리 이름을 받을 변수, 이후 데이터를 받고 맵 설정을 하는 데 사용
            facilityList: [], // 리스트 출력을 위해 시설 정보를 받을 배열
            facilityLocation: [], // 마커 출력을 위해 시설 위치 정보를 받을 배열
            isFacilityDataLoaded: false, // 시설 정보 + 시설 위치 정보를 전부 다 완전히 featch 했는지 확인을 위한 변수
            markerPositions: [], // 마커 위치를 저장할 배열, 시설 위치 정보를 받아 지정함
            markers: [], // 실제 마커를 담을 배열
            clickedMarker: '',
            activatedOverlay: '',
            map: null,
            optionSido: [], // 행정구역 '시도'를 담을 배열
            optionSigungu: [], // 행정구역 '시군구'를 담을 배열
            optionEmd: [], // 행정구역 '읍면동'을 담을 배열
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
            selectedSido: '', // '시도' select에서 선택된 '시도'를 v-model로 받아올 변수
            selectedSigungu: '', // '시군구' select에서 선택된 '시군구'를 v-model로 받아올 변수
            selectedEmd: '', // '읍면동' select에서 선택된 '읍면동'을 v-model로 받아올 변수
            selectedCat: '', // '카테고리' select에서 선택된 '카테고리'를 v-model로 받아올 변수
            beforeSelectedSido: '', // 이전에 선택한 '시도'를 담을 변수
            beforeSelectedSigungu: '', // 이전에 선택한 '시군구'를 담을 변수
            beforeSelectedEmd: '', // 이전에 선택한 '읍면동'을 담을 변수
            beforeSelectedCat: '', // 이전에 선택한 '카테고리'를 담을 변수
            pageActive: 1, // 현재 선택된 페이지를 담을 변수로 첫 MapView 동작 시 1로 설정
            totalPages: '', // 리스트 pagination을 위해 총 페이지 수를 받을 변수
            startNum: 0, // Pagination을 위해 현재 출력 페이지 배열의 시작 페이지 번호
            endNum: 0, // Pagination을 위해 현재 출력 페이지 배열의 마지막 페이지 번호
            contentUrl: '', // 유저의 선택에 맞는 리스트 출력을 위해 갱신 시 어떤 선택을 했는 지 구별을 위해 사용되는 변수
            clusterer: '',
            checkZoom: true,
        }
    },
    methods: {
        setOverlay(marker, facilityId){
            /////////////////////////////////////////////////////////////////////////////////////////////////
            // 데이터 가져오기
            axios.get('http://localhost:8090/api/facility', {params:{facilityId: facilityId}})
            .then(response =>{
                const facility = response.data;  
                /////////////////////////////////////////////////////////////////////////////////////////////////
                // content 설정
                const contentString = 
                    '<div style="width:300px; height: 300px; border:1px solid; border-color:black; overflow:scroll">'+
                        '<div style="padding:10px; background:white;">'+
                            '<div style="display: flex; align-items: center; margin-bottom:8px;">'+
                                `<div style="font-weight:bold; font-size: 18px">${facility.facilityName}</div>`+
                                `<div style="font-size: 11px">&nbsp;&nbsp;${facility.cat}</div>`+
                            '</div>'+
                            `<div style="font-size: 11px">${facility.roadAddr}</div>`+
                            `<div style="font-size: 11px; ">(지번) ${facility.landAddr}</div>`+
                            '<div style="display: flex; margin-top:8px; font-size: 11px">'+
                                '<div style="font-weight:bold;">기본정보&nbsp;</div>'+
                                `<div>${facility.basicInfo}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">영업시간&nbsp;</div>'+
                                `<div>${facility.businessHr}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">휴무일&nbsp;</div>'+
                                `<div>${facility.closedDay}</div>`+
                            '</div>'+   
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">전화번호&nbsp;</div>'+
                                `<div style="color:green">${facility.phoneNum}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                `<div style="font-weight:bold;" v-if="">홈페이지&nbsp;</div>`+
                                `${facility.website === '정보없음' ? '정보없음' : `<a href="${facility.website}" target="_blank">${facility.website}</a>`}` +
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">주차&nbsp;</div>'+
                                `<div>${facility.parkingAvail}</div>`+
                            '</div>'+   
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">이용로&nbsp;</div>'+
                                `<div>${facility.admissionFee}</div>`+
                            '</div>'+
                            '<div style="display :flex; justify-content: flex-end;">'+
                                '<button style="background:white; color:blue; border:none; padding:0px; margin-right:15px; font-size: 12px;">북마크</button>'+
                                '<button id="closeButton" style="background:white; color:blue; border:none; padding:0px; font-size: 12px;">닫기</button>'+
                            '</div>'+
                        '</div>'+
                        '<div style="padding:10px; background:#F7F7F7;">'+
                            '<div style="display: flex; align-items: center; margin-bottom:8px;">'+
                                '<div style="font-weight:bold;">반려동물 관련 사항</div>'+
                            '</div>'+        
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">추가요금&nbsp;</div>'+
                                `<div>${facility.petFee}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">전용&nbsp;</div>'+
                                `<div>${facility.petExclusive}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">크기&nbsp;</div>'+
                                `<div>${facility.petSize}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">제한사항&nbsp;</div>'+
                                `<div>${facility.petRestrictions}</div>`+
                            '</div>'+
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">장소(실내)&nbsp;</div>'+
                                `<div>${facility.indoorAvail}</div>`+
                            '</div>'+    
                            '<div style="display: flex; margin-top:1px; font-size: 11px">'+
                                '<div style="font-weight:bold;">장소(실외)&nbsp;</div>'+
                                `<div>${facility.outdoorAvail}</div>`+
                            '</div>'+  
                        '</div>'+
                    '</div>';

                const parser = new DOMParser();
                const content = parser.parseFromString(contentString, 'text/html');

                const imageSize = new kakao.maps.Size(8, 8);
                const closeButton = content.getElementById('closeButton');
                closeButton.addEventListener('click', () => {
                    this.activatedOverlay.setMap(null);
                    this.activatedOverlay = '';

                    this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/default.png'), imageSize));

                    for(let i=0; i<this.facility.length; i++){
                        if(this.clickedMarker.id === this.facilityList[i].facilityId){
                            this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificdefault.png'), new kakao.maps.Size(30, 30)));
                        }
                    }

                    this.clickedMarker = '';
                });

                content.body.addEventListener('mouseover', () => {
                    this.map.setCursor('default');
                });

                content.body.addEventListener('mouseout', () => {
                    this.map.setCursor('grab');
                });

                content.body.addEventListener('wheel', () => {
                    kakao.maps.event.preventMap();
                });

                /////////////////////////////////////////////////////////////////////////////////////////////////
                // overlay 설정
                // 이전에 출력한 overlay가 있는 경우 출력 해제 후 제거
                if(this.activatedOverlay !== ''){
                    this.activatedOverlay.setMap(null);
                    this.activatedOverlay = '';
                }

                const overlay = new kakao.maps.CustomOverlay({
                    position: marker.getPosition(),
                    content: content.body,
                    clickable: true,
                    xAnchor: -0.1,
                    zIndex: 3,
                });

                overlay.setMap(this.map);

                this.activatedOverlay = overlay;
            })
            .catch(error => {
                console.log(error);
            })
        },
        showOverlay(facilityList){
            // 맵 위치 클릭한 마커 중심으로 변경
            this.map.setCenter(new kakao.maps.LatLng(facilityList.lat, facilityList.lng));

            // 마커 다시 그리기
            this.displayMarker(this.markerPositions);

            const imageSize = new kakao.maps.Size(8, 8);

            // 이전에 클릭한 마커가 있는 경우 아이콘 기본값으로 변경
            if(this.clickedMarker !== ''){
                this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/default.png'), imageSize));

                for(let i=0; i<this.facilityList.length; i++){
                    if(this.clickedMarker.id === this.facilityList[i].facilityId){
                        this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificdefault.png'), new kakao.maps.Size(30, 30)));
                    }
                }

                this.clickedMarker = '';
            }
            
            // id로 해당 마커 찾기
            const targetMarker = this.markers.find((marker) => marker.id === facilityList.facilityId);
            const marker = targetMarker;

            marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/over.png'), imageSize));

            for(let i=0; i<this.facilityList.length; i++){
                if(marker.id === this.facilityList[i].facilityId){
                    marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificover.png'), new kakao.maps.Size(30, 30)));
                }
            }
            
            this.clickedMarker = marker;

            this.setOverlay(marker, facilityList.facilityId);
        },
        setListAndMarker(facilityListUrl, facilityLocationUrl, contentUrl){
            axios.get(facilityListUrl)
            .then(response => {
                this.facilityList = response.data.content;
                this.totalPages = response.data.totalPages;

                if(typeof this.$refs.scrollController !== 'undefined'){
                    this.$refs.scrollController.scrollTop = 0;
                }

                this.map.setCenter(new kakao.maps.LatLng(this.facilityList[0].lat, this.facilityList[0].lng));

                // startNum, endNum, pageActive 재설정
                if(this.totalPages != 0){
                    this.startNum = 1;
                    this.endNum = this.totalPages;
                    if(this.endNum > 5){
                        this.endNum = 5;
                    }
                }
                this.pageActive = this.startNum;
                this.contentUrl = contentUrl;

                axios.get(facilityLocationUrl)
                .then(response =>{
                    this.facilityLocation = response.data;

                    this.markerPositions = [];
                    for(var i = 0; i < this.facilityLocation.length; i++){
                        this.markerPositions.push([
                            this.facilityLocation[i].facilityId,
                            this.facilityLocation[i].facilityName,
                            this.facilityLocation[i].lat, 
                            this.facilityLocation[i].lng
                        ]);
                    }

                    this.displayMarker(this.markerPositions);
                })
                .catch(error =>{
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            })
        },
        setMapByEmd(){
            axios.get('http://localhost:8090/api/facilities/availability', {params:{emd: this.emd}})
            .then(response =>{
                const count = response.data;

                if(count == 0){
                    alert("존재하지 않는 동 이름입니다.");

                    this.emd = '';
                }else{
                    this.map.setMaxLevel(8);
                    this.map.setLevel(5);

                    this.selectedCat = '';
                    this.beforeSelectedCat = '';
                    this.selectedSido = '';
                    this.beforeSelectedSido = '';
                    this.selectedSigungu = '';
                    this.beforeSelectedSigungu = '';
                    this.selectedEmd = '';
                    this.beforeSelectedEmd = '';

                    this.setListAndMarker(
                        `http://localhost:8090/api/facilities?emd=${this.emd}&page=0&size=${this.size}`,
                        `http://localhost:8090/api/facilities/locations?emd=${this.emd}`,
                        `http://localhost:8090/api/facilities?emd=${this.emd}`
                    );
                }
            })
            .catch(error =>{
                console.log(error);
            })
        },
        setMapByCat(lat, lng){
            axios.get(`http://localhost:8090/api/facilities?cat=${this.cat}&lat=${lat}&lng=${lng}&page=0&size=${this.size}`)
            .then(response => {
                this.facilityList = response.data.content;
                this.totalPages = response.data.totalPages;

                axios.get(`http://localhost:8090/api/facilities/locations?cat=${this.cat}`)
                .then(response =>{
                    this.facilityLocation = response.data;

                    for(var i = 0; i < this.facilityLocation.length; i++){
                        this.markerPositions.push([
                            this.facilityLocation[i].facilityId,
                            this.facilityLocation[i].facilityName,
                            this.facilityLocation[i].lat, 
                            this.facilityLocation[i].lng
                        ]);
                    }

                    this.selectedCat = this.facilityList[0].cat;
                    this.beforeSelectedCat = this.selectedCat;
                    this.contentUrl = `http://localhost:8090/api/facilities?cat=${this.cat}&lat=${lat}&lng=${lng}`;

                    this.isFacilityDataLoaded = true; // 시설 정보, 시설 위치 정보 전부 fetch 완료 표시
                })
                .catch(error =>{
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            })
        },
        displayDefaultMap(lat, lng){
            const container = document.getElementById('map');

            const options = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 5,
            };

            this.map = new kakao.maps.Map(container, options);

            this.map.setMaxLevel(6);

            kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                if(this.map.getLevel() >= 1 && this.checkZoom === true){
                    this.displayMarker(this.markerPositions);
                }
            });

            kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                this.displayMarker(this.markerPositions);
            });
        },
        displayMap(){
            const container = document.getElementById('map');

            const options = {
                center: new kakao.maps.LatLng(this.facilityList[0].lat, this.facilityList[0].lng),
                level: 5,
            };

            this.map = new kakao.maps.Map(container, options);

            this.map.setMaxLevel(6);

            /////////////////////////////////////////////////////////////////////////////////////////////////
            // 마커 클러스터러 생성 및 이벤트 추가
            // this.clusterer = new kakao.maps.MarkerClusterer({
            //     map: this.map,
            //     averageCenter: true,
            //     disableClickZoom: true,
            //     minLevel: 12
            // });

            // kakao.maps.event.addListener(this.clusterer, 'clusterclick', () => {
            //     this.map.setLevel(this.map.getLevel()-1);
            // });

            this.displayMarker(this.markerPositions);

            kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                if(this.map.getLevel() >= 1 && this.checkZoom === true){
                    this.displayMarker(this.markerPositions);
                    //this.map.setMaxLevel(10);
                }
            });

            kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                this.displayMarker(this.markerPositions);
            });
        },
        initMap() {
            // 두 가지 경우
            // created 사이클에서 axios 사용 시 비동기적 동작으로 인해 fetch 완료 전 (isFacilityDataLoaded = false) mounted() 실행 가능 -> watch 동작 O
            // created 사이클에서 axios 사용 시 비동기적 동작으로 인해 fetch 완료 후 (isFacilityDataLoaded = true) mounted() 실행 가능 -> watch 동작 X

            if(typeof this.emd !== 'undefined' || typeof this.cat !== 'undefined'){
                if(this.isFacilityDataLoaded === true){
                    this.displayMap();
                }else{
                    this.$watch('isFacilityDataLoaded', (value) => {
                        if(value === true){
                            this.displayMap();
                        }
                    });
                }
            }else{
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.displayDefaultMap(position.coords.latitude, position.coords.longitude);
                        },
                        (error) => {
                            console.log(error);

                            this.displayDefaultMap(37.566535, 126.9779692);
                        }
                    )
                }else{
                    this.displayDefaultMap(37.566535, 126.9779692);
                }
            }
        },
        displayMarker(markerPositions) {
            // 기존 마커 제거
            if (this.markers.length > 0) {
                this.markers.forEach((marker) => {
                    marker.setMap(null);
                })
                this.markers = [];
            }

            // 범위를 지정할 각 모서리 변수
            const neLat = this.map.getBounds().getNorthEast().getLat();
            const neLng = this.map.getBounds().getNorthEast().getLng();
            const swLat = this.map.getBounds().getSouthWest().getLat();
            const swLng = this.map.getBounds().getSouthWest().getLng();

            // 반복문으로 마커 생성
            markerPositions.forEach((position) => {
                if((position[2] >= swLat && position[2] <= neLat) && (position[3] >= swLng && position[3] <= neLng)){
                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    // 마커 생성
                    const imageSize = new kakao.maps.Size(10, 10);

                    const marker = new kakao.maps.Marker({
                        map: this.map,
                        position: new kakao.maps.LatLng(position[2], position[3]),
                        title: position[1],
                        image: new kakao.maps.MarkerImage(require('../assets/marker/default.png'), imageSize),
                        zIndex: 1,
                    })
                    marker.id = position[0];
                    this.markers.push(marker);
                    //this.clusterer.addMarkers(this.markers);

                    const specificImageSize = new kakao.maps.Size(30, 30)
                    for(let i=0; i<this.facilityList.length; i++){
                        if(marker.id === this.facilityList[i].facilityId){
                            marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificdefault.png'), specificImageSize));
                            marker.setZIndex(2);
                        }
                    }

                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    // 마커 아이콘 관련 설정 및 이벤트
                    // 줌, 드래그 시 이전에 클릭한 마커 아이콘을 유지하기 위해 id로 체크 후 같은 마커는 아이콘 유지 
                    if(this.clickedMarker !== ''){
                        if(marker.id === this.clickedMarker.id){
                            marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/over.png'), imageSize));

                            for(let i=0; i<this.facilityList.length; i++){
                                if(marker.id === this.facilityList[i].facilityId){
                                    marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificover.png'), specificImageSize));
                                }
                            }

                            this.clickedMarker = marker;
                        }
                    }

                    // 마우스오버 할 때마다 아이콘 변경 표시
                    kakao.maps.event.addListener(marker, 'mouseover', () => {
                        marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/over.png'), imageSize));

                        for(let i=0; i<this.facilityList.length; i++){
                            if(marker.id === this.facilityList[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificover.png'), specificImageSize));
                            }
                        }
                    });

                    // 마우스아웃 할 때는 다시 아이콘 기본값 표시
                    kakao.maps.event.addListener(marker, 'mouseout', () => {
                        marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/default.png'), imageSize));

                        for(let i=0; i<this.facilityList.length; i++){
                            if(marker.id === this.facilityList[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificdefault.png'), specificImageSize));
                            }
                        }

                        // 단, 클릭한 마커가 있는 경우 아이콘 변경값 유지
                        if(this.clickedMarker !== ''){
                            this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/over.png'), imageSize));

                            for(let i=0; i<this.facilityList.length; i++){
                                if(this.clickedMarker.id === this.facilityList[i].facilityId){
                                    this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificover.png'), specificImageSize));
                                }
                            }
                        }
                    });

                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    // 마커 클릭 시 오버레이 출력
                    kakao.maps.event.addListener(marker, 'click', () => {
                        // 맵 위치 클릭한 마커 중심으로 변경
                        this.map.setCenter(new kakao.maps.LatLng(position[2], position[3]));

                        // 이전에 클릭한 마커가 있는 경우 아이콘 기본값으로 변경
                        if(this.clickedMarker !== ''){
                            this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/default.png'), imageSize));

                            for(let i=0; i<this.facilityList.length; i++){
                                if(this.clickedMarker.id === this.facilityList[i].facilityId){
                                    this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificdefault.png'), specificImageSize));
                                }
                            }

                            this.clickedMarker = '';
                        }
                        
                        marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/over.png'), imageSize));

                        for(let i=0; i<this.facilityList.length; i++){
                            if(marker.id === this.facilityList[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificover.png'), specificImageSize));
                            }
                        }
                        
                        this.clickedMarker = marker;

                        this.setOverlay(marker, position[0]);
                    });

                    /////////////////////////////////////////////////////////////////////////////////////////////////
                    // 지도 클릭 시 아이콘 기본값 설정 및 오버레이 삭제
                    kakao.maps.event.addListener(this.map, 'click', () => {
                        marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/default.png'), imageSize));

                        for(let i=0; i<this.facilityList.length; i++){
                            if(marker.id === this.facilityList[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('../assets/marker/specificdefault.png'), specificImageSize));
                            }
                        }

                        if(this.activatedOverlay !== ''){
                            this.activatedOverlay.setMap(null);
                            this.activatedOverlay = '';
                        }

                        this.clickedMarker = '';
                    });
                }
            })
        },
        getCat(){
            if(this.selectedCat.length !== 0){
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.map.setMaxLevel(6);
                            this.map.setLevel(5);

                            this.setListAndMarker(
                                `http://localhost:8090/api/facilities?cat=${this.selectedCat}&lat=${position.coords.latitude}&lng=${position.coords.longitude}&page=0&size=${this.size}`,
                                `http://localhost:8090/api/facilities/locations?cat=${this.selectedCat}`,
                                `http://localhost:8090/api/facilities?cat=${this.selectedCat}&lat=${position.coords.latitude}&lng=${position.coords.longitude}`
                            );
                        },
                        (error) => {
                            console.log(error);

                            this.map.setMaxLevel(6);
                            this.map.setLevel(5);

                            this.setListAndMarker(
                                `http://localhost:8090/api/facilities?cat=${this.selectedCat}&lat=${37.566535}&lng=${126.9779692}&page=0&size=${this.size}`,
                                `http://localhost:8090/api/facilities/locations?cat=${this.selectedCat}`,
                                `http://localhost:8090/api/facilities?cat=${this.selectedCat}&lat=${37.566535}&lng=${126.9779692}`
                            );
                        }
                    )
                }else{
                    this.map.setMaxLevel(6);
                    this.map.setLevel(5);

                    this.setListAndMarker(
                        `http://localhost:8090/api/facilities?cat=${this.selectedCat}&lat=${37.566535}&lng=${126.9779692}&page=0&size=${this.size}`,
                        `http://localhost:8090/api/facilities/locations?cat=${this.selectedCat}`,
                        `http://localhost:8090/api/facilities?cat=${this.selectedCat}&lat=${37.566535}&lng=${126.9779692}`
                    );
                }

                this.emd = '';
            }
        },
        getSido(){
            if(this.selectedCat === ''){
                alert("카테고리를 먼저 선택해주세요");
            }else{
                axios.get('http://localhost:8090/api/districts/sido')
                .then(response =>{
                    this.optionSido = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }
        },
        getFacilityBySido(){
            if(this.selectedSido.length !== 0){
                axios.get('http://localhost:8090/api/facilities/availability', {
                    params:{
                        cat: this.selectedCat,
                        sido: this.selectedSido.sidoName
                    }
                })
                .then(response =>{
                    const count = response.data;

                    if(count === 0){
                        alert("해당하는 시설이 없습니다.");

                        this.selectedSido = '';
                    }else{
                        this.beforeSelectedSido = this.selectedSido.sidoName;

                        this.checkZoom = false;
                        this.map.setMaxLevel(8);
                        this.map.setLevel(9);
                        this.checkZoom = true;

                        this.setListAndMarker(
                            `http://localhost:8090/api/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&page=0&size=${this.size}`,
                            `http://localhost:8090/api/facilities/locations?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}`,
                            `http://localhost:8090/api/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}`
                        );
                    }
                })
                .catch(error =>{
                    console.log(error);
                })

                this.emd = '';
            }
        },
        getSigungu(){
            if(this.selectedSido === ''){
                alert("시도를 먼저 선택해주세요");
            }else{
                axios.get('http://localhost:8090/api/districts/sigungu', {params:{sidoId: this.selectedSido.sidoId}})
                .then(response =>{
                    this.optionSigungu = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }
        },
        getFacilityBySigungu(){
            if(this.selectedSigungu.length !== 0){
                axios.get('http://localhost:8090/api/facilities/availability', {
                    params:{
                        cat: this.selectedCat,
                        sido: this.selectedSido.sidoName,
                        sigungu: this.selectedSigungu.sigunguName
                    }
                })
                .then(response =>{
                    const count = response.data;

                    if(count === 0){
                        alert("해당하는 시설이 없습니다.");

                        this.selectedSigungu = '';
                    }else{
                        this.beforeSelectedSigungu = this.selectedSigungu.sigunguName;

                        this.checkZoom = false;
                        this.map.setMaxLevel(8);
                        this.map.setLevel(6);
                        this.checkZoom = true;

                        this.setListAndMarker(
                            `http://localhost:8090/api/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&page=0&size=${this.size}`,
                            `http://localhost:8090/api/facilities/locations?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}`,
                            `http://localhost:8090/api/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}`
                        );
                    }
                })
                .catch(error =>{
                    console.log(error);
                })

                this.emd = '';
            }
        },
        getEmd(){
            if(this.selectedSigungu === ''){
                alert("시군구를 먼저 선택해주세요");
            }else{
                axios.get('http://localhost:8090/api/districts/emd', {params:{sigunguId: this.selectedSigungu.sigunguId}})
                .then(response =>{
                    this.optionEmd = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }
        },
        getFacilityByEmd(){
            if(this.selectedEmd.length !== 0){
                axios.get('http://localhost:8090/api/facilities/availability', {
                    params:{
                        cat: this.selectedCat,
                        sido: this.selectedSido.sidoName,
                        sigungu: this.selectedSigungu.sigunguName,
                        emd: this.selectedEmd.emdName
                    }
                })
                .then(response =>{
                    const count = response.data;

                    if(count === 0){
                        alert("해당하는 시설이 없습니다.");

                        this.selectedEmd = '';
                    }else{
                        this.beforeSelectedEmd = this.selectedEmd.emdName;

                        this.checkZoom = false;
                        this.map.setMaxLevel(8);
                        this.map.setLevel(5);
                        this.checkZoom = true;

                        this.setListAndMarker(
                            `http://localhost:8090/api/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&emd=${this.selectedEmd.emdName}&page=0&size=${this.size}`,
                            `http://localhost:8090/api/facilities/locations?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&emd=${this.selectedEmd.emdName}`,
                            `http://localhost:8090/api/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&emd=${this.selectedEmd.emdName}`
                        );
                    }
                })
                .catch(error =>{
                    console.log(error);
                })   
                
                this.emd = '';
            }
        },
        // 이전 버튼 클릭 시 startNum, endNum 재설정을 위한 메소드
        setPrevPageNum(){
            // isPrevDisabled()에 의해 startNum이 5 이하인 경우는 신경 X
            this.startNum = this.startNum - 5; // 시작 번호는 현재 시작 번호 - 5
            this.endNum = this.startNum + 4; // 마지막 번호는 현재 시작 번호 + 4
            this.pageActive = this.endNum; // 이전 버튼 클릭 시 선택 중인 페이지 표시를 위해 선택한 페이지 번호 리턴
            this.getFacilityContent(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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
            this.getFacilityContent(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        // 리스트 재출력을 위해 다시 facility 정보를 받아오기 위한 메소드
        getFacilityContent(i){
            let url = this.contentUrl + `&page=${i}&size=${this.size}`;

            axios.get(url)
            .then(response => {
                this.facilityList = response.data.content;

                this.$refs.scrollController.scrollTop = 0;
                
                this.map.setCenter(new kakao.maps.LatLng(this.facilityList[0].lat, this.facilityList[0].lng));
                
                this.displayMarker(this.markerPositions);
            })
            .catch(error => {
                console.log(error);
            })
        },
    },
    computed:{
      // 맨 첫 페이지 이전 버튼 동작 중지를 위해 startNum이 5 이하인 경우 false 리턴
      isPrevDisabled(){
        return this.startNum <= 5;
      },
      // startNum + 5를 하면 다음 페이지 배열의 시작 페이지 번호인데 총 페이지 수를 넘을 경우 false 리턴
      isNextDisabled(){
        return this.startNum+5 >= this.totalPages;
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
    created() {
        // 동 이름 또는 카테고리 파라미터 받기
        this.emd = this.$route.query.emd
        this.cat = this.$route.query.cat

        // 동 이름을 파라미터로 받은 경우
        if(typeof this.emd != 'undefined'){
            axios.get(`http://localhost:8090/api/facilities?emd=${this.emd}&page=0&size=${this.size}`)
            .then(response => {
                this.facilityList = response.data.content;
                this.totalPages = response.data.totalPages;

                axios.get(`http://localhost:8090/api/facilities/locations?emd=${this.emd}`)
                .then(response =>{
                    this.facilityLocation = response.data;

                    for(var i = 0; i < this.facilityLocation.length; i++){
                        this.markerPositions.push([
                            this.facilityLocation[i].facilityId,
                            this.facilityLocation[i].facilityName,
                            this.facilityLocation[i].lat, 
                            this.facilityLocation[i].lng
                        ]);
                    }

                    this.contentUrl = `http://localhost:8090/api/facilities?emd=${this.emd}`;

                    this.isFacilityDataLoaded = true; // 시설 정보, 시설 위치 정보 전부 fetch 완료 표시
                })
                .catch(error =>{
                    console.log(error);
                })
            })
            .catch(error => {
                console.log(error);
            })
        }

        // 카테고리를 파라미터로 받은 경우
        if(typeof this.cat !== 'undefined'){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.setMapByCat(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.log(error);

                        this.setMapByCat(37.566535, 126.9779692);
                    }
                )
            }else{
                this.setMapByCat(37.566535, 126.9779692);
            }
        }
    },
    mounted() {    
        if(!window.kakao || !window.kakao.maps){
            const script = document.createElement("script");
            script.src = 
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=52ab0e36c22fd3c43884e5698628abe2&libraries=clusterer";

            /* global kakao */
            script.addEventListener("load", () => {
                kakao.maps.load(this.initMap);
            });

            document.head.appendChild(script);
        }else {
            this.initMap();
        }  
    },
    watch:{
        selectedCat: function(){
            this.selectedSido = '',
            this.optionSido = [],
            this.selectedSigungu = '',
            this.optionSigungu = [],
            this.selectedEmd = '',
            this.optionEmd = []
        },
        selectedSido: function(){
            this.selectedSigungu = '',
            this.optionSigungu = [],
            this.selectedEmd = '',
            this.optionEmd = []
        },
        selectedSigungu: function(){
            this.selectedEmd = '',
            this.optionEmd = []
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