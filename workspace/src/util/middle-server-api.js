'use strict';

import { middleServerURL } from '../static/app';
import rsa from './rsa';
import createLoger from './createLoger';
import { ToastAndroid } from 'react-native';

let loger = createLoger('#a68bff');

// 서버에서 받은 공개키와 공개키 갱신주기 값
let rsaInfo = {
    N        : 0,
    e        : 0,
    interval : 0
};

// 공개키 설정 시간
let publicKeySetTime = 0;

async function post(url, send){
    ToastAndroid.show('통신중...', ToastAndroid.SHORT)
    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(send)
        });
        let responseJson = await response.json();
        return responseJson;
    } catch(error) {
        ToastAndroid.show('통신 오류', ToastAndroid.SHORT)
    }
}

async function rsaPost(op, message){
    return _rsaPost();

    async function _rsaPost(){
        let data;
        loger('send Data', message);
        if(+new Date() - publicKeySetTime >= rsaInfo.interval){
            // 키 재설정 시간(interval)이 지났을시 공개키를 받는다.
            loger('url', '/rsa/get');
            data = await post(`${middleServerURL}/rsa/get`);
        }else{
            loger('url', `/rsa/${op}`);
            data = await post(`${middleServerURL}/rsa/${op}`, {
                rsaInfo,
                screetData: await rsa.incodeJSON(message, rsaInfo.e, rsaInfo.N) //암호화
            });
        }
        loger('get data', data);
        if(data.state == 'rsaInfo'){
            // 공개키 재설정후 서버에 재요청
            publicKeySetTime = +new Date();
            rsaInfo = data.rsaInfo;
            return _rsaPost();
        }else{
            return data;
        }
    }
}

async function userPost(op, loginInfo, data = {}){
    let req = await rsaPost(`user/${op}`, {loginInfo, data})
    if(req.loginFailed){
        //@TODO Error 처리
        throw new Error('message');
    }

    return req;
}

export default {
    rsaPost, userPost
}
