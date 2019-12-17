const express = require('express');
const router = express.Router();

// @route  GET     api/profile
// @Description    Test Router
// @assess         Public
router.get('/', (req, res) =>{
    res.send('Profile Router')
})


module.exports = router;