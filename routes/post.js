//router 생성하는데 필요한 코드 (이하 2줄)
const express = require('express');
const router = express.Router();
const Posts = require('../models/post');
require('dotenv').config();
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../S3/s3');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();                                                                                                               

router.get('/', (req, res) => {
    res.send('this is root page');
});

//리스트 페이지 불러오기
router.get('/listPage', async (req, res) => {
  const posts = await Posts.find();
  const posts1 = posts.reverse();
  res.json({
      post: posts1,
  });
});


//호스트 게시글 작성
router.post('/hostAdd', authMiddleware, upload.array('postImg', 5), // 이미지 여러개 받기 최대5장
  async (req, res) => {
    const today = new Date();
    const date = today.toLocaleString();
    const { user } = res.locals.user;
    console.log(user)
    const email = res.locals.user.email;
    const nickName = res.locals.user.nickName;
    const userProfile = res.locals.user.userProfile;
    const { postTitle, postDesc, postCharge, address, room, wifi, laundry, parkinglot, latitude, longitude } = req.body;    
    const postImg = [];
    console.log(req.body);
    for (let i = 0; i < req.files.length; i++) {
      postImg.push(req.files[i]?.location);
    }
    console.log(postImg)
    try {
      await Posts.create({
        email,
        userProfile,
        date,
        nickName,
        postTitle, 
        postDesc, 
        postCharge, 
        address,
        room, wifi, laundry, parkinglot,
        latitude: Number(latitude),
        longitude: Number(longitude),
        postImg,
      });
      res.status(200).send({
        message: '호스트 게시글이 등록되었습니다.',
      });
    } catch (err) {
      res.status(400).send({
        message: '호스트 게시글 등록이 실패했습니다.',
      });
    }
  }
);


//호스트 게시글 수정
router.post( '/hostUpdate/:postId', authMiddleware, upload.array('postImg', 5), async (req, res, next) => {
    const { user } = res.locals.user;
    const email = res.locals.user.email;
    const nickName = res.locals.user.nickName;
    const userProfile = res.locals.user.userProfile;
    const today = new Date();
    const date = today.toLocaleString();
    const { postTitle, postDesc, postCharge, address, room, wifi, laundry, parkinglot, coordinates } = req.body;

    //새로 받아온 사진 (배열로 받아옴)
    const postImg = [];
    const newImgName = [];
    for (let i = 0; i < req.files.length; i++) {
      postImg.push(req.files[i]?.location);
      newImgName.push(postImg[i].split('_')[1]);
    }

    //기존 이미지 처리
    const { postId } = req.params;
    const o_id = new Object(postId);
    const [detail] = await Posts.find({ _id : o_id }); 
    console.log(detail)
    const deleteImg = [];
    const existingImgURL = [];
    for (let i = 0; i < detail.postImg.length; i++) {
      existingImgURL.push(detail.postImg[i]);
      deleteImg.push(existingImgURL[i].split('_')[1]);
    }
    console.log(existingImgURL)
    
    for (let i = 0; i < detail.postImg.length; i++) {
      if (deleteImg === newImgName) {
        s3.deleteObject({
          Bucket: 'imagesofairbnb',
          Key: `${existingImgURL[i]}`
        }, (err, data) => {
          console.log(err)
          if (err) { 
            throw err
          }
        });
      }
    }
    try {
        await Posts.updateOne(
            { _id: o_id },
            { $set: {
              email,
              nickName,
              userProfile,
              date, 
              postTitle, 
              postDesc, 
              postCharge, 
              address, 
              room, wifi, laundry, parkinglot, 
              coordinates, 
              postImg 
            }
        });
        res.status(200).send({
          message: '수정 완료',
        });
    } catch (err) {
      res.status(400).send({
        message: '수정 실패',
      });
    }
  }
);


//호스트 게시글 삭제
router.delete('/postDelete/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const o_id = new Object(postId)
    const existsPosts = await Posts.find({ _id : o_id });
    if (existsPosts.length) {
        await Posts.deleteOne({ _id : o_id });
    }
    const existsComments = await Comments.find({ postId: o_id });
    if (existsComments.length) {
        await Comments.deleteMany({ postId: o_id });
    }

    res.status(200).send({
      message: '삭제 완료',
    });
});

module.exports = router;