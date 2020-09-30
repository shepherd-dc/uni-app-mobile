import { uniID } from '@/utils/request'

// 登录
export const loginByWeixin = async (params) => {
	return await uniID('loginByWeixin', params)
}

// 退出登录
export const logout = async (params) => {
	return await uniID('logout', params)
}
