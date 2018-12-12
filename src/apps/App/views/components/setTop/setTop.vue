<template>
	<div class="set-top-wrap">
		<span class="set-top-btn" @click="onclick" v-show="setTopDisplay" ><span>返回顶部</span></span>
	</div>
</template>

<script>
import {mapState} from 'vuex';
export default {
    name: 'setTop',
    data () {
        return {
            setTopDisplay: false
        };
    },
    methods: {
        onclick () {
            this.$emit('setTop');
        }
    },
    computed: {
        ...mapState({
            setTopDisplayS: state => state.index.isSetTopDisplay
        })
    },
    watch: {
        setTopDisplayS (val, oval) {
            this.setTopDisplay = val;
        }
    }
};
</script>

<style lang="less" scoped>
	.set-top-wrap{
		position:fixed;
		bottom:120px;
		left:316px;
		background:transparent!important;
		z-index:999;
		.set-top-btn{
			display: block;
			width:51px;
			height:51px;
			text-indent:-9999em;
			// background:url(../../../assets/images/icon_setTop.png) no-repeat center;
			background-size:51px;
		}
	}
</style>