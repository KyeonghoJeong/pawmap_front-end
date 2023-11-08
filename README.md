<h1><img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/477d5789-f58e-41ef-ad66-854f22bc8575" width="25"/> 반려동물 동반 가능 시설 쉽게 찾자! 웹사이트 포맵</h1>

목차
----
1. 프로젝트 소개
2. 기술 스택
3. 프로젝트 구조
4. 주요 기능
5. 데모 영상

## 1. 프로젝트 소개

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/e4e7cb55-3849-4f1e-9c60-9930d8449bcd" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/bb0e21e0-040f-45e6-995d-d96bb88852b6" width="640"/><p>

<strong>우리나라의 반려가구 수 2022년 기준 552만 가구 (출처: KB경영연구소)</strong><p>

반려동물을 키우는 사람들은 방문하고자 하는 장소에 반려동물 동반이 가능한지 일일이 찾고 알아봐야 함<p>

공공데이터와 사용자의 위치 정보를 활용, 사용자로 하여금 다양한 검색 옵션으로 반려동물 동반 가능 시설을 쉽게 찾을 수 있도록 해주는 웹사이트를 개발하고자 함<p>

사이트 이름인 포맵은 paw(동물의 발) + map(지도)를 합쳐 만들었음

## 2. 기술 스택

- Back-end

> Java, Spring Boot, MySQL, Oracle

- Front-end

> HTML, CSS, JavaScript, Vue, Bootstrap

- Version Control

> Git, Github

## 3. 프로젝트 구조

- 프로젝트 구성도

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/d326d64f-0066-42a4-a82a-e4677615c5f6" width="500"/><p>

---

- ERD

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/62e327d2-c078-4ff3-8ce2-3c462169da7d" width="800"/><p>

공공데이터포털의 한국문화정보원 전국 반려동물 동반 가능 문화시설 위치 데이터를 활용하였음<p>

프론트단의 요구에 맞는 데이터만을 효율적으로 보내기 위해 공공데이터포털 API를 이용하는 것이 아니라 CSV 파일을 받아 수정 후 임포트 하여 DB를 구성하였음

---

- REST API

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/64cf559b-0285-4ad5-a3d1-9045a415a8a1" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/ffd40d6c-466e-4c33-8f38-f865aae83f2c" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/30383a2e-4f77-4cbb-a172-8b0803af9aa0" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/e66d88b1-0881-4b17-a1ef-3e1bfd925cd2" width="640"/>

## 4. 주요 기능

- 번호판 및 차량 번호 인식

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/1ec5108e-ddbf-4469-bd07-b043fd74aa98" width="640"/><p>

동 이름을 검색 시 지도 페이지로 이동하여 해당하는 읍면동에 있는 반려동물 동반 가능 시설을 지도와 마커, 목록으로 확인할 수 있음<p>

하단의 카테고리 버튼 클릭 시 지도 페이지로 이동하여 접속 중인 기기의 현재 위치를 기준으로 주변에 있는 해당 카테고리의 반려동물 동반 가능 시설을 확인할 수 있음<p>

상단의 pawmap 클릭 시 메인 페이지로 이동<p>

상단의 지도 메뉴 클릭 시 지도 페이지로 이동하여 현재 위치를 중심으로 지도를 확인하고 여러 옵션으로 반려동물 동반 가능 시설을 찾을 수 있음<p>

상단의 게시판 메뉴 클릭 시 다른 회원들과 의사소통할 수 있는 게시판을 이용할 수 있음<p>

상단의 로그인 메뉴 선택 시 로그인 페이지로 이동하여 로그인할 수 있음<p>

상단의 회원가입 메뉴 선택 시 회원가입 페이지로 이동하여 회원가입할 수 있음

---
