<template>
    <div class="mp">
        <div class="mp-title">
            <h1>마이페이지</h1>
        </div>

        <div class="mp-nav">
            <ul class="nav nav-tabs mp-tabs">
                <li class="nav-item mp-tab">
                    <a class="nav-link mp-link active" href="#">관심목록</a>
                </li>
                <li class="nav-item mp-tab">
                    <a class="nav-link mp-link" href="#">내가 쓴 글</a>
                </li>
                <li class="nav-item mp-tab">
                    <a class="nav-link mp-link" href="#">내 정보</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style>
    .mp{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .mp-title{
        margin-top: 5%;
        margin-bottom: 2%;
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .mp-nav{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .mp-tabs{
        width: 100%;
        text-align: center;
    }
    .mp-tab {
        width: 33%;
    }
    .mp-link{
        color: black;
    }
    .mp-tabs .nav-link.active {
        background-color: #fd7e14; 
        color: white;
    }

</style>