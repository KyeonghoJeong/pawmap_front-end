<template>
    <div class="div-posting">
        <div class="div-board-top">
            <div class="div-board-top-message">
                <figure>
                    <blockquote class="blockquote">
                        <p>게시판</p>
                    </blockquote>
                    <figcaption class="blockquote-footer">
                        게시판에서 다른 회원들과 정보를 나누어보세요.
                    </figcaption>
                </figure>
            </div>
        </div>
        <div class="div-posting-group">
            <div class="div-posting-title">
                <div class="div-posting-title-first">
                    제목
                </div>
                <div class="div-posting-title-second">
                    안녕하세요
                </div>
            </div>
            <div class="div-posting-date">
                <div class="div-posting-date-first">
                    작성일
                </div>
                <div class="div-posting-date-second">
                    2023-04-19 00:11:33
                </div>
            </div>
            <div class="div-posting-nickname">
                <div class="div-posting-nickname-first">
                    닉네임
                </div>
                <div class="div-posting-nickname-second">
                    해리 케인
                </div>
            </div>
            <div class="div-posting-content">
                해리 에드워드 케인 MBE는 잉글랜드의 축구 선수이다. 포지션은 스트라이커이다. 현재 토트넘 홋스퍼에서 활약하고 있다. 그는 플레이 메이커이자 토트넘의 중심축으로 토트넘이 가장 필요한 선수 중 한 명이다. 그는 현재 잉글랜드 내의 최고의 선수 중 한 명으로 꼽히고있다.
            </div>
            <div class="div-posting-mnd">
                <div class="div-posting-mnd-mnd">
                    <a href="#" class="div-posting-mnd-m">수정</a>&nbsp;&nbsp;
                    <a href="#" class="div-posting-mnd-d">삭제</a>
                </div>
            </div>
            <div class="div-posting-btns">
                <button type="button" class="btn btn-writing">이전</button>
                <button type="button" class="btn btn-writing">목록</button>
                <button type="button" class="btn btn-writing">다음</button>
            </div>
            <div class="div-posting-inc">
                <div class="div-posting-inc-cmt">
                    <div class="div-posting-inc-cmt-i">
                        <span class="div-posting-inc-cmt-i-nickname">홀란드</span>
                        <span>2023-04-19 01:21:00</span>
                    </div>
                    <div class="div-posting-inc-cmt-c">
                        잘 읽었습니다.
                    </div>
                </div>
            </div>
            <div class="div-posting-cmtbox">
                <div class="form-floating div-posting-cmtbox-input">
                    <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">댓글을 남겨보세요.</label>
                </div>
                <div class="div-posting-cmtbox-btn">
                    <button type="button" class="btn btn-writing">등록</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .div-posting{
        padding-top: 7%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .div-posting-group{
        width: 60%;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(203, 204, 206);
    }

    .div-posting-title{
        height: 15%;
        display: flex;
        font-weight: bold;
        padding: 1%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-title-first{
        width: 15%;
    }

    .div-posting-date{
        height: 15%;
        display: flex;
        padding: 1%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-date-first{
        width: 15%;
    }

    .div-posting-nickname{
        height: 15%;
        display: flex;
        padding: 1%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-nickname-first{
        width: 15%;
    }

    .div-posting-content{
        height: 20vh;
        padding: 1%;
    }

    .div-posting-mnd{
        padding-right: 2%;
        display: flex;
        flex-direction: row-reverse;
    }
    .div-posting-mnd-mnd{
        font-weight: bold;
    }
    .div-posting-mnd a{
        color: black;
    }

    .div-posting-btns{
        height: 15%;
        padding: 1%;
        display: flex;
        justify-content: space-between;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-btns button{
        width: 15%;
    }

    .div-posting-inc{
        height: 15%;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-inc-cmt{
        margin: 1%;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-inc-cmt-i{
        padding: 1%;
        display: flex;
        justify-content: space-between;
        border-top: 0px;
        border-bottom: 1px;
        border-left: 0px;
        border-right: 0px;
        border-style: solid;
        border-color: rgb(203, 204, 206);
    }
    .div-posting-inc-cmt-i-nickname{
        font-weight: bold;
        color: rgb(81, 145, 195);
    }
    .div-posting-inc-cmt-c{
        padding: 1%;
        display: flex;
        height: 8vh;
    }

    .div-posting-cmtbox{
        height: 15%;
        padding: 1%;
        display: flex;
        flex-direction: column;
    }
    .div-posting-cmtbox-btn{
        margin-top: 1%;
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
    }

    @media screen and (max-width: 992px){
        .div-posting-group{
            width: 100%;
        }
        .div-posting-btns button{
            width: 20%;
        }
    }
    @media screen and (max-width: 576px){
        .div-posting-group{
            width: 100%;
        }
        .div-posting-btns button{
            width: 20%;
        }
    }
</style>