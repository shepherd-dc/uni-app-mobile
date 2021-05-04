<template>
	<view class="xc-level">
		<!-- 显示用户等级图标及成长值 -->
		<view class="level-icon">
			当前等级：
			<text class="active-level">{{ myLevel.title }}</text>
		</view>
		<view class="growth-value">
			当成长值：
			<text class="active-level">{{ myInfo.growthValue }} </text>
		</view>
		
		<!-- 显示用户当前等级权益 -->
		<view class="weui-cell__bd">
			<view class="text-xl text-black padding-bottom-sm">
				我的权益：
			</view>
			<view class="weui-flex active-level">
				<block v-for="item in myLevel.bonus" :key="item.name">
					<view class="weui-flex__item">
						<view class="cu-avatar xl round bg-white solids">
							<text v-if="item.desc.length > 0" class="avatar-text">{{item.desc}}</text>
							<view v-if="item.desc.length <= 0" class="text-sl">
								<text class="icon-edit"></text>
							</view>
						</view>
						<view>{{item.name}}</view>
					</view>
				</block>
			</view>
		</view>
		
		<!-- 显示用户等级升级说明 -->
		<view v-if="growthValueToNextLevel > 0" class="weui-cell weui-cell_hide_line">
			<view class="weui-cell__bd">
				<view>
					还差
					<text class="active-level"> {{growthValueToNextLevel}} </text>成长值就能成为
					<text class="line-nextLevel"> {{nextLevel.title}}</text>，加油！
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			myLevel: Object,
			myInfo: Object,
			growthValueToNextLevel: Number,
			nextLevel: Object
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss" scoped>
.xc-level {
	text-align: left;
	margin: 40rpx 0;
}
.active-level {
	color: $mk-base-color;
}
</style>
