<template>
    <div id="app">
        <!-- 多个页面 -->
        <!-- :include="['basicInfo', 'infoWarning' ,'dynamic']" -->
        <router-view></router-view>
    </div>
</template>
<script>
    // import {mapGetters} from 'vuex';
    import {Loading} from 'vux';
    export default {
    };
</script>
<style lang="less">
@import '../common/layout.less';
</style>
