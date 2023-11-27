<h2><img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/477d5789-f58e-41ef-ad66-854f22bc8575" width="20"/> 반려동물 동반 가능 시설을 쉽게 찾을 수 있는 웹사이트 포맵</h2>

목차
----
1. 프로젝트 소개
2. 목표
3. 담당 역할
4. 기술 스택
5. 프로젝트 구조
6. 주요 기능
7. 데모 영상
8. 회고

## 1. 프로젝트 소개

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/e4e7cb55-3849-4f1e-9c60-9930d8449bcd" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/bb0e21e0-040f-45e6-995d-d96bb88852b6" width="640"/><p>

> 우리나라의 반려가구 수 2022년 기준 552만 가구 (출처: KB경영연구소)

반려동물을 키우는 사람들은 방문하고자 하는 장소에 반려동물 동반이 가능한지 일일이 찾고 알아봐야 함.<p><p>

공공데이터와 사용자의 위치 정보를 활용, 사용자가 다양한 검색 옵션으로 반려동물 동반 가능 시설을 쉽게 찾을 수 있도록 해주는 웹사이트를 개발하고자 함.<p><p>

사이트 이름인 포맵은 paw(동물의 발) + map(지도)를 합쳐 만들었음.

## 2. 목표

- #### Back-end
 
    Spring Framework 학습
    Spring Boot Back-end 프로젝트 구조 이해 및 구현
    REST API 설계
    Oracle DB 설계
    Spring Security 동작 원리 이해 및 구현
    JWT 인증과 인가 구현
    YAML을 사용한 프로젝트 설정
    Gradle을 사용한 프로젝트 빌드
    회원가입 시 이메일 인증 구현

- #### Front-end

    HTML, CSS, JavaScript 학습
    Vue.js를 통한 Front-end 프레임워크 이해 및 화면 구현
    HTTP Method를 사용하여 Back-end 서버에 리소스 처리 요청
    Bootstrap을 통한 반응형 웹 구현과 이해
    카카오맵 API 적용

## 3. 담당 역할

- Back-end 프로젝트 구조 설계
- REST API 설계
- Service 계층 로직 구현
- Spring Security 구현
- JWT 인증과 인가 구현
- DB 설계
- Front-end 화면 디자인
- Front-end UI 및 동작 구현

## 4. 기술 스택

- #### Back-end

    Java, Spring Boot, Oracle

- #### Front-end

    HTML, CSS, JavaScript, Vue.js, Bootstrap

- #### Version Control

    Git, Github

## 5. 프로젝트 구조

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/d326d64f-0066-42a4-a82a-e4677615c5f6" width="500"/><p>

> 프로젝트 구성도

### Back-end
Gradle은 Maven과 비교하여 빌드 속도가 빠르고 동적이며 설정 주입 방식으로 재사용에 용이함. 또한 Groovy 언어를 사용해 구조적이고 가독성이 좋은 장점이 있어 Gradle로 프로젝트를 빌드하고 필요한 라이브러리와 의존성을 관리하였음.<p><p>
YAML 타입은 계층 구조로 가독성이 좋은 장점이 있어 application.yml 파일로 PORT 설정, Oracle DB 연동 설정, SMTP 관련 설정을 하였음.<p><p>
Spring 프레임워크는 기존에 사용 경험이 있던 Java에 기반하고 있고 보안 설정, 인증과 인가, JWT를 쉽게 처리할 수 있도록 해주는 Spring Security를 제공함. 이러한 이유로 Spring 프레임워크 사용하기로 하였고 더 나아가 Spring 프레임워크 설정을 편리하게 할 수 있게 해주는 Spring Boot로 Back-end 서버를 개발하였음.<p><p>
Spring Boot 프로젝트는 Front-end의 View 단마다 Controller, Service, DAO, Repository의 계층 구조로 대응하도록 구성하였음. Service, DAO, Repository는 인터페이스로 구현하고 Anotation을 사용하여 DI 하였음. View 단과 데이터를 송수신할 때는 DTO 클래스를 사용하였으며 직접 DB의 데이터를 처리할 때는 Entity 클래스와 JpaRepository 인터페이스를 사용하였음.<p><p>
Spring Security 설정 클래스를 생성하고 Front-end의 HTTP 메서드 요청에 대한 권한 설정 내용과 JWT 필터를 추가한 SecurityFilterChain 인스턴스를 Bean으로 등록하였음. 또한 CORS 관련 설정을 특정 URL에 적용하는 UrlBasedCorsConfigurationSource 인스턴스, 회원 비밀번호 암호화 및 일치 여부 확인을 위해 사용되는 PasswordEncoder 인스턴스, 인증과 인가를 처리할 AuthenticationManager 인스턴스와 CustomAuthenticationProvider 인스턴스를 모두 Bean으로 등록하였음.<p><p>
JwtTokenProvider 클래스는 Access Token 생성 메서드, Refresh Token을 생성 메서드, 토큰 유효성 검사 메서드, JWT 인증을 완료한 Authentication 인스턴스를 리턴하는 메서드로 구성되어 있으며 JwtAuthenticationFilter 클래스에서는 이를 이용하여 JWT의 유효성을 검사하고 SecurityContextHolder에 인증된 회원의 Authentication 객체를 설정함. 이후 AuthenticationManager에서 CustomAuthenticationProvider로 회원 인증 절차를 위임하고 authenticate 메서드로 회원에 대한 인증 절차를 처리함.<p><p>
회원가입 시 전송되는 이메일 인증 코드는 난수로 생성하며 MimeMessageHelper로 MimeMessage 인스턴스의 속성과 이메일 주소, 제목, 내용 등을 설정한 뒤 JavaMailSender 인터페이스를 통해 사용자의 이메일로 전송함.

