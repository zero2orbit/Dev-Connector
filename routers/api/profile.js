const express = require('express');
const router = express.Router();
const request = require('request')
const config = require('config')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile')
const User = require('../../models/Users')


// @route  GET     api/profile/me
// @Description    Get Profile
// @assess         Private
router.get('/me',auth, async (req, res) =>{
    try {
        
        const profile = await Profile.findOne({ user:req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg:'There is No Profile for this User'})
        }

        res.json(profile)

    } catch (e) {
        res.status(500).json({ msg: 'Internal Server Error'})
    }
})


// @route          POST api/profile
// @Description    Create or Update Profile
// @assess         Private
router.post('/', [auth, [
    check('status', 'Status Is Required').not().isEmpty(),
    check('skills', 'At list One Skill Is Required ').not().isEmpty()
]] , async(req, res)=>{
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array()})
    }


    const { company,website,location,bio,githubusername,status,skills,
                        youtube,facebook,twitter,instagram,linkedin } = req.body;

        // Build Profile Object
        const profileFilde = {};
        profileFilde.user = req.user.id;
        if (company) profileFilde.company = company;
        if (website) profileFilde.website = website;
        if (location) profileFilde.location = location;
        if (bio) profileFilde.bio = bio;
        if (githubusername) profileFilde.githubusername = githubusername;
        if (status) profileFilde.status = status;
        if (skills) {
            profileFilde.skills = skills.split(',').map(skill => skill.trim())
        }

        // Build Social object
        profileFilde.social ={}
        if (youtube) profileFilde.social.youtube = youtube
        if (facebook) profileFilde.social.facebook = facebook
        if (instagram) profileFilde.social.instagram = instagram
        if (twitter) profileFilde.social.twitter = twitter
        if (linkedin) profileFilde.social.linkedin = linkedin

        try {
            
            let profile = await Profile.findOne({ user: req.user.id})
            if (profile) {
                // Upadate The Profile
                profile = await Profile.findOneAndUpdate({ user: req.user.id}, { $set: profileFilde}, { new: true})
                return res.json(profile)
            }

            profile = new Profile(profileFilde)
            await profile.save();
            res.json(profile)

        } catch (e) {
            console.error(e.message)
            res.status(500).json({  msg: 'Internal Server Error'})
        }
})



// @route          Get api/profile/all
// @Description    get All Prifile
// @assess         Public

router.get('/', async(req, res) =>{

    try {
        
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)

    } catch (e) {
        res.status(500).json({ msg:'Internal Error'})
    }
    
})



// @route          Get api/profile/user/:user_id
// @Description    get All Prifile
// @assess         Public
router.get('/user/:user_id', async(req, res) =>{

    try {
        
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if(!profile) return res.status(400).json({ msg:'There is No Profile'})
        res.json(profile)

    } catch (e) {
        if (e.kind == 'ObjectId') {
            return res.status(400).json({ msg:'There is No Profile'})
        }
        res.status(500).json({ msg:'Internal Error'})
    }
    
})

// @route          Delete auth/profile
// @Description    get All Prifile
// @assess         Public
router.delete('/', async(req, res) =>{

    try {
        // Delete Profile
        await Profile.findOneAndRemove({ user: req.user.id })

        // Delete User
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg:'User Removed'})

    } catch (e) {
        if (e.kind == 'ObjectId') {
            return res.status(400).json({ msg:'There is No Profile'})
        }
        res.status(500).json({ msg:'Internal Error'})
    }
    
})


// @route          Put auth/profile/experience
// @Description    Update  Profile
// @assess         private
router.put('/experience', [ auth, [
    check('title', 'Titel Is Required'),
    check('company', 'Company Is Required'),
    check('from', 'From Date Is Required'),
]], async(req, res)=> {
    const error = validationResult(req)
    if (!error.isEmpty) {
        return res.status(400).json({ error: error.array()})
    }
    const { title, company, location, from, to, current, description } = req.body

    const newExp = { title, company, location, from, to, current, description }

    try {
        
        const profile = await Profile.findOne({ user: req.user.id })
        if (!profile) return res.status(400).json({ msg:'NO Profile Found'})
        profile.experience.unshift(newExp)
        await profile,save()
        res.json(profile)

    } catch (e) {
        res.status(500).json({ msg:'Internal Server Error'})
    }
})

// @route          Delete api/profile/experience/:exp_id
// @Description    Delete experience By ID
// @assess         private
router.get('/experience/:exp_id',auth, async(req, res) =>{

    try {
        
        const profile = await Profile.findOne({ user: req.user.id })
        if(!profile) return res.status(400).json({ msg:'There is No Profile'})

        // Get Remove Index
        const removeIndex = profile.experience.map(item => item.id).indexof(req.params.exp_id)

        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)

        res.json(profile)

    } catch (e) {
        res.status(500).send('Internal Server Error')
    }
    
})






// @route          Put auth/profile/education
// @Description    Update  Profile
// @assess         private
router.put('/education', [ auth, [
    check('school', 'School Is Required'),
    check('degree', 'Degree Is Required'),
    check('fieldofStudy', 'Field Of Study Is Required'),
    check('from', 'From Date Is Required'),
]], async(req, res)=> {
    const error = validationResult(req)
    if (!error.isEmpty) {
        return res.status(400).json({ error: error.array()})
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body

    const newEdu = {  school, degree, fieldofstudy, from, to, current, description }

    try {
        
        const profile = await Profile.findOne({ user: req.user.id })
        if (!profile) return res.status(400).json({ msg:'NO Profile Found'})
        profile.education.unshift(newEdu)
        await profile,save()
        res.json(profile)

    } catch (e) {
        res.status(500).json({ msg:'Internal Server Error'})
    }
})

// @route          Delete api/profile/education/:edu_id
// @Description    Delete education By ID
// @assess         private
router.get('/education/:edu_id',auth, async(req, res) =>{

    try {
        
        const profile = await Profile.findOne({ user: req.user.id })
        if(!profile) return res.status(400).json({ msg:'There is No Profile'})

        // Get Remove Index
        const removeIndex = profile.education.map(item => item.id).indexof(req.params.edu_id)

        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)

    } catch (e) {
        res.status(500).send('Internal Server Error')
    }
    
})

// @route          Get api/profile/github/:username
// @Description    Delete education By ID
// @assess         public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('GitHubClientID')}&client_secret=${config.get('GitHubClientSecret')}`,
            method:'GET',
            headers: { 'user-agent': 'node.js' }
        }

        request(options, (error, response, body)=>{
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg:'No Github Profile Found'})
            }
            res.json(JSON.parse(body))
        })
        
    } catch (e) {
        res.status(500).json({ msg: 'Internal Server Error'})
    }
})






module.exports = router;