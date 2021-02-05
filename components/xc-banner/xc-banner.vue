<template>
  <view>
    <uni-swiper-dot
      :info="info"
      :mode="mode"
      :current="current"
      :dots-styles="{backgroundColor: '#f1f1f1', border: 'none', selectedBackgroundColor: '#56ceab', selectedBorder: 'none'}"
      field="content">
      <swiper
        class="swiper-box"
        autoplay
        circular
        @change="change">
        <swiper-item
          v-for="(item, index) in info"
          :key="index">
          <view class="swiper-item">
            <image
              :src="item.src"
              class="image-item"
              mode="bottom"/>
          </view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
  </view>
</template>

<script>
export default {
  data () {
    return {
      info: [{
        src: '../../static/img/1.jpg'
      }, {
        src: '../../static/img/2.jpg'
      }, {
        src: '../../static/img/3.jpg'
      }],
      current: 0,
      mode: 'round'
    }
  },
  methods: {
    change (e) {
      this.current = e.detail.current
    }
  }
}
</script>

<style lang="less" scoped>
	.swiper-item {
		width: 100%;
		height: 100%;
		.image-item {
			width: 100%;
		}
	}
</style>
