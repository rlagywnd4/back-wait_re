const {User, Review} = require('../models');
const Common = require('../common')


exports.createReview = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message : '로그인을 먼저 진행해 주세요' });
      return ;
    };
    let {score, id} = req.body;
    score = Number(score);
    id = Number(id);
    const user = await User.findOne({
      where : { id }, 
      attributes : ['userId', 'score']
    });
    if (!score) {
      res.status(400).json({ message : '점수가 존재하지 않습니다.' });
      return ;
    };
    if (!user) {
      res.status(400).json({ message : '리뷰의 대상이 정해져 있지 않습니다.' });
      return ;
    };
    const reviewData = {id, score};
    const review = await Review.create({...reviewData, writerId : userInfo.id});
    if (review) {
      const { count, _ } = await Review.findAndCountAll({
        where: { id },
      });
      const oldScore = user.dataValues.score;
      await User.update({
        score : ((oldScore * (count - 1)) + score) / count
      }, {
        where : { id }
      })
      res.status(201).json({ message : '리뷰가 정상적으로 생성되었습니다.'});
    } else {
      throw new Error();
    };
  } catch (err) {
    console.log(err);
    res.status(500).json({ message : '알 수 없는 서버 에러' });
  };
};
exports.getReview = async (req, res) => {
  try {
    const reviewId = req?.params?.reviewId;
    if (!reviewId) {
      res.status(404).json({ message : '존재하지 않는 리뷰입니다.'});
      return ;
    };
    const review = await Review.findOne({
      where : { reviewId }
    });
    res.status(200).json({ review });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message : '알 수 없는 서버 에러' });
  }
};
exports.updateReview = (req, res) => {
  try {

  } catch (err) {
    console.log(err);
    res.status(500).json({ message : '알 수 없는 서버 에러' });
  }
};
exports.deleteReview = (req, res) => {
  try {

  } catch (err) {
    console.log(err);
    res.status(500).json({ message : '알 수 없는 서버 에러' });
  }
};