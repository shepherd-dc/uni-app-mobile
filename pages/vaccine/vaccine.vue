<template>
  <view class="vaccine">
    <view class="header">
      <view
        class="add"
        @tap="toAdd">
        <uni-icons
          type="plusempty"
          size="16"></uni-icons>
        <text>添加自费</text>
      </view>
      <view class="tip">
        <text>接种须知</text>
      </view>
    </view>
    <view class="body">
      <xc-list
				ref="vaccineList"
        :list="list"
        @done="vaccineDone" />
    </view>
		<uni-calendar 
			ref="calendar"
			:insert="false"
			@confirm="confirm"
			@close="close" />
		<uni-popup
			ref="popup"
			type="dialog" >
		    <uni-popup-dialog
					type="success"
					title="温馨提示"
					content="完善宝宝信息，以获得更贴心的服务"
					:before-close="true"
					@close="popupClose"
					@confirm="popupConfirm" >
				</uni-popup-dialog>
		</uni-popup>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { loginCheck } from '@/utils/loginCheck'
import { getMonthAddedDate } from '@/utils/datetime'
import { getVaccineList, doVaccine, undoVaccine } from '@/service/vaccine'
import { getBabyInfo } from '@/service/info'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog'
export default {
	components: {
		uniPopupDialog
	},
  onLoad () {
	  loginCheck()
  },
  async onShow () {
	  if (this.hasLogin) {
			if (!this.birthday) await this.getBabyBirthday()
			this.getVaccineList()
		}
  },
  data () {
    return {
      list: [],
      done: false,
			doneVaccine: {}
    }
  },
  computed: mapState(['hasLogin', 'birthday']),
  methods: {
		...mapMutations(['saveBabyInfo']),
    async getVaccineList () {
      // 未添加自费时, 默认只显示免费
      const res = await getVaccineList(0) // type: 0 免费
      console.log('getVaccineList', res)
      const { data } = res
      this.list = data.map(item => {
				if (this.birthday) {
					item.birthday = getMonthAddedDate(this.birthday, item.month)
				}
				return item
			})
    },
		async getBabyBirthday () {
		  const res = await getBabyInfo()
		  console.log('getBabyInfo', res)
		  const { data } = res
		  if (data.length) {
				// TODO 目前只支持一个宝宝
				const baby = data[0]
				this.saveBabyInfo(baby.birthday)
			} else {
				this.$refs.popup.open()
			}
		},
    async vaccineDone (v) {
			this.doneVaccine = v
      if (v.done) {
        await undoVaccine(v._id)
        this.doneLoading = false
        this.done = false
				this.getVaccineList()
      } else {
				this.$refs.calendar.open()
      }
    },
		async confirm(e) {
			const v = this.doneVaccine
			const date = e.fulldate
			v.done_time = date
			await doVaccine(v)
			// TODO: 添加成功后，前端自行处理，不请求刷新列表
			this.done = true
			this.getVaccineList()
		},
		close () {
			console.log('close calendar', this.doneVaccine)
			for (let l of this.list) {
				for (let v of l.vaccine) {
					if (this.doneVaccine._id === v._id) {
						this.$set(v, 'done', false)
					}
				}
			}
		},
		/**
		 * 点击取消按钮触发
		 * @param {Object} done
		 */
		popupClose (done) {
			console.log('cancel')
			// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 done 才会关闭对话框
			// ...
			done()
		},
		/**
		 * 点击确认按钮触发
		 * @param {Object} done
		 * @param {Object} value
		 */
		popupConfirm (done) {
			this.$navigateTo('/info/info')
			done()
		},
    toAdd () {
      this.$navigateTo('/vaccine/add')
    }
  }
}
</script>

<style lang="less" scoped>
.vaccine {
	height: 100%;
	width: 100%;
	background-color: #f8f8f8;
	padding-top: 90rpx;
}
.header {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	width: 100%;
	box-sizing: border-box;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	padding: 20rpx;
	border-bottom: 8rpx solid #f8f8f8;
	.tip {
		color: #56ceab;
	}
}
/deep/.uni-dialog-button-text.uni-button-color {
	color: #4cd964;
}
</style>
