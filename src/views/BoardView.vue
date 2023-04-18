<template>
    <div class="div-board">
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
        <div class="div-board-table">
            <table class="table table-hover table-bordered table-sm div-board-table-table">
            <thead class="table-secondary">
                <tr>
                    <th scope="col" class="writing-num">#</th>
                    <th scope="col" class="writing-title">제목</th>
                    <th scope="col" class="writing-nickname">닉네임</th>
                    <th scope="col" class="writing-date">날짜</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row" class="num-in-board">10</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Otto</td>
                    <td class="date-in-board">@mdo</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">9</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">8</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">7</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">6</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">5</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">4</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">3</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">2</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
                <tr>
                    <th scope="row" class="num-in-board">1</th>
                    <td><span class="board-title" @click="goToPosting">Mark</span></td>
                    <td class="nickname-in-board">Thornton</td>
                    <td class="date-in-board">@fat</td>
                </tr>
            </tbody>
            </table>
        </div>
        <div class="div-board-bottom-set">
            <div class="div-board-bottom-scset">
                <div class="div-board-bottom-search">
                    <form>
                        <div class="input-group">
                            <input type="text" class="form-control" aria-label="keyword" aria-describedby="basic-addon1">
                            <span class="input-group-text" id="basic-addon1"  style="background-color:white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </span>
                        </div>
                    </form>
                </div>
                <div class="div-board-bottom-category">
                    <select class="form-select" aria-label="Default select example">
                        <option value="1">제목</option>
                        <option value="2">내용</option>
                        <option value="3">닉네임</option>
                    </select>
                </div>
            </div>
            <div class="div-board-bottom-btn">
                <button type="button" class="btn btn-writing" @click="goToWriting">글쓰기</button>
            </div>
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
        goToWriting(){
            this.$router.push('/writing');
        },
        goToPosting(){
            this.$router.push('/posting');
        }
    }
}
</script>

<style>
    .div-board{
        padding-top: 7%;
        padding-left: 10%;
        padding-right: 10%;
        padding-bottom: 2%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .div-board-top{
        width: 60%;
        display: flex;
    }
    .div-board-table{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .div-board-bottom-set{
        width: 60%;
        display:flex;
        margin-bottom: 1.5%;
    }
    .div-board-paging{
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .div-board-top-message{
        width: 100%;
    }
    .div-board-table-table{
        width: 100%;
    }
    .div-board-bottom-scset{
        width: 50%;
        display:flex;
    }
    .div-board-bottom-search{
        width: 70%;
        margin-right: 2%;
    }
    .div-board-bottom-category{
        width: 30%;
    }
    .div-board-bottom-btn{
        width: 50%;
        display: flex;
        flex-direction: row-reverse;
    }
    .btn-writing{
        background-color: #fd7e14;
        color: white;
    }
    .writing-num{
        width: 15;
        text-align: center;
    }
    .writing-title{
        width: 55%;
        text-align: center;
    }
    .writing-nickname{
        width: 15;
        text-align: center;
    }
    .writing-date{
        width: 15;
        text-align: center;
    }
    .num-in-board{
        text-align: center;
    }
    .date-in-board{
        text-align: center;
    }
    .nickname-in-board{
        text-align: center;
    }
    .page-link{
        color: black;
    }
    .pagination .page-item.active .page-link {
        background-color: #fd7e14;
        border-color: rgb(225, 228, 232);
    }
    td .board-title:hover{
        text-decoration: underline;
        cursor: pointer;
    }

    @media screen and (max-width: 992px){
        .div-board-top{
            width: 100%;
            flex-direction: column;
        }
        .div-board-table{
            width: 100%;
        }
        .div-board-bottom-set{
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-bottom: 3%;
        }
    
        .div-board-top-message{
            width: 100%;
        }
        .div-board-bottom-scset{
            width: 100%;
            margin-bottom: 3%;
        }
        .div-board-bottom-btn{
            width: 100%;
        }
        .div-board-bottom-search{
            width: 70%;
        }
        .div-board-bottom-category{
            width: 30%;
            margin-top: 0%;
        }
        .div-board-table-table{
            width: 100%;
        }
    }
</style>