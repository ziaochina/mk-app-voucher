/**
 * mock.js 提供应用截获ajax请求，为脱离后台测试使用
 * 模拟查询更改内存中mockData,并返回数据
 */

import { fetch } from 'mk-utils'
const mockData = fetch.mockData

function initMockData() {
    if (!mockData.vouchers) {
        mockData.vouchers = []
        for (let i = 0; i < 5; i++) {
            mockData.vouchers.push({
                id: i,
                name: '诸葛' + (i + 1),
                sex: i % 2 + '',
                birthday: `1980-${i % 11 + 1}-${i % 28 + 1}`,
                mobile: '13818181' + (100 + i),
                married: i % 2 == 0 ? true : false,
                education: { id: i % 2 + '', name: i % 2 == 0 ? '本科' : '专科' },
                signature: '诸葛' + (i + 1) + ' good!'

            })

            mockData.vouchers[i].details = []
            mockData.vouchers[i].details.push({
                id: 0,
                name: '公孙' + (i + 1),
                rela: { id: '0', name: '夫妻' },
                mobile: '13817181' + (100 + i),
                birthday: `1983-${i % 11 + 1}-${i % 28 + 1}`,
            })
        }
    }
}

fetch.mock('/v1/voucher/init', (option) => {
    initMockData()

    return {
        result: true,
        value: {
            voucher: (option.id || option.id == 0) ? mockData.vouchers.find(o => o.id == option.id) : undefined,
            educations: [{
                id: '0',
                name: '本科'
            }, {
                id: '1',
                name: '专科'
            }],
            relas: [{
                id: '0',
                name: '夫妻'
            }, {
                id: '1',
                name: '父母'
            }, {
                id: '2',
                name: '子女'
            }]
        }
    }
})

fetch.mock('/v1/voucher/findById', (option) => {
    initMockData()
    const voucher = mockData.vouchers.find(o => o.id == option.id)
    return {
        result: true, value: voucher
    }
})


fetch.mock('/v1/voucher/prev', (option) => {
    initMockData()
    if (option.id == 0)
        return { result: true, value: mockData.vouchers[0] }

    if (option.id) {
        const index = option.id - 1 < 0 ? 0 : option.id - 1
        return { result: true, value: mockData.vouchers[index] }
    }
    return { result: true, value: mockData.vouchers[mockData.vouchers.length - 1] }
})


fetch.mock('/v1/voucher/next', (option) => {
    initMockData()
    if (option.id || option.id == 0) {
        const index = option.id + 1 > mockData.vouchers.length - 1 ? mockData.vouchers.length - 1 : option.id + 1
        return { result: true, value: mockData.vouchers[index] }
    }
    return { result: true, value: mockData.vouchers[mockData.vouchers.length - 1] }
})


fetch.mock('/v1/voucher/update', (option) => {
    initMockData()
    option.details.forEach((o, index) => o.id = index)
    mockData.vouchers[option.id] = option
    return { result: true, value: option }
})



