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
        src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7d442ec4-8edf-4e99-8e52-4170f0c2ac6c/391b13bb-d8f6-435c-b182-25dfdf62635f.jpg'
      }, {
        src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7d442ec4-8edf-4e99-8e52-4170f0c2ac6c/0ec708b5-2bf1-4156-b3a2-cf2ae8681d56.jpg'
      }, {
        src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7d442ec4-8edf-4e99-8e52-4170f0c2ac6c/9a4f4a90-5a4f-49fe-a933-952bf915f943.jpg'
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
