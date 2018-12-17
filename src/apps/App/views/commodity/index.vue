<template>
    <div>
        <scroll
                :scrollbar="true"
                :pullUpLoad="false"
                :pullDownRefresh="true"
                ref="scroll"
                @pullingDown="onPullingDown"
            >
            <div slot="list">
                <div id="box">
                    <ul id="stockIndex">
                        <li v-for="(item, index) in stockindexlist" :key='index' :class='[{backgroundcolor1: item.stockIndexColor == -1 ? true : false}, {backgroundcolor2: item.stockIndexColor == 0 ? true : false}]' @click="stock()">
                            <p>{{item.stockIndexName}}</p>
                            <p>{{item.stockIndexPrice === '' ? '--' : item.stockIndexPrice}}</p>
                            <p><span>{{item.stockIndexChange === '' ? '--' : item.stockIndexChange}}</span><span>{{item.stockIndexRate === '' ? '--' : item.stockIndexRate}}</span></p>
                        </li>
                    </ul>
                    <div class="bodyBox" v-for="(item, index) in classifylist" :key='index'>
                        <div class="headline" @click="switchFn(item)"><i :class='{arrow: item.active}'></i>{{item.goodsCategoryName}}</div>
                        <div :class="['contentBox', {'auto': item.active}]" :style="{'max-height': item.maxHeight}">
                            <div class="minHeader">
                                <span>商品</span>
                                <span>现货/期货</span>
                                <span>推荐股票</span>
                            </div>
                            <ul>
                                <li v-for="(item, index) in contentlist" :key='index' @click="details(item)">
                                    <div class="good">{{item.cmsHexunConfigSimpleVO.goodsName}}</div>
                                    <div class="spot">
                                        <p :class='[{color1: item.cmsSimpleSpotpriceVO && item.cmsSimpleSpotpriceVO.upsDownsFlag == -1}, {color2: item.cmsSimpleSpotpriceVO && item.cmsSimpleSpotpriceVO.upsDownsFlag == 0}, {color3: item.cmsSimpleSpotpriceVO && item.cmsSimpleSpotpriceVO.upsDownsFlag == 1}]'>{{!item.cmsSimpleSpotpriceVO || item.cmsSimpleSpotpriceVO.avg === null ? '--' : item.cmsSimpleSpotpriceVO.avg}}</p>
                                        <p :class='[{color1: item.cmsSimpleSpotpriceVO && item.cmsSimpleSpotpriceVO.upsDownsFlag == -1}, {color2: item.cmsSimpleSpotpriceVO && item.cmsSimpleSpotpriceVO.upsDownsFlag == 0}, {color3: item.cmsSimpleSpotpriceVO && item.cmsSimpleSpotpriceVO.upsDownsFlag == 1}]'>{{!item.cmsSimpleSpotpriceVO || item.cmsSimpleSpotpriceVO.riseFallRate === null ? '--' : item.cmsSimpleSpotpriceVO.riseFallRate}}</p>
                                        <p :class='[{color1: item.cmsQuoteVo && item.cmsQuoteVo.upsDownsFlag == -1}, {color2: item.cmsQuoteVo && item.cmsQuoteVo.upsDownsFlag == 0}, {color3: item.cmsQuoteVo && item.cmsQuoteVo.upsDownsFlag == 1}]'>{{!item.cmsQuoteVo || item.cmsQuoteVo.settlePrice === null ? '--' : item.cmsQuoteVo.settlePrice}}</p>
                                        <p :class='[{color1: item.cmsQuoteVo && item.cmsQuoteVo.upsDownsFlag == -1}, {color2: item.cmsQuoteVo && item.cmsQuoteVo.upsDownsFlag == 0}, {color3: item.cmsQuoteVo && item.cmsQuoteVo.upsDownsFlag == 1}]'>{{!item.cmsQuoteVo || item.cmsQuoteVo.riseFallPer === null ? '--' : item.cmsQuoteVo.riseFallPer}}</p>
                                    </div>
                                    <div class="recommend">
                                        <p v-for="(item1, index) in item.cmsStockList" :key='index'>
                                            <span>{{item1.stockName}}</span>
                                            <span :class='[{color3: item1.upsDownsFlag == -1}, {color4: item1.upsDownsFlag === 0}]'>{{item1.lastPrice}}</span>
                                            <span :class='[{color3: item1.upsDownsFlag == -1}, {color4: item1.upsDownsFlag === 0}]'>{{item1.riseFallRate}}</span>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
        <div class="service">
            <a href="https://kefu.easemob.com/webim/im.html?tenantId=40417"></a>
        </div>
    </div>
