<template>
<div class="address-view">
    <div class="address-container">
        <div class="area">
            <div class="title">地区</div>
            <div class="select" id="chose">省、市、区</div>
        </div>
        <div class="address-content">
            <div class="title">详细地址</div>
            <div class="address-input">
                <textarea 
                    name="" 
                    id="" 
                    cols="30" 
                    rows="4"
                    placeholder="街道门牌、楼层房间号等信息"
                >
                </textarea>
            </div>
        </div>
    </div>
</div>
</template>
<script>
// import city from '../../constant/city.js'
import initCitySelect from '../../libs/city.js'
export default {
    data () {
        return {
            area: ''
        }
    },
    mounted () {
        initCitySelect('chose', (area) => {
            this.area = area
            console.log(area)
        })
    }
}
</script>
<style lang="less">
.flex () {
    display: flex;
    flex-direction: raw;
    justify-content: space-between;
}
.address-view {
    padding: 0 30px;
    margin-top: 30px;
    .address-container {
        border: 1px solid #a1a1a1;
        .area {
            .flex;
            padding: 23px 28px;
            border-bottom: 1px solid #e4e4e4;
            .title {
                font-size: 30px;
                color: #373737;
                font-weight: bold;
            }
            .select {
                font-size: 26px;
                color: #9e9e9e;
            }
        }
        .address-content {
            .flex;
            padding: 23px 28px;
            padding-top: 23px;
            height: 150px;
            .title {
                font-size: 30px;
                color: #373737;
                font-weight: bold;
            }
            .address-input {
                font-size: 26px;
                color: #9e9e9e;
                textarea {
                    // border: none;
                }
            }
        }
    }
}
</style>