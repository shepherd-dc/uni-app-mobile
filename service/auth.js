import { uniID } from '@/utils/request'

// 登录
export const loginByWeixin = async (params) => {
	return await uniID('loginByWeixin', params)
}

// 退出登录
export const logout = async (params) => {
	return await uniID('logout', params)
}

// 校验token
export const checkToken = async (params) => {
	return await uniID('checkToken', params)
}
