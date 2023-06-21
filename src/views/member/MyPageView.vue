<template>
    <div class="mp">
        <div class="mp-title">
            <h1>마이페이지</h1>
        </div>

        <div class="mp-nav">
            <ul class="nav nav-tabs mp-tabs">
                <li class="nav-item mp-tab">
                    <p class="nav-link mp-link p-mypage-bookmark" v-bind:class="{ active: activeTab === 'BookmarkView' }" @click="setPath('bookmark')">북마크</p>
                </li>
                <li class="nav-item mp-tab">
                    <p class="nav-link mp-link p-mypage-posting" v-bind:class="{ active: activeTab === 'MyArticleView' }" @click="setPath('posting')">내가 쓴 글</p>
                </li>
                <li class="nav-item mp-tab">
                    <p class="nav-link mp-link p-mypage-info" v-bind:class="{ active: activeTab === 'InfoView' }" @click="setPath('info')">내 정보</p>
                </li>
            </ul>
        </div>

        <div style="width: 100%">
            <component v-bind:is="activeTab"></component>
        </div>
    </div>
</template>

<script>
import BookmarkView from '../../components/BookmarkView.vue'
import MyArticleView from '../../components/MyArticleView.vue'
import InfoView from '../../components/InfoView.vue'

export default {
    data(){
        return{
            activeTab: '',
        }
    },
    methods:{
        setPath(query){
            if(query === 'bookmark'){
                this.activeTab = 'BookmarkView';
            }else if(query === 'posting'){
                this.activeTab = 'MyArticleView';
            }else if(query === 'info'){
                this.activeTab = 'InfoView';
            }

            if(this.$route.fullPath === `/mypage?tab=${query}`){
                this.$router.go(this.$router.currentRoute);
            }else{
                this.$router.push({path: "/mypage", query: {tab: query}});
            }
        }
    },
    components:{
        BookmarkView,
        MyArticleView,
        InfoView,
    },
    created(){
        if(this.$route.query.tab === 'bookmark'){
            this.activeTab = 'BookmarkView';
        }else if(this.$route.query.tab === 'posting'){
            this.activeTab = 'MyArticleView';
        }else if(this.$route.query.tab === 'info'){
            this.activeTab = 'InfoView';
        }
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
    }.p-mypage-bookmark:hover, .p-mypage-posting:hover, .p-mypage-info:hover {
        cursor:pointer;
    }

    @media screen and (max-width: 992px){
        .mp-tab {
            width: 33%;
        }
    }
</style>