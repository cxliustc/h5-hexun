<template>
    <div class="dataDetail">
        <scroll
        :data="infoList"
        :scrollbar="true"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"
        :pullUpLoad="{}"
        :pullDownRefresh="{}"
        @scroll="scrollHide"
        @scrollEnd="scrollShow"
        :listenScroll="true"
        :listenScrollEnd="true"
        ref="scroll">
            <ul slot="list" class="list">
                <li>
                    <div class="datas">
                        <p class="title">
                            <span class='child'>现货</span>
                            <span class='child'>期货(结算价)</span>
                            <span class='child'>股指(收盘价)</span>
                        </p>
                        <div class="dataList">
                            <div class='child'>
                                <p
                                    class='first bold'
                                    :class="{
                                        'red': getIn(['spotPriceColor'], prices) === '1',
                                        'green': getIn(['spotPriceColor'], prices) === '-1'
                                    }"
                                >{{getIn(['spotPrice'], prices)}}</p>
                                <p
                                    class='second'
                                    :class="{
                                        'red': getIn(['spotPriceColor'], prices) === '1',
                                        'green': getIn(['spotPriceColor'], prices) === '-1'
                                    }"
                                >
                                    {{getIn(['spotPriceRate'], prices)}}
                                </p>
                            </div>
                            <div class='child'>
                                <p
                                    class='first bold'
                                    :class="{
                                        'red': getIn(['settlePriceColor'], prices) === '1',
                                        'green': getIn(['settlePriceColor'], prices) === '-1'
                                    }"
                                >{{getIn(['settlePrice'], prices)}}</p>
                                <p
                                    class='second'
                                    :class="{
                                        'red': getIn(['settlePriceColor'], prices) === '1',
                                        'green': getIn(['settlePriceColor'], prices) === '-1'
                                    }"
                                >{{getIn(['settlePriceRate'], prices)}}</p>
                            </div>
                            <div class='child'>
                                <p class='first'>{{getIn(['stockIndexName'], prices)}}</p>
                                <p
                                    class='second'
                                    :class="{
                                        'red': getIn(['stockIndexColor'], prices) === '1',
                                        'green': getIn(['stockIndexColor'], prices) === '-1'
                                    }"
                                >{{getIn(['stockIndexPrice'], prices)}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="chart">
                        <chart width='100%' id="canvas" :options="polar"></chart>
                    </div>
                    <div class="chartDesc clearfix">
                        <i class='blue'></i>
                        <span class='word'>现货</span>
                        <i class='red'></i>
                        <span class='word'>期货</span>
                        <i class='yellow'></i>
                        <span class='word'>股指</span>
                        <span class="time">更新时间：{{getIn(['date'], prices)}}</span>
                    </div>
                    <div class="line"></div>
                    <div class="recommend">
                        <div class="title">
                            <i></i>
                            <span>相关推荐</span>
                        </div>
                    </div>
                </li>
                <li v-for="(item, index) in infoList" :key="index" >
                    <!-- 1张图 -->
                    <div class='clearfix detail' v-if="getIn(['cmsInfoAttList'], item) && getIn(['cmsInfoAttList'], item).length === 1">
                        <div class="left">
                            <p class="title">
                                {{getIn(['title'], item)}}
                            </p>
                            <p class="timeAndSource clearfix">
                                <span class="source">{{getIn(['author'], item)}}</span>
                                <span class="time">{{getIn(['releaseDate'], item) | daysBefore}}</span>
                            </p>
                        </div>
                        <div class="right">
                            <img :src="getIn(['cmsInfoAttList', 0], item)" alt="">
                        </div>
                    </div>
                    <!-- 无图或者大于1张图 -->
                    <div class='clearfix detail' v-if="!getIn(['cmsInfoAttList'], item) || getIn(['cmsInfoAttList'], item).length > 1">
                        <p class="title">
                            {{getIn(['title'], item)}}
                        </p>
                        <div class="images">
                            <img v-for='(el, ind) in getIn(["cmsInfoAttList"], item)' :key='ind' :src="el" alt="">
                        </div>
                        <p class="timeAndSource clearfix">
                            <span class="source">{{getIn(['author'], item)}}</span>
                            <span class="time">{{getIn(['releaseDate'], item) | daysBefore}}</span>
                        </p>
                    </div>
                </li>
            </ul>
        </scroll>
    </div>
</template>
<script>
import Scroll from 'COMPONENTS/scroll';
import mixin from './mixin';
import chart from 'vue-echarts';
import apis from '../../apis/index';
export default {
    mixins: [mixin],
    components: {
        chart, Scroll
    },
    name: 'dataDetail',
    data () {
        return {
            infoList: [],
            polar: {
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.76)',
                    padding: 10,
                    showDelay: 0,
                    formatter: function (params) {
                        let str = params[0].axisValue;
                        params.map((item, index) => {
                            str += '<br/>' + item.seriesName + '：' + (item.value ? item.value : '-');
                        });
                        return str;
                    },
                    textStyle: {
                        fontSize: 12
                    },
                    trigger: 'axis'
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLine: {
                            lineStyle: {
                                color: '#393939'
                            }
                        },
                        axisLabel: {
                            formatter: function (value) {
                                return value.slice(5);
                            },
                            fontSize: 12
                        }
                    }
                ],
                yAxis: [
                    {
                        name: '现货／期货',
                        type: 'value',
                        scale: true,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        nameTextStyle: {
                            fontSize: 12
                        }
                    },
                    {
                        name: '股指',
                        type: 'value',
                        scale: true,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        nameTextStyle: {
                            fontSize: 12
                        }
                    }
                ],
                series: [
                    {
                        name: '现货',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#95D3FF',
                                lineStyle: {
                                    color: '#95D3FF'
                                }
                            }
                        },
                        data: [],
                        yAxisIndex: 0
                    }, {
                        name: '期货',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#EE5050',
                                lineStyle: {
                                    color: '#EE5050'
                                }
                            }
                        },
                        data: [],
                        yAxisIndex: 0
                    }, {
                        name: '股指',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#F1CB18',
                                lineStyle: {
                                    color: '#F1CB18'
                                }
                            }
                        },
                        data: [],
                        yAxisIndex: 1
                    }
                ],
                grid: {
                    left: '100',
                    right: '100',
                    bottom: '45',
                    top: '60'
                }
            },
            prices: {},
            count: 2,
            name: ''
        };
    },
    created () {
        let {id, name} = this.$route.params;
        this.name = decodeURIComponent(name);
        this.onPullingDown();
        this.getDatas(id);
        this.setPolarFontSize();
    },
    methods: {
        // 下拉刷新
        onPullingDown () {
            apis.data.getList({
                pageNum: 1,
                pageSize: 10,
                channelMName: this.name
            }).then(({data, pageCount}) => {
                let cmsAppHomePageResList = data.data;
                if (!cmsAppHomePageResList || cmsAppHomePageResList.length === 0) {
                    this.noResultShow = true;
                    data = [];
                } else {
                }
                this.count = 2;
                this.infoList = cmsAppHomePageResList;
            }).catch(() => {
                this.$refs.scroll.forceUpdate();
            });
        },
        // 上拉加载
        onPullingUp () {
            apis.data.getList({
                pageNum: this.count,
                pageSize: 10,
                channelMName: this.name
            }).then(({data, pageCount}) => {
                let cmsAppHomePageResList = data.data;
                if (this.count > pageCount) {
                    this.$refs.scroll.forceUpdate(false);
                } else {
                    this.infoList = this.infoList.concat(cmsAppHomePageResList);
                    this.count++;
                }
            }).catch(() => {
                this.$refs.scroll.forceUpdate();
            });
        },
        getDatas (id) {
            apis.data.getDatas({id}).then(({data}) => {
                if (data.success) {
                    this.prices = data.data;
                    // 处理图表的数据
                    let xData = [];
                    let yData1 = [];
                    let yData2 = [];
                    let yData3 = [];
                    data.data.history.map((item, index) => {
                        xData.unshift(item[0]);
                        yData1.unshift(item[1]);
                        yData2.unshift(item[2]);
                        yData3.unshift(item[3]);
                    });
                    this.polar.xAxis[0].data = xData;
                    this.polar.series[0].data = yData1;
                    this.polar.series[1].data = yData2;
                    this.polar.series[2].data = yData3;
                } else {
                    console.log(data.message);
                }
            }).catch(() => {
                console.log('报错');
            });
        },
        setPolarFontSize () {
            let fontSize = parseFloat(window.getComputedStyle(document.documentElement)['fontSize']) / 100;
            this.polar.tooltip.textStyle.fontSize = 12 * fontSize;
            this.polar.xAxis[0].axisLabel.fontSize = 12 * fontSize;
            this.polar.yAxis[0].axisLabel.textStyle.fontSize = 12 * fontSize;
            this.polar.yAxis[1].axisLabel.textStyle.fontSize = 12 * fontSize;
            this.polar.yAxis[0].nameTextStyle.fontSize = 12 * fontSize;
            this.polar.yAxis[1].nameTextStyle.fontSize = 12 * fontSize;
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../../common/variable.less';
.dataDetail{
    .datas{
        .title{
            padding: 0 18px 0 21px;
            height:30px;
            line-height: 30px;
            background: #f5f5f5;
            font-size: 12px;
            color: #999999;
            letter-spacing: -0.13px;
            .child{
                width:125px;
                display: inline-block;
            }
            .child:last-child{
                width:75px;
            }
        }
        .dataList{
            padding: 14px 18px 22px 21px;
            .child{
                width:125px;
                display: inline-block;
                .first{
                    font-size: 14px;
                    color: #333;
                    letter-spacing: -0.17px;
                    height:22px;
                    line-height: 22px;
                }
                .second{
                    margin-top: 3px;
                    font-size: 12px;
                    color: #333;
                    letter-spacing: -0.13px;
                    height:17px;
                    line-height: 17px;
                }
                .red{
                    color: #EE5050;
                }
                .green{
                    color:#2EBA80;
                }
                .bold{
                    font-weight: 400;
                }
            }
            .child:last-child{
                width:75px;
            }
        }
        
    }
    .chart{
        height:210px;
        padding: 0 15px;
        .echarts{
            width:100%!important;
            height:100%!important;
        }
    }
    .chartDesc{
        margin: 18px 0 22px;
        padding-left: 19px;
        padding-right: 15px;
        height:17px;
        line-height: 17px;
        font-size: 12px;
        color: #999;
        letter-spacing: 0;
        i{
            width:8px;
            height:8px;
            display: inline-block;
            margin-right: 6px;
        }
        .blue{
            background: #95D3FF;
        }
        .red{
            background: #EE5050;
        }
        .yellow{
            background: #F1CB18;
        }
        .word{
            margin-right: 20px;
        }
        .time{
            float: right;
        }
    }
    .line{
        height:10px;
        background: #f5f5f5;
    }
    .recommend{
        .title{
            height:40px;
            font-size: 14px;
            color: #555555;
            letter-spacing: 0;
            text-align: justify;
            padding-left: 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid #eee;
            i{
                width:4px;
                height:14px;
                background: #EE5050;
                border-radius: 2px;
                display: inline-block;
                margin-right: 10px;
            }
            span{
                display: inline-block;
                height: 14px;
                line-height: 14px;
            }
        }
    }
    .list{
        li>.detail{
            padding:15px;
            border-bottom: 1px solid #eee;
            .left{
                float: left;
                width: 220px;
            }
            .right{
                float: right;
                img{
                    width: 112px;
                    height: 74px;
                    display: inline-block;
                }
            }
            .title{
                font-size: 17px;
                color: #333333;
                text-align: justify;
                line-height: 24px;
                .textover(2);
                height:48px;
                margin-bottom: 14px;
            }
            .timeAndSource{
                font-size: 12px;
                color: #999999;
                letter-spacing: 0;
                line-height: 12px;
                .source{
                    float: left;
                }
                .time{
                    float: right;
                }
            }
            .images{
                margin-bottom: 14px;
                img{
                    display: inline-block;
                    width:112px;
                    margin-right: 4.5px;
                    height:74px;
                }
                img:last-child{
                    margin-right: 0;
                }
            }
        }
    }
    
}
</style>