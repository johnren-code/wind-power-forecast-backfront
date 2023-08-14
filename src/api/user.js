import http from '@http/http'
export const _getUserInfo = (errMsg) => http.GET('/api/auth/userInfo', {}, errMsg)

export const userExport = (user) => http.EXPORT('/api/user/exportUser', user)

export const feedbackExport = (feedback) => http.EXPORT('/api/feedback/exportFeedback', feedback)

export const userUpdate = (user) => http.POST('/api/user/update', user)
