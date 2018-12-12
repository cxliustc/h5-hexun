import Scroll from 'COMPONENTS/scroll';
import {mapState} from 'vuex';
import setTop from '../components/setTop/setTop';
export default {
    components: {
        Scroll, setTop
    },
    data () {
        return {
            items: [],
            count: 2
        };
    },
    computed: {
        ...mapState({
            // pullingFlag: state => state.data.pullingFlag
        })
    },
    methods: {
        // 下拉刷新
        onPullingDown (params, isInit) {
            let keyword = '';
            if (!this.getData) {
                this.items = [];
                return;
            }
            this.getData({
                request: {
                    keyword: keyword
                } // ...params
            }).then(({data, pageCount, total}) => {
                let upDateData = this.$children[0].$data;
                console.log('当前总条数为：', total);
                console.log('更新条数为:', upDateData.updateCount);
                if (isInit) {
                    upDateData.initTotal = total;
                } else {
                    upDateData.updateTotal = total;
                    upDateData.updateCount = upDateData.updateTotal - upDateData.initTotal;
                    upDateData.initTotal = total;
                }
                this.$children[0].$data.pullUpLoad = false;
                if (this.setData) this.setData(data);
                this.items = data;
                this.count = 2;
            }).catch(() => {
                this.$refs.scroll.forceUpdate();
            });
        },
        // 上拉加载
        onPullingUp (params) {
            if (!this.getData) {
                this.items = [];
                return;
            }
            this.getData({
                ...params,
                request: {
                    pageNum: this.count,
                    keyword: this.keyword
                }
            }).then(({data, pageCount}) => {
                debugger;
                if (this.count > pageCount || data.length === 0) {
                    this.$refs.scroll.forceUpdate(false);
                } else {
                    this.items = this.items.concat(data);
                    this.count++;
                }
            }).catch((error) => {
                console.log(error);
                this.$refs.scroll.forceUpdate();
            });
        },
        scrollHide () {
            // this.$store.commit('data/setPullingFlag', 0);
        },
        scrollShow () {
            let that = this;
            let y = this.$refs.scroll.scroll.y;
            if (y !== 0) {
                that.$store.commit('index/setTopDisplay', true);
            } else {
                that.$store.commit('index/setTopDisplay', false);
            }
        },
        setTop () {
            let scroll = this.$refs.scroll;
            scroll.scrollTo(0, 0, 500);
        }
    },
    watch: {
        keyword (value) {
            this.onPullingDown({
                loading: true,
                keyword: value
            });
        }
    }
};
