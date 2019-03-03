<template>
    <div>
        <!-- 验证码弹出层 -->
        <div class='VerificationCodeWrap' v-show="showBomb">
            <div class="VerificationCodeContent">
                <div>
                    <input type="text" class="userBox" v-model='userName' @input='userName=userName.slice(0, 20)' placeholder="请输入姓名">
                </div>
                <div>
                    <input type="tel" class="phoneBox" v-model='phoneNum' @input='phoneNum=phoneNum.replace(/[^\d\.]/g,"")' placeholder="请输入手机号" maxlength="11">
                </div>
                <div>
                    <input type="text" class="codeBox" v-model='codeNum' @input='codeNum=codeNum.replace(/[^\d\.]/g,"")' placeholder="请输入验证码">
                    <span class="getCode" :class='{"isGetCode" : isGetCode}' @click='getVerificationCode(phoneNum)'>{{isGetCode ? `已发送(${CountDown}S)` : '发送验证码'}}</span>
                </div>
                <button class="subCode" @click='subPhone()'>提交</button>
            </div>
            <button class="VerificationClose" @click="closeBomb"><img src="../../assets/images/info/close.png" alt=""></button>
        </div>
    </div>
</template>
<script>
import apis from '@/apps/App/apis';
import { ls } from 'UTILS/utils';
import { isPhone, isName } from 'UTILS/StringUtil';
export default {
    name: 'submit',
    data () {
        return {
            // showBomb: false, // 短信验证弹框
            userName: '', // 用户姓名
            phoneNum: '', // 电话号码
            codeNum: '', // 验证码
            isGetCode: false, // 验证码是否发送
            CountDown: 60 // 倒计时
        };
    },
    props: ['showBomb', 'detailId'],
    methods: {
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
        getVerificationCode (phoneNum) {
            if (!this.isGetCode) {
                if (isPhone(phoneNum)) {
                    let params = {
                        user: {
                            mobile: phoneNum
                        }
                    };
                    apis.info.getVerificationCode(params).then((data) => {
                        data = data.body;
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
        subPhone () {
            let params = {
                user: {
                    mobile: this.phoneNum,
                    code: this.codeNum,
                    username: this.userName
                }
            };
            let expires = new Date();
            expires = new Date((expires.getFullYear() + 50).toString());
            if (isPhone(this.phoneNum)) {
                if (this.userName.length >= 2 && isName(this.userName)) {
                    apis.info.submitCode(params).then((data) => {
                        data = data.body;
                        if (data.success) {
                            this.showMainMask = false;
                            this.showBomb = false;
                            ls.setCookie('HX_AUTH_CHECK', 'checked', expires);
                            this.$router.push({
                                name: 'infoDetail',
                                params: {informationId: this.detailId}
                            });
                        } else {
                            this.$vux.toast.show({
                                text: '验证码错误',
                                type: 'text',
                                width: '2rem',
                                position: 'bottom'
                            });
                        }
                    });
                } else {
                    this.$vux.toast.show({
                        text: '请输入姓名,2-20个中英文字符',
                        type: 'text',
                        width: '2rem',
                        position: 'bottom'
                    });
                }
            } else {
                this.$vux.toast.show({
                    text: '请输入正确手机号',
                    type: 'text',
                    width: '2rem',
                    position: 'bottom'
                });
            }
        },
        closeBomb () {
            this.$emit('closeBomb', false);
        }
    }
};
</script>
<style lang='less' scoped>
    .VerificationCodeWrap{
        height:100%;
        width:100%;
        position: fixed;
        top:0;
        left:0;
        background:transparent;
        z-index:3;
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
            left:50%;
            margin-left:-11.3px;
            background: transparent;
            img{
                height:22.6px;
                width:22.6px;
            }
        }
        .VerificationCodeContent{
            position: absolute;
            width:287px;
            background: #FFFFFF;
            border: 1px solid #E2E2E2;
            border-radius: 8px;
            top:50%;
            left:50%;
            margin-top:-134.5px;
            margin-left:-143.5px;
            padding:34px 0 31px 28px;
            z-index:6;
            .getCode{
                display: inline-block;
                width:88px;
                height:36px;
                background: #EE5050;
                border-radius: 8px 8px 8px 8px;
                color:#fff;
                text-align: center;
                line-height: 36px;
                font-size:12px;
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
                &.phoneBox, &.userBox{
                    width: 230px;
                }
                &.codeBox{
                    width:139px;
                }
            }
        }
    }
</style>
