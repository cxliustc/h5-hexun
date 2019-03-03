<template>
    <div class="index-container" ref="container">
        <div class="content">
            <div>
                <img src="/static/images/logo.jpg" alt="" style="height: 180px; width: 50%;display: block; margin: 0 auto;">
            </div>
            <div>
                <mt-radio
                    v-model="radio"
                    :options="[{
                        label: '海泉湾维景国际酒店豪华房',
                        value: '02b8d5c10a144667b671bd38d2b6381c'
                    }, {
                        label: '海泉湾维景国际酒店标准房',
                        value: '6762acc072cf41dea76cbfd3a6a21753'
                    }]"
                >
                </mt-radio>
                <mt-field class="time" label="预约时间" v-model="time">
                    <div @click="showPicker">
                        {{time}}
                    </div>
                </mt-field>
                <mt-field label="核销码" placeholder="请输入核销码" v-model="code"></mt-field>
                <mt-field label="手机号码" placeholder="请输入手机号码" type="tel" v-model="phoneNumber"></mt-field>
                
                <mt-field label="验证码" v-model="captcha">
                    <mt-button size="small" type="primary" @click="getCode" style="background-color: #FF6100">获取验证码</mt-button>
                </mt-field>
                <div style="width: 100%; margin-top: 20%; margin-bottom: 20px;">
                    <mt-button @click="submit" type="primary" size="normal" style="width: 200px; display: block; margin: 0 auto; background-color: #FF6100">提交</mt-button>
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
            radio: window.sessionStorage.radio || '02b8d5c10a144667b671bd38d2b6381c',
            // pickerVisible: '',
            code: '',
            phoneNumber: '',
            captcha: '',
            times: -1
        }
    },
    computed : {
        time () {
            // debugger
            return this.handleTime(parseInt(window.sessionStorage[this.radio]))
        }
    },
    // watch: {
    //     pickerVisible (val) {
    //         console.log(val)
    //         this.time = `${val.getFullYear()}年/${val.getMonth()}月/${val.getDay()}日/${val.getHours()}时`
    //     }
    // },
    // updated () {
    //     this.time = window.sessionStorage.time
    // },
    created () {
        // debugger
        // window.sessionStorage.time = ''
        // debugger
        // this.onCodeHandler = throttle(this.getCode, 60000)
    },
    destroyed () {
        window.clearInterval(this['02b8d5c10a144667b671bd38d2b6381c' + 'timer'])
        window.clearInterval(this['6762acc072cf41dea76cbfd3a6a21753' + 'timer'])
    },
    watch: {
        radio (val) {
            window.sessionStorage.radio = val
        }
        // code (val) {
        //     debugger
        //     window.sessionStorage[this.radio + 'code'] = val
        // },
        // phoneNumber (val) {
        //     window.sessionStorage[this.radio + 'phoneNumber'] = val
        // },
        // captcha (val) {
        //     window.sessionStorage[this.radio + 'captcha'] = val
        // }
    },
    mounted () {
        this.scroll = new BScroll(this.$refs.container, {
            scrollY: true,
            probeType: 1,
            click: true
            // scrollbar: true
        })
    },
    methods: {
        handleTime (time) {
            // debugger
            if (!time) {
                return '选择日期'
            }
            let date = new window.Date(time)
            let year = date.getFullYear()
            let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
            let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate() 
            return year + '-' + month + '-' + day
        },
        showPicker () {
            // this.$refs.picker.open()
            this.$router.push({
                name: 'date',
                params: {
                    id: this.radio
                }
            })
        },
        submit () {
            if (this.code === '') {
                Toast('请输入核销码')
                return
            }
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNumber))) {
                Toast('请输入正确手机号码')
                return
            }
            if (this.captcha === '') {
                Toast('请输入验证码')
                return
            }
            if (!window.sessionStorage[this.radio]) {
                Toast('请选择日期')
                return
            }
            axios.post('https://ebusiness.nibaspace.com/commodity/order/reserve/offline', {
                code: this.code,
                reserveMobile: this.phoneNumber,
                verificationCode: this.captcha,
                reserveTime: window.parseInt(window.sessionStorage[this.radio])
            }).then(function (res) {
                debugger
                if (res.data.result) {
                    MessageBox.alert('预约申请已提交，等待海泉湾审核')
                } else {
                    MessageBox.alert('预约失败')
                }
            })
        },
        getverificationCode () {

        },
        getCode () {
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNumber))) {
                Toast('手机号码有误')
                return
            }
            if (this[this.radio + 'times'] > 60 || !this[this.radio + 'times']) {
                axios.post('https://ebusiness.nibaspace.com/commodity/mobile/send/to', {
                    mobile: this.phoneNumber
                }).then(function (res) {
                    if (res.data.result) {
                        Toast('发送成功')
                    }
                })
                this[this.radio + 'times'] = 0
                if (this[this.radio + 'timer']) {
                    window.clearInterval(this[this.radio + 'timer'])
                }
                this[this.radio + 'timer'] = window.setInterval(() => {
                    this[this.radio + 'times'] = this[this.radio + 'times'] + 1
                    console.log(new Date().getTime())
                }, 1000)
            } else {
                Toast('请于60s之后再点击发送验证码')
            }
        },
        onCodeHandler: () => {}
    }
}
</script>
<style lang="less">
.index-container {
    position: absolute;
    height: 100%;
    width: 100%;
    .content{
        width: 100%;
    }
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