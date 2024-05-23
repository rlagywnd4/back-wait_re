// 멀터 설정
const multer = require('multer');
const path = require('path'); //경로에 관한 내장 모듈

//업로드 코드
exports.uploadImg = (folderName) => {
  return multer({
    storage: multer.diskStorage({
      destination(req, res, done) {
        done(null, `public/${folderName}/`);
      },
      filename(req, file, done) {
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};
