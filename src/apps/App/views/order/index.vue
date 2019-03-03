<template>
<div ref="slideContainer" class="slide-container">
    <div class="order-view">
        <div class="title-header">
            <div class="left-image">
                <img :src="getIn(['faceUrl'], productInfo) || '/static/images/logo.jpg'" alt="">
            </div>
            <div class="right-content">
                <div class="title">
                    {{getIn(['goodsName'], productInfo)}}
                </div>
                <div class="date">
                    可使用日期：2019.03.15 - 2019.09.19
                </div>
                <div class="date">
                    预约日期：2019.03.03 - 2019.03.15
                </div>
            </div>
        </div>
        <div class="name-container">
            <div class="name">
                <div class="title">姓名：</div>
                <div class="person">
                    <input type="text" placeholder="请输入姓名" v-model="name">
                </div>
            </div>
        </div>
        <div class="phone-container">
            <div class="phone">
                <div class="title">电话：</div>
                <div class="phone-number">
                    <input type="phone" placeholder="请输入手机号" v-model="phoneNumber">
                </div>
            </div>
        </div>
        <div class="gap"></div>
        <div class="address">
            <div class="title">地址：</div>
            <div class="person-address">
                <div class="district" id="chose">省/市/区</div>
            </div>
        </div>
        <div class="address-content">
            <div class="address-content-info">
                <div class="title">详细地址：</div>
                <div class="input-address">
                    <textarea 
                        name="" 
                        id="" 
                        cols="30" 
                        rows="4"
                        placeholder="请输入街道门牌、楼层房间号等信息"
                        v-model="address"
                    >
                    </textarea>
                </div>
            </div>
        </div>
        <div class="note"></div>
        <div class="submit-container">
            <div class="submit" @click="submit">
                提交预约
            </div>
        </div>
    </div>
</div>
</template>
<script>
import Date from './date'
import {getIn} from 'UTILS/utils.js'
import initCitySelect from '../../libs/city.js'
import axios from 'axios'
import {Toast, MessageBox} from 'mint-ui'
// import BScroll from 'better-scroll' 
export default {
    components: {
        date: Date
    },
    data () {
        return {
            productInfo: {},
            name: '',
            phoneNumber: '',
            area: '',
            address: ''
        }
    },
    mounted () {
        this.productInfo = JSON.parse(window.localStorage.productInfo || '{}')
        initCitySelect('chose', (area) => {
            this.area = area
            console.log(area)
        })
    },
    methods: {
        getIn,
        submit () {
            if (!(/^1[34578]\d{9}$/.test(this.phoneNumber))) {
                Toast('手机号码格式错误')
                return
            }
            if (!this.name) {
                Toast('请输入姓名')
                return
            }
            if (!this.phoneNumber) {
                Toast('请输入手机号码')
                return
            }
            if (!this.area || !this.address) {
                Toast('请输入地址')
                return
            }
            axios.post('https://ebusiness.nibaspace.com/commodity/order/code/add', {
                code: window.localStorage.code,
                phone: this.phoneNumber,
                name: this.name,
                region: this.area,
                detailedAdress: this.address
            }).then(res => {
                if (res.data.result) {
                    MessageBox({
                        title: '提示',
                        message: '成功预约',
                        showCancelButton: false
                    }).then(action => {
                        window.localStorage.productInfo = ''
                        window.localStorage.code = ''
                        this.$router.push('checkLogin')
                    })
                } else {
                    Toast(res.data.message)
                }
            })
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
    overflow-y: scroll;
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
            // background-color: red;
            img {
                width: 172px;
                height: 172px;
            }
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
    .address-content {
        padding-top: @padding-top-bottom;
        .address-content-info {
            .list-common-style;
            justify-content: flex-start;
            .title {
                font-size: 28px;
                padding-bottom: 12px; 
            }
            .input-address {
                font-size: 28px;
                textarea {
                    font-size: 28px;
                }
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
            justify-content: flex-start;
            color: #373737;
            padding: 0;
            padding-bottom: @padding-top-bottom;
            .title {
                font-size: 28px;
            }
            .person {
                input {
                    font-size: 28px;
                }
            }
            border-bottom: 1px solid #e4e4e4;
        }
    }
    .phone-container {
        padding: 0 30px;
        padding-top: @padding-top-bottom;
        .phone {
            .list-common-style;
            justify-content: flex-start;
            padding: 0;
            color: #373737;
            .title {
                font-size: 28px;
                padding-bottom: @padding-top-bottom;
            }
            .phone-number {
                font-size: 28px;
                input {
                    font-size: 28px;
                }
            }
            border-bottom: 1px solid #e4e4e4;
        }
    }
    > .address {
        .list-common-style;
        justify-content: flex-start;
        color: #373737;
        padding-bottom: @padding-top-bottom;
        padding-top: @padding-top-bottom;
        .title {
            font-size: 28px;
        }
        .person-address {
            display: flex;
            font-size: 28px;
            flex-direction: column;
            align-items: flex-end;
            .address-content {
                font-size: 28px;
                color: #9e9e9e;
            }
        }
    }
    .submit-container {
        margin-top: 300px;
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