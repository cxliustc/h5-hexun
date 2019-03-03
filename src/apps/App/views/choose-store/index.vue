<template>
    <div class="choose-store-view">
        <div class="store-slide" ref="storeSlide">
            <div class="store-container">
                <ul>
                    <li 
                        v-for="(item, index) in storeList" :key="index" :class="{
                                select: select === index
                            }"
                        @click="clickItem(index)"
                    >
                        <div class="name">
                            {{item.name}}
                        </div>
                        <div class="address">
                            {{item.address}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
const storeList =[]
for (var i = 0; i < 10; i++) {
    storeList.push({
        name: '金沙店',
        address: '陕西省西安市碑林区含光北路'
    })
}
export default {
    data () {
        return {
            storeList,
            select: 0
        }
    },
    mounted () {
        this.initScroll()
    },
    methods: {
        clickItem (index) {
            this.select = index
        },
        initScroll () {
            this.scroll = new BScroll(this.$refs.storeSlide, {
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
.choose-store-view {
    .store-slide {
        position: absolute;
        width: 100%;
        height: 100%;
        .store-container {
            padding: 19px 30px;
            // box-sizing: border-box;
            ul {
                li {
                    box-sizing: border-box;
                    width: 100%;
                    opacity: 0.77;
                    border: 1px solid #A1A1A1;
                    border-radius: 8px;
                    height: 128px;
                    padding: 20px 28px;
                    .name {
                        color: #373737;
                        font-size: 30px;
                        font-weight: bold;
                    }
                    .address {
                        color: #9e9e9e;
                        font-size: 26px;
                    }
                    margin-bottom: 16px;
                }
                .select {
                    opacity: 0.77;
                    background-image: linear-gradient(-50deg, #FF8100 0%, #FF5000 100%);
                    border-radius: 8px;
                    border: none;
                    .name {
                        color: #fff;
                    }
                    .address {
                        color: #fff;
                    }
                }
            }
        }
    }
}  
</style>