<template>
	<view>
		<!-- 成长体系中的所有成长等级列表 使用scroll-view实现横向滚动 -->
		<view class="weui-panel__hd">
			<view class="text-xl text-black">
				【成长体系】
			</view>
			<scroll-view :scroll-x="true">
				<view class="level_list_container">
					<block v-for="level in levels" :key="level.id">
						<view class="level_tab_item margin-sm" @click="onLevelItemClick(level.id)">
							<view class="cu-avatar solids">
								<text class="icon-medal"></text>
							</view>
							<view :class="level.id == selectedId ? 'active-level' : ''">{{level.title}}</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		
		<view class="weui-panel__bd">
			<!-- 用户选中成长等级的成长值范围 -->
			<view class="weui-cell weui-cell_hide_line">
				<view class="weui-cell__bd">
					<view class="weui-flex">
						<view class="weui-flex__item">成长值：</view>
						<view>
							<text class="active-level">{{ selectedLevel.minGrowthValue }}{{ selectedLevel.maxGrowthValue >0 ? ' - ' + selectedLevel.maxGrowthValue : '+' }}</text>
						</view>
					</view>
				</view>
			</view>
				
			<!-- 用户选中成长等级的等级权益 -->
			<view class="weui-cell weui-cell_hide_line">
				<view class="weui-cell__bd">
					<view class="text-xl text-black padding-bottom-sm">
						等级权益：
					</view>
					<view class="weui-flex active-level">
						<block v-for="item in selectedLevel.bonus" :key="bonus.name">
							<view class="weui-flex__item">
								<view class="cu-avatar lg round bg-white line-selectedLevel-icon solids">
									<text v-if="item.desc.length > 0" class="avatar-text">{{item.desc}}</text>
									<view v-if="item.desc.length <= 0" class="text-xl">
										<text class="icon-edit"></text>
									</view>
								</view>
								<view></view>
								<view>{{item.name}}</view>
							</view>
						</block>
					</view>
				</view>
			</view>
				
			<!-- 用户选中成长等级的升级说明 -->
			<view v-if="selectedLevel.minGrowthValue - myInfo.growthValue > 0" class="weui-cell weui-cell_hide_line">
				<view class="weui-cell__bd">
					<view>
						还差
						<text class="line-selectedLevel-icon"> {{selectedLevel.minGrowthValue - myInfo.growthValue}} </text>成长值就能成为
						<text class="line-selectedLevel-icon"> {{selectedLevel.title}}</text>，加油！
					</view>
				</view>
			</view>
				
			<!-- 成长值获取规则说明 -->
			<view class="weui-cell weui-cell_hide_line">
				<view class="weui-cell__bd">
					<view class="text-xl text-black padding-bottom-sm">【成长值获取规则】</view>
					<view class="growth-rules">
						<view>通过微信运动步数同步，积分换购，发表文章获得成长值，具体规则如下：</view>
						<view>1. 微信运动每同步1步，获得1成长值</view>
						<view>2. 积分购买商品，每消耗1积分，获得1成长值（不包含购买小M卡会员消耗的积分）</view>
						<view>3. 每发表1篇笔记，获得1000成长值</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			levels: Array,
			selectedLevel: Object,
			selectedId: String | Number
		},
		data() {
			return {
			}
		},
		methods: {
			onLevelItemClick (id) {
				this.$emit('on-item-click', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
.level_list_container {
	display: flex;
	flex-wrap: nowrap;
	justify-content: center;
	.level_tab_item {
		width: 40rpx;
	}
}
.active-level {
	color: $mk-base-color;
}
.growth-rules {
	text-align: left;
}
</style>
