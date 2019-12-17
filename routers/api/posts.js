const express = require('express');
const router = express.Router();

// @route  GET     api/post
// @Description    Test Router
// @assess         Public
router.get('/', (req, res) =>{
    res.send('Post Router')
})


module.exports = router;