<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
        <div ref="list" class="list-content">
            <slot name="list">
                <ul>
                <li v-on:click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>
                </ul>
            </slot>
        </div>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
            :isShow="isShow"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad && isShow">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :pulling="pulling"
          :bubbleY="bubbleY"
          :isShow="isShow"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh && isShow">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="pulling" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>{{refreshTxt}}</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="js">
  import BScroll from 'better-scroll';
  import Loading from '../loading/loading.vue';
  import Bubble from '../bubble/bubble.vue';
  import {getRect, isIphone} from 'UTILS/utils';

  const COMPONENT_NAME = 'scroll';
  const DIRECTION_H = 'horizontal';
  const DIRECTION_V = 'vertical';

  export default {
    name: COMPONENT_NAME,
    props: {
        data: {
            type: Array,
            default: function () {
                return [];
            }
        },
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        listenBeforeScroll: {
            type: Boolean,
            default: false
        },
        direction: {
            type: String,
            default: DIRECTION_V
        },
        scrollbar: {
            type: null,
            default: false
        },
        pullDownRefresh: {
            type: null,
            default: false
        },
        pullUpLoad: {
            type: null,
            default: false
        },
        startY: {
            type: Number,
            default: 0
        },
        refreshDelay: {
            type: Number,
            default: 20
        },
        freeScroll: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            beforePullDown: true,
            isRebounding: false,
            isPullingDown: false,
            pulling: false,
            isPullUpLoad: false,
            pullUpDirty: true,
            pullDownStyle: '',
            bubbleY: 0,
            isShow: false
        };
    },
    computed: {
        pullUpTxt () {
            const moreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more || '加载更多';

            const noMoreTxt = this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore || '没有更多';

            return this.pullUpDirty ? moreTxt : noMoreTxt;
      },
        refreshTxt () {
            return this.pullDownRefresh && this.pullDownRefresh.txt || '刷新完成';
        }
    },
    created () {
        this.pullDownInitTop = -50;
    },
    mounted () {
        this.$nextTick(() => {
            this.initScroll();
        })
    },
    methods: {
        initScroll () {
            if (!this.$refs.wrapper) {
                return;
            }
            if (this.$refs.list && (this.pullDownRefresh || this.pullUpLoad)) {
                this.$refs.list.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`;
                this.isShow = true;
            }
            let options = {
                probeType: this.probeType,
                click: this.click,
                scrollY: this.freeScroll || this.direction === DIRECTION_V,
                scrollX: this.freeScroll || this.direction === DIRECTION_H,
                scrollbar: this.scrollbar,
                pullDownRefresh: {stop: isIphone() ? 80 * parseFloat(window.document.documentElement.style.fontSize) / 200 : 40},
                pullUpLoad: this.pullUpLoad,
                startY: this.startY,
                freeScroll: this.freeScroll
            };

            this.scroll = new BScroll(this.$refs.wrapper, options);

            if (this.listenScroll) {
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos);
                });
            }

            if (this.listenBeforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScrollStart');
                });
            }

            if (this.pullDownRefresh) {
                this._initPullDownRefresh();
            }

            if (this.pullUpLoad) {
                this._initPullUpLoad();
            }
        },
      disable () {
            this.scroll && this.scroll.disable();
      },
      enable () {
            this.scroll && this.scroll.enable();
      },
      refresh () {
            this.scroll && this.scroll.refresh();
      },
      scrollTo () {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement () {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },
      clickItem (e, item) {
            console.log(e);
            this.$emit('click', item);
      },
      destroy () {
            this.scroll.destroy();
      },
      forceUpdate (dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
            this.pulling = false;
            this._reboundPullDown().then(() => {
                this._afterPullDown();
            });
        } else if (this.pullUpLoad && this.isPullUpLoad) {
            this.isPullUpLoad = false;
            this.scroll.finishPullUp();
            // debugger;
            this.pullUpDirty = dirty;
            this.refresh();
        } else {
            this.refresh();
        }
      },
      _initPullDownRefresh () {
        this.scroll.on('pullingDown', () => {
            this.beforePullDown = false;
            this.isPullingDown = true;
            this.pulling = true;
            this.$emit('pullingDown');
        })
        this.scroll.on('scroll', (pos) => {
            if (this.beforePullDown) {
                this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
                this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10) / 100}rem`;
            } else {
                this.bubbleY = 0;
            }

            if (this.isRebounding) {
                this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`;
            }
        })
      },
      _initPullUpLoad () {
            this.scroll.on('pullingUp', () => {
                this.isPullUpLoad = true;
                this.$emit('pullingUp');
            })
      },
      _reboundPullDown () {
        const {stopTime = 500} = this.pullDownRefresh;
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.isRebounding = true;
                    this.scroll.finishPullDown();
                    this.isPullingDown = false;
                    resolve();
                }, stopTime);
            })
      },
      _afterPullDown () {
            this.pullDownStyle = `top:${this.pullDownInitTop}px`;
            setTimeout(() => {  
                this.beforePullDown = true;
                this.isRebounding = false;
                this.refresh();
            }, this.scroll.options.bounceTime);
      }
    },
    watch: {
        data () {
            this.$nextTick(() => {
                this.forceUpdate(true);
            })
        }
    },
    components: {
        Loading,
        Bubble
    }
  }

</script>

<style lang="less">
.scroll-content{
    transform: translateZ(0);
}
.list-wrapper{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: #fff;
    .list-content{
        position: relative;
        z-index: 10;
        background: #fff;
        width: 100%;
        // border-top: 1PX solid #e5e5e5;
        .list-item{
            height: 60px;
            line-height: 60px;
            font-size: 18px;
            padding-left: 20px;
            border-bottom: 1PX solid #e5e5e5;
        }  
    }
}
.pulldown-wrapper{
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    // transition: all .05s;
    pointer-events: none;
    font-size: 12px;
    .after-trigger{
        margin-top: 0px;
    }
}
.pullup-wrapper{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    background-color: #fff;
}
</style>
