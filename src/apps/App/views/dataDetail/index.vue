<template>
    <div class="dataDetail">
        <div class="header">
            <span>乙二醇</span>
            <div>
                <span @click='getIntroduce()'></span>
                <span @click='getQrCode()'></span>
            </div>
        </div>
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
            <ul slot="list" class="list" >
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
                        <chart id="canvas" :options="polar"></chart>
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
                <li v-for="(item, index) in infoList" :key="index" @click='goToDetail(item.infoId)'>
                    <!-- 1张图 -->
                    <div class='clearfix detail' v-if="getIn(['channelCode'],item) !=='YB' && getIn(['cmsInfoAttList'], item) && getIn(['cmsInfoAttList'], item).length === 1">
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
                    <div class='clearfix detail' v-if="getIn(['channelCode'],item) !=='YB' &&(!getIn(['cmsInfoAttList'], item) || getIn(['cmsInfoAttList'], item).length > 1 || getIn(['cmsInfoAttList'], item).length === 0)">
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
                    <!-- 有附件时，不显示 -->
                    <div class='clearfix detail' v-if="getIn(['channelCode'],item) ==='YB'">
                        <p class="title">
                            {{getIn(['title'], item)}}
                        </p>
                        <p class="timeAndSource clearfix">
                            <span class="source">{{getIn(['author'], item)}}</span>
                            <span class="time">{{getIn(['releaseDate'], item) | daysBefore}}</span>
                        </p>
                    </div>
                </li>
                 <li>
                    <div v-show="noResultShow" class="noResult">
                        <NoPriceResult></NoPriceResult>
                    </div>
                </li>
            </ul>
        </scroll>
        <!-- <a href="https://kefu.easemob.com/webim/im.html?tenantId=40417" class="CustomerService" v-show='!showMainMask'></a> -->
        <askUps :askList='askList' v-on:askUpsFn='askUpsFn'/>
        <submitComponent :showBomb='showBomb' v-on:closeBomb='closeBomb' :detailId='detailId'/>
        <popPicture :showBomb='showBombPicture' v-on:closeBomb='closeBombPicture'>
            <img :src="imgUrl" alt="">
        </popPicture>
    </div>
</template>
<script>
import Scroll from 'COMPONENTS/scroll';
import NoPriceResult from '../../../../components/noPriceResult';
import askUps from '../../components/askUps';
import submitComponent from '../../components/submitComponent';
import popPicture from '../../components/popPicture';
import mixin from './mixin';
import chart from 'vue-echarts';
import apis from '../../apis/index';
import { ls } from 'UTILS/utils';
import hexunPop1 from '../../assets/images/hexun_pop1.png';
import hexunPop2 from '../../assets/images/hexun_pop2.png';
export default {
    mixins: [mixin],
    components: {
        chart, Scroll, NoPriceResult, askUps, submitComponent, popPicture
    },
    name: 'dataDetail',
    data () {
        return {
            noResultShow: false,
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
                        // splitNumber: 6,
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
                        // splitNumber: 6,
                        scale: true,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                fontSize: 12
                            }
                        },
                        nameTextStyle: {
                            fontSize: 12
                        },
                        splitLine: {
                            show: false
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
                    left: '13%',
                    right: '13%',
                    bottom: '10%',
                    top: '15%'
                }
            },
            prices: {},
            count: 2,
            name: '',
            askList: [],
            detailId: '',
            showBomb: false,
            showBombPicture: false,
            imgUrl: ''
        };
    },
    created () {
        let {id, name} = this.$route.params;
        this.name = decodeURIComponent(name);
        this.onPullingDown();
        this.getDatas(id);
        this.setPolarFontSize();
        apis.data.getMaidian();
        apis.commodity.queryPage().then(data => {
            data = data.body;
            if (data.success) {
                this.askList = data.data;
            }
        });
    },
    methods: {
        closeBomb () {
            this.showBomb = false;
        },
        getIntroduce () {
            this.imgUrl = hexunPop1;
            this.showBombPicture = true;
        },
        getQrCode () {
            this.imgUrl = hexunPop2;
            this.showBombPicture = true;
        },
        closeBombPicture () {
            this.showBombPicture = false;
        },
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
                    this.$refs.scroll.forceUpdate(false);
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
            }).then((result) => {
                let {data, pageCount} = result.body;
                let cmsAppHomePageResList = data;
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
        },
        goToDetail (item) {
            this.$router.push({
                name: 'infoDetail',
                params: {informationId: item}
            });
        },
        askUpsFn (id) {
            this.detailId = id;
            if (ls.getCookie('HX_AUTH_CHECK') === 'checked') {
                this.$router.push({
                    name: 'infoDetail',
                    params: {informationId: this.detailId}
                });
            } else {
                this.showBomb = true;
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../../common/variable.less';
.dataDetail{
    .list-wrapper{
        top: 60px;
    }
    .header{
        width: 100%;
        height: 60px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 19px;
        span:nth-child(1) {
            font-size: 17px;
            color: #333333;
        }
        div{
            display: flex;
            align-items: center;
            span:nth-child(1) {
                display: inline-block;
                width: 22px;
                height: 22px;
                background: url(../../assets/images/hexun_wh.png) no-repeat 0px 0px;
                background-size: cover;
            }
            span:nth-child(2) {
                display: inline-block;
                width: 22px;
                height: 22px;
                margin-left: 22px;
                background: url(../../assets/images/hexun_erwm.png) no-repeat 0px 0px;
                background-size: cover;
            }
        }
    }
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
        width:375px;
        padding: 0 15px;
        .echarts{
            width:345px!important;
            height:210px!important;
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
.CustomerService{
        background:url(../../assets/images/CustomerService.png) no-repeat;
        height:55px;
        width:55px;
        background-size:0.55rem;
        display: block;
        position:fixed;
        bottom:26px;
        right:16px;
        z-index:10;
    }
</style>