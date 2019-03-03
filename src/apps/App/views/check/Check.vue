<template>
    <div class="index-container" ref="container">
        <div class="content" style="margin-top: 30%;">
            <div>
                <mt-field label="核销码" type="url" placeholder="请输入核销码" v-model="code"></mt-field>
                <div style="width: 100%; margin-top: 20%; margin-bottom: 20px;">
                    <mt-button @click="submit" type="primary" size="normal" style="width: 200px; display: block; margin: 0 auto; background-color: #FF6100">核销</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import md5 from 'js-md5'
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
            code: ''
        }
    },
    methods: {
        submit () {
            axios.post('https://ebusiness.nibaspace.com/commodity/order/check/merchant', {
                code: this.code
            }, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': window.localStorage.token
                }
            }).then(function (res) {
                if (res.data.result) {
                    MessageBox('提示', '核销成功').then((action) => {
                        if (action === 'confirm') {
                            this.code = ''
                        }
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