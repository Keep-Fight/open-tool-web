import request from '@/utils/request'



export const toolApi = {

    // 通过域名获取IP地址
    getIpAddress(domain) {
        return request.get('/tool/ipAddress',{params:{domain}} )
            .then(res => res.data)
            .catch(err => {
                console.error('获取IP地址失败:', err)
                return '获取IP地址失败'
            })
    }

}