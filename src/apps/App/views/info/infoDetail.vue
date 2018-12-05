<template>
    <div class="wrapper" v-cloak id="infoDetailBox">
        <div class='title'>{{infoDetail.title}}</div>
        <div class="content">
            <div class="authorInfo">
                <!-- 有头像 -->
                <div class='author_like' v-if="(infoDetail.roleCode === 'R10' || infoDetail.roleCode === 'R21')"  >
                    <div class="paddTop" :class='{"author_affiliation iosStyleBorder": isIos, "author_affiliation": !isIos}' >
                        <div>
                            <img v-if='infoDetail.authorImageUrl !== null' :src="infoDetail.authorImageUrl|imgSrc" :onerror="errorImg" class='headPortrait'  alt="" />
                            <img v-if='infoDetail.authorImageUrl === null && infoDetail.roleCode === "R10"' src="../../assets/images/author-default.png" class='headPortrait'  alt="" />
                            <img v-if='infoDetail.authorImageUrl === null && infoDetail.roleCode === "R21"' src="../../assets/images/company-icon.png" class='headPortrait' alt="" />
                            <span  class='author_name' >{{infoDetail.authorName|strLimit(6)}}</span>
                            <!-- <span v-if="infoDetail.topLevel !== null" class='author_name' ><span>{{(infoAttention.openEmployee.nickName || infoAttention.openEmployee.empName || infoAttention.openEmployee.empCode)|strLimit(6)}}</span></span> -->
                            <span class='author_time'>{{infoDetail.releaseDate|translateDate}}</span>
                            <span v-if="infoDetail.isShowOrigin === '0'" class='copyright_logo'>原创</span>
                        </div>
                    </div>
                </div>
                <!-- 没有头像 -->
                <div v-if="infoDetail.roleCode !== 'R10' && infoDetail.roleCode !== 'R21'">
                    <!-- <span v-if="infoDetail.topLevel !== null" class='author_name' ><span>{{(infoAttention.openEmployee.nickName || infoAttention.openEmployee.empName || infoAttention.openEmployee.empCode)|strLimit(6)}}</span></span> -->
                    <span  class='author_name' >{{infoDetail.authorName|strLimit(6)}}</span>&nbsp;
                    <span class='author_time'>{{infoDetail.releaseDate|translateDate}}</span>
                    <span v-if="infoDetail.isShowOrigin === '0'" class='copyright_logo'>原创</span>
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
                <!-- <chart id="canvas" :options="polar"></chart> -->
            </div>
            <div class="infoContent">
                <span class='infoContent-html' :class="{'isIosG':isIos}" v-html="delBrInData(infoDetail.texHtml)"></span>
                <div>
                    <span v-for='(item, index) in infoDetail.tagList' :key='index' class='appreciate'>{{item.tagName}}</span>
                </div>                    
                <span class='declare' v-if="infoDetail.isShowOrigin === '1'">来源：{{infoDetail.ext2}}</span>
                <span class='declare' v-if="infoDetail.isShowDisclaimer === '1'">免责声明：本文非百联大宗原创，以上仅代表作者个人观点</span>
                <span class='declare' v-if="infoDetail.isShowCopyright === '1'">版权声明：如需转载，请注明来自“百联大宗”</span>
            </div>
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
                                <p class='recommendationTitle' :class="[{'recommendationTitle': item.cmsInfoAttList !== null && item.cmsInfoAttList.length >=3},{'recommendationTitle1': item.cmsInfoAttList !== null &&item.cmsInfoAttList.length <3}]">{{item.title|strLimit(30)}}</p>
                                <img class='dantu' v-if='item.cmsInfoAttList && item.cmsInfoAttList.length !==0 && item.cmsInfoAttList.length <3 && !item.cmsInfoAttList[0].includes(".pdf")' :src='item.cmsInfoAttList[0]'/>
                                <div class="santu" v-if='item.cmsInfoAttList && item.cmsInfoAttList.length >=3'>
                                    <img v-if='!item.cmsInfoAttList[0].includes(".pdf")' :src="item.cmsInfoAttList[0]" alt="">
                                    <img v-if='!item.cmsInfoAttList[1].includes(".pdf")' :src="item.cmsInfoAttList[1]" alt="">
                                    <img v-if='!item.cmsInfoAttList[2].includes(".pdf")' :src="item.cmsInfoAttList[2]" alt="">
                                </div>
                                <div class='subscript'>
                                    <span class='left' style='margin-right:0.12rem;'>{{item.author|strLimit(6)}}</span>
                                    <span class='left'>{{item.releaseDate|translateDate}}</span>
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
import {getTime} from 'UTILS/utils';
export default {
    name: 'infodetail',
    data () {
        return {
            infoDetail: {}, // 详情数据
            infoRecommendation: {}, // 相关推荐数据
            isIos: false, // 是否是ios
            errorImg: import('../../assets/images/user-default-blue.png')
        };
    },
    created () {
        // 资讯详情数据拿取
        let params = {
            informationId: this.$route.params.informationId || '',
            cacheId: this.$route.params.informationId || ''};
        apis.info.getInfoDetailData(params).then((data) => {
            data = data.body;
            if (data.success) {
                this.infoDetail = data.data;
                // 相关推荐数据拿取
                let paramsRecommend = {
                    categoryLevel1Id: this.infoDetail.categoryLevel1Id,
                    categoryLevel2Id: this.infoDetail.categoryLevel2Id,
                    categoryLevel3Id: this.infoDetail.categoryLevel3Id,
                    channelCode: this.infoDetail.channelCode,
                    infoId: this.infoDetail.infoId,
                    cacheId: this.infoDetail.infoId
                };
                apis.info.getInfoDetailRecommendData(paramsRecommend).then((data) => {
                    data = data.body;
                    if (data.success) {
                        this.infoRecommendation = data.data;
                    }
                });
            }
        });
        // 判断ios，android
        this.getMobilesType();
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
        }
    }
};
</script>
<style lang="less">
.clear {
    clear: both;
}
[v-cloak] {
    display: none;
}
.paddTop{
    padding-top: 16px;
}
#infoDetailBox {
    height:100%;
    overflow: scroll;
    overflow-x: hidden;
    // margin-top: 51px;
    -webkit-text-size-adjust: none;
    -webkit-overflow-scrolling: touch;
    background:#F2F2F2;
    // padding: 0 16px;
    .headPortrait {
        border: 0.5px solid #E5E5E5;
    }
    img {
        max-width: 100%;
        // height: auto;
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
        padding: 20px 16px 12px;
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
            padding:0 16px;
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
                color: #45b2ff;
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
                font-size: 14px;
                color:#393939;
                line-height: 24px;
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
            padding:0 16px;
            padding-top: 6px;
            box-sizing: border-box;
            background:#fff;
            // border-bottom: 1px solid #e8e8e8;
            .declare {
                display: block;
                color: #a1a1a1;
                font-size: 12px;
            }
            div {
                padding-bottom: 18px;
            }
            .infoContent-html {
                display: block;
                // width: 350px;
                font-size: 14px !important;
                color: #393939;
                margin-top: 14px;
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
                    line-height: 26px !important;
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
                    font-size: 16px !important;
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
                padding:0 16px;
                background:#fff;
                ul {
                    li {
                        position: relative;
                        padding: 16px 0 13px 0;
                        border-bottom: 1px solid #f3f3f3;
                        clear: both;
                        height: 90px;
                        overflow-x:hidden;
                        .santu{
                            clear: both;
                            width:4rem;
                            img{
                                float: left;
                            }
                            img:nth-child(1) {
                                margin-left: 0;
                            }
                        }
                        .recommendationTitle {
                            width: 100%;
                            display: inline-block;
                            font-size: 14px;
                            color: #393939;
                            // width: 349px;
                            // height: 44px;
                            // margin-left: 10px;
                             margin-bottom: 15px;
                             line-height: 24px;
                        }
                        .recommendationTitle1 {
                            display: inline-block;
                            vertical-align: top;
                            font-size: 14px;
                            color: #393939;
                            width: 200px;
                            margin-left: 0;
                        }
                        .subscript {
                            // margin-top: 10px;
                            position: relative;
                            margin-top: 30px;
                            // margin-left: 10px;
                            // width: 355px;
                            color: #939393;
                            font-size: 12px;
                            height: 17px;
                        }
                        .subscript1 {
                            display: inline-block;
                            position: absolute;
                            top: 68px;
                            // left: 10px;
                            left: 0;
                            width: 235px;
                            color: #939393;
                            font-size: 12px;
                            height: 17px;
                        }
                        .dantu{
                            margin-top:10px;
                        }
                        img {
                            display: inline-block;
                            margin-top:10px;
                            width: 110px;
                            height: 69px;
                            vertical-align: top;
                            margin-right: 10px;
                            border-radius: 8px;
                        }
                    }
                }
            }
            .comment_area {
                padding:0 16px;
                background:#fff;
                margin-top: 8px;
                padding-top:10px;
                padding-bottom:60px;
                .toComment{
                    margin-top:20px; 
                    font-size: 14px;
                }
                .noComment {
                    // height: 111px;
                    // border-bottom: 1px solid #DBDBDB;
                    width: 100%;
                    position: relative;
                    div {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        img {
                            width: 110px;
                            height: 102.3px;
                            display: block;
                            margin: 0 auto;
                        }
                        span {
                            font-size: 14px;
                            color: #BBB;
                            display: block;
                            margin-top: 24.7px;
                            width: 240px;
                        }
                        a {
                            display: block;
                            margin: 0 auto;
                            margin-top: 24px;
                            font-size: 12px;
                            color: #21a3ff;
                            width: 83px;
                            height: 30px;
                            border: 1px solid #21A3FF;
                            border-radius: 8px;
                            line-height: 30px;
                            text-align: center;

                        }
                    }
                }
                p {
                    display: inline-block;
                    float: right;
                    margin-right: 17px;
                    img {
                        display: inline-block;
                        vertical-align: middle;
                        margin-left: 9px;
                    }
                    .writeComment {
                        width: 15px;
                        height: 15px;
                    }
                    .viewComment {
                        width: 20px;
                        height: 20px;
                    }
                    p {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 14px;
                        margin-left: 8px;
                        font-size: 14px;
                    }
                }
                div {
                    // padding: 0 0 0 10px;
                    font-size: 17px;
                    color: #393939;
                    // line-height: 50%;
                    span {
                        display: inline-block;
                        height: 20px;
                        line-height: 20px;
                        .colorMark {
                            display: inline-block;
                            width: 5px;
                            height: 14px;
                            background-color: #21a3ff;
                            margin-right: 10px;
                        }
                        .modelName{
                            font-size: 16px;
                        }
                    }
                    .moreComment {
                        font-size: 12px;
                        color: #939393;
                        margin-top: 5px;
                        margin-right: 14px;
                        cursor: pointer;
                        -webkit-tap-highlight-color: rgba(0,0,0,0);
                    }
                    ul{
                        li{
                            .critic {
                                margin-top: 17px;
                                .headPortrait {
                                    border-radius: 50%;
                                }
                                img {
                                    width: 30px;
                                    height: 30px;
                                    display: inline;
                                    vertical-align: middle;
                                }
                                span {
                                    img {
                                        width: 30px;
                                        height: 30px;
                                        border-radius: initial;
                                        display: inline;
                                        vertical-align: middle;
                                    }
                                }
                                .delete-comment {
                                    margin-left: 8px;
                                    img{
                                        width: 14px;
                                        height: 14px;
                                    }
                                }
                                .replyListShow{
                                    font-size: 12px;
                                    float: right;
                                    padding: 0 15px 0 5px;
                                    cursor: pointer;
                                    -webkit-tap-highlight-color: rgba(0,0,0,0);
                                    img{
                                        width: 13px;
                                        height: 7px;
                                        vertical-align: middle;
                                        display: inline-block;
                                    }
                                    i{
                                        display: inline-block;
                                        min-width: 20px;
                                        text-align: center;
                                    }
                                }
                                .like-comment {
                                    font-size: 12px;
                                    float: right;
                                    padding: 0 15px 0 5px;
                                    cursor: pointer;
                                    -webkit-tap-highlight-color: rgba(0,0,0,0);
                                    img{
                                        width: 12px;
                                        height: 12px;
                                        vertical-align: baseline;
                                    }
                                    i{
                                        display: inline-block;
                                        min-width: 20px;
                                        text-align: center;
                                    }
                                }
                                span {
                                    display: inline-block;
                                    vertical-align: middle;
                                    margin-left: 8px;
                                    font-size: 14px;
                                    color: #939393;
                                }
                                .criticName{
                                    font-size: 14px;
                                }
                                .criticDate{
                                    font-size: 12px;
                                }
                            }
                            .commentContent {
                                margin-left: 38px;  
                                margin-top: 4px; 
                                font-size: 14px;
                                color: #383838;
                            }
                            .replyListLi{
                                display: flex;
                            }
                            .replyContent{
                                margin-right: 0px;
                                font-size: 14px;
                                color: #383838;
                                word-break: break-all;
                                // display: inline-block;
                                padding: 3px 10px 10px;
                                flex: 1;
                            }
                            .replyList{
                                background-color: #e7e7e7;
                                margin-right: 0px;
                            }
                            .relpyListDelet{
                                margin-top: 2px;
                                font-size: 14px;
                                padding: 3px 10px 10px;
                                // float: right;
                                cursor: pointer;
                                -webkit-tap-highlight-color: rgba(0,0,0,0);
                                .replyListImg{
                                    width: 12px;
                                    height: 12px;
                                }
                            }
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
        padding-top:15px!important;
        span {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        .colorMark {
        display: inline-block;
        width: 5px;
        height: 14px;
        background-color: #21a3ff;
        margin-right: 10px;
        float:left;
        position: relative;
        top:3.5px;
        }
        .modelName{
        font-size: 16px;
        display: inline-block;
        float:left;
        color: #393939;
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
    .recommendationContent {
        clear: both;
        text-align: left;
        ul {
            li {
                position: relative;
                // height: 70px;
                height: auto !important;
                padding: 16px 0 5px 0 !important;
                border-bottom: 1px solid #ccc;
                clear: both;
                .santu{
                    clear: both;
                    // position: absolute;
                    // top: 0px;
                    // right: 10px;
                    img:nth-child(1) {
                        margin-left: 0;
                    }
                }
                .recommendationTitle {
                    position: relative;
                    display: inline-block;
                    font-size: 16px;
                    color: #393939;
                    // width: 349px;
                    left: 10px;
                    // margin-bottom: 10px;
                }
                .recommendationTitle1 {
                    display: inline-block;
                    vertical-align: top;
                    font-size: 16px;
                    color: #393939;
                    // width: 239px;
                    width: 204px;
                    // margin-left: 10px;
                    margin-left: 0;
                }
                .subscript {
                    clear: both;
                    line-height: 0.05rem;
                    margin-top: 10px;
                    margin-bottom: 0px;
                    margin-left: 10px;
                    // width: 355px;
                    color: #939393;
                    font-size: 12px;
                    height: 17px;
                }
                .subscript1 {
                    display: inline-block;
                    position: absolute;
                    top: 68px;
                    // left: 10px;
                    left: 0;
                    width: 235px;
                    color: #939393;
                    font-size: 12px;
                    height: 17px;
                }
                img {
                    position: relative;
                    // display: inline-block;
                    width: 110px;
                    height: 69px;
                    vertical-align: top;
                    margin-left: 5px;
                    border-radius: 8px;
                    float: right;
                    bottom: 10px;
                }
            }
        }
    }
    .comment_area {
        margin-top: 33px;
        // padding-bottom:30px;
        .toComment{
            margin-top:20px; 
            font-size: 14px;
        }
        .noComment {
            height: 111px;
            // border-bottom: 1px solid #DBDBDB;
            width: 100%;
            position: relative;
            div {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                img {
                    width: 110px;
                    height: 102.3px;
                    display: block;
                    margin: 0 auto;
                }
                span {
                    font-size: 14px;
                    color: #383838;
                    display: block;
                    margin-top: 24.7px;
                    width: 240px;
                }
                a {
                    display: block;
                    margin: 0 auto;
                    margin-top: 24px;
                    font-size: 12px;
                    color: #21a3ff;
                    width: 83px;
                    height: 30px;
                    border: 1px solid #21A3FF;
                    border-radius: 8px;
                    line-height: 30px;
                    text-align: center;

                }
            }
        }
        p {
            display: inline-block;
            float: right;
            margin-right: 17px;
            img {
                display: inline-block;
                vertical-align: middle;
                margin-left: 9px;
            }
            .writeComment {
                width: 15px;
                height: 15px;
            }
            .viewComment {
                width: 20px;
                height: 20px;
            }
            p {
                display: inline-block;
                vertical-align: middle;
                margin-right: 14px;
                margin-left: 8px;
                font-size: 14px;
            }
        }
        div {
            // padding: 0 0 0 10px;
            font-size: 17px;
            color: #393939;
            // line-height: 50%;
            span {
                display: inline-block;
                height: 20px;
                line-height: 20px;
                .colorMark {
                    display: inline-block;
                    width: 5px;
                    height: 20px;
                    background-color: #21a3ff;
                    margin-right: 8px;
                    top:3.5px;
                }
            }
            .moreComment {
                font-size: 13px;
                color: #44b1ff;
                margin-top: 5px;
                margin-right: 14px;
                cursor: pointer;
                -webkit-tap-highlight-color: rgba(0,0,0,0);
            }
            ul{
                li{
                    .critic {
                        margin-top: 17px;
                        .headPortrait {
                            border-radius: 50%;
                        }
                        img {
                            width: 30px;
                            height: 30px;
                            display: inline;
                            vertical-align: middle;
                        }
                        span {
                            img {
                                width: 30px;
                                height: 30px;
                                border-radius: initial;
                                display: inline;
                                vertical-align: middle;
                            }
                        }
                        .delete-comment {
                            margin-left: 8px;
                            img{
                                width: 14px;
                                height: 14px;
                            }
                        }
                        .like-comment {
                            font-size: 12px;
                            float: right;
                            padding: 0 15px 0 5px;
                            cursor: pointer;
                            -webkit-tap-highlight-color: rgba(0,0,0,0);
                            img{
                                width: 12px;
                                height: 12px;
                                vertical-align: baseline;
                            }
                            i{
                                display: inline-block;
                                min-width: 20px;
                                text-align: center;
                            }
                        }
                        span {
                            display: inline-block;
                            vertical-align: middle;
                            margin-left: 8px;
                            font-size: 14px;
                            color: #A3A3A3;
                        }
                    }
                    .commentContent {
                        margin: 4px 10px 0 38px;
                        font-size: 14px;
                        color: #383838;
                    }
                }
            }
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
