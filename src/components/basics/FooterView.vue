<template>
<!-- footer를 담을 div -->
<div class="container-fluid div-footer-footer">
    <!-- footer -->
    <div>
        <!-- footer 내용 배치를 위한 div -->
        <div class="py-3 my-4 border-top div-footer-item">
            <!-- 문구 배치 -->
            <div>
                <span class="mb-3 mb-md-0 text-muted">Developed by Kyeongho Jeong</span>
            </div>
            <!-- 아이콘 배치 -->
            <div>
                <ul class="ul-footer-icon">
                    <li><img src="@/assets/pawmap.png" class="img-footer-icon"></li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<style>
.div-footer-footer{
    flex-shrink: 0; /* wrapper에 따른 비율 조정 X */
    padding-top: 0%;
}
.div-footer-item{
    width: 100%;
    display: flex;
    justify-content: space-between; /* 문구와 아이콘 리스트를 양끝에 배치 */
}
.ul-footer-icon{
    display: flex;
    list-style: none; /* 각 아이콘 앞에 오는 점 없애기 */
    padding-left: 0;
    margin-bottom: 0;
}
.img-footer-icon{
    width: 27px;
    height: 27px;
}
/* 너비 992px 이하 시 footer 내용 가운데 정렬 */
@media (max-width: 992px) {
    .div-footer-item {
        flex-direction: column;
        align-items: center;
    }
    .ul-footer-icon{
        margin-top: 15px;
    }
}
</style>