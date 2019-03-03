<template>
    <div class="index-container" ref="container">
        <div class="content">
            <div>
                <img src="/static/images/logo.jpg" alt="" style="height: 180px; width: 50%;display: block; margin: 0 auto;">
            </div>
            <div>
                <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
                <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
                <div style="width: 100%; margin-top: 20%; margin-bottom: 20px;">
                    <mt-button @click="submit" type="primary" size="normal" style="width: 200px; display: block; margin: 0 auto; background-color: #FF6100">登录</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import md5 from 'js-md5'
import axios from 'axios'
import {Radio, Field, Button, DatetimePicker, MessageBox, Toast} from 'mint-ui'
import {throttle} from 'underscore'
import BScroll from 'better-scroll'
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
            username: Cookies.get('username') || '',
            password: Cookies.get('password') || ''
        }
    },
    methods: {
        submit () {
            // debugger
            if (!this.username) {
                Toast('请输入用户名')
                return
            }
            if (!this.password) {
                Toast('请输入密码')
                return
            }
            // 记住密码的功能
            Cookies.set('username', this.username, 7)
            Cookies.set('password', this.password, 7)

            axios.post('https://ebusiness.nibaspace.com/commodity/doLogin', {
                userName: this.username,
                password: md5(this.password)
            }).then((res) => {
                if (res.data.result) {
                    window.localStorage.token = res.data.data.accessToken
                    Toast('登录成功')
                    setTimeout(() => {
                        this.$router.push({
                            name: 'check'
                        })
                    }, 2000)
                } else {
                    Toast('登录失败')
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