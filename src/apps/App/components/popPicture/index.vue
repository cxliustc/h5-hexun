<template>
    <div>
        <!-- 验证码弹出层 -->
        <div class='VerificationCodeWrap' v-show="showBomb">
            <div class="VerificationCodeContent">
                <slot/>
            </div>
            <button class="VerificationClose" @click="closeBomb"><img src="../../assets/images/info/close.png" alt=""></button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'popPicture',
    data () {
        return {
        };
    },
    props: ['showBomb'],
    methods: {
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
            top: 460px;                             
            left: 50%;
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
            border-radius: 8px;
            top: 70px;
            left:50%;
            margin-left:-143.5px;
            z-index:6;
            img{
                display: inline-block;
                width: 287px;
                height: 349px;
            }
        }
    }
</style>
