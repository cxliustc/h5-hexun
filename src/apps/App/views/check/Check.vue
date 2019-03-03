<template>
    <div class="index-container" ref="container">
        <div class="content" style="margin-top: 30%;">
            <div>
                <mt-field label="核销码" type="url" placeholder="请输入核销码" v-model="code"></mt-field>
                <mt-field label="手机号" type="phone" placeholder="请输入手机号" v-model="phoneNumber"></mt-field>
                <div class="code">
                    <mt-field style="width: 250px;" class="code-input" label="验证码" type="url" placeholder="请输入验证码" v-model="validateCode"></mt-field>
                    <mt-button style="height: 48px; background-color: #FF6100;" class="code-button" @click="getCode" type="primary" size="small">获取验证码</mt-button>
                </div>
                <div style="width: 100%; margin-top: 20%; margin-bottom: 20px;">
                    <mt-button @click="submit" type="primary" size="normal" style="width: 200px; display: block; margin: 0 auto; background-color: #FF6100">查询预约</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {Radio, Field, Button, DatetimePicker, MessageBox, Toast} from 'mint-ui'
import {throttle} from 'underscore'
import BScroll from 'better-scroll';
export default {
    components: {
        [Radio.name]: Radio,
        [Field.name]: Field,
        [Button.name]: Button,
        [DatetimePicker.name]: DatetimePicker
    },
    data () {
        // let radio = window.sessionStorage.radio || '170fe21b87394ac08acc5895bfab27ac'
        return {
            code: '',
            phoneNumber: '',
            validateCode: ''
        }
    },
    methods: {
        getCode () {
            if (!(/^1[34578]\d{9}$/.test(this.phoneNumber))) {
                Toast('手机号码格式错误')
                return
            }
            if (!this.code) {
                Toast('请输入核销码')
                return
            }
            axios.post('https://ebusiness.nibaspace.com/commodity/order/code/check', {
                code: this.code,
                phone: this.phoneNumber
            }).then((res) => {
                if (res.data.result) {
                    Toast('成功发送验证码，请注意查收')
                }
            })
        },
        submit () {
            axios.post('https://ebusiness.nibaspace.com/commodity/order/code/query', {
                code: this.code,
                phone: this.phoneNumber,
                number: this.validateCode
            }).then((res) => {
                if (res.data.result) {
                    window.localStorage.productInfo = JSON.stringify(res.data.data)
                    window.localStorage.code = this.code
                    this.$router.push({
                        name: 'order'
                    })
                } else {
                    MessageBox('提示', res.data.message)
                }
            })
        }
    },
    mounted () {
        this.scroll = new BScroll(this.$refs.container, {
            scrollY: true,
            probeType: 1,
            click: true
            // scrollbar: true
        })
    }
}
</script>
<style lang="less">
.code-button {
    // font-size: 12px;
}
.index-container {
    position: absolute;
    height: 100%;
    width: 100%;
    .content{
        width: 100%;
    }
}
.code {
    display: flex;

}
    .time {
        input {
            display: none;
        }
    }
    .mint-cell-wrapper {
        background-image: none;
    }
    .mint-cell:last-child {
        background-image: none;
    }
</style>