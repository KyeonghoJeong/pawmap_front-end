<template>
    <div class="div-board-mine">
        <div class="div-board-table">
            <table class="table table-hover table-bordered table-sm div-board-table-table">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="writing-category">카테고리</th>
                    <th scope="col" class="writing-place">이름</th>
                    <th scope="col" class="writing-address">주소</th>
                    <th scope="col" class="writing-del">삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row" class="category-in-board">동물병원</th>
                    <td class="place-in-board"><span class="board-title" @click="goToPosting">야당동물병원</span></td>
                    <td>경기 파주시 경의로 1100 201호</td>
                    <td class="del-in-board"><input class="form-check-input" type="checkbox" value="" id="defaultCheck1"></td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="div-board-bottom-del-btn">
            <button type="button" class="btn div-board-bottom-btn-btn">삭제</button>
        </div>
        <div class="div-board-paging">
            <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                    </li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">4</a></li>
                    <li class="page-item"><a class="page-link" href="#">5</a></li>
                    <li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
            </nav>
        </div>
    </div>
</template>

<script>
    export default {
        methods:{
            goToPosting(){
                this.$router.push('/posting');
            }
        }
    }
</script>

<style>
    .writing-category{
        width: 20%;
        text-align: center;
    }
    .writing-place{
        width: 20%;
        text-align: center;
    }
    .writing-address{
        width: 50%;
        text-align: center;
    }
    .writing-del{
        width: 10%;
        text-align: center;
    }

    .category-in-board{
        text-align: center;
    }
    .place-in-board{
        text-align: center;
    }
    .del-in-board{
        text-align: center;
    }

    .div-board-bottom-del-btn{
        width: 60%;
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 3%;
    }

    @media screen and (max-width: 992px){
        .div-board-bottom-del-btn{
            width: 100%;
        }
    }
</style>