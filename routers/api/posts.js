const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post')
const User = require('../../models/Users')
const Profile = require('../../models/Profile')

// @route          GET api/posts
// @Description    Create Post
// @assess         Private
router.post('/', [ auth, [
    check('text','Text Field Is Empty').not().isEmpty()
]], async(req, res) =>{
    
    try {
        
        const error = validationResult(req)
        if (!error.isEmpty) return res.status(400).json({ error: error.array()})

        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        })

        const post = await newPost.save();
        res.json(post)

    } catch (e) {
        console.error(e.message)
        res.status(500).json('Server Error')
    }
 
})

// @route          GET api/posts
// @Description    get all Post
// @assess         Private
router.get('/', auth, async(req, res) =>{
    try {
        const posts = await Post.find().sort({ date: -1})
        res.json(posts)
    } catch (e) {
        console.error(e.message)
        res.status(500).json({ msg:'Server Error'})
    }
})

// @route          GET api/posts/:id
// @Description    get Post By ID
// @assess         Private
router.get('/:id', auth, async(req, res) =>{
    try {

        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ msg: 'No Post Found ON This Id'})
        res.json(post)

    } catch (e) {
        console.error(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'No Post Found ON This Id'})
        }
        res.status(500).json({ msg:'Server Error'})
    }
})

// @route          Delete api/posts/:id
// @Description    get Post By ID
// @assess         Private
router.delete('/:id', auth, async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        //cheak user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Authorized'})
        }

        await post.remove();
        res.json({ msg:'Post Is Removed'})
        
    } catch (e) {
        console.error(e.message)
        if (e.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Not Authorized'})
        }
        res.status(500).json({ msg:'Server Error'})
    }
})



// @route          Put api/posts/like/:id
// @Description    like a post
// @assess         Private
router.put('/like/:id', auth, async(req,res)=>{
    try {

        const post = Post.findById(req.params.id)
        //cheak Already Liked Or Not
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post Is Already Liked'})
        }
        post.likes.unshift({ user: req.user.id})
        await post.save()
        res.json(post.likes)
        
    } catch (e) {
        console.error(e.message)
        res.status(500).json({msg:'Internal Server Error'})
    }
})


// @route          Put api/posts/unlike/:id
// @Description    like a post
// @assess         Private
router.put('/unlike/:id', auth, async(req,res)=>{
    try {

        const post = Post.findById(req.params.id)
        //cheak Already Liked Or Not
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post Is Not Liked Yet' })
        }
        
        // Get Index
        const removeIndex = post.likes.map(like => like.user.toString()).indexof(req.user.id)
        post.likes.splice(removeIndex, 1)

        await post.save()
        res.json(post.likes)
        
    } catch (e) {
        console.error(e.message)
        res.status(500).json({msg:'Internal Server Error'})
    }
})



// @route          GET api/posts/comments
// @Description    Comment on  Post
// @assess         Private
router.post('/comments/:id', [ auth, [
    check('text','Text Field Is Empty').not().isEmpty()
]], async(req, res) =>{
    
    try {
        
        const error = validationResult(req)
        if (!error.isEmpty) return res.status(400).json({ error: error.array()})

        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)

        const newCommet = {
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        }

        post.comments.unshift(newCommet)
        await post.save();
        res.json(post.comments)

    } catch (e) {
        console.error(e.message)
        res.status(500).json('Server Error')
    }
 
})


// @route          Delete api/posts/comments/:id/:comment_id
// @Description    Delete a Comment on  Post
// @assess         Private
router.delete('/comments/:id/:comment_id', auth, async(req, res) =>{
    try {
        
        const post = Post.findById(req.params.id)

        // Pull out Comment
        const comment = post.comments.find(comment => comment.id = req.user.id)
        // Cheak Commet Exist
        if (!comment) {
            return res.status(400).json({ msg: 'Comment DoesNot Exist'})
        }

        // cheak Same User
        if(comment.user.toString() !== req.user.id){
            return res.status(400).json({ msg: 'Unauthersized'})
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexof(req.user.id)
        post.comments.splice(removeIndex, 1)

        await post.save()
        res.json(post.comments)


    } catch (e) {
        console.error(e.message)
        res.status(500).json('Server Error')
    }
})


module.exports = router;