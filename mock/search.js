import Mock from 'mockjs'

export default [
    {
        url: '/api/search',
        method: 'get',
        timeout: 1000,
        response: (req, res) => {
            const keyword = req.query.keyword; // 获取关键字
            let num = Math.floor(Math.random() * 10); // 随机生成0-9的数字
            let list = [];
            for (let i = 0; i < num; i++) {
                const randomData = Mock.mock({
                    title: '@ctitle(3, 8)'
                })
                list.push(`${randomData.title}${keyword}`)
            }
            return {
                code: 0,
                data: list,
            }
        }
    }
]