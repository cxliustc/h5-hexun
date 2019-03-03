<template>
    <div class="no-result">
        <img :src="emptyImgUrl ? emptyImgUrl : defaultBackLogoUrl" />
        <p>{{emptyText ? emptyText : defaultTitle}}</p>
    </div>
</template>
<script>
export default {
    name: 'noPriceResult',
    props: {
        emptyText: String,
        emptyImgUrl: String
    },
    data () {
        return {
            defaultTitle: '暂无最新数据',
            defaultBackLogoUrl: require('../../apps/App/assets/images/no-result.png')
        };
    }
};
</script>
<style lang="less" scoped>
    .no-result{
        position: relative;
        top:0;
        left:0;
        width:100%;
        height:100%;
        text-align: center;
        font-size: 15px;
        color: #CECECE;
        // height: 500px;
        background: #fff;
        img{
            margin-top:30px;
            width:72px;
            height:72px;
        }
        p{
            padding-top: 22px;
        }
    }
</style>