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
                                            disabled: item.margin === 0
                                        }"
                                    >
                                        <div 
                                            class="title"
                                            :class="{
                                                'background': index !== selected
                                            }"
                                        >{{handleTime(item.bookDate)}}</div>
                                        <div class="remain">{{item.bookedCount + '/' + item.margin}}</div>
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
import axios from 'axios'
const dateList =  [
        {
            "id": "ca8561ff23724122889316e10c5926c3",
            "appId": "c899d1e6f3b64a29a7539910755656ce",
            "goodsId": "f6203ba943824328b5c4a263b04946eb",
            "bookDate": 1548864000000,
            "margin": 45,
            "bookedCount": 0,
            "delFlag": "0",
            "createBy": "c899d1e6f3b64a29a7539910755656ce",
            "createTime": 1548865591000,
            "updateBy": "c899d1e6f3b64a29a7539910755656ce",
            "updateTime": 1548865591000
        },
        {
            "id": "8f6653e4bb104984b7ee1b3b779c33c8",
            "appId": "c899d1e6f3b64a29a7539910755656ce",
            "goodsId": "f6203ba943824328b5c4a263b04946eb",
            "bookDate": 1548950400000,
            "margin": 50,
            "bookedCount": 0,
            "delFlag": "0",
            "createBy": "c899d1e6f3b64a29a7539910755656ce",
            "createTime": 1548865595000,
            "updateBy": "c899d1e6f3b64a29a7539910755656ce",
            "updateTime": 1548865595000
        },
        {
            "id": "c96e889a8d004a8e8cf258a31b7ff66f",
            "appId": "c899d1e6f3b64a29a7539910755656ce",
            "goodsId": "f6203ba943824328b5c4a263b04946eb",
            "bookDate": 1549036800000,
            "margin": 50,
            "bookedCount": 50,
            "delFlag": "0",
            "createBy": "c899d1e6f3b64a29a7539910755656ce",
            "createTime": 1548865595000,
            "updateBy": "c899d1e6f3b64a29a7539910755656ce",
            "updateTime": 1548865595000
        }
]

export default {
    data () {
        return {
            dateList: [],
            selected: -1
        }
    },
    created () {
        // debugger
        axios.post('https://ebusiness.nibaspace.com/commodity/book/room/list/get', {
            appId: '05bc2c20b8014a2aa0e7538b3d8074a2',
            goodsId: this.$route.params.id
        }).then((res) => {
            // debugger
            this.dateList = res.data.data
            setTimeout(() => {
                this.initScroll()
            })
        })
    },
    methods: {
        handleTime (time) {
            // debugger
            let date = new window.Date(time)
            let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
            let day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate() 
            return month + '-' + day
        },
        clickItem (item, index) {
            if (item.margin === 0) return
            this.selected = index
            window.sessionStorage[this.$route.params.id] = item.bookDate
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
        width: 100%;
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