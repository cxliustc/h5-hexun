<template>
    <div id="app">
        <keep-alive include='dataDetail'> 
            <!-- 多个页面 -->
            <!-- :include="['basicInfo', 'infoWarning' ,'dynamic']" -->
            <router-view :key="key"></router-view>
        </keep-alive>
        <loading v-model="isLoading"></loading>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {Loading} from 'vux';
    export default {
        data () {
            return {
                show: true
            };
        },
        components: {
            Loading
        },
        computed: {
            ...mapGetters({
                'isLoading': 'system/isLoading'
            }),
            key () {
                return this.$route.path + Math.random();
            }
        }
    };
</script>
<style lang="less">
@import '../common/layout.less';
</style>
