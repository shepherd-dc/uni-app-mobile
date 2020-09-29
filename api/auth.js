import { uniID } from '@/utils/request'

// 登录
export const loginByWeixin = async (params) => {
	return await uniID('loginByWeixin', params)
}