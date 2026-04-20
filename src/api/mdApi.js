import request from '@/utils/request'

const mdApi = {

    // 获取目录树（MdNode列表）
    getTree() {
        return request.get('/md/tree')
            .then(res => res.data) // 解析CommonResult的data字段
            .catch(err => {
                console.error('获取目录树失败:', err)
                return []
            })
    },

    // 获取MD文件内容
    getContent(path) {
        return request.get('/md/content', { params: { path } })
            .then(res => res.data)
            .catch(err => {
                console.error(`获取文件[${path}]失败:`, err)
                return '文件加载失败，请检查路径是否正确'
            })
    }
}

export default mdApi