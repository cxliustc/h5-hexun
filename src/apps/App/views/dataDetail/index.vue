<template>
    <div class="dataDetail">
        <scroll
        :data="datas"
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
                                <p class='first red'>7800</p>
                                <p class='second'>+2.1%</p>
                            </div>
                            <div class='child'>
                                <p class='first red'>610.00</p>
                                <p class='second'>+3.10%</p>
                            </div>
                            <div class='child'>
                                <p class='first'>细分化工</p>
                                <p class='second'>21112.00</p>
                            </div>
                        </div>
                    </div>
                    <div class="chart">

                    </div>
                    <div class="chartDesc clearfix">
                        <i class='blue'></i>
                        <span class='word'>现货</span>
                        <i class='red'></i>
                        <span class='word'>期货</span>
                        <i class='yellow'></i>
                        <span class='word'>股指</span>
                        <span class="time">更新时间：2018/12/09</span>
                    </div>
                    <div class="line"></div>
                    <!-- <chart id="canvas" :options="polar"></chart> -->
                    <div class="recommend">
                        <div class="title">
                            <i></i>
                            <span>相关推荐</span>
                        </div>
                    </div>
                </li>
                <li v-for="(item, index) in datas" :key="index" >
                    <!-- 1张图 -->
                    <div class='clearfix detail' v-if="item.cmsInfoAttList && item.cmsInfoAttList.length === 1">
                        <div class="left">
                            <p class="title">
                                {{item.title}}
                            </p>
                            <p class="timeAndSource clearfix">
                                <span class="source">{{item.author}}</span>
                                <span class="time">{{item.releaseDate | daysBefore}}</span>
                            </p>
                        </div>
                        <div class="right">
                            <img :src="item.cmsInfoAttList[0]" alt="">
                        </div>
                    </div>
                    <!-- 无图或者大于1张图 -->
                    <div class='clearfix detail' v-if="!item.cmsInfoAttList || item.cmsInfoAttList.length > 1">
                        <p class="title">
                            {{item.title}}
                        </p>
                        <div class="images">
                            <img v-for='(el, ind) in item.cmsInfoAttList' :key='ind' :src="el" alt="">
                        </div>
                        <p class="timeAndSource clearfix">
                            <span class="source">{{item.author}}</span>
                            <span class="time">{{item.releaseDate | daysBefore}}</span>
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
// import * as filters from '../../../../utils/filters';
export default {
    mixins: [mixin],
    components: {
        chart, Scroll
    },
    name: 'dataDetail',
    data () {
        return {
            datas: []
        };
    },
    created () {
        this.onPullingDown();
    },
    methods: {
        // daysBefore: filters.daysBefore,
        // 下拉刷新
        onPullingDown () {
            console.log('下拉');
            apis.data.getList({
                pageNum: 1,
                pageSize: 10,
                queryType: '1'
            }).then(({data, pageCount}) => {
                let cmsAppHomePageResList = data.data;
                if (!cmsAppHomePageResList || cmsAppHomePageResList.length === 0) {
                    this.noResultShow = true;
                    data = [];
                } else {
                }
                if (this.setData) this.setData(cmsAppHomePageResList);
                this.count = 2;
                this.datas = cmsAppHomePageResList;
            }).catch(() => {
                this.$refs.scroll.forceUpdate();
            });
        },
        // 上拉加载
        onPullingUp () {
            console.log('上拉');
            apis.data.getList({
                pageNum: this.count,
                pageSize: 10,
                queryType: '1'
            }).then(({data, pageCount}) => {
                let cmsAppHomePageResList = data.data;
                if (this.count > pageCount) {
                    this.$refs.scroll.forceUpdate(false);
                } else {
                    this.datas = this.datas.concat(cmsAppHomePageResList);
                    this.count++;
                }
            }).catch(() => {
                this.$refs.scroll.forceUpdate();
            });
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
                    color: #EE5050;
                    letter-spacing: -0.13px;
                    height:17px;
                    line-height: 17px;
                }
                .red{
                    color: #EE5050;
                }
            }
            .child:last-child{
                width:75px;
            }
        }
        
    }
    .chart{
        height:210px;
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
                    width:110px;
                    margin-right: 7.5px;
                    height:72px;
                }
                img:last-child{
                    margin-right: 0;
                }
            }
        }
    }
    
}
</style>