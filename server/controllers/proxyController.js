const {Proxy} = require('../models');
const jwt = require('jsonwebtoken');

const input = {
    // 프록시가 자신의 정보를 등록하는 코드
    postRegister : async (req,res)=>{
        //프록시 생성시에 등록될 정보들
        try {
            const access = req.cookies?.access;
            if (!access) {
                res.status(401).json({ message: '로그인을 먼저 해주세요' });
            } else {
                await jwt.verify(access, process.env.SECRET_KEY, async (err, decoded) => {
                    if (err) {
                        res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
                    } else {
                        // 프록시 조회
                        const selectAll = await Proxy.findAll();
                        const idArray = selectAll.map(item => item.id);

                        if (decoded?.id) {
                            // 이미 등록된 글이 있는지 확인
                            if (idArray.includes(decoded.id)) {
                                res.status(402).json({ message: '이미 등록하신 글이 있습니다' });
                            } else {
                                // 등록 가능한 경우 프록시 생성
                                const postProxy = await Proxy.create({
                                    id: req.body.id,
                                    proxyAddress: req.body.proxyAddress,
                                    gender: req.body.gender,
                                    age: req.body.age,
                                    proxyMsg: req.body.proxyMsg,
                                });

                                return res.send(postProxy);
                            }
                        }
                    }
                });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
        }
    },

    // 등록한 프록시 정보를 업데이트 하는 코드
    updateProxy : async (req,res)=>{
        try {
            const access = req.cookies?.access;
            if (!access) {
                res.status(401).json({ message: '로그인을 먼저 해주세요' });
            } else {
                await jwt.verify(access, process.env.SECRET_KEY, async (err, decoded) => {
                    if(err){
                        res.status(403).json({message: '유효하지 않은 토큰입니다'});
                    } else {
                        const updateProxy = await Proxy.update({
                            proxyAddress : req.body.proxyAddress,
                            gender : req.body.gender,
                            age : req.body.age,
                            proxyMsg : req.body.proxyMsg,
                        },
                        {
                            where : {id : decoded?.id},
                        }
                        );
                        return res.send(updateProxy);
                    }
                })
            }
    } catch(err){
        console.error(e);
        res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
    }
   },
    
    // 등록한 프록시를 삭제하는 코드
    deleteRegister : async (req,res)=>{
        try{
            const access = req.cookies?.access;
            if(!access){
                res.status(401).json({message: '로그인을 먼저 시도하십시오'});
            } else {
                await jwt.verify(access, process.env.SECRET_KEY, async(err, decoded)=>{
                    if(err){
                        res.status(403).json({message: '토큰을 다시 한번 제대로 발급 받으십시오'});
                    } else {
                        const deleteProxy = await Proxy.destroy({
                            where : {id : decoded?.id},
                        });
                        res.send({message : deleteProxy});
                    }
                })
            }
        } catch(err){
            console.error(err);
            res.status(500).json({message: '알 수 없는 서버 에러입니다.'});
        }
    },

    // 프록시 사진 등록하는 방법
    postImgProxy : async(req,res)=>{
        try{
            const access = req.cookies?.access;
            if(!access){
                res.status(401).json({message : '로그인을 먼저 진행해 주세요'});
            } else {
                await jwt.verify(access, process.env.SECRET_KEY, async(err,decoded)=>{
                    if(err){
                        res.status(403).json({message : '토큰을 새로 발급받으세요'});
                    } else{
                       const proxyInfo = await Proxy.findOne({
                        where : {id: {id : decoded?.id}},
                       });

                       if(proxyInfo.photo === 'null'){
                        await Proxy.update({
                            photo : '/public/proxyImg/' + req.file.filename,
                        }, {
                            where : {id : {id : decoded?.id}}
                        });
                       } else {
                        await Proxy.update({
                            photo : '/public/proxyImg/' + req.file.filename,
                        }, {
                            where : {id : {id : decoded?.id}}
                        });
                       }
                    }
                })
            }
        } catch(err){
            console.error(err);
            res.status(500).json({message : '알 수 없는 서버 에러입니다.'});
        }
    }
}

const output = {
    // proxy 정보들을 확인하는 방법
    getProxyAll : async (req,res)=>{
        const proxy = await Proxy.findAll({
            order : [['proxyId', 'DESC']],
        });
        console.log(proxy);
        return res.send(proxy);
    },

    // proxy 하나의 정보를 가져오는 값
    getProxyOne : async (req,res)=>{
        const proxy = await Proxy.findOne({
            where : { proxyId : req.params.proxyId},
        });
        console.log('여기는 프록시 입니다' + proxy);
        return res.send(proxy);
    }
}

module.exports = {input, output};