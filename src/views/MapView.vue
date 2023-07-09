<template>
<div>
    <!-- div-map-top은 header 밑 검색바 div와 select 메뉴 div를 담을 div -->
    <div class="div-map-top">
        <!-- div-map-search는 검색바를 담을 div -->
        <div class="div-map-search">
            <!-- 읍면동 이름 검색 시 setMapByEmd 메소드 호출 -->
            <form class="form-map-search" @submit.prevent="setMapByEmd()">
                <div class="input-group">
                    <!-- span, svg, path는 아이콘 설정 관련 -->
                    <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </span>
                    <!-- 검색바 input type text, 검색 시 emd 변수에 데이터 전달 -->
                    <input type="text" v-model="emd" class="form-control" placeholder="동 이름을 검색하세요" aria-label="keyword" aria-describedby="basic-addon1">
                </div>
            </form>
        </div>
        <!-- div-map-select는 select 메뉴를 담기 위한 div -->
        <div class="div-map-select">
            <!-- 카테고리, 시도, 시군구, 읍면동은 select에서 옵션 선택 시 각 v-model에 지정한 변수에 전달되고 -->
            <!-- 카테고리 select은 @change로 옵션 변경 시 getFacilitiesByCat 메소드 호출 -->
            <!-- 나머지 select 메뉴들은 클릭 시 지정된 메소드로 백엔드 서버로부터 옵션 데이터를 받아옴 -->
            <!-- option 내부 v-for문으로 각 select 별 리스트에서 옵션 반복 출력 -->
            <select class="form-select select-map" v-model="selectedCat" @change="getFacilitiesByCat()" aria-label="Default select example">
                <option value="" selected>카테고리 선택</option>
                <option v-for="item in optionCat" :value="item" :key="item">{{ item }}</option>
            </select>
            <select class="form-select select-map" v-model="selectedSido" @click="getSido()" @change="getFacilitiesBySido()" aria-label="Default select example">
                <option value="" selected>시도 선택</option>
                <option v-for="item in sidoOptions" :value="item" :key="item.sidoId">{{ item.sidoName }}</option>
            </select>
            <select class="form-select select-map" v-model="selectedSigungu" @click="getSigungu()" @change="getFacilitiesBySigungu()" aria-label="Default select example">
                <option value="" selected>시군구 선택</option>
                <option v-for="item in sigunguOptions" :value="item" :key="item.sigunguId">{{ item.sigunguName }}</option>
            </select>
            <select class="form-select select-map" v-model="selectedEmd" @click="getEmd()" @change="getFacilityByEmd()" aria-label="Default select example">
                <option value="" selected>읍면동 선택</option>
                <option v-for="item in emdOptions" :value="item" :key="item.emdId">{{ item.emdName }}</option>
            </select>
        </div>
    </div>
    <!-- div-map-main는 시설 리스트 div 및 카카오맵 api 출력을 위한 div를 담기 위한 div -->
    <div class="div-map-main">
        <!-- div-map-list는 시설 리스트 div -->
        <div class="div-map-list" ref="scrollController" >
            <!-- facilities 리스트에 데이터가 있는 경우만 리스트 출력 -->
            <!-- div-map-card는 card를 반복 출력할 div와 pagination div를 담을 div -->
            <div class="card div-map-card" v-if="facilities.length > 0">
                <!-- div-map-card-body는 facilities 리스트에서 들어있는 시설 갯수만큼 반복해서 출력 -->
                <!-- 이하 자식 div는 facility의 데이터 출력 -->
                <div class="card-body div-map-card-body" v-for="(facility, index) in facilities" :key="index">
                    <div class="div-map-card-body-title">
                        <div class="div-map-card-body-title-facilityname">{{facility.facilityName}}</div>
                        <div class="div-map-card-body-title-cat">&nbsp;&nbsp;{{facility.cat}}</div>
                    </div>
                    <div class="div-map-card-body-roadaddr">{{facility.roadAddr}}</div>
                    <div class="div-map-card-body-landaddr">(지번) {{facility.landAddr}}</div>
                    <div class="div-map-card-body-basicinfo">
                        <div class="div-map-card-body-basicinfo-title">기본정보&nbsp;</div>
                        <div>{{facility.basicInfo}}</div>
                    </div>
                    <div class="div-map-card-body-businesshr" style="display: flex; font-size: 11px">
                        <div class="div-map-card-body-businesshr-title">영업시간&nbsp;</div>
                        <div>{{facility.businessHr}}</div>
                    </div>
                    <div class="div-map-card-body-phonenum" style="display: flex; font-size: 11px">
                        <div class="div-map-card-body-phonenum-title">전화번호&nbsp;</div>
                        <div style="color:green">{{facility.phoneNum}}</div>
                    </div>
                    <!-- 북마크, 상세보기 클릭 시 각각 addBookmark, showDetails 메소드 호출 -->
                    <div class="div-map-card-body-buttons">
                        <button class="button-map-card-body-detail" @click="showDetails(facility)">상세보기</button>
                        <button class="button-map-card-body-bookmark" @click="addBookmark(facility.facilityId)">북마크</button>
                    </div>
                </div>

                <!-- div-map-pagination은 pagination을 위한 div -->
                <div class="div-map-pagination">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination pagination-sm">
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
                                <button class="page-link" @click="getFacilitiesByPage(i-1)">{{i}}</button>
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
        </div>
        <!-- div-map-map은 카카오톡 api div -->
        <div class="div-map-map">
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
            size: 10, // pagination을 위한 백엔드에 pageable 데이터로 보내는 page 사이즈 변수
            emd: '', // MapView로 이동 시 동 이름을 받을 변수
            cat: '', // MapView로 이동 시 카테고리 이름을 받을 변수, 이후 데이터를 받고 맵 설정을 하는 데 사용
            facilities: [], // 리스트 출력을 위해 시설 정보를 받을 배열
            facilityLocations: [], // 마커 출력을 위해 시설 위치 정보를 받을 배열
            markerPositions: [], // 마커 위치를 저장할 배열, 시설 위치 정보를 받아 지정함
            markers: [], // 실제 마커를 담을 배열
            clickedMarker: '', // 현재 선택(클릭)된 마크를 담을 변수
            activatedOverlay: '', // 현재 보여지고 있는 오버레이를 담을 변수
            map: null, // 카카오맵 api 지도 변수
            sidoOptions: [], // 행정구역 '시도'를 담을 배열
            sigunguOptions: [], // 행정구역 '시군구'를 담을 배열
            emdOptions: [], // 행정구역 '읍면동'을 담을 배열
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
            pageActive: 1, // 현재 선택된 페이지를 담을 변수로 첫 MapView 동작 시 1로 설정
            totalPages: '', // 리스트 pagination을 위해 총 페이지 수를 받을 변수
            startNum: 0, // Pagination을 위해 현재 출력 페이지 배열의 시작 페이지 번호
            endNum: 0, // Pagination을 위해 현재 출력 페이지 배열의 마지막 페이지 번호
            contentUrl: '', // 유저의 선택에 맞는 리스트 출력을 위해 갱신 시 어떤 선택을 했는 지 구별을 위해 사용되는 변수
            zoomByWheel: true, // 마우스 휠에 의한 줌 변경인지, 코드 내에서 줌 레벨 변경에 의한 줌 변경인지 구별하는 데 쓰이는 변수
        }
    },
    methods: {
        // 북마크 추가 메소드
        // 시설 id를 매개변수로 받는다
        async addBookmark(facilityId){
            // 로컬 스토리지에 accessToken이 있는 경우(로그인 되어 있는 경우)만 북마크 추가 가능
            if(localStorage.getItem("accessToken") !== null){
                if(confirm("정말 북마크에 등록하시겠습니까?")){
                    try {
                        // acccessToken + 시설 id로 post 요청
                        const addBookmarkResponse = await axios.post('http://localhost:8090/api/map/bookmark', {
                            facilityId: facilityId
                        }, {
                            headers:{'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                        });

                        if(addBookmarkResponse.data === 'addedBookmark'){
                            alert("이미 북마크에 등록되어 있는 시설입니다.");
                        }else if(addBookmarkResponse.data === 'success'){
                            alert("북마크에 등록했습니다.");
                        }else if(addBookmarkResponse.data === 'invalidAccessToken'){
                            // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
                            // axios의 동기적 동작을 위해 async/await 사용
                            // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                            const getNewAccessTokenResponse = await axios.get('http://localhost:8090/api/member/accesstoken', {
                                withCredentials: true
                            })

                            // 백엔드로부터 refreshToken이 유효하지 않다는 응답을 받은 경우
                            if(getNewAccessTokenResponse.data === 'invalidRefreshToken'){
                                // 기존에 로컬 스토리지에 저장되어 있던 accessToken 삭제
                                localStorage.removeItem("accessToken");
                                // 기존에 로컬 스토리지에 저장되어 있던 authority 삭제
                                localStorage.removeItem("authority");

                                // 로그인 만료 알림
                                alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                                // 유저에게 바로 로그인 페이지로 이동할지 묻기
                                if(confirm("다시 로그인하시겠습니까?")){
                                    // 로그인 후 보고 있던 페이지로 돌아오기 위해 현재 페이지 경로 저장 
                                    localStorage.setItem("previousPage", this.$route.fullPath);

                                    // 확인 버튼 누른 경우 로그인 페이지로 이동
                                    this.$router.push({path: "/signin"});
                                }

                                // 로그인 상태일 때만 볼 수 있는 페이지에서 로그아웃 버튼을 누른 경우는 메인 페이지로 이동
                                if(this.$route.path === "/board/writing"
                                    || this.$route.path === "/board/modifying"
                                    || this.$route.path === "/mypage" 
                                    || this.$route.path === "/mypage/deletingAccount" 
                                    || this.$route.path === "/admin"){
                                    this.$router.push({path: "/"});
                                }

                                // header 메뉴 갱신을 위해 새로고침
                                this.$router.go(this.$router.currentRoute);
                            }else {
                                // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우

                                // 재발급 받은 accessToken 로컬 스토리지에 저장
                                localStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);

                                // acccessToken + 시설 id로 post 재요청
                                const reAddBookmarkResponse = await axios.post('http://localhost:8090/api/map/bookmark', {
                                    facilityId: facilityId
                                }, {
                                    headers:{'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                                });

                                // accessToken이 유효한 경우 => post 요청 성공
                                if(reAddBookmarkResponse.data !== 'invalidAccessToken'){
                                    if(reAddBookmarkResponse.data === 'addedBookmark'){
                                        alert("이미 북마크에 등록되어 있는 시설입니다.");
                                    }else if(reAddBookmarkResponse.data === 'success'){
                                        alert("북마크에 등록했습니다.");
                                    }
                                }
                            }
                        }
                } catch(error) {
                    console.log(error);
                }
                }
            }else{
                // 로그인 상태가 아닌 경우 로그인 요청
                alert("북마크 추가를 위해서는 로그인하셔야 합니다.");
                
                // 유저에게 바로 로그인 페이지로 이동할 지 묻기
                if(confirm("로그인 하시겠습니까?")){
                    // 로그인 후 현재 페이지로 돌아오기 위해 로컬 스토리지에 현재 페이지 주소 저장
                    localStorage.setItem("previousPage", this.$route.fullPath);
                    
                    // 로그인 페이지로 이동
                    this.$router.push('/signin');
                }
            }
        },
        // 마커 클릭 또는 상세보기 클릭 시 마커 옆에 출력할 오버레이 설정 메소드
        async setOverlay(marker, facilityId){
            // 해당 마커와 해당 마커의 시설 id를 매개변수로 받음

            // 마커가 겹쳐 있는 경우가 있으므로 선택한 마커를 가장 최상위로 출력
            marker.setZIndex(3);
            
            // 시설 정보 데이터 가져오기
            axios.get('http://localhost:8090/api/map/facility/information', {params:{facilityId: facilityId}})
            .then(response =>{
                // 응답 데이터(해당 시설 id로 받아온 시설 정보) 설정
                const facility = response.data;
                
                // 오버레이의 html content를 String으로 선언
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
                                '<button id="addBookmark" style="background:white; color:blue; border:none; padding:0px; margin-right:15px; font-size: 12px;">북마크</button>'+
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
                const content = parser.parseFromString(contentString, 'text/html'); // String 컨텐츠를 text/html로 파싱

                // 오버레이 내 북마크 추가 버튼에 클릭 이벤트 리스너 추가를 위해 버튼 id로 가져오기
                const addBookmark = content.getElementById("addBookmark");
                addBookmark.addEventListener('click', () => {
                    // 북마크 추가 클릭 시 해당 오버레이가 가지고 있는 시설 id로 북마크 추가 메소드 호출
                    this.addBookmark(facility.facilityId);
                });

                // 오버레이 내의 닫기 클릭 이벤트 리스너 추가를 위해 버튼 id로 가져오기
                const closeButton = content.getElementById("closeButton");
                closeButton.addEventListener('click', () => {
                    // 오버레이 닫기 버튼 클릭 시 동작

                    // activatedOverlay는 현재 출력 되어 있는 오버레이 변수
                    this.activatedOverlay.setMap(null); // 지도에서 오버레이 없애기
                    this.activatedOverlay = ''; // 오버레이 변수 초기화
 
                    // 이전에 클릭한 마커가 있는 경우 해제
                    if(this.clickedMarker !== ''){
                        // 작은 마커 클릭 가정 먼저 => 기본값으로
                        // 이후 리스트에 있는 마커 인지 검사 => 기본값으로

                        // 작은 마커 이미지 사이즈 설정
                        const smallMarkerSize = new kakao.maps.Size(8, 8);
                        // 리스트 기준 마커 이미지 사이즈 설정
                        const listMarkerSize = new kakao.maps.Size(35, 35);
                        
                        // 오버레이 출력 시 마커의 이미지가 바뀌는데 리스트 기준 마커 외 작은 마커 중 클릭 상태의 마커 또한 기본 아이콘으로 변경
                        this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/smallMarker.png'), smallMarkerSize));
                        this.clickedMarker.setZIndex(1); // 항상위 레벨 다시 조정

                        // 오버레이 출력 시 마커의 이미지가 바뀌는데 닫기 버튼 클릭 시 리스트 기준 마커 다시 기본 이미지로 변경
                        // facilities(시설 리스트)에서 찾기
                        for(let i=0; i<this.facilities.length; i++){
                            // 마커 마다 id가 할당되어 있음
                            // 해당 마커 id와 리스트에 출력 중인 시설들의 id 중 일치하는 경우 => 리스트 마커 아이콘 적용
                            if(this.clickedMarker.id === this.facilities[i].facilityId){
                                this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/listMarker.png'), listMarkerSize));
                                this.clickedMarker.setZIndex(2); // 항상위 레벨 다시 조정
                            }
                        }

                        // 클릭했던 마커 초기화
                        this.clickedMarker = '';
                    }
                });

                // 오버레이 내에서 마우스 이동 시 커서 변경
                content.body.addEventListener('mouseover', () => {
                    this.map.setCursor('default');
                });

                // 오버레이 밖으로 마우스 이동 시 커서 변경
                content.body.addEventListener('mouseout', () => {
                    this.map.setCursor('grab');
                });

                // 오버레이 내에서 휠 사용 시 카카오맵에도 휠 적용되는 것 방지
                content.body.addEventListener('wheel', () => {
                    kakao.maps.event.preventMap();
                });

                // 이전에 출력한 overlay가 있는 경우(=이미 지도에 오버레이가 출력되어 있는 경우)
                if(this.activatedOverlay !== ''){
                    this.activatedOverlay.setMap(null); // 지도에서 지우기
                    this.activatedOverlay = ''; // 초기화
                }

                // overlay 만들기
                const overlay = new kakao.maps.CustomOverlay({
                    position: marker.getPosition(), // 기준은 마커 위치
                    content: content.body, // 위에서 만든 html
                    clickable: true, // 클릭 가능
                    xAnchor: -0.1, // 마커를 기준으로 우측에 띄우도록 설정
                    zIndex: 3, // 카카오맵 요소 중 가장 맨 위에 띄우도록 설정
                });

                overlay.setMap(this.map); // 카카오맵에 할당

                this.activatedOverlay = overlay; // 현재 출력 중인 오버레이를 변수에 담음
            })
            .catch(error => {
                console.log(error);
            })
        },
        // 리스트 내의 상세보기 클릭 시 오버레이를 출력하는 메소드
        showDetails(facility){
            // 상세보기 할 시설 변수를 매개변수로 받음

            // 상세보기를 클릭한 시설의 좌표로 맵 이동
            this.map.setCenter(new kakao.maps.LatLng(facility.lat, facility.lng));

            // 위에서 이동한 위치 기준으로 맵에 마커 다시 그리기
            this.displayMarker();

            // 작은 마커 이미지 사이즈 설정
            const smallMarkerSize = new kakao.maps.Size(8, 8);
            // 리스트 기준 마커 이미지 사이즈 설정
            const listMarkerSize = new kakao.maps.Size(35, 35);

            // 이전에 클릭한 마커가 있는 경우 해제
            if(this.clickedMarker !== ''){
                // 작은 마커라고 가정하고 먼저 기본 마커 아이콘으로 변경
                this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/smallMarker.png'), smallMarkerSize));

                // 이후 리스트 마커인 경우 기본 리스트 마커 아이콘으로 변경
                // facilities(시설 리스트)에서 찾기
                for(let i=0; i<this.facilities.length; i++){
                    // 마커 마다 id가 할당되어 있음
                    // 해당 마커 id와 리스트에 출력 중인 시설들의 id 중 일치하는 경우 => 리스트 마커 아이콘 적용
                    if(this.clickedMarker.id === this.facilities[i].facilityId){
                        this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/listMarker.png'), listMarkerSize));
                    }
                }

                // 클릭된 마커 변수 초기화
                this.clickedMarker = '';
            }
            
            // 지도에 출력중인 마커(marker.id) 중 리스트에서 상세보기를 클릭한 시설의 마커(facility.failityId) 찾기
            const targetMarker = this.markers.find((marker) => marker.id === facility.facilityId);
            const marker = targetMarker; // 해당 마커 설정

            // facilities(시설 리스트)에서 찾기
            for(let i=0; i<this.facilities.length; i++){
                // 마커 마다 id가 할당되어 있음
                // 상세보기 클릭한 시설의 마커 id와 리스트에 출력 중인 시설들의 id 중 일치하는 경우 => 리스트 마커 클릭 아이콘 적용
                if(marker.id === this.facilities[i].facilityId){
                    marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedListMarker.png'), listMarkerSize));
                }
            }
            
            this.clickedMarker = marker; // 변경한 마커를 클릭 중인 마커로 설정

            this.setOverlay(marker, facility.facilityId); // 오버레이 출력을 위해 마커 정보와 시설 id로 호출
        },
        // 화면 왼쪽 시설 리스트와 화면 오른쪽 지도 위의 마커 설정을 위한 메소드
        // 읍면동 검색, select 선택 등 조건이 바뀔 때 시설 정보, 시설 위치 정보를 백엔드에서 받아와서 설정해주기 위한 메소드 
        async setListAndMarker(facilitiesUrl, facilityLocationsUrl, maxLevel, level){
            try {
                const facilitiesResponse = await axios.get(facilitiesUrl);

                // 시설 정보 임시 변수에 담아 검색 결과에 존재하는지 먼저 체크
                const tempFacilities = facilitiesResponse.data.content; // 시설 정보 => 리스트 출력   

                if(tempFacilities.length === 0) {
                    // 검색 결과에 맞는 시설이 없는 경우
                    alert("검색 결과가 존재하지 않습니다.");
                }else{
                    this.facilities = tempFacilities; // 임시 변수 => 시설 정보 변수에 저장
                    this.totalPages = facilitiesResponse.data.totalPages; // => 페이지네이션을 위한 총 페이지 수

                    // 시설 목록을 새로 받아와서 맵 이동, 마커 표시를 할 때 기존에 마커가 있는 상태인 경우
                    // 화면에 마커가 있는 상태에서 맵 이동을 하게 되어 부자연스러우므로 기존 마커 먼저 제거
                    // 기존 마커 제거 => markers 배열의 길이가 0보다 큰 경우 마커 정보가 들어있는 경우
                    if (this.markers.length > 0) {
                        // markers 배열에 있는 marker 수만큼 반복 => 각 marker 맵에서 지우기 
                        this.markers.forEach((marker) => {
                            marker.setMap(null);
                        })
                        this.markers = []; // 마커 전부 초기화
                    }

                    // 리스트 출력 div 내부에 스크롤이 있는 경우 리스트 재출력 시 스크롤 상단으로 위치
                    if(typeof this.$refs.scrollController !== 'undefined'){
                        this.$refs.scrollController.scrollTop = 0;
                    }

                    // pagination 변수 설정
                    // 페이지 번호 1~5까지 설정 
                    // startNum, endNum, pageActive 재설정
                    if(this.totalPages != 0){
                        this.startNum = 1; // pagination 시작 번호
                        this.endNum = this.totalPages; // 처음은 pagination 마지막 번호가 5이하라고 가정

                        // 만약 마지막 번호가 5를 넘는 경우는 다음 pagination이므로 첫 번째 pagination의 최대치인 5로 설정 
                        if(this.endNum > 5){
                            this.endNum = 5;
                        }
                    }
                    this.pageActive = this.startNum; // 첫 출력이므로 현재 선택 중인 페이지 1로 설정

                    this.zoomByWheel = false;
                    // 이전 출력 중인 맵의 레벨이 새로 지정할 최대 레벨보다 크면 줌 변화가 2번 발생하므로 체크
                    if(this.map.getLevel() > maxLevel){
                        this.map.setLevel(level); // 지도 줌 레벨 먼저 설정
                        this.map.setMaxLevel(maxLevel); // 지도 줌 변경 최대 레벨 설정
                    }else{
                        this.map.setMaxLevel(maxLevel); // 지도 줌 변경 최대 레벨 설정
                        this.map.setLevel(level); // 지도 줌 레벨 설정
                    }
                    this.zoomByWheel = true;

                    // 시설 목록 중 제일 처음 시설 위치를 기준으로 맵 이동
                    this.map.setCenter(new kakao.maps.LatLng(this.facilities[0].lat, this.facilities[0].lng));

                    // 마커 설정을 위해 위치 정보 받기
                    const facilityLocationsResponse = await axios.get(facilityLocationsUrl);

                    this.facilityLocations = facilityLocationsResponse.data; // 해당 검색 조건에 맞는 시설들의 위치를 전부 받아옴

                    this.markerPositions = []; // 마커 정보를 담을 리스트 초기화

                    // 시설의 수 만큼 반복
                    for(var i = 0; i < this.facilityLocations.length; i++){
                        // 마커 생성을 위해 마커 정보 리스트에 각 시설의 id, 시설명, 위도, 경도 넣기
                        this.markerPositions.push([
                            this.facilityLocations[i].facilityId,
                            this.facilityLocations[i].facilityName,
                            this.facilityLocations[i].lat, 
                            this.facilityLocations[i].lng
                        ]);
                    }

                    // 마커 출력 메소드 호출
                    this.displayMarker();
                }
            } catch (error) {
                console.log(error);
            }
        },
        // 동 이름 검색 시 화면 설정 메소드
        setMapByEmd(){
            // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
            this.contentUrl = `http://localhost:8090/api/map/facilities?emd=${this.emd}`;

            // 시설 리스트, 마커 설정 메소드 호출
            this.setListAndMarker(
                `http://localhost:8090/api/map/facilities?emd=${this.emd}&page=0&size=${this.size}`,
                `http://localhost:8090/api/map/facility/locations?emd=${this.emd}`,
                8,
                5
            );

            this.$router.replace({query: {emd: this.emd}}); // 쿼리 바꾸기
        },
        // 헤더에서 지도 메뉴 클릭시 처음 지도 출력 시 마커 없이 지도만 출력하는 메소드
        displayMap(lat, lng){
            // id = map인 div 가져오기
            const container = document.getElementById('map');

            // 지도 중심 위도/경도 설정
            // 지도 줌 레벨 설정
            const options = {
                center: new kakao.maps.LatLng(lat, lng),
                level: 5,
            };

            // 카카오맵 객체 생성
            this.map = new kakao.maps.Map(container, options);

            // 카카오맵 확대 최대 레벨 설정
            this.map.setMaxLevel(6);

            // 지도 객체에 대해 카카오맵 줌 변화 이벤트 리스너 추가
            kakao.maps.event.addListener(this.map, "zoom_changed", ()=> {
                // 어떤 레벨이든 지도 줌 변화 시 마커 다시 그리기 
                if(this.map.getLevel() >= 1 && this.zoomByWheel === true){
                    this.displayMarker(); // 마커 그리기 메소드 호출
                }
            });

            // 지도 객체에 대해 카카오맵 드래그 이벤트 리스너 추가
            kakao.maps.event.addListener(this.map, 'dragend', ()=> {        
                // 드래그 할 때마다 마커 다시 그리기
                this.displayMarker();
            });
        },
        // 현재 위치 또는 기본값 위치를 리턴하는 메소드
        getPosition(){
            return new Promise((resolve) => {
                if(navigator.geolocation){
                    // 위치 정보 액세스 가능한 경우
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            // 현재 위치 접근 가능한 경우
                            resolve({
                                latitude: position.coords.latitude, // 현재 위치 위도
                                longitude: position.coords.longitude // 현재 위치 경도
                            });
                        },
                        (error) => {
                            // 현재 위치 접근 불가능한 경우
                            resolve({
                                latitude: 37.566535, // 위도 기본값 => 서울
                                longitude: 126.9779692 // 경도 기본값 => 서울
                            });

                            console.log(error);
                        }
                    )
                }else{
                    // 위치 정보 액세스 불가능한 경우
                    resolve({
                        latitude: 37.566535, // 위도 기본값 => 서울
                        longitude: 126.9779692 // 경도 기본값 => 서울
                    });
                }
            })
        },
        // 지도 객체 생성 전 시설 정보 데이터 수신 여부, 위치 정보 제공 유무 등을 체크하는 메소드
        // 위치 지정 or not => 시설 정보 데이터 받기 => 시설 위치 데이터 받기 => displayMap() => displayMarker()
        // 동기적 동작을 위해 async 지정
        async initMap() {
            let currentLat; // 현재 위치 위도
            let currentLng; // 현재 위치 경고

            // 현재 위치의 위도 및 경도 설정
            try {
                // 현재 또는 기본 위치 정보 받기
                const position = await this.getPosition();

                currentLat = position.latitude; // 현재 위치 또는 기본값 위도
                currentLng = position.longitude; // 현재 위치 또는 기본값 경도
            } catch (error) {
                console.log(error);
            }

            if(typeof this.emd === 'undefined' && typeof this.cat === 'undefined'){
                // 지도 메뉴를 클릭한 경우
                this.displayMap(currentLat, currentLng);
            }else{
                let facilitiesUrl; // 시설 정보 데이터 get 요청 주소
                let facilityLocationsUrl; // 시설 위치 데이터 get 요청 주소

                if(typeof this.emd !== 'undefined'){
                    // 메인 페이지에서 동 이름을 검색한 경우
                    facilitiesUrl = `http://localhost:8090/api/map/facilities?emd=${this.emd}&page=0&size=${this.size}`;
                    facilityLocationsUrl = `http://localhost:8090/api/map/facility/locations?emd=${this.emd}`;

                    // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
                    this.contentUrl = `http://localhost:8090/api/map/facilities?emd=${this.emd}`;
                }else if(typeof this.cat !== 'undefined'){
                    // 메인 페이지에서 카테고리를 클릭한 경우
                    facilitiesUrl = `http://localhost:8090/api/map/facilities?cat=${this.cat}&lat=${currentLat}&lng=${currentLng}&page=0&size=${this.size}`;
                    facilityLocationsUrl = `http://localhost:8090/api/map/facility/locations?cat=${this.cat}`;

                    // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
                    this.contentUrl = `http://localhost:8090/api/map/facilities?cat=${this.cat}&lat=${currentLat}&lng=${currentLng}`;

                    // 쿼리에 따라 카테고리 select 출력 변경
                    if(this.cat === '동물용품'){
                        this.selectedCat = '반려동물용품';
                    }else{
                        this.selectedCat = this.cat; 
                    }
                }

                try {
                    // 시설 정보 get 요청
                    const facilitiesResponse = await axios.get(facilitiesUrl);

                    // 시설 정보 임시 변수에 담아 검색 결과에 존재하는지 먼저 체크
                    const tempFacilities = facilitiesResponse.data.content;

                    if(tempFacilities.length === 0){
                        // 동 이름 검색 시 해당하는 시설이 없는 경우 안내
                        alert("검색 결과가 존재하지 않습니다.");

                        // 지도만 출력
                        this.displayMap(currentLat, currentLng);
                    }else{
                        this.facilities = tempFacilities; // 임시 변수 => 시설 정보 변수에 저장
                        this.totalPages = facilitiesResponse.data.totalPages; // => 페이지네이션을 위한 총 페이지 수

                        // 시설 위치 정보 get 요청
                        const facilityLocationsResponse = await axios.get(facilityLocationsUrl);

                        this.facilityLocations = facilityLocationsResponse.data; // 시설 위치 정보 받기

                        // 시설 위치의 수만큼 반복하여 마커 위치를 담는 배열에 위치 정보 데이터 저장
                        for(let i = 0; i < this.facilityLocations.length; i++){
                            this.markerPositions.push([
                                this.facilityLocations[i].facilityId,
                                this.facilityLocations[i].facilityName,
                                this.facilityLocations[i].lat, 
                                this.facilityLocations[i].lng
                            ]);
                        }

                        this.displayMap(this.facilities[0].lat, this.facilities[0].lng); // displayMap 메소드 호출
                        this.displayMarker(); // 마커 그리기
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        // 카카오맵 지도 위에 마커를 그리는 메소드
        displayMarker() {
            // 기존 마커 제거 => markers 배열의 길이가 0보다 큰 경우 마커 정보가 들어있는 경우
            if (this.markers.length > 0) {
                // markers 배열에 있는 marker 수만큼 반복 => 각 marker 맵에서 지우기 
                this.markers.forEach((marker) => {
                    marker.setMap(null);
                })
                this.markers = []; // 마커 전부 초기화
            }

            // 범위를 지정할 각 모서리 변수
            const neLat = this.map.getBounds().getNorthEast().getLat(); // 맵 북동 쪽 경계 부분 위도
            const neLng = this.map.getBounds().getNorthEast().getLng(); // 맵 북동 쪽 경계 부분 경도
            const swLat = this.map.getBounds().getSouthWest().getLat(); // 맵 남서 쪽 경계 부분 위도
            const swLng = this.map.getBounds().getSouthWest().getLng(); // 맵 남서 쪽 경계 부분 경도

            // 반복문으로 마커 생성
            // 마커 포지션 수만큼 반복
            // position[0] => 시설 id
            // position[1] => 시설명
            // position[2] => 위도
            // position[3] => 경도
            // 작은 마커 + 리스트 마커 (화면 왼쪽에 출력되는 시설 목록에 해당하는 마커는 다른 이미지로 표시)
            this.markerPositions.forEach((position) => {
                // 위도 및 경도가 현재 맵 내부 범위 안에 있는 경우만
                if((position[2] >= swLat && position[2] <= neLat) && (position[3] >= swLng && position[3] <= neLng)){
                    // 작은 마커 이미지 사이즈 설정
                    const smallMarkerSize = new kakao.maps.Size(8, 8);
                    // 리스트 기준 마커 이미지 사이즈 설정
                    const listMarkerSize = new kakao.maps.Size(35, 35);

                    // 마커 생성 및 출력
                    const marker = new kakao.maps.Marker({
                        map: this.map, // 마커를 출력할 맵 객체 지정
                        position: new kakao.maps.LatLng(position[2], position[3]), // 마커를 출력할 위치 지정 (시설의 위도/경도)
                        title: position[1], // 마커 마우스오버 시 출력할 이름 지정
                        image: new kakao.maps.MarkerImage(require('/src/assets/marker/smallMarker.png'), smallMarkerSize), // 기본 마커 이미지 지정
                        zIndex: 1, // 항상위 우선순위 지정
                    })
                    marker.id = position[0]; // 해당 마커의 id 속성 추가
                    this.markers.push(marker); // markers 배열에 생성 marker 추가

                    // 리스트 마커 설정
                    // facilities => 화면 왼쪽에 출력되는 시설 목록을 담고 있는 배열
                    // 시설 수만큼 반복
                    for(let i=0; i<this.facilities.length; i++){
                        // 시설 목록에 출력된 시설 중 id가 현재 생성한 마커의 id와 일치하는 경우
                        if(marker.id === this.facilities[i].facilityId){
                            // 마커 이미지 변경 및 항상위 우선순위 변경
                            marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/listMarker.png'), listMarkerSize));
                            marker.setZIndex(2);
                        }
                    }

                    // 마커 아이콘 관련 설정 및 이벤트
                    // 줌, 드래그 시 이전에 클릭한 마커가 있는 경우 해당 마커의 상태를 유지하기 위해 id로 체크 후 같은 마커는 아이콘 유지
                    // 클릭된 마커가 있는 경우
                    if(this.clickedMarker !== ''){
                        // 생성한 마커와 이전 클릭한 마커가 같은 경우
                        if(marker.id === this.clickedMarker.id){
                            // 먼저 기본 마커(작은 마커)인 경우 기본(작은) 마커 클릭 이미지로 변경
                            marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedSmallMarker.png'), smallMarkerSize));

                            // 이후 시설 목록에 있는 시설의 마커인 경우 리스트 마커 클릭 이미지로 변경
                            for(let i=0; i<this.facilities.length; i++){
                                if(marker.id === this.facilities[i].facilityId){
                                    marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedListMarker.png'), listMarkerSize));
                                }
                            }

                            this.clickedMarker = marker; // 생성 마커 => 클릭한 마커로 지정
                        }
                    }

                    // 마커 마우스오버 이벤트 리스너 추가
                    kakao.maps.event.addListener(marker, 'mouseover', () => {
                        // 마커 마우스오버 시 마커 클릭 이미지로 변경
                        marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedSmallMarker.png'), smallMarkerSize));

                        // 시설 목록에 있는 시설의 마커인 경우 리스트 마커 클릭 이미지로 변경
                        for(let i=0; i<this.facilities.length; i++){
                            if(marker.id === this.facilities[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedListMarker.png'), listMarkerSize));
                            }
                        }
                    });

                    // 마커 마우스아웃 이벤트 리스너 추가 => 마우스오버 시 마커 이미지가 변경 되는데 이를 다시 기본 이미지로 바꾸기 위함
                    kakao.maps.event.addListener(marker, 'mouseout', () => {
                        // 마커 마우스아웃 시 작은 마커 기본 이미지로 변경
                        marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/smallMarker.png'), smallMarkerSize));

                        // 시설 목록에 있는 시설의 마커인 경우 리스트 마커 기본 이미지로 변경 
                        for(let i=0; i<this.facilities.length; i++){
                            if(marker.id === this.facilities[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/listMarker.png'), listMarkerSize));
                            }
                        }

                        // 단, 클릭한 마커가 있는 경우 해당 마커는 이미지 유지
                        if(this.clickedMarker !== ''){
                            // 먼저 작은 마커 클릭 이미지로 변경
                            this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedSmallMarker.png'), smallMarkerSize));

                            // 시설 목록에 있는 시설의 마커인 경우 리스트 마커 클릭 이미지로 변경
                            for(let i=0; i<this.facilities.length; i++){
                                if(this.clickedMarker.id === this.facilities[i].facilityId){
                                    this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedListMarker.png'), listMarkerSize));
                                }
                            }
                        }
                    });

                    // 마커 클릭 이벤트 리스너 추가 => 마커 클릭 시 오버레이 출력
                    kakao.maps.event.addListener(marker, 'click', () => {
                        // 맵 위치 클릭한 마커 중심으로 변경
                        this.map.setCenter(new kakao.maps.LatLng(position[2], position[3]));

                        // 이전에 클릭한 마커가 있는 경우 클릭 마커는 기본 이미지로 변경
                        if(this.clickedMarker !== ''){
                            // 먼저 작은 마커 기본 이미지로 변경
                            this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/smallMarker.png'), smallMarkerSize));

                            // 시설 목록에 있는 시설의 마커인 경우 리스트 마커 기본 이미지로 변경
                            for(let i=0; i<this.facilities.length; i++){
                                if(this.clickedMarker.id === this.facilities[i].facilityId){
                                    this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/listMarker.png'), listMarkerSize));
                                }
                            }

                            this.clickedMarker = ''; // 클릭 마커 초기화
                        }
                        
                        // 먼저 작은 마커 클릭 이미지로 변경
                        marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedSmallMarker.png'), smallMarkerSize));

                        // 시설 목록에 있는 시설의 마커인 경우 리스트 마커 클릭 이미지로 변경
                        for(let i=0; i<this.facilities.length; i++){
                            if(marker.id === this.facilities[i].facilityId){
                                marker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/clickedListMarker.png'), listMarkerSize));
                            }
                        }
                        
                        this.clickedMarker = marker; // 해당 마커 클릭 마커로 지정

                        this.setOverlay(marker, position[0]); // 클릭한 마커 옆에 오버레이 출력을 위해 setOverlay 메소드 호출
                    });

                    // 지도 클릭 이벤트 리스너 추가 => 마커 이미지 기본값으로 설정 및 오버레이 삭제
                    kakao.maps.event.addListener(this.map, 'click', () => {
                        // 출력중인 오버레이가 있는 경우
                        if(this.activatedOverlay !== ''){
                            this.activatedOverlay.setMap(null); // 오버레이 해제
                            this.activatedOverlay = ''; // 오버레이 초기화
                        }

                        // 클릭한 마커가 있는 경우
                        if(this.clickedMarker !== ''){
                            // 먼저 작은 마커 기본 이미지로 변경
                            this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/smallMarker.png'), smallMarkerSize));
                            this.clickedMarker.setZIndex(1); // 항상위 레벨 다시 조정

                            // 시설 목록에 있는 시설의 마커인 경우 리스트 마커 기본 이미지로 변경
                            for(let i=0; i<this.facilities.length; i++){
                                if(this.clickedMarker.id === this.facilities[i].facilityId){
                                    this.clickedMarker.setImage(new kakao.maps.MarkerImage(require('/src/assets/marker/listMarker.png'), listMarkerSize));
                                    this.clickedMarker.setZIndex(2); // 항상위 레벨 다시 조정
                                }
                            }

                            this.clickedMarker = ''; // 클릭 마커 초기화
                        }
                    });
                }
            })
        },
        // getSido는 select 메뉴 클릭 시 백엔드에 요청하여 지역 정보를 받아와서 메뉴로 출력하기 위힌 메소드 => 시도
        getSido(){
            // 카테고리 선택 후 선택 가능
            if(this.selectedCat === ''){
                alert("카테고리를 먼저 선택해주세요");
            }else{
                // select에 올 수 있는 시도 목록 요청
                axios.get('http://localhost:8090/api/map/district/sidos')
                .then(response =>{
                    this.sidoOptions = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }
        },
        // getSigungu는 select 메뉴 클릭 시 백엔드에 요청하여 지역 정보를 받아와서 메뉴로 출력하기 위힌 메소드 => 시군구
        getSigungu(){
            // 시도 선택 후 선택 가능
            if(this.selectedSido === ''){
                alert("시도를 먼저 선택해주세요");
            }else{
                // select에 올 수 있는 시군구 목록 요청 => 선택된 시도의 id를 보내서 해당 id 값을 같이 가지고 있는 시군구 옵션만 받음
                axios.get('http://localhost:8090/api/map/district/sigungus', {params:{sidoId: this.selectedSido.sidoId}})
                .then(response =>{
                    this.sigunguOptions = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }
        },
        // getEmd은 select 메뉴 클릭 시 백엔드에 요청하여 지역 정보를 받아와서 메뉴로 출력하기 위힌 메소드 => 읍면동
        getEmd(){
            // 시군구 선택 후 선택 가능
            if(this.selectedSigungu === ''){
                alert("시군구를 먼저 선택해주세요");
            }else{
                // select에 올 수 있는 읍면동 목록 요청 => 선택된 시군구의 id를 보내서 해당 id 값을 같이 가지고 있는 읍면동 옵션만 받음
                axios.get('http://localhost:8090/api/map/district/emds', {params:{sigunguId: this.selectedSigungu.sigunguId}})
                .then(response =>{
                    this.emdOptions = response.data;
                })
                .catch(error =>{
                    console.log(error);
                })
            }
        },
        // select 메뉴에서 카테고리 선택 시 실행되는 메소드 => 카테고리에 맞는 시설 목록/마커 출력
        // getPosition() 메소드 사용을 위해 동기적 동작 => async/await
        async getFacilitiesByCat(){
            // select 디폴트 값 선택한 경우 제외
            if(this.selectedCat !== ''){
                const position = await this.getPosition(); // 현재 위치의 위도, 경도 받기

                const currentLat = position.latitude; // 현재 위치 또는 기본값 위도
                const currentLng = position.longitude; // 현재 위치 또는 기본값 경도

                // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
                this.contentUrl = `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&lat=${currentLat}&lng=${currentLng}`;

                // setListAndMarker 파라미터 => 시설 정보 get 요청 url, 시설 위치 정보 get 요청 url, 줌 최대 레벨, 줌 레벨
                this.setListAndMarker(
                    `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&lat=${currentLat}&lng=${currentLng}&page=0&size=${this.size}`,
                    `http://localhost:8090/api/map/facility/locations?cat=${this.selectedCat}`,
                    6,
                    5
                );

                // 쿼리 변경
                if(this.selectedCat === '반려동물용품'){
                    this.$router.replace({query: {cat: '동물용품'}});
                }else{
                    this.$router.replace({query: {cat: this.selectedCat}});
                }
            }
        },
        // select 메뉴에서 시도 선택(변경) 시 실행되는 메소드 => 해당 시도에 맞는 시설 목록/마커 출력
        getFacilitiesBySido(){
            // select 디폴트 값 선택한 경우 제외
            if(this.selectedSido !== ''){
                // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
                this.contentUrl = `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}`;
                
                // setListAndMarker 파라미터 => 시설 정보 get 요청 url, 시설 위치 정보 get 요청 url, 줌 최대 레벨, 줌 레벨
                this.setListAndMarker(
                    `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&page=0&size=${this.size}`,
                    `http://localhost:8090/api/map/facility/locations?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}`,
                    8,
                    8
                );
            }
        },
        // select 메뉴에서 시군구 선택(변경) 시 실행되는 메소드 => 해당 시군구에 맞는 시설 목록/마커 출력
        getFacilitiesBySigungu(){
            // select 디폴트 값 선택한 경우 제외
            if(this.selectedSigungu !== ''){
                // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
                this.contentUrl = `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}`;

                // setListAndMarker 파라미터 => 시설 정보 get 요청 url, 시설 위치 정보 get 요청 url
                this.setListAndMarker(
                    `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&page=0&size=${this.size}`,
                    `http://localhost:8090/api/map/facility/locations?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}`,
                    8,
                    6
                );
            }
        },
        // select 메뉴에서 읍면동 선택(변경) 시 실행되는 메소드 => 해당 읍면동에 맞는 시설 목록/마커 출력
        getFacilityByEmd(){
            // select 디폴트 값 선택한 경우 제외
            if(this.selectedEmd !== ''){
                // contentUrl => pagination 페이지 번호, 사이즈를 제외한 get 요청 url
                this.contentUrl = `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&emd=${this.selectedEmd.emdName}`;

                // setListAndMarker 파라미터 => 시설 정보 get 요청 url, 시설 위치 정보 get 요청 url
                this.setListAndMarker(
                    `http://localhost:8090/api/map/facilities?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&emd=${this.selectedEmd.emdName}&page=0&size=${this.size}`,
                    `http://localhost:8090/api/map/facility/locations?cat=${this.selectedCat}&sido=${this.selectedSido.sidoName}&sigungu=${this.selectedSigungu.sigunguName}&emd=${this.selectedEmd.emdName}`,
                    8,
                    5
                );
            }
        },
        // 이전 버튼 클릭 시 startNum, endNum 재설정을 위한 메소드
        setPrevPageNum(){
            // isPrevDisabled()에 의해 startNum이 5 이하인 경우는 신경 X
            this.startNum = this.startNum - 5; // 시작 번호는 현재 시작 번호 - 5
            this.endNum = this.startNum + 4; // 마지막 번호는 현재 시작 번호 + 4
            this.pageActive = this.endNum; // 이전 버튼 클릭 시 선택 중인 페이지 표시를 위해 선택한 페이지 번호 리턴
            this.getFacilitiesByPage(this.endNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
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
            this.getFacilitiesByPage(this.startNum-1); // 시설 리스트 출력을 위해 현재 page 번호를 넘기기
        },
        // 시설 목록 재출력을 위해 다시 시설 정보를 받아오기 위한 메소드 => 페이지 번호 클릭 시, 이전/다음 버튼 클릭 시
        getFacilitiesByPage(i){
            // i는 페이지 번호
            // contentUrl은 동 이름 검색, 카테고리 선택, select 메뉴 선택 등에 의해 현재 출력하고 있는 시설 정보를 가져오는 get 요청 url
            let url = this.contentUrl + `&page=${i}&size=${this.size}`;

            // 시설 목록을 새로 받아와서 맵 이동, 마커 표시를 할 때 기존에 마커가 있는 상태인 경우
            // 화면에 마커가 있는 상태에서 맵 이동을 하게 되어 부자연스러우므로 기존 마커 먼저 제거
            // 기존 마커 제거 => markers 배열의 길이가 0보다 큰 경우 마커 정보가 들어있는 경우
            if (this.markers.length > 0) {
                // markers 배열에 있는 marker 수만큼 반복 => 각 marker 맵에서 지우기 
                this.markers.forEach((marker) => {
                    marker.setMap(null);
                })
                this.markers = []; // 마커 전부 초기화
            }

            axios.get(url)
            .then(response => {
                this.facilities = response.data.content; // 페이지 번호에 맞는 시설 정보 받기

                this.$refs.scrollController.scrollTop = 0; // 스크롤 맨 위로 바꾸기
                
                // 맨 처음 시설의 좌표(위도/경도)로 지도 이동 
                this.map.setCenter(new kakao.maps.LatLng(this.facilities[0].lat, this.facilities[0].lng));
                
                this.displayMarker(); // 시설 위치 정보는 이미 받았으므로 마커만 다시 그리기
            })
            .catch(error => {
                console.log(error);
            })
        },
    },
    // 값 변경 시 계산
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
        let numbers = []; // 페이지 번호를 담을 배열 초기화
        let start = this.startNum; // 시작 번호
        let end = this.endNum; // 마지막 번호

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
    // 특정 변수 값 변경 추적
    watch:{
        // selectedCat이 변경된 경우
        selectedCat: function(){
            // 이전에 선택된 시도, 시군구, 읍면동 초기화
            this.selectedSido = '',
            this.selectedSigungu = '',
            this.selectedEmd = '',

            // 시도, 시군구, 읍면동 각 select 메뉴 초기화
            this.sidoOptions = [],
            this.sigunguOptions = [],
            this.emdOptions = []
        },
        // selectedSido가 변경된 경우
        selectedSido: function(){
            // 이전에 선택된 시군구, 읍면동 초기화
            this.selectedSigungu = '',
            this.selectedEmd = '',

            // 시군구, 읍면동 각 select 메뉴 초기화
            this.sigunguOptions = [],
            this.emdOptions = []
        },
        // selectedSigungu가 변경된 경우
        selectedSigungu: function(){
            // 이전에 선택된 읍면동 초기화
            this.selectedEmd = '',

            // 읍면동 select 메뉴 초기화
            this.emdOptions = []
        }
    },
    // mount 이전 초기 변수 설정 및 데이터 가져오기
    created() {
        // 헤더에서 지도 메뉴 클릭 시 동 이름 또는 카테고리 이름을 쿼리로 받기
        this.emd = this.$route.query.emd;
        this.cat = this.$route.query.cat;
    },
    mounted() {
        if(!window.kakao || !window.kakao.maps){
            // kakao 아직 로드 되지 않은 경우
            const script = document.createElement("script"); // script 객체 생성

            // 카카오맵 api 소스 및 옵션 설정
            // autoload=false => script 동적 로딩
            // appkey => 앱 키
            // libraries=clusterer => 클러스터 설정 (현재 사용 X)
            script.src = 
                "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=52ab0e36c22fd3c43884e5698628abe2&libraries=clusterer";

            // 전역 등록 시 global 지정 필요
            /* global kakao */
            script.addEventListener("load", () => {
                kakao.maps.load(this.initMap); // 카카오맵 로드 시 initMap 메소드 호출
            });

            document.head.appendChild(script); // 스크립트 실행되도록 head에 스크립트 추가 => 이후 실행 시 kakao 로드
        }else {
            // 이미 로드된 경우 initMap 메소드만 호출
            this.initMap();
        }  
    },
}
</script>

<style>
    /* 상단 메뉴 */
    .div-map-top{ /* 검색바 + select 메뉴의 부모 div */
        display: flex; /* 내부 div 정렬 */
        width: 100%; /* 너비 100% 차지 */
        border: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    .div-map-search{ /* 검색바 div */
        width: 20%; /* 검색바 너비 20% 차지 */
        border-right: 1px solid rgb(219, 219, 219); /* 테두리 굵기, 색 설정 */
    }
    .form-map-search{ /* 검색바 내부 form */
        margin: 3%; /* form과 div 사이에 margin 설정 */
    }
    .div-map-select{ /* select 메뉴 div */
        width: 80%; /* select 메뉴 너비 80% 차지 */
        display: flex; /* select 메뉴 정렬 */
        align-items: center; /* select 메뉴 가운데 정렬 */
        justify-content: flex-start; /* select 메뉴 왼쪽부터 나열 */
        padding-left: 1%; /* 왼쪽 padding 추가 */
    }
    .select-map{ /* 각 select */
        width: 20%; /* 너비 설정 */
        margin-right: 1%; /* 각 select 메뉴 간 간격 설정 */
    }
    /* 리스트 메뉴 + 지도 */
    .div-map-main{ /* 시설 목록 div + 카카오맵 div를 담는 div */
        display: flex; /* 시설 목록, 맵 정렬 */
        height: 74vh; /* viewport 기준 높이 지정 */
        border-bottom: 1px solid rgb(219, 219, 219); /* 밑에 테두리 추가 */
    }
    .div-map-list{ /* 시설 목록 출력 div */
        width: 20%; /* 너비 지정 */
        border-right: 1px solid rgb(219, 219, 219);
        overflow: scroll; /* 스크롤 추가 */
    }
    /* 시설 정보 출력 부분 */
    .div-map-card{ /* 카드 컴포넌트 담을 div */
        width: 100%; /* 너비 지정 */
        border-top: 0px; /* 상단 테두리 제거 */
    }
    .div-map-card-body{ /* 카드 컴포넌트 div */
        border-bottom: 1px solid rgb(219, 219, 219); /* 하단 테두리 추가 */
    }
    /* 아래부터는 카드 컴포넌트 내부 요소 디테일에 관한 스타일 */
    .div-map-card-body-title{
        display: flex; 
        align-items: center; 
        margin-bottom: 8px;
    }
    .div-map-card-body-title-facilityname{
        font-weight: bold; 
        font-size: 18px;
    }
    .div-map-card-body-title-cat{
        font-size: 11px;
    }
    .div-map-card-body-roadaddr{
        font-size: 11px;
    }
    .div-map-card-body-landaddr{
        font-size: 11px;
    }
    .div-map-card-body-basicinfo{
        display: flex; 
        margin-top:8px; 
        font-size: 11px;  
    }
    .div-map-card-body-basicinfo-title{
        font-weight: bold;
    }
    .div-map-card-body-businesshr{
        display: flex; 
        font-size: 11px;
    }
    .div-map-card-body-businesshr-title{
        font-weight: bold;
    }
    .div-map-card-body-phonenum{
        display: flex; 
        font-size: 11px;
    }
    .div-map-card-body-phonenum-title{
        font-weight: bold;
    }
    .div-map-card-body-buttons{
        display: flex; 
        justify-content: flex-end;
    }
    .button-map-card-body-detail{ /* 카드 컴포넌트 내부 상세보기 버튼 */
        background:white; /* 버튼 배경색 지정 */
        color:blue; /* 버튼 내부 글자색 지정 */
        border: none; /* 버튼 테두리 제거 */
        padding: 0px; /* 패딩 제거 */
        font-size: 12px; /* 폰트 크기 지정 */
        margin-right: 15px; /* 북마크 버튼과의 간격 지정 */
    }
    .button-map-card-body-bookmark{ /* 카드 컴포넌트 내부 북마크 버튼 */
        background:white; /* 버튼 배경색 지정 */
        color:blue; /* 버튼 내부 글자색 지정 */
        border: none; /* 버튼 테두리 제거 */
        padding: 0px; /* 패딩 제거 */
        font-size: 12px; /* 폰트 크기 지정 */
    }
    /* pagination 부분 */
    .div-map-pagination{ /* pagination을 담는 div */
        display:flex; /* pagination flex 정렬 */
        flex-direction: column; /* pagination column 정렬 */ 
        align-items: center; /* pagination 가운데 정렬 */
        padding-top: 20px; /* 위(카드 컴포넌트)와 간격 조절 */
        padding-bottom: 5px; /* 아래와 간격 조절 */
    }
    .page-link{ /* pagination에서 각 버튼 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
    .page-link:hover{ /* pagination에서 각 버튼 마우스오버 시 색 변경 */
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .pagination .page-item.active .page-link {
        /* 콤마가 없으면 조합  */
        /* ul pagination => li page-item이 active일 때 => button page-link 색 변경 */
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .div-map-map{ /* 카카오맵 api를 담는 div */
        width: 80%; /* 너비 지정 */
    }
    #map{
        /* 카카오맵 api 지도 너비, 높이 모두 100% 지정 */
        width: 100%;
        height: 100%;
    }
    /* 화면 너비가 992px 이하인 경우 배치 및 스타일 변경 */
    @media screen and (max-width: 992px){
        /* 상단 메뉴 */
        .div-map-top{ /* 검색바 + select 메뉴를 담는 div */
            flex-direction: column; /* column 정렬로 변경 */
        }
        .div-map-search{ /* 검색바 담는 div */
            width: 100%; /* 너비 100%로 변경 */
            display: flex; /* flex 정렬 */
            border-right: 0; /* 오른쪽 테두리 제거 */
            border-bottom: 1px solid rgb(219, 219, 219); /* 아래 테두리 추가 */
        }
        .form-map-search{ /* 검색바 form */
            width: 100%; /* 너비 100%로 변경 */
            /* 상하좌우 간격 조절 */
            margin-top: 2%;
            margin-bottom: 2%;
            margin-left: 1.5%;
            margin-right: 1.5%;
        }
        .div-map-select{ /* select 메뉴 담는 div */
            width: 100%; /* 너비 100%로 변경 */
            display: flex; /* select flex 정렬 */
            flex-direction: column; /* select column 정렬로 변경 */
            align-items: center; /* select 가운데 정렬 */
            /* 위, 오른쪽, 왼쪽 간격 조절 */
            padding-top: 2%; 
            padding-left: 2%;
            padding-right: 1%;
        }
        .select-map{
            width: 100%; /* 각 select 너비 100%로 변경 */
            margin-bottom: 2%; /* 각 select 메뉴 간 간격 조절 */
        }
        /* 리스트 메뉴 + 지도 */
        .div-map-list{ /* 시설 목록 출력 div */
            width: 100%; /* 너비 100%로 변경 */
            height: 74vh; /* 높이 viewport 기준으로 변경 */
            border-right: 0px; /* 오른쪽 테두리 제거 */
        }
        .div-map-map{ /* 카카오맵 api 지도 감추기 => 992px 이하에선 동작하지 않도록 */
            display: none;
        }
        .button-map-card-body-detail{ /* 992px 이하에서는 지도가 동작되지 않도록 했으므로 상세보기(오버레이) 버튼도 감추기 */
            display: none;
        }
    }
</style>