<template>
    <div class="mp">
        <div class="mp-title">
            <h1>관리페이지</h1>
        </div>

        <div class="mp-nav">
            <ul class="nav nav-tabs mp-tabs">
                <li class="nav-item mp-tab">
                    <span class="nav-link mp-link p-mypage-bookmark" v-bind:class="{ active: activeTab === 'MembersView' }" @click="setPath('members')">회원 관리</span>
                </li>
                <li class="nav-item mp-tab">
                    <span class="nav-link mp-link p-mypage-posting" v-bind:class="{ active: activeTab === 'AdminBoardView' }" @click="setPath('adminBoard')">게시글 관리</span>
                </li>
                <li class="nav-item mp-tab">
                    <span class="nav-link mp-link p-mypage-info" v-bind:class="{ active: activeTab === 'AdminInfoView' }" @click="setPath('adminInfo')">내 정보</span>
                </li>
            </ul>
        </div>

        <div style="width: 100%">
            <component v-bind:is="activeTab"></component>
        </div>
    </div>
</template>

<script>
import MembersView from '/src/components/admin/MembersView.vue'
import AdminBoardView from '/src/components/admin/AdminBoardView.vue'
import AdminInfoView from '/src/components/admin/AdminInfoView.vue'

export default {
    data(){
        return{
            activeTab: '',
        }
    },
    methods:{
        setPath(query){
            if(query === 'members'){
                this.activeTab = 'MembersView';
            }else if(query === 'adminBoard'){
                this.activeTab = 'AdminBoardView';
            }else if(query === 'adminInfo'){
                this.activeTab = 'AdminInfoView';
            }

            if(this.$route.fullPath === `/admin?tab=${query}`){
                this.$router.go(this.$router.currentRoute);
            }else{
                this.$router.push({path: "/admin", query: {tab: query}});
            }
        }
    },
    components:{
        MembersView,
        AdminBoardView,
        AdminInfoView,
    },
    created(){
        if(this.$route.query.tab === 'members'){
            this.activeTab = 'MembersView';
        }else if(this.$route.query.tab === 'adminBoard'){
            this.activeTab = 'AdminBoardView';
        }else if(this.$route.query.tab === 'adminInfo'){
            this.activeTab = 'AdminInfoView';
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