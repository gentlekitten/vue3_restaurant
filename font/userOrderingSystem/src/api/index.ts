import request from '@/utils/request'

export function getData(url: string, params: any) {
    return request({
        url,
        method: 'get',
        params,
    })
}

export function upData(url: string, data: any) {
    return request({
        url,
        method: 'post',
        data
    })
}

export function deleteData(url: string, params: any) {
    return request({
        url,
        method: 'delete',
        params
    })
}

export function upLogo(url: string, data: any) {
    return request({
        url,
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}