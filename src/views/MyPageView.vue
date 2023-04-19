<template>
    <div class="mp">
        <div class="mp-title">
            <h1>마이페이지</h1>
        </div>

        <div class="mp-nav">
            <ul class="nav nav-tabs mp-tabs">
                <li class="nav-item mp-tab">
                    <a class="nav-link mp-link" href="#" v-bind:class="{ active: activeTab === 'BookmarkView' }" v-on:click.prevent="activeTab = 'BookmarkView'">관심목록</a>
                </li>
                <li class="nav-item mp-tab">
                    <a class="nav-link mp-link" href="#" v-bind:class="{ active: activeTab === 'MyWritingView' }" v-on:click.prevent="activeTab = 'MyWritingView'">내가 쓴 글</a>
                </li>
                <li class="nav-item mp-tab">
                    <a class="nav-link mp-link" href="#" v-bind:class="{ active: activeTab === 'EditInfoView' }" v-on:click.prevent="activeTab = 'EditInfoView'">내 정보</a>
                </li>
            </ul>
        </div>

        <div style="width: 100%">
            <component v-bind:is="activeTab"></component>
        </div>
    </div>
</template>

<script>
    import BookmarkView from '../components/BookmarkView.vue'
    import MyWritingView from '../components/MyWritingView.vue'
    import EditInfoView from '../components/EditInfoView.vue'

    export default {
        data(){
            return{
                activeTab: "BookmarkView",
            }
        },
        components:{
            BookmarkView,
            MyWritingView,
            EditInfoView,
        }
    }

</script>

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

    .nav-link:hover {
        background-color: #fd7e14;
        color: white;
    }

    @media screen and (max-width: 992px){
        .mp-tab {
            width: 33%;
        }
    }
</style>