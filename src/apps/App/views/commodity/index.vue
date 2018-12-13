<template>
    <scroll
            :scrollbar="true"
            :pullUpLoad="false"
            :pullDownRefresh="true"
            :listenScroll="true"
            :listenScrollEnd="true"
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
                    <div :class="['contentBox', {'auto': item.active}]">
                        <div class="minHeader">
                            <span>商品</span>
                            <span>现货/期货</span>
                            <span>推荐股票</span>
                        </div>
                        <ul>
                            <li v-for="(item, index) in contentlist" :key='index' @click="details(item)">
                                <div class="good">{{item.cmsHexunConfigSimpleVO.goodsName}}</div>
                                <div class="spot">
                                    <p :class='[{color1: item.cmsSimpleSpotpriceVO.upsDownsFlag == -1 ? true : false}, {color2: item.cmsSimpleSpotpriceVO.upsDownsFlag == 0 ? true : false}]'>{{item.cmsSimpleSpotpriceVO.avg === null ? '--' : item.cmsSimpleSpotpriceVO.avg}}</p>
                                    <p :class='[{color1: item.cmsSimpleSpotpriceVO.upsDownsFlag == -1 ? true : false}, {color2: item.cmsSimpleSpotpriceVO.upsDownsFlag == 0 ? true : false}]'>{{item.cmsSimpleSpotpriceVO.riseFallRate === null ? '--' : item.cmsSimpleSpotpriceVO.riseFallRate}}</p>
                                    <p :class='[{color1: item.cmsQuoteVo.upsDownsFlag == -1 ? true : false}, {color2: item.cmsQuoteVo.upsDownsFlag == 0 ? true : false}]'>{{item.cmsQuoteVo.settlePrice === null ? '--' : item.cmsSimpleSpotpriceVO.settlePrice}}</p>
                                    <p :class='[{color1: item.cmsQuoteVo.upsDownsFlag == -1 ? true : false}, {color2: item.cmsQuoteVo.upsDownsFlag == 0 ? true : false}]'>{{item.cmsQuoteVo.riseFallPer === null ? '--' : item.cmsSimpleSpotpriceVO.riseFallPer}}</p>
                                </div>
                                <div class="recommend">
                                    <p v-for="(item1, index) in item.cmsStockList" :key='index'>
                                        <span>{{item1.stockName}}</span>
                                        <span :class='[{color3: item1.upsDownsFlag == -1 ? true : false}, {color4: item1.upsDownsFlag == 0 ? true : false}]'>{{item1.lastPrice}}</span>
                                        <span :class='[{color3: item1.upsDownsFlag == -1 ? true : false}, {color4: item1.upsDownsFlag == 0 ? true : false}]'>{{item1.riseFallRate}}</span>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </scroll>
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
            contentlist: []
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
                    // console.log(this.contentlist);
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
                params: {id: item.cmsHexunConfigSimpleVO.id, name: 'dataDetail'}
            });
        },
        // 渲染页面
        init: function () {
            // 股指渲染
            apis.commodity.stockindexdata().then((data) => {
                data = data.body;
                if (data.success) {
                    this.stockindexlist = data.data;
                    // this.stockindexlist[0].stockIndexName = '';
                    // this.stockindexlist[0].stockIndexColor = 0;
                    // console.log(this.stockindexlist);
                }
            });
            // 列表渲染
            apis.commodity.classifydata().then((data) => {
                data = data.body;
                if (data.success) {
                    this.classifylist = data.data;
                    this.classifylist[0].active = true;
                    // console.log(this.classifylist[0].goodsCategoryId);
                    let patientia = this.classifylist[0].goodsCategoryId;
                    this.switchFn(this.classifylist[0], patientia);
                    this.$refs.scroll.forceUpdate();
                }
            });
            // 埋点
            apis.commodity.burying({url: 'productHomePage'});
        },
        onPullingDown: function () {
            this.init();
        }
    },
    created () {
        this.init();
    }
};
</script>
<style lang="less">
    .blockNone {
        display: none;
    }
    #box {
        height: 100%;
        overflow: auto;
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
                    transition: all 300ms linear;
                    &.auto {
                        max-height: 1200px;
                    }
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
                            margin-right: 46px;
                        }
                    }
                    ul {
                        li {
                            height: 111px;
                            padding: 0 15px;
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
                                width: 96px;
                                padding-top: 9px;
                                P {
                                    color: #EE5050;
                                    &.color1 {
                                        color: #2EBA80;
                                    }
                                    &.color2 {
                                        color: #D0D0D0;
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
                                        margin-right: 6px;
                                        &.color3 {
                                            color: #2EBA80!important;
                                        }
                                        &.color4 {
                                            color: #D0D0D0!important;
                                        }
                                    }
                                    span:nth-child(1) {
                                        font-size: 14px;
                                    }
                                    span:nth-child(2) {
                                        font-size: 12px;
                                        color: #EE5050;
                                    }
                                    span:nth-child(3) {
                                        font-size: 12px;
                                        color: #EE5050;
                                    }
                                }
                            }
                        }
                    }
                }
        }
    }
</style>