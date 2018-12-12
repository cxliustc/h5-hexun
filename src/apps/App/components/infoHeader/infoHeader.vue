<template>
    <div class="pageHeader clearfix">
        <img class="fl" src='../../assets/images/info/infoLeftArrow.png' @click="goBack()" />
        <h1 class="fl" :class="{center:isDynamicname}">{{isDynamicname ? '新闻详情' : authorName}}</h1>
    </div>
</template>
<script>
export default {
    name: 'pageHeader',
    data () {
        return {
        };
    },
    props: ['isDynamicname', 'authorName'],
    methods: {
        goBack () {
            this.$router.go(-1);// 返回上一层
        }
    }
};
</script>
<style lang="less" scoped>
    .pageHeader{
        height:44px;
        width:100%;
        background:#fff;
        position: fixed;
        top:0;
        left:0;
        box-shadow: inset 0 -1px 0 0 #F5F5F5;
        h1{
        width:76%;
        padding-left: 11.3px;
        font-size:15px;
        font-weight: 300;
        color:#333;
        letter-spacing: 0.44px;
        height:44px;
        line-height: 44px;
        &.center{
            text-align: center;
            font-size:17px;
        }
        }
        img{
            width:18.4px;
            height:18.4px;
            margin-top:13px;
            margin-left:15px;
        }
    }
</style>

 