<template>
    <div class="writing">
        <BoardTitleView></BoardTitleView>

        <div class="writing-group">
            <div class="mb-3 writing-group-title">
                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="제목을 입력하세요.">
            </div>
            <div class="mb-3">
                <input class="form-control" type="file" id="formFile">
            </div>
            <div class="mb-3">
                <textarea class="form-control writing-group-content" id="exampleFormControlTextarea1" rows="3" placeholder="내용을 입력하세요."></textarea>
            </div>
            <div class="writing-group-add">
                <button type="button" class="btn writing-group-add-btn">등록</button>
            </div>
        </div>
    </div>
</template>

<script>
    import BoardTitleView from '../components/BoardTitleView.vue'

    export default {
        components:{
            BoardTitleView
        }
    }
</script>

<style>
    .writing{
        padding-top: 7%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .writing-group{
        width: 60%;
        border-style: solid;
        border-width: 1px;
        border-color: rgb(203, 204, 206);
        padding: 1%;
    }
    .writing-group-content{
        height: 30vh;
    }
    .writing-group-add{
        display: flex;
        flex-direction: row-reverse;
    }
    .writing-group-add-btn{
        background-color: #fd7e14;
        color: white;
        width: 80px;
    }

    @media screen and (max-width: 992px){
        .writing-group{
            width: 100%;
        }
    }
</style>