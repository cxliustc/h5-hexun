<template>
    <div class="askUps clearfix">
        <div class="askInput">
            <ul ref='ulList' :class='{"noTransition" : flag}'>
                <li v-for="(item, index) in askList" :key="index" @click="goToDetail(getIn(['newsId'], item))">
                    {{item.newsTitle}}
                </li>
            </ul>
        </div>
        <div class="askText">今日策略</div>
    </div>
</template>
<script>
export default {
    name: 'askUps',
    data () {
        return {
            count: 0,
            flag: false
        };
    },
    mounted () {
        var distance = 0;
        var rem = window.getComputedStyle(document.documentElement)['fontSize'];
        setInterval(() => {
            var length = this.askList.length - 1;
            if (this.count < length) {
                this.flag = false;
                this.count++;
            } else {
                this.flag = true;
                this.count = 0;
            }
            distance = -24 * this.count * (parseInt(rem) / 100);
            if (this.$refs.ulList) {
                this.$refs.ulList.style.transform = `translateY(${distance}px)`;
            }
        }, 2000);
    },
    props: ['askList'],
    methods: {
        goToDetail (id) {
            this.$emit('askUpsFn', id);
        }
    }
};
</script>
<style lang="less" scoped>
    .askUps{
        position: absolute;
        bottom: 16px;
        right: 16px;
        background: url(../../assets/images/commodity-img/jrcl.png) no-repeat 0px 0px;
        background-size: 2.65rem;
        height: 60px;
        width: 265px;
        .askInput{
            position: absolute;
            top: 20px;
            left: 18px;
            z-index: 2;
            width: 190px;
            height: 24px;
            padding-left: 2px;
            box-sizing: border-box;
            color: #ffffff;
            overflow: hidden;
        }
        .askText{
            position: absolute;
            bottom: 12px;
            right: 10px;
            background-color: #ec5354;
            height: 10px;
            width: 38px;
            color: #f3c9c9;
            font-size: 8px;
            line-height: 10px;
            text-align: center;
        }
        ul{
            position: absolute;
            top: 0px;
            left: 0px;
            transition: all 500ms;
            width: 100%;
            li{
                height: 24px;
                line-height: 24px;
                overflow: hidden;
            }
        }
        .noTransition{
            transition: all 0ms;
        }
    }
</style>

 