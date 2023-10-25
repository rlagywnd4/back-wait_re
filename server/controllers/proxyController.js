const {Proxy} = require('../models');

const input = {
    // 프록시가 자신의 정보를 등록하는 코드
    postRegister : async (req,res)=>{
        //프록시 생성시에 등록될 정보들
        const postProxy = await Proxy.create({
            id : req.body.id,
            proxyAddress : req.body.proxyAddress,
            gender : req.body.gender,
            age : req.body.age,
            proxyMsg : req.body.proxyMsg,
        });
        return res.send(postProxy);
    },

    // 등록한 프록시 정보를 업데이트 하는 코드
    updateProxy : async (req,res)=>{
        const updateProxy = await Proxy.update({
            proxyAddress : req.body.proxyAddress,
            gender : req.body.gender,
            age : req.body.age,
            proxyMsg : req.body.proxyMsg,
        },
        {
            where : {id : req.params.id},
        }
        );

        return res.send(updateProxy);
    },
    
    // 등록한 프록시를 삭제하는 코드
    deleteRegister : async (req,res)=>{
        const deleteProxy = await Proxy.destroy({
            where : {proxyId : req.params.proxyId},
        });
        res.send({message : deleteProxy});
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

    // proxy 
    getProxyOne : async (req,res)=>{
        const proxy = await Proxy.findOne({
            where : { proxyId : req.params.proxyId},
        });
        console.log('여기는 프록시 입니다' + proxy);
        return res.send(proxy);
    }
}

module.exports = {input, output};