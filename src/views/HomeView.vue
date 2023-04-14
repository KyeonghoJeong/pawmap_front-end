<template>
<div>

    <div>
        <nav class="navbar navbar-expand-sm navbar-dark custom-navbar">
            <div class="container custom-container-message">
                <h1 class="display-6 custom-display-6">어떤 장소를 찾으세요?</h1>
            </div>
        </nav>
    </div>

    <div>
        <nav class="navbar navbar-expand-sm navbar-dark custom-navbar">
            <form class="container custom-container-search">
                <div class="input-group">
                    <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </span>
                    <input type="text" class="form-control" placeholder="장소를 입력하세요" aria-label="keyword" aria-describedby="basic-addon1" style="height:50px">
                </div>
            </form>
        </nav>
    </div>

</div>
</template>

<style>
.custom-container-message{
    width: 920px;
    padding-top: 80px;
    padding-bottom: 37px;
}
.custom-display-6{
    color: white;
}
.custom-container-search{
    width:900px;
    padding-bottom:55px;
}
@media screen and (max-width: 576px){
    .custom-container-message{
        padding-top: 5px;
        padding-bottom: 0px;
    }
    .custom-container-search{
        width:900px;
        padding-bottom:5px;
    }
}
</style>