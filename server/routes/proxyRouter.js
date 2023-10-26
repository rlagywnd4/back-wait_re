const express = require('express');
const multer = require('multer');
const proxyRouter = express.Router();
const proxyController = require('../controllers/proxyController');

//업로드 코드
const uploadProxy = multer({
    storage : multer.diskStorage({
        destination(req,res,done) {
            done(null, 'public/proxyImg/');
        },
        filename(req,file,done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits : {fileSize: 5 * 1024 * 1024},
});

//프록시 글 등록
proxyRouter.post('/register', proxyController.input.postRegister);

//프록시 글 리스트 뽑아오기
proxyRouter.get('/getter', proxyController.output.getProxyAll);
//프록시 특정 글 보기
proxyRouter.get('/getter/:proxyId', proxyController.output.getProxyOne);

//등록된 프록시를 변경
proxyRouter.patch('/update/:id', proxyController.input.updateProxy);
//등록된 프록시를 삭제
proxyRouter.delete('/delete/:id', proxyController.input.deleteRegister);
// 프록시 이미지 등록
proxyRouter.post('/imgUpload', uploadProxy.single(), proxyController.input.postImgProxy);

module.exports = proxyRouter;