### Front-end
Vue.js 프레임워크는 JavaScript 기반으로 문법이 간단하고 직관적이어서 첫 Front-end 프레임워크 학습에 용이하다고 판단하여서 선택하였고 Vue.js 프레임워크와 HTML, CSS, JavaScript를 활용하여 Front-end 화면을 개발하였음.<p><p>
Bootstrap을 통해 Front-end 화면을 반응형 웹으로 개발하였음.<p><p>
Axios를 사용하여 HTTP 메서드로 Back-end 서버에 리소스 처리를 요청함.<p><p>
로컬 스토리지와 Cookie를 사용하여 JWT를 처리하고 저장함.<p><p>
반려동물 동반 가능 시설을 지도에 표시하기 위해 지도 API를 사용하였음. 구글 Maps API는 대한민국 지도의 경우 정확도가 떨어지는 문제가 있었고 API 활용과 관련한 정보를 네이버 지도 API보다 더 많이 쉽게 구할 수 있는 카카오맵 API를 활용하였음.

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/62e327d2-c078-4ff3-8ce2-3c462169da7d" width="800"/><p>

> ERD

대학교 졸업작품 프로젝트에서 MySQL을 사용하여 DB를 설계한 경험이 있기 때문에 이번 프로젝트에서는 새로운 DBMS 학습을 목표로 Oracle을 사용하여 DB를 설계하였음.<p><p>
공공데이터포털의 한국문화정보원 전국 반려동물 동반 가능 문화시설 위치 데이터를 활용하였음.<p><p>
Front-end View 단의 요구에 맞는 데이터만을 효율적으로 보내기 위해 공공데이터포털에서 API가 아닌 CSV 파일을 받아 수정 후 임포트 하여 DB를 구성하고 REST API를 설계하였음.

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/968c6ed4-f04d-4f72-b63d-2d21d371faab" width="640"/><p>

> 지도 페이지 관련 REST API

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/bdba7202-4bc6-4dec-8c84-e3b1ea7dc459" width="640"/><p>

> 게시판 페이지 관련 REST API

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/713f7f8a-4638-4ddc-84cd-fd180f216ba2" width="640"/><p>

> 인증과 인가 관련 REST API

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/246702ae-a537-48c0-97d1-056384846311" width="640"/>

> 회원 관련 REST API

---

## 6. 주요 기능

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/1ec5108e-ddbf-4469-bd07-b043fd74aa98" width="640"/><p>

> 메인 페이지

- 동 이름 검색 시 지도 페이지로 이동하여 해당 반려동물 동반 가능 시설을 목록과 지도로 확인
- 카테고리 버튼 클릭 시 지도 페이지로 이동하여 해당 반려동물 동반 가능 시설을 목록과 지도로 확인

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/edd25b29-3dfd-4016-a1f8-133f48b9d12a" width="640"/><p>

> 지도 페이지

- 동 이름 검색 시 해당 반려동물 동반 가능 시설을 목록과 지도로 확인
- 카테고리 선택 시 해당 반려동물 동반 가능 시설을 목록과 지도에서 현재 접속 위치 기준 가까운 순으로 확인
- Select 메뉴를 통해 카테고리, 시도, 시군구, 읍면동을 조합하여 해당 반려동물 동반 가능 시설을 목록과 지도로 확인
- 지도의 마커를 클릭하거나 목록에서 카드 또는 상세보기 버튼을 클릭하여 해당 반려동물 동반 가능 시설의 상세정보 및 반려동물 동반 관련 사항을 확인
- 북마크 버튼을 클릭하여 해당 시설을 북마크에 추가 (로그인 필요)

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/94ae60fb-de24-4db2-953c-7e6cf244f0b5" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/2879fcc5-32a1-4190-b068-d4de61dfdcac" width="640"/><p>

