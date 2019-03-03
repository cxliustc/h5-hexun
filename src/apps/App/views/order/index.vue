<template>
<div ref="slideContainer" class="slide-container">
    <div class="order-view">
        <div class="title-header">
            <div class="left-image">
                <img src="" alt="">
            </div>
            <div class="right-content">
                <div class="title">
                    暴击年末脏衣服我承包-3折仅49元抢UCC国际衣套餐-义务专车接送包宝宝啊喝点酒卡的进口量
                </div>
                <div class="date">
                    有效期至：2019-06-05
                </div>
            </div>
        </div>
        <div class="gap"></div>
        <div class="order-number-container">
            <div class="order-number">
                <div class="title">
                    预约数量
                </div>
                <div class="options">
                    <div @click="change(-1)">-</div>
                    <div>{{number}}</div>
                    <div @click="change(1)">+</div>
                </div>
            </div>
        </div>
        
        <div class="order-store">
            <div class="title">
                预约门店
            </div>
            <div class="address">
                <div class="show-address">金沙店&nbsp&gt</div>
                <div class="address-content">陕西省西安市碑林区含光北路</div>
            </div>
        </div>
        <div class="gap"></div>
        <div class="order-date">
            <div class="up-title">
                <div class="title">预约日期</div>
                <div class="choose-button">请选择你要预约的时间</div>
            </div>
            <div class="date">
                <date />
            </div>
        </div>
        <div class="begin-time-container">
            <div class="begin-time">
                <div class="title">
                    开始时间
                </div>
                <div class="time">
                    12:00&nbsp&gt
                </div>
            </div>
        </div>
        <div class="over-time">
            <div class="title">
                结束时间
            </div>
            <div class="time">
                15:00&nbsp&gt
            </div>
        </div>
        <div class="gap"></div>
        <div class="name-container">
            <div class="name">
                <div class="title">姓名</div>
                <div class="person">东东&nbsp&gt</div>
            </div>
        </div>
        <div class="phone-container">
            <div class="phone">
                <div class="title">电话</div>
                <div class="phone-number">17868885336&nbsp&gt</div>
            </div>
        </div>
        <div class="address">
            <div class="title">地址</div>
            <div class="person-address">
                <div class="district">陕西省西安市碑林区&nbsp&gt</div>
                <div class="address-content">西安创新设计中心306</div>
            </div>
        </div>
        <div class="note"></div>
        <div class="submit-container">
            <div class="submit">
                提交预约
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Date from './date'
// import BScroll from 'better-scroll' 
export default {
    components: {
        date: Date
    },
    data () {
        return {
            number: 0
        }
    },
    methods: {
        change (number) {
            if (this.number === 0 && number === -1) {
                return
            }
            this.number = this.number + number
        }
    }
}
</script>
<style lang="less">
@padding-top-bottom: 18px;
.list-common-style () {
    padding: 0 30px;
    color: #373737;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.slide-container {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
}
.order-view {
    .title-header {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 20px 30px;
        height: 213px;
        background-color: #fff;
        .left-image {
            // flex: 1;
            height: 172px;
            width: 172px;
            background-color: red;
        }
        .right-content {
            flex: 2;
            // background-color: blue;
            height: 100%;
            padding-left: 20px;
            .title {
                font-size: 28px;
                color: #373737;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                font-weight: bold;
            }
            .date {
                font-size: 26px;
                color: #9c9c9c;
                margin-top: 10px;
            }
        }
    }
    .order-number-container {
        padding: 0 30px;
        padding-top: @padding-top-bottom;
        .order-number {
            .list-common-style;
            padding: 0;
            padding-bottom: @padding-top-bottom;
            .title {
                font-size: 28px;
            }
            .options {
                div {
                    display: inline-block;
                }
            }
            border-bottom: 1px solid #e4e4e4;
        }
    }
    
    .order-store {
        .list-common-style;
        .title {
            font-size: 28px;
        }
        padding-top: @padding-top-bottom;
        padding-bottom: @padding-top-bottom;
        > .address {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 26px;
            .show-address {
                color: #373737;
            }
            .address-content {
                color: #9e9e9e;
            }
        }
    }
    .order-date {
        padding-top: @padding-top-bottom;
        .up-title {
            .list-common-style;
            .title {
                font-size: 28px;
                padding-bottom: 12px; 
            }
            .choose-button {
                font-size: 26px;
                color: #9c9c9c;
            }
        }
        padding-bottom: 21px;
    }
    .begin-time-container {
        padding: 0 30px;
        .begin-time {
            .list-common-style;
            color: #373737;
            padding: 0;
            .title {
                font-size: 28px;
                padding-bottom: @padding-top-bottom;
            }
            .time {
                font-size: 26px;
            }
            border-bottom: 1px solid #e4e4e4;
        }
    }
    .over-time {
        .list-common-style;
        padding-top: @padding-top-bottom;
        padding-bottom: @padding-top-bottom;
        color: #373737;
        .title {
            font-size: 28px;
        }
        .time {
            font-size: 26px;
        }
        margin-bottom: 16px;
        // background-color: #e4e4e4;
    }
    .gap {
        width: 100%;
        height: 13px;
        background-color: #e4e4e4;
    }
    .name-container {
        padding: 0 30px;
        padding-top: @padding-top-bottom;
        .name {
            .list-common-style;
            color: #373737;
            padding: 0;
            padding-bottom: @padding-top-bottom;
            .title {
                font-size: 28px;
            }
            .person {
                font-size: 26px;
            }
            border-bottom: 1px solid #e4e4e4;
        }
    }
    .phone-container {
        padding: 0 30px;
        padding-top: @padding-top-bottom;
        .phone {
            .list-common-style;
            padding: 0;
            color: #373737;
            .title {
                font-size: 28px;
                padding-bottom: @padding-top-bottom;
            }
            .phone-number {
                font-size: 26px;
            }
            border-bottom: 1px solid #e4e4e4;
        }
    }
    > .address {
        .list-common-style;
        color: #373737;
        padding-bottom: @padding-top-bottom;
        padding-top: @padding-top-bottom;
        .title {
            font-size: 28px;
        }
        .person-address {
            display: flex;
            font-size: 26px;
            flex-direction: column;
            align-items: flex-end;
            .address-content {
                color: #9e9e9e;
            }
        }
    }
    .submit-container {
        padding: 0 30px;
        padding-bottom: 30px;
        .submit {
            color: #fff;
            width: 100%;
            height: 85px;
            margin: 0 auto;
            opacity: 0.77;
            background-image: linear-gradient(-50deg, #FF8100 0%, #FF5000 100%);
            border-radius: 8px;
            line-height: 85px;
            text-align: center;
            font-size: 28px;
        }
    }
}
</style>