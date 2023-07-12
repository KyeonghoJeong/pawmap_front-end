<template>
    <div>
        <!-- 등록 버튼 클릭 시 댓글 수정 메소드 호출 -->
        <form @submit.prevent="updateComment">
            <!-- 댓글 내용을 수정할 textarea를 담는 div -->
            <div class="div-updatingComment-writing">
                <!-- textarea 최대 길이 지정 및 required 지정, 데이터 입력 시 newWriting 변수에 저장 -->
                <textarea class="form-control textarea-updatingComment" maxlength="300" v-model="newWriting" required></textarea>
            </div>
            <!-- 버튼들을 담을 div -->
            <div class="div-updatingComment-btns">
                <!-- 취소 버튼 클릭 시 closeUpdatingCommentMenu 메소드 호출 -->
                <button type="button" class="btn btn-updatingComment-cancel" @click="closeUpdatingCommentMenu">취소</button>&nbsp;&nbsp;
                <!-- 수정 버튼 클릭 시 submit -->
                <button type="submit" class="btn btn-updatingComment-update">수정</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'

export default{
    // CommentView(부모)로부터 현재 댓글의 내용, id 받기
    props: {
        writing:{
            type: String,
            required: true, // 필수 지정
        },
        cmtId:{
            type: Number,
            required: true, // 필수 지정
        }
    },
    data(){
        return{
            newWriting: '', // 새로 입력한 내용
        }
    },
    methods:{
        // 취소 버튼을 눌렀을 때 CommentView(부모)에게 알려서 수정 메뉴를 닫도록 함 
        closeUpdatingCommentMenu(){
            this.$emit('closeUpdatingCommentMenu', true); // 간단히 true로 알림
        },
        // accessToken 재발급 메소드
        async getAccessToken(){
            // Cookie에 가지고 있는 refreshToken으로 accessToken을 재발급
            // axios의 동기적 동작을 위해 async/await 사용
            try {
                // 서로 다른 도메인 간의 Cookie 송수신을 위해 withCredentials: true 설정
                const getAccessTokenResponse = await axios.get('http://localhost:8090/api/auth/access-token', {
                    withCredentials: true
                })

                // 200 => 요청 성공
                if(getAccessTokenResponse.status === 200){
                    // refreshToken이 유효하여 백엔드로부터 accessToken을 재발급 받은 경우
                    // 재발급 받은 accessToken 로컬 스토리지에 저장
                    localStorage.setItem("accessToken", getAccessTokenResponse.data.accessToken);

                    return true; // 성공 => true 리턴
                }
            } catch (error) {
                // 403 => refreshToken 토큰 만료
                if(error.response.status === 403){
                    // 기존에 로컬 스토리지에 저장되어 있던 accessToken, role 삭제
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("role");
                }

                return false; // 실패 => false 리턴
            }
        },
        // 댓글 수정 메소드
        // axios의 동기적 동작을 위해 async/await 사용
        async updateComment(){
            // 기존 내용과 수정 내용이 다른 경우만 백엔드 요청 및 수정
            if(this.newWriting !== this.writing){
                try {
                    // accessToken + 댓글 id + 새로 입력한 내용으로 post 요청
                    const updateCommentResponse = await axios.put('http://localhost:8090/api/board/article/comment', {
                        cmtId: this.cmtId,
                        writing: this.newWriting
                    }, {
                        headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                    })

                    // 200 => 요청 성공
                    if(updateCommentResponse.status === 200){
                        this.$router.go(this.$router.currentRoute); // 댓글 수정 후 페이지 새로고침
                    }
                } catch (error) {
                    // 403 => accessToken 토큰 만료
                    if(error.response.status === 403){
                        // accessToken 재발급 메소드 호출 => true면 성공
                        const isNewAccessTokenLoaded = await this.getAccessToken();
                        
                        if(isNewAccessTokenLoaded){
                            try {
                                // accessToken + 댓글 id + 새로 입력한 내용으로 post 재요청
                                const reUpdateCommentResponse = await axios.put('http://localhost:8090/api/board/article/comment', {
                                    cmtId: this.cmtId,
                                    writing: this.newWriting
                                }, {
                                    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
                                })

                                // 200 => 재요청 성공
                                if(reUpdateCommentResponse.status === 200){
                                    this.$router.go(this.$router.currentRoute); // 댓글 수정 후 페이지 새로고침
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }else{
                            // 로그인 만료 알림
                            alert("로그인 시간이 만료되었습니다. 다시 로그인해 주세요.");

                            // header 메뉴 갱신을 위해 새로고침
                            this.$router.go(this.$router.currentRoute);
                        }
                    }
                }
            }else{
                // 같은 경우 새로고침
                this.$router.go(this.$router.currentRoute);
            }
        }
    },
    created(){
        // CommentView로부터 받은 댓글 내용을 newWriting 변수에 저장 => v-model에 반영되므로 textarea에 기존 내용 출력
        this.newWriting = this.writing;
    }
}
</script>

<style>
    /* 댓글 내용을 입력하는 textarea를 담는 div */
    .div-updatingComment-writing{
        padding: 1%; /* 상하좌우 여백 */
    }
    /* textarea 높이 지정을 위한 클래스 */
    .textarea-updatingComment{
        height: 100px; /* 높이 지정 */
    }
    /* 버튼들을 담을 div */
    .div-updatingComment-btns{
        width: 100%; /* 너비 100% 채우기 */
        /* 우측 끝 정렬 */
        display: flex;
        justify-content: flex-end;
        /* 오른쪽, 아래 패딩 추가 */
        padding-right: 1%;
        padding-bottom: 1%;
    }
    /* 버튼 클래스 => 색, 너비 지정 */
    .btn-updatingComment-cancel, .btn-updatingComment-update{
        width: 80px;
        background-color: #fd7e14;
        border-color: rgb(219, 219, 219);
        color: white;
    }
    .btn-updatingComment-cancel:hover, .btn-updatingComment-update:hover{ /* 버튼 마우스오버 시 색 변경 */
        background-color: white;
        border-color: rgb(219, 219, 219);
        color: black;
    }
</style>