> 게시판 페이지

- 게시글 및 댓글 작성/조회/수정/삭제
- 검색 메뉴에서 제목+내용, 제목, 내용, 닉네임 중 하나를 선택하여 원하는 검색어로 게시글을 검색

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/b6e79fc8-04e2-462b-8541-3ce415dfb22d" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/6cbf994e-2f46-418c-abcf-91675e0dfb64" width="640"/><p>

> 로그인 페이지

- 로그인 (아이디 저장)

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/55565c61-8d69-4752-a704-616fc833fc86" width="640"/><p>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/14009366-ffef-49b1-82e3-91d917bce160" width="640"/><p>

> 회원가입 페이지

- 회원가입 (입력 데이터 유효성 체크, 이메일 인증)

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/8d8487be-73dd-49ba-8790-d3fffd28281d" width="640"/><p>

> 마이페이지의 북마크 탭

- 회원이 추가한 반려동물 동반 가능 시설 북마크를 조회 및 삭제할 수 있음

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/d3353994-5cd0-482d-b39b-e85d6baf6e7c" width="640"/><p>

> 마이페이지의 내 게시글 탭

- 회원 본인의 게시글 모두 조회
- 검색 메뉴에서 제목+내용, 제목, 내용, 닉네임 중 하나를 선택하여 원하는 검색어로 게시글을 검색
- 체크박스를 이용하여 한번에 여러 게시글을 삭제

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/8c38d496-0ef5-4c79-89e8-2682145cecc5" width="640"/><p>

> 마이페이지의 회원정보 탭

- 회원 본인의 아이디, 닉네임, 이메일을 확인
- 비밀번호 변경

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/e652520d-e20d-4415-abae-9c5131a0a01d" width="640"/><p>

> 회원 탈퇴 페이지

- 회원 탈퇴 (비밀번호 입력)

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/858340fa-3db2-45b3-8f36-976087ce34dc" width="640"/><p>

> 관리페이지의 게시글 관리 탭

- 게시판 전체 게시글 조회/검색/삭제 (관리자 권한 계정)

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/588639f5-6e07-4aa5-8a0a-37612b3630e9" width="640"/><p>

> 관리페이지의 회원 관리 탭

- 전체 회원 정보 조회/검색 (관리자 권한 계정)
- 회원 차단 (관리자 권한 계정)

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/9cac85a7-1c63-4b3e-8b0a-472545a1ed0f" width="210"/>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/2d14b722-4418-4610-9a0d-dc7fb9a22387" width="210"/>
<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/385ed585-c12c-42e3-bb15-0d1acb757fe8" width="210"/>

> Bootstrap을 활용한 반응형 웹 디자인

## 7. 데모 영상

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/e5b18f7c-08ca-48b7-a312-0de953180e61"/><p>

> 동 이름 검색

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/dfe5465b-6a26-4611-839a-0f5b27c5f139"/><p>

> 카테고리 버튼 클릭

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/faaa924f-980f-46ec-bb0f-539d584ef68b"/><p>

>  회원가입

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/eee76c66-dff8-42b2-a80e-227f60bb7ab9"/><p>

> 로그인

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/7250c8f9-7cab-4da3-8eaa-6acc64b33c1c"/><p>

> 지도 페이지

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/62b34470-a58d-4f87-b6dc-9b6e81aa378d"/><p>

> 게시글 및 댓글 조회

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/c27edd3c-b77f-4046-93ef-40871c0944da"/><p>

> 게시글 및 댓글 작성/수정/삭제

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/211ed7f8-6ce1-4701-b062-77320e8100a1"/><p>

> 마이페이지의 북마크 탭

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/7e080ec9-689b-418d-8c34-deab4b13fb77"/><p>

> 마이페이지의 내 게시글 탭

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/817339c2-f40c-4269-bd52-4642698a8d1a"/><p>

> 마이페이지의 회원정보 탭

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/39516589-5703-400f-ac43-f02c024aee75"/><p>

> 회원 탈퇴

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/6e66ee30-ff93-4e6b-93cf-cf15cb72d77e"/><p>

> 관리페이지의 게시글 관리 탭

---

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/880bb5d6-381f-4093-80d6-85c1e4fda664"/><p>

> 관리페이지의 회원 관리 탭

---

- 부트스트랩을 활용한 반응형 웹 디자인

<img src="https://github.com/KyeonghoJeong/pawmap_front-end/assets/128965451/2639eb7b-6223-4d4a-b52e-d2d65e3df1bd"/>

---

## 8. 회고

