<template>
    <div class="wrapper" :class='{"overflowH":showMainMask}' v-cloak id="infoDetailBox">
        <!-- 文章遮罩 -->
        <div class="mainMask" v-show="showMainMask" @click="showBomb = true">
            <span>提示:本内容由百联大宗提供,请验证手机号后获取全文</span>
        </div>
        <!-- 验证码弹出层 -->
        <div class='VerificationCodeWrap' v-show="showBomb">
            <div class="VerificationCodeContent">
                <div>
                    <input type="tel" class="phoneBox" v-model='phoneNum' @input='phoneNum=phoneNum.replace(/[^\d\.]/g,"")' placeholder="请输入手机号">
                </div>
                <div>
                    <input type="text" class="codeBox" v-model='codeNum' @input='codeNum=codeNum.replace(/[^\d\.]/g,"")' placeholder="请输入验证码">
                    <span class="getCode" :class='{"isGetCode" : isGetCode}' @click='getVerificationCode(phoneNum)'>{{isGetCode ? `已发送(${CountDown}S)` : '发送验证码'}}</span>
                </div>
                <button class="subCode" @click='subPhone()'>提交</button>
            </div>
            <button class="VerificationClose" @click="showBomb = false"><img src="../../assets/images/close.png" alt=""></button>
        </div>
        <!-- 正文 -->
        <div class='title'>{{infoDetail.title}}</div>
        <div class="content">
            <div class="authorInfo">
                <div>
                    <span  class='author_name' >{{infoDetail.authorName|strLimit(6)}}</span>&nbsp;
                    <span class='author_time'>{{infoDetail.releaseDate|translateDate}}</span>
                </div>
                <div v-if='infoDetail.channelName === "研报"'>
                    <a v-for='(item, index) in infoDetail.cmsInfoAttRes' :key="index" class='pdfLogo' id='pdfLogo' href='javascript:;' download='' @click='showPDF(item.attachmentName, item.attachmentPath)'>
                        <p>{{item.attachmentName}}</p>
                    </a>
                </div>
                <div class='guideIntrduction' v-if='infoDetail.isShowGeneral === "1" && infoDetail.channelCode !== "ZB"'>
                    <p class='guideContent'>
                        <span class='guide_logo'>导语：</span>{{infoDetail.general}}
                    </p>
                </div>
            </div>
            <!-- 研报表格 -->
            <div class="table" v-show='infoDetail.cmsInfoData && infoDetail.cmsInfoData.showTable === "1"'>
                <p>{{infoDetail.cmsInfoData ? infoDetail.cmsInfoData.tableTitle : ''}}</p>
                <div>
                    <table class="info-table">
                        <thead>
                            <tr>
                                <th>交期</th>
                                <th>方向</th>
                                <th>数量</th>
                                <th>价格</th>
                                <th>方向</th>
                                <th>数量</th>
                                <th>价格</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in getTableData(infoDetail.cmsInfoData)" :key="index">
                                <td>{{getTableText(item.deliveryTime)}}</td>
                                <td>{{getTableText(item.buyDirection)}}</td>
                                <td>{{getTableText(item.buyQuantity)}}</td>
                                <td>{{getPrice(item.buyStartPrice, item.buyEndPrice)}}</td>
                                <td>{{getTableText(item.sellDirection)}}</td>
                                <td>{{getTableText(item.sellQuantity)}}</td>
                                <td>{{getPrice(item.sellStartPrice, item.sellEndPrice)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="trade-time">交易数据更新于：{{infoDetail.cmsInfoData ? getUpdateTime(infoDetail.cmsInfoData.dataEndTime) : ''}}</p>
            </div>
            <!-- 研报图表 -->
            <div class="chart-div" v-show='infoDetail.cmsInfoData && infoDetail.cmsInfoData.showChart === "1"'>
                <p>{{infoDetail.cmsInfoData ? infoDetail.cmsInfoData.chartTitle : ''}}</p>
                <chart id="canvas" :options="polar" :auto-resize = true></chart>
            </div>
            <div class="infoContent">
                <span class='infoContent-html' :class="{'isIosG':isIos}" v-html="delBrInData(infoDetail.texHtml)"></span>
                <span class='declare' v-if="infoDetail.isShowOrigin === '1'">来源：{{infoDetail.ext2}}</span>
                <span class='declare' v-if="infoDetail.isShowDisclaimer === '1'">免责声明：本文非百联大宗原创，以上仅代表作者个人观点</span>
                <span class='declare' v-if="infoDetail.isShowCopyright === '1'">版权声明：如需转载，请注明来自“百联大宗”</span>
            </div>
            <!-- 相关推荐 -->
            <div class='infoRecommendation'>
                <div class='recommedationTitle'>
                    <span>
                        <span class="colorMark"></span><p class='modelName'>相关推荐</p>
                    </span>
                </div>
                <div class='recommendationContent'>
                    <ul>
                        <li v-for="(item, index) in infoRecommendation" :key="index" @click='gotoRecommendation(item.infoId)'>
                            <a href="">
                                <!-- 单图 -->
                                <div class="clearfix" v-if="item.cmsInfoAttList !== null &&item.cmsInfoAttList.length <3">
                                    <div class="left releative oneJpgLeft">
                                        <p class='recommendationTitle recommendationTitle1'>{{item.title|strLimit(30)}}</p>
                                        <div class='subscript subscript1'>
                                            <span class='left' style='margin-right:0.12rem;'>{{item.author|strLimit(6)}}</span>
                                            <span class='right'>{{item.releaseDate|translateDate}}</span>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <img class='dantu' v-if='item.cmsInfoAttList && item.cmsInfoAttList.length !==0 && !item.cmsInfoAttList[0].includes(".pdf")' :src='item.cmsInfoAttList[0]'/>
                                    </div>
                                </div>
                                <!-- 三图 -->
                                <div class="clearfix" v-if="item.cmsInfoAttList !== null &&item.cmsInfoAttList.length >=3">
                                    <p class='recommendationTitle'>{{item.title|strLimit(30)}}</p>
                                    <div class="santu clearfix">
                                        <img v-if='!item.cmsInfoAttList[0].includes(".pdf")' :src="item.cmsInfoAttList[0]" alt="">
                                        <img v-if='!item.cmsInfoAttList[1].includes(".pdf")' :src="item.cmsInfoAttList[1]" alt="">
                                        <img v-if='!item.cmsInfoAttList[2].includes(".pdf")' :src="item.cmsInfoAttList[2]" alt="">
                                    </div>
                                    <div class='subscript subscript2'>
                                        <span class='left' style='margin-right:0.12rem;'>{{item.author|strLimit(6)}}</span>
                                        <span class='right'>{{item.releaseDate|translateDate}}</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
import apis from '@/apps/APP/apis';
import { getTime } from 'UTILS/utils';
import { isPhone } from 'UTILS/StringUtil';
import chart from 'vue-echarts';
import { setTimeout } from 'timers';
export default {
    name: 'infodetail',
    data () {
        return {
            infoDetail: {}, // 详情数据
            infoRecommendation: {}, // 相关推荐数据
            isIos: false, // 是否是ios
            errorImg: import('../../assets/images/user-default-blue.png'),
            phoneNum: '', // 电话号码
            codeNum: '', // 验证码
            isGetCode: false, // 验证码是否发送
            CountDown: 60, // 倒计时
            showMainMask: true, // 文章遮罩
            showBomb: true, // 短信验证弹框
            polar: {// 研报图表配置
                tooltip: {
                    trigger: 'item',
                    showDelay: 0,
                    formatter: function (params) {
                        if (params.value.length > 1) {
                            return params.seriesName + ' :<br/>' + '数量：' + params.value[0] + '个 <br/>' + '价格：' + params.value[1] + '元 ';
                        }
                    },
                    textStyle: {
                        fontSize: 12
                    }
                },
                grid: {
                    left: '2%',
                    right: '5%',
                    containLabel: true
                },
                textStyle: {
                    fontSize: 12
                },
                legend: {
                    data: ['买', '卖      数量：个'],
                    x: 'center',
                    y: 'bottom',
                    textStyle: {
                        fontSize: 12
                    }
                },
                xAxis: [
                    {
                        type: 'value',
                        scale: true,
                        fontSize: 12,
                        minInterval: 1,
                        min: 0,
                        axisLabel: {
                            textStyle: {
                                fontSize: 12
                            },
                            formatter: function (value, index) {
                                if (parseInt(value) !== value) {
                                    return '';
                                }
                                return parseInt(value);
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                fontSize: 12
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '买',
                        type: 'scatter',
                        color: '#95d3ff',
                        label: {
                            normal: {
                                color: '#000000',
                                show: true,
                                position: 'top',
                                fontSize: 12
                            }
                        },
                        data: []
                    },
                    {
                        name: '卖      数量：个',
                        color: '#f55b5b',
                        type: 'scatter',
                        label: {
                            normal: {
                                color: '#000000',
                                show: true,
                                position: 'top',
                                fontSize: 12
                            }
                        },
                        data: []
                    }
                ]
            }
        };
    },
    components: {
        chart
    },
    created () {
        // 资讯详情数据拿取
        let params = {
            informationId: this.$route.params.informationId || '',
            cacheId: this.$route.params.informationId || '',
            refresh: true};
        apis.info.getInfoDetailData(params).then((data) => {
            data = data.body;
            if (data.success) {
                this.infoDetail = data.data;
                // 图表数据处理
                if (this.infoDetail.cmsInfoData) {
                    this.getChartdata(this.infoDetail.cmsInfoData.chartContent);
                }
                // 相关推荐数据拿取
                let paramsRecommend = {
                    categoryLevel1Id: this.infoDetail.categoryLevel1Id,
                    categoryLevel2Id: this.infoDetail.categoryLevel2Id,
                    categoryLevel3Id: this.infoDetail.categoryLevel3Id,
                    channelCode: this.infoDetail.channelCode,
                    infoId: this.infoDetail.infoId,
                    cacheId: this.infoDetail.infoId,
                    refresh: true
                };
                apis.info.getInfoDetailRecommendData(paramsRecommend).then((data) => {
                    data = data.body;
                    if (data.success) {
                        this.infoRecommendation = data.data.length > 3 ? data.data.slice(0, 3) : data.data;
                    }
                });
            }
        });
        // 判断ios，android
        this.getMobilesType();
        // 图表字体设置
        this.setPolarFontSize();
    },
    mounted () {
    },
    methods: {
        // 判断ios，android
        getMobilesType () {
            let u = navigator.userAgent;
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                this.isIos = false;
            } else if (isiOS) {
                this.isIos = true;
            }
        },
        // 研报表格数据处理
        getTableData (cmsInfoData) {
            if (cmsInfoData) {
                if (cmsInfoData.tableContent) {
                    return JSON.parse(cmsInfoData.tableContent);
                }
            } else {
                return [];
            }
        },
        // 研报表格普通文本处理
        getTableText (str) {
            if (str === null || str === '') {
                return '-';
            } else {
                return str;
            }
        },
        // 研报表格价格处理
        getPrice (start, end) {
            if (start === null || end === null) {
                return '-';
            } else {
                if (start === end) {
                    return start;
                } else {
                    return start + '-' + end;
                }
            }
        },
        // 去除正文<br>
        delBrInData: function (data) {
            if (data) {
                data = data.replace(/<br>/g, '');
            }
            return data;
        },
        // 相关推荐跳转
        gotoRecommendation: function (item) {
            // this.$store.commit('index/setLoading', true)
            this.$router.push({
                name: 'infoDetail',
                params: {informationId: item}
            });
        },
        // 表格数据时间处理
        getUpdateTime (time) {
            return getTime(time);
        },
        // 图表字体设置
        setPolarFontSize () {
            let fontSize = parseFloat(window.getComputedStyle(document.documentElement)['fontSize']) / 100;
            this.polar.tooltip.textStyle.fontSize = 12 * fontSize;
            this.polar.xAxis[0].axisLabel.textStyle.fontSize = 12 * fontSize;
            this.polar.yAxis[0].axisLabel.textStyle.fontSize = 12 * fontSize;
            this.polar.series[0].label.normal.fontSize = 12 * fontSize;
            this.polar.series[1].label.normal.fontSize = 12 * fontSize;
            this.polar.legend.textStyle.fontSize = 12 * fontSize;
            // this.polar.xAxis[0].nameTextStyle.fontSize = 12 * fontSize
        },
        // 图表数据处理
        getChartdata (data) {
            if (!!data && data !== '{}') {
                let sellData = [];
                let buyData = [];
                JSON.parse(data).sell.map((el, ind) => {
                    if (el.quantity === 0 || el.quantity === null) {
                        return false;
                    } else {
                        sellData.push([el.quantity, el.price]);
                        this.polar.series[1].data = sellData;
                    }
                });
                JSON.parse(data).buy.map((el, ind) => {
                    if (el.quantity === 0 || el.quantity === null) {
                        return false;
                    } else {
                        buyData.push([el.quantity, el.price]);
                        this.polar.series[0].data = buyData;
                    }
                });
                console.log(this.polar.series[1].data);
                console.log(this.polar.series[0].data);
            }
        },
        // 验证码倒计时
        getCountDown () {
            if (this.CountDown > 0) {
                this.CountDown --;
                let getCountDown = this.getCountDown;
                setTimeout(function () {
                    getCountDown();
                }, 1000);
            } else {
                this.CountDown = 60;
                this.isGetCode = false;
            }
        },
        // 获取验证码
        getVerificationCode (phoneNum) {
            if (!this.isGetCode) {
                if (isPhone(phoneNum)) {
                    let params = {
                        user: {
                            mobile: phoneNum
                        }
                    };
                    apis.info.getVerificationCode(params).then((data) => {
                        if (data.success) {
                            this.isGetCode = true;
                            this.getCountDown();
                        }
                    });
                } else {
                    this.$vux.toast.show({
                        text: '请输入正确手机号',
                        type: 'text',
                        width: '2rem',
                        position: 'bottom'
                    });
                }
            }
        },
        // 提交手机号
        subPhone () {
            this.showBomb = false;
            let params = {
                user: {
                    mobile: this.phoneNum,
                    code: this.codeNum
                }
            };
            apis.info.submitCode(params).then((data) => {
                if (data.success) {
                    this.showBomb = false;
                }
            });
        }
    }
};
</script>
<style lang="less">
.clear {
    clear: both;
}
.releative{
    position: relative;
}
[v-cloak] {
    display: none;
}
.paddTop{
    padding-top: 16px;
}
.overflowH{
    overflow: hidden!important;
}
#infoDetailBox {
    height:100%;
    overflow: scroll;
    overflow-x: hidden;
    -webkit-text-size-adjust: none;
    -webkit-overflow-scrolling: touch;
    background:#F2F2F2;
    .mainMask{
        height:100px;
        width:100%;
        border-bottom:0.3rem solid #fff;
        background:url(../../assets/images/maskMain.png) repeat-x bottom;
        background-size:1px 1rem;
        position: fixed;
        bottom: 0;
        left: 0;
        text-align: center;
        span{
            font-size:12px;
            color:#EE5050;
            position: relative;
            top:38px;
            letter-spacing:0.15em;
        }
    }
    .VerificationCodeWrap{
        height:100%;
        width:100%;
        position: fixed;
        top:0;
        left:0;
        background:transparent;
        &:before{
            content:'';
            background:#000;
            opacity:0.4;
            height:100%;
            width:100%;
            display: block;
            position: absolute;
            top:0;
            left:0;
        }
        .VerificationClose{
            border:0;
            position: absolute;
            bottom:60px;                              
            left:170px;
            margin-left:-11.3px;
            background: transparent;
            img{
                height:22.6px;
                width:22.6px;
            }
        }
        .VerificationCodeContent{
            position: absolute;
            height:229px;
            width:287px;
            background: #FFFFFF;
            border: 1px solid #E2E2E2;
            border-radius: 8px;
            top:219px;
            left:45px;
            padding:34px 0 31px 28px;

            .getCode{
                display: inline-block;
                width:88px;
                height:36px;
                background: #EE5050;
                border-radius: 8px 8px 8px 8px;
                color:#fff;
                text-align: center;
                line-height: 36px;
                &.isGetCode{
                    background:#ddd;
                    color:#aaa;
                }
            }
            .subCode{
                background: #EE5050;
                border-radius: 8px;
                width:234px;
                height:39px;
                color:#fff;
                font-size:18px;
                border:0;
            }
            input{
                height:36px;
                border: 1px solid #CBCBCB;
                border-radius: 8px;
                font-size:14px;
                padding:8px 14px;
                margin-bottom:26px;
                &.phoneBox{
                    width: 230px;
                }
                &.codeBox{
                    width:139px;
                }
            }
        }
    }
    .headPortrait {
        border: 0.5px solid #E5E5E5;
    }
    img {
        max-width: 100%;

        border: 0;
        display: block;
        margin:0 auto;
    }
    .left {
        float: left;
        font-size: 10px;
    }
    .right {
        float: right;
        font-size: 10px;
    }
    .title {
        width: 100%;
        font-size: 24px;
        line-height:35px;
        padding: 14px 15px 5px;
        background:#fff;
    }
    .content {
        a {
            // display: block;
            color:#44b1ff;
            text-decoration: none;
            pointer-events: none;
        }
        .authorInfo {
            padding:0 15px;
            background:#fff;
            .copyright_logo {
                display: inline-block;
                width: 30px;
                height: 15px;
                line-height: 15px;
                border-radius: 2px;
                color: #bbb;
                border: 1px solid #b3b3b3;
                font-size: 10px;
                margin-right: 8px;
                text-align: center;
                vertical-align: middle;
            }
            .author_time {
                font-family: PingFangSC-Regular;
                letter-spacing: 0.35px;
                display: inline-block;
                font-size: 12px;
                color:#a1a1a1;
                // width: 60px;
                height: 17px;
                line-height: 17px;
                // margin-left: 8px;
                margin-right: 8px;
                vertical-align: middle;
            }
            .author_name {
                font-family: PingFangSC-Regular;
                letter-spacing: 0.35px;
                line-height: 17px;
                display: inline-block;
                color: #999;
                height: 17px;
                font-size: 12px;
                vertical-align: middle;
            }
            .infoType {
                display: inline-block;
                width: 45px;
                height: 19px;
                font-size: 12px;
                border: 1px solid #76c7ff;
                color: #6ec3ff;
                margin-left: 6px;
                margin-top: 2px;
                border-radius: 4px;
                text-align: center;
                line-height: 17px;
                vertical-align: middle;
            }
            .pdfLogo {
                display: block;
                margin-top: 9px;
                margin-left: 8px;
                pointer-events: initial;
                    img {
                        display: inline-block;
                        vertical-align: middle;
                        width: 16px;
                        height: 16px;
                    }
                    p {
                        display: inline-block;
                        font-size: 12px;
                        color: #4475C1;
                        vertical-align: middle;
                    }
                }
            .guideIntrduction {
                position: relative;
                margin-top: 28px;
                padding-bottom: 30px;
                font-size: 18px;
                color:#393939;
                line-height: 32.4px;
                .guideContent {
                    .guide_logo{
                        font-weight: bold
                    }
                }
            }
        }
        .chart-div{
            width: 100%;
            margin-top: 18px;
            font-size: 12px;
            padding:0 16px;
            background:#fff;
            .echarts {
                width: 100%;
                height: 300px;
            }
            // chart{
            //     width: 100%;
            //     padding-left: 20px
            // }

        }
        .table{
            margin-top: 18px;
            font-size: 12px;
            padding:0 16px;
            background:#fff;
            .trade-time{
                font-size: 8px;
                color: #5a5a5a;
                background: #f6f6f6;
                height: 20px;
                line-height: 20px;
                text-align: right;
                padding-right: 12px;

            }
            .info-table {
                margin-top: 12px;
                width: 100%;
                display: table;
                border-collapse: separate;
                border-spacing: 2px;
                border-color: grey;
                font-size: 10px;
                color: #1e1e1e;
                tr{
                    display: table-row;
                    border-color: inherit;
                    background: #f6f6f6;
                    th{
                    padding-top: 8px;   
                    padding-bottom: 8px;  
                    }
                    td{
                        padding-top: 8px;   
                        padding-bottom: 8px;
                        text-align: center
                    }
                    &:nth-of-type(2n){
                        background: #e6eaef;
                    }
                }
            }
         }
        .infoContent {
            // padding-left: 8px;
            font-size: 14px;
            color: #424242;
            // width: 360px;
            width: 100%;
            padding:0 15px;
            padding-top: 11px;
            box-sizing: border-box;
            background:#fff;
            // border-bottom: 1px solid #e8e8e8;
            .declare {
                display: block;
                color: #a1a1a1;
                font-size: 12px;
                margin-top:10px;
                padding-bottom:15px;
            }
            div {
                padding-bottom: 18px;
            }
            .infoContent-html {
                display: block;
                // width: 350px;
                font-size: 18px !important;
                color: #393939;
                line-height: 24px;
                letter-spacing: 1.3px;
                img {
                    width: 100% !important;
                    height: auto !important;
                    // max-width: 100% !important;
                    // min-height: 40px!important;
                    display: block !important;
                    margin: 8px auto !important;
                }
                p {
                    // line-height: normal !important;
                    line-height: 32.4px !important;
                    margin-bottom: 20px!important;
                    span {
                        font-size:0.17rem!important;
                    }
                }
                h3 {
                    font-size: 16px !important;
                    font-weight: bold;
                }
                a{
                    pointer-events: initial !important
                }
                
            }
            .isIosG {
                *{
                    font-size: 18px !important;
                }
            }
            .appreciate {
                font-size: 12px;
                color: #36ACFF;
                font-weight: normal;
                padding:0 7px;
                height:19px;
                line-height: 19px;
                text-align: center;
                border: 1px solid #36ACFF;
                border-radius: 2px;
                display: inline-block;
                margin-right: 10px;
                margin-top: 12px;
            }
        }
        .author_like {
            // width: 360px;
            width: 100%;
            // height: 240px;
            // padding-left: 8px;
            box-sizing: border-box;
            background:#fff;
            // border-bottom: 12px solid #efefef;
            .author_affiliation {
                // width: 360px;
                height: 63px;
                // border-bottom: 1px solid #f6f6f6;
                // border: 1px solid #eee;
                border-radius: 8px;
                position: relative;
                .headPortrait {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: inline-block;
                    // margin-top: 23px;
                    // margin-left: 10px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
                .author_detail {
                    display: inline-block;
                    margin-left: 14px;
                    height: 41px;
                    // width: 100px;
                    vertical-align: top;
                    margin-top: 15px;
                    position: relative;
                    div {
                        margin-top: 16px;
                        .author_detail_name {
                            float: left;
                            font-size: 14px;
                            color: #21A3ff;
                        }
                        .author_detail_type {
                            float: left;
                            width: 45px;
                            height: 19px;
                            border: 1px solid #76c7ff;
                            color: #76c7ff;
                            border-radius: 4px;
                            margin-left: 15px;
                            margin-right: 0;
                            font-size: 12px;
                            // position: absolute;
                            // top: 8px;
                            // right:0;
                            text-align: center;
                            line-height: 17px;
                            vertical-align: bottom;
                            // padding-bottom: 8px;
                        }
                        .author_detail_mark {
                            display: inline-block;
                            clear: both;
                            width: 16px;
                            height: 16px;
                            line-height: 16px;
                            vertical-align: middle;
                        }
                        .author_detail_identity {
                            display: inline-block;
                            clear: both;
                            font-size: 12px;
                            color: #939393;
                            margin-right: 8px;
                            vertical-align: bottom;
                        }
                    }
                }
                .attention {
                    position: absolute;
                    width: 62px;
                    height: 20px;
                    right: 30px;
                    top: 21px;
                    img {
                        width: 11px;
                        height: 11px;
                    }
                    span {
                        margin-left: 4px;
                        font-size: 13px;
                        color:#44b1ff;
                        float: right;
                    }
                }
            }
            .reward {
                padding-top: 20px;
                // width: 360px;
                div {
                    .giveLike {
                        float: left;
                        font-size: 15px;
                        color:#939393;
                        cursor: pointer;
                        margin-left: 12px;
                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                        img {
                            display: inline-block;
                            vertical-align: text-top;
                            width: 18px;
                            height: 18px;
                        }
                        span {
                            margin-left: 4px;
                            display: inline-block;
                            vertical-align: bottom;
                        }
                    }
                    .shareOrReport {
                        float: right;
                        p {
                            text-decoration: none;
                            font-size: 13px;
                            color: #44b1ff;
                            display: inline;
                            margin: 0 10px;
                            vertical-align: bottom;
                        }
                    }
                }
                .reward_add {
                    clear: both;
                    // height: 60px;
                    position: relative;
                    padding: 10px 0 0 0;
                    a {
                        pointer-events: initial;
                    }
                    img {
                        display: block;
                        margin: 0 auto;
                        width: 60px;
                        height: 60px;
                        margin-bottom: 25px;
                    }
                    span {
                        display: block;
                        margin: 0 auto;
                        padding:20px 0;
                        color: #383838;
                        font-size: 14px;
                        text-align: center;
                    }
                    i {
                        font-style: initial;
                        position: absolute;
                        font-size: 12px;
                        top: 50px;
                        // left: 177px;
                        left: 50%;
                        color: #fff;
                    }
                    .reward_list {
                        width: 73%;
                        margin: 0 auto;
                        padding-bottom: 35px;
                        text-align: center;
                        li {
                            display: inline-block;
                            margin-right: 12px;
                            img{
                                height: 30px;
                                width: 30px;
                                border-radius: 50%;
                            }
                        }
                    }
                }
                .reward_me {
                    display:flex;
                    font-family: PingFangSC-Regular;
                    font-size: 10px;color: #A1A1A1;
                    letter-spacing: 0.29px;
                    clear: both;
                    // height: 60px;
                    position: relative;
                    padding: 4px 40px 0 40px;
                    a {
                        pointer-events: initial;
                    }
                    img {
                        display: block;
                        margin: 0 auto;
                        width: 33px;
                        height: 33px;
                    }
                    span {
                        display: block;
                        margin: 10px auto;
                        color: #383838;
                        font-size: 14px;
                        text-align: center;
                    }
                    i {
                        font-style: initial;
                        position: absolute;
                        font-size: 12px;
                        top: 50px;
                        // left: 177px;
                        left: 50%;
                        color: #fff;
                    }
                    .reward_list {
                        width: 73%;
                        margin: 0 auto;
                        margin-bottom: 35px;
                        text-align: center;
                        li {
                            display: inline-block;
                            margin-right: 12px;
                            img{
                                height: 30px;
                                width: 30px;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
        .infoRecommendation {
            // padding-bottom: 30px;
            margin-top:8px;  
            .recommedationTitle{
                padding:0 16px;
                .inline{
                    border-bottom: 1px solid #ccc;
                    position: relative;
                    height:40px;
                    margin-bottom:15px;
                }
                .relativeRecommendation {
                    color: #393939;
                    font-size: 16px;
                    text-align:center;
                    margin-top: 16px;
                    display: inline-block;
                    width:100px;
                    position: absolute;
                    margin:0 auto;
                    background:#fff;
                    top:30px;
                    left:50%;
                    margin-left:-50px;
                }
                .moreRecommendation {
                    color: #44b1ff;
                    font-size: 13px;
                    float: right;
                    margin-right: 8px;
                    margin-top: 18px;
                }
            }
            .recommendationContent {
                clear: both;
                padding:0 15px;
                text-align: left;
                background:#fff;
                ul {
                    padding-bottom:10px;
                    li {
                        position: relative;
                        padding: 11px 0 15px 0;
                        border-bottom: 1px solid #f3f3f3;
                        clear: both;
                        height: auto;
                        overflow-x:hidden;
                        clear: both;
                        .santu{
                            clear: both;
                            width:100%;
                            margin-top:14px;
                            img{
                                float: left;
                                margin-left:4.5px;
                            }
                            img:nth-child(1) {
                                margin-left: 0;
                            }
                        }
                        .oneJpgLeft{
                            height:74px;
                            width:auto;
                        }
                        .recommendationTitle {
                            width: 100%;
                            display: inline-block;
                            font-size: 16px;
                            color: #393939;
                             line-height: 24px;
                        }
                        .recommendationTitle1 {
                            display: inline-block;
                            vertical-align: top;
                            font-size: 17px;
                            color: #393939;
                            width: 220px;
                            margin-left: 0;
                        }
                        .subscript {
                            width: 100%;
                            color: #939393;
                            font-size: 12px;
                            height: 17px;
                        }
                        .subscript1 {
                            position: absolute;
                            bottom:0;
                        }
                        .subscript2 {
                            margin-top:15px;
                        }
                        img {
                            display: inline-block;
                            width: 112px;
                            height: 74px;
                            vertical-align: top;
                            float: right;
                        }
                    }
                }
            }
        }
    }
}
.infoRecommendation {
    position: relative;
    top: 28%;
    clear: both;
    .recommedationTitle{
        background:#fff;
        padding-top:13px!important;
        padding-bottom:10px!important;
        border-bottom:1px solid #F6F6F6;
        span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        .colorMark {
        display: inline-block;
        width: 5px;
        height: 14px;
        background-color: #EE5050;
        border-radius:2px;
        margin-right: 10px;
        float:left;
        position: relative;
        top:3.5px;
        }
        .modelName{
        font-size: 14px;
        display: inline-block;
        float:left;
        color: #555;
        }
    }        
        .inline{
            border-bottom: 1px solid #ccc;
            position: relative;
            height:40px;
            margin-bottom:15px;
        }
        .relativeRecommendation {
            color: #ccc;
            font-size: 13px;
            text-align:center;
            margin-top: 16px;
            display: inline-block;
            width:100px;
            position: absolute;
            margin:0 auto;
            background:#fff;
            top:30px;
            left:50%;
            margin-left:-50px;
        }
        .moreRecommendation {
            color: #44b1ff;
            font-size: 13px;
            float: right;
            margin-right: 8px;
            margin-top: 18px;
        }
    }
}
#infoDetailBox {
    .content {
        .author_like {
            .iosStyleBorder {
                border:0;
                height: 50px;
            }
        }
    }
} 
</style>
