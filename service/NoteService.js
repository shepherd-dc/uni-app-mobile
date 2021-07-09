import uploadFiles from '@/utils/upload'
import {
	db,
	dbCmd as _
} from '@/utils/request'

/**
 *笔记数据操作类
 *@class NoteService
 *@constructor
 */
class NoteService {
	/**
	 * 构造函数
	 */
	constructor() {
		this.listIndex = 0 //分页获取数据的当前页索引
		this.pageCount = 10 //每次分页获取多少数据
	}

	/**
	 * 添加用户笔记到数据库
	 * @method postNote
	 * @for NoteService
	 * @param {string} content 笔记文字
	 * @param {array} imageList 笔记图片地址列表
	 * @param {function} successCallback() 处理数据查询结果的回调函数
	 */
	async postNote(formData, imageList) {
		if (imageList.length > 0) {
			//如果包含图片，先上传图片到云存储
			const files = await uploadFiles(imageList)
			formData.images = files
		}
		return this._addNote(formData)
	}

	/**
	 * 私有方法-发表笔记到云开发数据库
	 * @method _addNote
	 * @for NoteService
	 * @param {object} note 笔记
	 * @param {function} successCallback() 处理数据查询结果的回调函数
	 */
	async _addNote(formData) {
		//调用云函数执行发表笔记操作
		uni.showLoading({
			title: '笔记保存中',
			mask: true
		})
		try {
		  const res = await uniCloud.callFunction({
		    name: 'postNote', // 云函数名字
				data: formData // 传输数据
		  })
		  return res.result
		} catch (e) {
		  console.error(e) // eslint-disable-line
		  uni.showModal({
		  	content: e.message || '云函数请求失败',
		  	showCancel: false
		  })
		} finally {
		  uni.hideLoading()
		}
	}
}

export default NoteService
