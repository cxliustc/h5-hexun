<template>
    <scroll
            :scrollbar="true"
            :pullUpLoad="false"
            :pullDownRefresh="true"
            :listenScroll="true"
            :listenScrollEnd="true"
            ref="scroll"
        >
        <div slot="list">
            <div id="box">
                <ul id="stockIndex">
                    <li v-for="(item, index) in stockindexlist" :key='index' :class='{color: item.stockIndexColor == -1 ? true : false}'>
                        <p>{{item.stockIndexName}}</p>
                        <p>{{item.stockIndexPrice}}</p>
                        <p><span>+11.65</span><span>{{item.stockIndexRate}}</span></p>
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
                            <li>
                                <div class="good">乙二醇</div>
                                <div class="spot">
                                    <p>7800</p>
                                    <p>+2.1%</p>
                                    <p>610.00</p>
                                    <p>+3.10%</p>
                                </div>
                                <div class="recommend">
                                    <p>
                                        <span>三圣股份</span>
                                        <span>8.30</span>
                                        <span>+1.97%</span>
                                    </p>
                                    <p>
                                        <span>科顺股份</span>
                                        <span>9.74</span>
                                        <span>+10.06%</span>
                                    </p>
                                    <p>
                                        <span>华新水泥</span>
                                        <span>18.04</span>
                                        <span>+0.50%</span>
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
import apis from '@/apps/APP/apis';
import Scroll from 'COMPONENTS/scroll';
export default {
    name: 'commodity',
    data () {
        return {
            stockindexlist: [],
            classifylist: []
        };
    },
    components: {
        Scroll
    },
    methods: {
        switchFn: function (item) {
            this.classifylist.forEach((item) => {
                item.active = false;
            });
            item.active = true;
        }
    },
    created () {
        apis.commodity.stockindexdata().then((data) => {
            data = data.body;
            if (data.success) {
                this.stockindexlist = data.data;
                // console.log(this.stockindexlist);
            }
        });
        apis.commodity.classifydata().then((data) => {
            data = data.body;
            if (data.success) {
                this.classifylist = data.data;
                this.classifylist[0].active = true;
                // console.log(this.classifylist);
            }
        });
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
                &.color {
                    background-color: #2EBA80;
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
                        transform: rotate(-134deg);
                        position: absolute;
                        top: 18px;
                        left: 18px;
                        width: 8px;
                        height: 8px;
                        border-bottom: 1px solid #EE4F50;
                        border-right: 1px solid #EE4F50;
                        &.arrow {
                            transform: rotate(44deg) !important;
                            top: 12px!important;
                            left: 18px!important;
                        }
                    }
                }
                .contentBox {
                    max-height:0;
                    overflow: hidden;
                    transition: all 300ms linear;
                    &.auto {
                        max-height: 600px;
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
                            }
                            .spot {
                                float: left;
                                width: 104px;
                                padding-top: 9px;
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
                                    }
                                    span:nth-child(1) {
                                        font-size: 14px;
                                    }
                                    span:nth-child(2) {
                                        font-size: 12px;
                                    }
                                    span:nth-child(3) {
                                        font-size: 12px;

                                    }
                                }
                            }
                        }
                    }
                }
        }
    }
</style>