</template>
<script>
import apis from '@/apps/App/apis';
import Scroll from 'COMPONENTS/scroll';
export default {
    name: 'commodity',
    data () {
        return {
            stockindexlist: [],
            classifylist: [],
            contentlist: [],
            contentobj: [{
                stockName: '',
                lastPrice: '',
                riseFallRate: '',
                upsDownsFlag: null
            }, {
                stockName: '',
                lastPrice: '',
                riseFallRate: '',
                upsDownsFlag: null
            }, {
                stockName: '',
                lastPrice: '',
                riseFallRate: '',
                upsDownsFlag: null
            }]
        };
    },
    components: {
        Scroll
    },
    methods: {
        // 点击列表选项
        switchFn: function (item, patientia) {
            this.classifylist.forEach((item) => {
                item.active = false;
                item.maxHeight = 0;
            });
            item.active = true;
            // console.log(item);
            // console.log(patientia);
            // 列表内容渲染
            let params = {
                'goodsCategoryId': item.goodsCategoryId === '' ? patientia : item.goodsCategoryId};
            // console.log(params);
            apis.commodity.contentdata(params).then((data) => {
                data = data.body;
                if (data.success) {
                    this.contentlist = data.data;
                    if (this.contentlist) {
                        for (var i = 0; i < this.contentlist.length; i++) {
                            if (this.contentlist[i].cmsStockList === null) {
                                this.contentlist[i].cmsStockList = this.contentobj;
                            }
                        }
                        // console.log(this.contentlist);
                        item.maxHeight = `${1.5 * this.contentlist.length}rem`;
                    }
                }
            });
        },
        // 点击股指跳转
        stock: function () {},
        // 点击跳转详情页
        details: function (item) {
            // console.log(item);
            this.$router.push({
                name: 'dataDetail',
                params: {id: item.cmsHexunConfigSimpleVO.id, name: item.cmsHexunConfigSimpleVO.goodsName}
            });
        },
        // 渲染页面
        init: function () {
            // 股指渲染
            apis.commodity.stockindexdata().then((data) => {
                data = data.body;
                if (data.success) {
                    this.stockindexlist = data.data;
                    // console.log(this.stockindexlist);
                }
            });
            // 列表渲染
            apis.commodity.classifydata().then((data) => {
                data = data.body;
                if (data.success) {
                    this.$refs.scroll.forceUpdate();
                    this.classifylist = data.data;
                    this.classifylist[0].active = true;
                    // console.log(this.classifylist[0].goodsCategoryId);
                    let patientia = this.classifylist[0].goodsCategoryId;
                    this.switchFn(this.classifylist[0], patientia);
                }
            });
            // 埋点
            apis.commodity.burying({url: 'productHomePage'});
        },
        // 下拉刷新
        onPullingDown: function () {
            this.init();
        }
    },
    // 在钩子函数里调用渲染页面的方法
    created () {
        this.init();
    },
    // 在钩子函数里调用刷新滑动组件的方法
    mounted () {
        let ref = this.$refs;
        setTimeout(function () { ref.scroll.refresh(); }, 300);
    },
    // 在钩子函数里调用刷新滑动组件的方法
    updated () {
        let ref = this.$refs;
        setTimeout(function () { ref.scroll.refresh(); }, 300);
    }
};
</script>
<style lang="less">
    #box {
        #stockIndex {
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            li {
                height: 81px;
                width: 80px;
                background-color: #EE5050;
                border-radius: 5px;
                padding-top: 10px;
                &.backgroundcolor1 {
                    background-color: #2EBA80;
                }
                &.backgroundcolor2 {
                    background-color: #D0D0D0;
                }
                p:nth-child(1) {
                    font-size: 12px;
                    color: #fff;
                    text-align: center;
                }
                p:nth-child(2) {
                    font-size: 16px;
                    color: #fff;
                    text-align: center;
                }
                p:nth-child(3) {
                    font-size: 10px;
                    color: #fff;
                    text-align: center;
                    span:nth-child(1) {
                        margin-right: 3px;
                    }
                }
            }
        }
        .bodyBox {
                .headline {
                    font-size: 14px;
                    background-color: #F1F1F1;
                    color: #6A6A6A;
                    height: 35px;
                    line-height: 35px;
                    padding: 0 30px;
                    position: relative;
                    i {
                        position: absolute;
                        top: 14px;
                        left: 12px;
                        width: 17px;
                        height: 10px;
                        background: url(../../assets/images/commodity-img/topup.png) no-repeat 0px 0px;
                        background-size: 0.16rem;
                        &.arrow {
                            transform: rotate(180deg);
                            top: 14px!important;
                            left: 12px!important;
                        }
                    }
                }
                .contentBox {
                    max-height:0;
                    overflow: hidden;
                    transition: all 0.1s linear;
                    .minHeader {
                        background-color: #F5F5F5;
                        padding: 0 15px;
                        height: 24px;
                        line-height: 24px;
                        color: #999999;
                        font-size: 12px;
                        span:nth-child(1) {
                            margin-right: 58px;
                        }
                        span:nth-child(2) {
                            margin-right: 33px;
                        }
                    }
                    ul {
                        li {
                            height: 111px;
                            padding: 0 0 0 15px;
                            border-bottom: 1px solid #F6F6F6;
                            .good {
                                float: left;
                                line-height: 111px;
                                font-size: 14px;
                                width: 84px;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                padding-right: 5px;
                            }
                            .spot {
                                float: left;
                                width: 90px;
                                padding-top: 9px;
                                P {
                                    color: #D0D0D0;
                                    &.color1 {
                                        color: #2EBA80;
                                    }
                                    &.color2 {
                                        color: #333333;
                                    }
                                    &.color3 {
                                        color: #EE5050;
                                    }
                                }
                                p:nth-child(2n+1){
                                    font-size: 16px;
                                }
                                p:nth-child(2n){
                                    font-size: 12px;
                                }
                            }
                            .recommend {
                                float: left;
                                display: flex;
                                flex-direction: column;
                                align-content: space-around;
                                padding-top: 10px;
                                p {
                                    height: 30px;
                                    line-height: 30px;
                                    span {
                                        margin-right: 4px;
                                        &.color3 {
                                            color: #2EBA80!important;
                                        }
                                        &.color4 {
                                            color: #333333!important;
                                        }
                                    }
                                    span:nth-child(1) {
                                        font-size: 14px;
                                        display: inline-block;
                                        width: 58px;
                                    }
                                    span:nth-child(2) {
                                        font-size: 12px;
                                        color: #EE5050;
                                    }
                                    span:nth-child(3) {
                                        font-size: 12px;
                                        color: #EE5050;
                                        margin-right: 0px;
                                    }
                                }
                            }
                        }
                    }
                }
        }
    }
    .service {
        position: fixed;
        bottom: 16px;
        right: 16px;
        a {
            display: block;
            height: 60px;
            width: 265px;
            background: url(../../assets/images/commodity-img/kefu.png) no-repeat 0px 0px;
            background-size: 2.65rem;
        }
    }
</style>