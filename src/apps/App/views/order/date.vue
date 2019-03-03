<template>
<div ref="wrapper" class="list-wrapper" :style="{height: wrapperHeight}">
    <div class="scroll-content">
        <div ref="listWrapper">
            <ul class="list-content" ref="date">
                <li
                    :style="{
                        height: height    
                    }"
                    class="list-item" 
                    v-for="(item, index) in dateList"
                    @click="clickItem(item, index)"
                >
                </li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import BScroll from 'better-scroll' 
const dateList = []
for (var i = 0; i < 10; i++) {
    dateList.push({
        time: '02-02(周六)',
        content: '0/50',
        status: 0
    })
}
export default {
    data () {
        return {
            dateList,
            height: '100px'
        }
    },
    computed: {
        wrapperHeight () {
            return 2 * window.parseInt(this.height) + 'px'
        }
    },
    mounted () {
        this.height = document.querySelector('.list-item').clientWidth + 'px'
        this.$nextTick(() => {
            this.initScroll()
        })
    },
    methods: {
        clickItem () {
            console.log(arguments)
        },
        initScroll () {
            this.scroll = new BScroll(this.$refs.wrapper, {
                scrollY: true,
                probeType: 1,
                click: true,
                stopPropagation: true
                // scrollbar: true
            })
        }
    }
}
</script>
<style lang="less">
    .list-wrapper {
        overflow: hidden;
        width: 100%;
        .scroll-content {
            position: relative;
            z-index: 1;
            padding: 0 30px;
            .list-content {
                display: flex;
                flex: column;
                flex-wrap: wrap;
                justify-content: flex-start;
                // float: left;
                width: 100%;
                // position: absolute;
                padding-bottom: 100px;
                li {
                    box-sizing: border-box;
                    width: 25%;
                    border: 1px solid #e4e4e4;
                }
            }
        }
    }
</style>