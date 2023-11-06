const {Proxy, WaitMate} = require('../models');
const Room = require('../schema/Room');
const ChatData = require('../schema/ChatData');
const jwt = require('jsonwebtoken');
const Common = require('../common');
const { Op } = require('sequelize');

const input = {
    //프록시 테스트용
    postRegisterTest : async (req,res)=>{
        try{
            console.log('포토값' + req.file.filename);
            if(req.body.photo === null){
                const postProxy = await Proxy.create({
                    id: req.body.id,
                    title : req.body.title,
                    proxyAddress: req.body.proxyAddress,
                    gender: req.body.gender,
                    age: req.body.age,
                    proxyMsg: req.body.proxyMsg,
                    photo : 'http://localhost:8080/public/proxyImg/default.png',
                 });
                return res.send(postProxy);
            } else if(req.body.photo !== null){
                const postProxy = await Proxy.create({
                    id: req.body.id,
                    title : req.body.title,
                    proxyAddress: req.body.proxyAddress,
                    gender: req.body.gender,
                    age: req.body.age,
                    proxyMsg: req.body.proxyMsg,
                    photo : 'http://localhost:8080/public/proxyImg/' + req.file.filename,
                 });
                return res.send(postProxy);
            }
            
        } catch(err){
            console.error(err);
        }
    },

    // 프록시가 자신의 정보를 등록하는 코드
    postRegister : async (req,res)=>{
        //프록시 생성시에 등록될 정보들
        try {
            const userInfo = Common.cookieUserinfo(req);
            if (!userInfo) {
                res.status(401).json({ message: '로그인을 먼저 해주세요' });
            } else {
                    // 프록시 조회
                    const selectAll = await Proxy.findAll();
                    const idArray = selectAll.map(item => item.id);

                    // 이미 등록된 글이 있는지 확인
                    if (idArray.includes(userInfo.id)) {
                         res.status(402).json({ message: '이미 등록하신 글이 있습니다' });
                    } else {
                      // 등록 가능한 경우 프록시 생성
                    if(req.body.photo === undefined){
                        const postProxy = await Proxy.create({
                            id: req.body.id,
                            proxyAddress: req.body.proxyAddress,
                            gender: req.body.gender,
                            age: req.body.age,
                            proxyMsg: req.body.proxyMsg,
                            title : req.body.title,
                            photo : 'http://localhost:8080/public/proxyImg/default.png'
                         });
                        return res.send(postProxy);
                    } else{
                        const postProxy = await Proxy.create({
                            id: req.body.id,
                            proxyAddress: req.body.proxyAddress,
                            gender: req.body.gender,
                            age: req.body.age,
                            proxyMsg: req.body.proxyMsg,
                            title : req.body.title,
                            photo : 'http://localhost:8080/public/proxyImg/' + req.file.filename,
                         });
                        return res.send(postProxy);
                    }
                    
                    }           
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
        }
    },



    // 등록한 프록시 정보를 업데이트 하는 코드
    updateProxy : async (req,res)=>{
        try {
            const userInfo = Common.cookieUserinfo(req);
            if (!userInfo) {
                res.status(401).json({ message: '로그인을 먼저 해주세요' });
            } else {
                const updateProxy = await Proxy.update({
                proxyAddress : req.body.proxyAddress,
                gender : req.body.gender,
                age : req.body.age,
                proxyMsg : req.body.proxyMsg,
                 },
                {
                where : {id : userInfo.id},
                });
            return res.send(updateProxy);
             }
        } catch(err){
            console.error(e);
            res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
        }
    },
    
    // 등록한 프록시를 삭제하는 코드
    deleteRegister : async (req,res)=>{
        try{
            const userInfo = Common.cookieUserinfo(req);
            if(!userInfo){
                res.status(401).json({message: '로그인을 먼저 시도하십시오'});
            } else {
                const deleteProxy = await Proxy.destroy({
                where : {id : userInfo.id},
                });
            res.send({message : deleteProxy});   
            }
        } catch(err){
            console.error(err);
            res.status(500).json({message: '알 수 없는 서버 에러입니다.'});
        }
    },

    // 프록시 사진 등록하는 방법
    postImgProxy : async(req,res)=>{
        try{
            const userInfo = Common.cookieUserinfo(req);
            if(!userInfo){
                res.status(401).json({message : '로그인을 먼저 진행해 주세요'});
            } else {
                       const proxyInfo = await Proxy.findOne({
                        where : {id: {id : userInfo.id}},
                       });

                       if(proxyInfo.photo === 'null'){
                        await Proxy.update({
                            photo : '/public/proxyImg/default.jpg',
                        }, {
                            where : {id : {id : userInfo.id}}
                        });
                       } else {
                        await Proxy.update({
                            photo : '/public/proxyImg/' + req.file.filename,
                        }, {
                            where : {id : {id : userInfo.id}}
                        });
                       }
            }
        } catch(err){
            console.error(err);
            res.status(500).json({message : '알 수 없는 서버 에러입니다.'});
        }
    },

    mongooseTest: async (req, res) => {
        try {
            const newRoom = new Room({
                wmId: req.body.wmId,
                proxyId: req.body.proxyId,
            });
    
            const room = await newRoom.save(); // 비동기로 저장하고 결과를 받음
            console.log('room 저장 성공', room);
            res.status(201).json(room); // 성공 응답 보내기
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: '방 생성 실패' }); // 오류 응답 보내기
        }
    }
}

const output = {
        // proxy 정보들을 확인하는 방법
    getProxyAll: async (req, res) => {
        const { address, order } = req.query;
        console.log(address, order);
        const proxyAddress = await Proxy.findAll({
        where: {
            proxyAddress: {
            [Op.like]: `%${address}%`,
            },
        },
        order: [[order, 'DESC']],
        });
        res.send({list: proxyAddress});
    },

    // 특정한 구의 정보값들을 불러오는 방법
    getAddressAll : async (req,res)=>{
        try{
        const userInfo = Common.cookieUserinfo(req);
        if(!userInfo){
            res.status(401).json({message : '로그인을 먼저 진행해 주세요'});
        } else{
            const result = await WaitMate.findOne({
                where : {id : userInfo.id}
            });
            const proxyList = await Proxy.findAll({
                where : {proxyAddress : result.wmAddress}
            });
            if(proxyList){
                res.status({list: proxyList})
            }
        }
        } catch(err){
            console.error(err);
            res.status(500).json({message : '연결하지 못했습니다'});
        }
    },

    // proxy 하나의 정보를 가져오는 값
    getProxyOne : async (req,res)=>{
        const proxy = await Proxy.findOne({
            where : { proxyId : req.params.proxyId},
        });
        console.log('여기는 프록시 입니다' + proxy);
        return res.send({result : proxy});
    },

    // 자신의 채팅방 목록을 가져오는 코드
    getChattingList: async (req, res) => {
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (userInfo) {
        const resultList = await Room.find({
          $or: [
            { sender: userInfo.id },
            { receiver: userInfo.id }
          ]
        });
        // 정보가 있는 경우
        if (resultList && resultList.length > 0) {
          res.send({ list: resultList });
        } else {
          // 정보가 없는 경우
          res.send({ message: '채팅방 목록이 없습니다.' });
        }
      } else {
        // userInfo가 없는 경우
        res.send({ message: '사용자 정보를 찾을 수 없습니다.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: '서버 오류 발생' });
    }
  }
}

module.exports = {input, output};