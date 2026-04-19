import request from '@/utils/request'

const pdfApi = {

    // 获取 PDF 文件树（两级结构：目录 -> PDF 文件）
    getTree() {
        return request.get('/pdf/tree')
            .then(res => res.data)
            .catch(err => {
                console.error('获取 PDF 目录树失败:', err)
                return []
            })
    },
}

export default pdfApi