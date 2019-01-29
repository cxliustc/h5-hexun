<template>
    <div>
        <div>
            <img src="/static/images/logo.jpg" alt="" style="height: 180px; width: 50%;display: block; margin: 0 auto;">
        </div>
        <div>
            <mt-field label="核销码" placeholder="请输入核销码" v-model="code"></mt-field>
            <mt-field label="手机号码" placeholder="请输入手机号码" type="tel" v-model="phoneNumber"></mt-field>
            <mt-field class="time" label="预约时间" v-model="time">
                <div @click="showPicker">
                    {{time}}
                </div>
            </mt-field>
            <mt-datetime-picker
                ref="picker"
                v-model="pickerVisible"
                type="datetime"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日"
                hour-format="{value} 时">
            </mt-datetime-picker>
            <mt-field label="验证码" v-model="captcha">
                <mt-button size="small" type="primary" @click="onCodeHandler" style="background-color: #FF6100">获取验证码</mt-button>
            </mt-field>
            <div style="width: 100%; position: absolute; bottom: 0;">
                <mt-button @click="submit" type="primary" size="normal" style="width: 200px; display: block; margin: 0 auto; margin-bottom: 20%; background-color: #FF6100">提交</mt-button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {Field, Button, DatetimePicker, MessageBox} from 'mint-ui'
import {throttle} from 'underscore'
export default {
    components: {
        [Field.name]: Field,
        [Button.name]: Button,
        [DatetimePicker.name]: DatetimePicker
    },
    data () {
        return {
            pickerVisible: '',
            code: '',
            phoneNumber: '',
            time: window.localStorage.time || '选择日期',
            captcha: ''
        }
    },
    watch: {
        pickerVisible (val) {
            console.log(val)
            this.time = `${val.getFullYear()}年/${val.getMonth()}月/${val.getDay()}日/${val.getHours()}时`
        }
    },
    updated () {
        this.time = window.localStorage.time
    },
    created () {
        window.localStorage.time = ''
        // debugger
        this.onCodeHandler = throttle(this.getCode, 60000)
    },
    methods: {
        showPicker () {
            // this.$refs.picker.open()
            this.$router.push({
                name: 'date'
            })
        },
        submit () {
            MessageBox.alert('预约成功')
        },
        getverificationCode () {

        },
        getCode () {
            console.log('1111')
        },
        onCodeHandler: () => {}
    }
}
</script>
<style lang="less">
    .time {
        input {
            display: none;
        }
    }
</style>