//Library
const express = require('express')
const router = express.Router()

//importing models
const Post=require('../models/Posts');
const User=require('../models/Users');
const Comment=require('../models/Comments')
const Like=require('../models/Like')

//importing verify token
const verifyToken=require('../verifyToken')

//localhost:3000/post/

//get all post
router.get('/',verifyToken,async(req,res)=>{
  let data=await Post.aggregate([
    {
      $project: {
        _id: {
          $toString: "$_id"
        },
        content: "$content",
        user: "$user",
        date: '$date',
        title:"$title"

      }
    },
    {

      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
    {

      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments"
      }
    },{
      $sort:{date:-1}
    },
    {
      $sort: {likes: -1 }
    },
    {
      $project: {
        likes: { $size: "$likes" },
        comment:"$comments",
        content: "$content",
        user: "$user",
        date: '$date',
        title:"$title"


      }
    }
  ])
 return res.send(data)
})


//get single post
router.get('/:id',verifyToken,async(req,res)=>{
  const {id}=req.params;
  let post=await Post.findOne({_id:id})
  return res.send(post)
})

//update single post
router.put('/:id',verifyToken, async(req,res)=>{
  const {id}=req.params;
  const data=req.body;
  const post = await Post.findById(id);
  if (!post) {
    return res.json({ 'error': 'post not found' }).status(400)
  }
  if (post.user !== req.user._id) {
    return res.json({ 'error': "you are not post author!" }).status(400)
  }
  //It will update the post in MongoDB
  await Post.findOneAndUpdate({_id:id},data)

  return res.send(post);
})

//delete single post
router.delete('/:id',verifyToken, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return res.json({ 'error': 'post not found' }).status(400)
  }
  if (post.user !== req.user._id) {
    return res.json({ 'error': "you are not post author!" }).status(400)
  }
  //it find the post and it will update the same post
  await Post.findOneAndDelete({_id:id})
  return res.sendStatus(204)
})


//create post
router.post('/',verifyToken,(req,res)=>{
  const {content,title}=req.body;
  const obj=new Post({
    content:content,
    user:req.user,
    title:title,
  });
  obj.save()
    .then(() =>{return res.send(obj).status(201)})
    .catch(err => { return res.send(err).status(400) })
})

// add api for comment
router.post('/comment', verifyToken, async(req, res) => {
  const { id,comment } = req.body;
  const post=await Post.findById(id);
  if(!post){
    return res.json({'error':'post not found'}).status(400)
  }
  if(post.user==req.user._id){
    return res.json({'error':"post author can't add comment on there posts !!"}).status(400)
  }
  const obj = new Comment({
    content: comment,
    user: req.user,
    post:id
  });
  obj.save()
    .then(() => { return res.send(obj).status(201) })
    .catch(err => { return res.send(err).status(400) })
})


//add api for likes
router.get('/like/:id',verifyToken,async(req,res)=>{
  let {id}=req.params
  let like=await Like.findOne({post:id,user:req.user._id})
  const post = await Post.findById(id);
  if (!post) {
    return res.json({ 'error': 'post not found' }).status(400)
  }
  console.log(post.user ,req.user._id)
  if (post.user == req.user._id) {
    return res.json({ 'error': "post author can't add like on there posts !!" }).status(400)
  }
  if(like==null){
    let newLike = new Like({ post: id, user: req.user._id })
    newLike.save()
  }else{
    console.log("deleting",like._id.toString())
    like.delete()
  }
  return res.send(200)
})


//exporting router
module.exports = router;
