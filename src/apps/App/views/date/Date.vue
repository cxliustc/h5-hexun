<template>
    <div class="date">
        <div class="date-container">
            <div class="header">日历预约</div>
            <div ref="wrapper" class="list-wrapper" @click="handler">
                <div class="scroll-content">
                    <div ref="listWrapper">
                        <slot>
                            <ul class="list-content">
                                <li 
                                    class="list-item" 
                                    v-for="(item, index) in dateList"
                                    @click="clickItem(item, index)"
                                >
                                    <div
                                        :class="{
                                            'date-container': true,
                                            selected: index === selected,
                                            disabled: item.disabled  
                                        }"
                                    >
                                        <div 
                                            class="title"
                                            :class="{
                                                'background': index !== selected
                                            }"
                                        >{{item.time}}</div>
                                        <div class="remain">10/50</div>
                                    </div>
                                </li>
                            </ul>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="submit-container">
            <div class="submit" @click="subscribe">确定选择</div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import {MessageBox} from 'mint-ui'
const dateList = [{
    time: '01-29(周二)'
}, {
    time: '01-30(周三)'
}, {
    time: '01-31(周四)'
}, {
    time: '02-01(周五)'
}, {
    time: '02-02(周六)'
}, {
    time: '02-03(周日)'
}, {
    time: '02-04(周一)',
    disabled: true
}, {
    time: '02-05(周二)'
}, {
    time: '02-06(周三)'  
}, {
    time: '02-07(周四)'
}, {
    time: '02-08(周五)',
    disabled: true
}, {
    time: '02-09(周六)'
}, {
    time: '02-10(周日)'
}, {
    time: '02-11(周一)'
}, {
    time: '02-12(周二)',
    disabled: true
}, {
    time: '02-13(周三)',
    disabled: true
}, {
    time: '02-14(周四)'
}, {
    time: '02-15(周五)',
    disabled: true
}, {
    time: '02-16(周六)'
}, {
    time: '02-17(周日)'
}, {
    time: '02-18(周一)',
    disabled: true
}, {
    time: '02-19(周二)'
}, {
    time: '02-20(周三)'
}, {
    time: '02-21(周四)'
}, {
    time: '02-22(周五)'
}, {
    time: '02-23(周六)'
}, {
    time: '02-24(周日)'
}, {
    time: '02-25(周一)'
}, {
    time: '02-26(周二)'
}, {
    time: '02-27(周三)'
}]

export default {
    data () {
        return {
            dateList: dateList,
            selected: -1
        }
    },
    methods: {
        clickItem (item, index) {
            debugger
            if (item.disabled) return
            this.selected = index
            window.localStorage.time = item.time
        },
        initScroll () {
            this.scroll = new BScroll(this.$refs.wrapper, {
                scrollY: true,
                probeType: 1,
                click: true
                // scrollbar: true
            })
        },
        subscribe () {
            // MessageBox.alert('预约成功').then(() => {
                this.$router.push({
                    name: 'subscribe'
                })
            // })
        },
        handler () {
            console.log('hello')
        }
    },
    mounted () {
        setTimeout(() => {
            this.initScroll()
        })
    }
}
</script>
<style lang="less">
.date {
    .header {
        padding-left: 5px;
        padding-top: 10px;
        padding-bottom: 5px;
    }
    .list-wrapper {
        position: absolute;
        height: 100%;
        overflow: hidden;
        .scroll-content {
            position: relative;
            z-index: 1;
            // .list-content {
            //     position: relative;
            //     z-index: 10;
            // }
        }
    }
    .submit-container {
        width: 100%;
        height: 50px;
        background-color: white;
        position: fixed;
        z-index: 100;
        bottom: 0px;
        padding: 10px 0;
        box-sizing: content-box;
        .submit {
            background-color: #FF6100; 
            // margin: 0 10px;
            width: 95%;
            height: 50px;
            box-sizing: box-content;
            margin: 0 auto;
            color: white;
            font-size: 14px;
            line-height: 50px;
            text-align: center;
            margin-bottom: 10px;
        }
    }
    .scroll-content {
        width: 100%;
        // height: 100%;
        float: left;
        .list-content {
            display: flex;
            flex: column;
            flex-wrap: wrap;
            justify-content: flex-start;
            // float: left;
            width: 100%;
            // position: absolute;
            padding-bottom: 100px;
            li.list-item {
                width: 25%;
                height: 100px;
                // flex: 1;
                align-items: center;
                div.date-container {
                    border: 1px solid #636363;
                    // background-color: red;
                    margin: 5px;
                    font-size: 12px;
                    height: 70px;
                    div {
                        text-align: center;
                    }
                    .title {
                        // padding-top: 18px;
                        padding: 5px 0;
                        // background-color: #ffecec
                    }
                    .background {
                        background-color: #ffecec
                    }
                    .remain {
                        margin-top: 15px;
                    }
                }
                .selected {
                    background-color: #FF6100;
                    color: white;
                }
                .disabled {
                    color: rgb(153, 153, 153);
                }
            }
        }
        
    }
}
</style>