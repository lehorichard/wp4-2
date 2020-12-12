const express = require('express')
//const cors = require('cors')
const app = express()
const fs = require('fs')
const path = require('path')
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const { check, validationResult, body } = require("express-validator")
const jwt = require("jsonwebtoken")
const auth = require('./middleware/auth')
const User = require('./models/user')
const Image = require('./models/image')
const upload = require('./middleware/upload')
const FileType = require('file-type');
const user = require('./models/user')
const mongoose = require('mongoose')

require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//app.use(cors())

app.get('/', (req, res) => {
    res.json({message:  'hello'})
})

app.post('/api/register', [
    body('username', 'Invalid username').not().isEmpty(),
    body('password', 'Password has to be at least 6 characters long.').isLength({
        min: 6
    })
], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let { username, password } = await req.body
    
    try {
        let user = await User.findOne({
            username
        })
        if (user) return res.status(400).json({msg: "User already exists."})

        user = new User({ username, password })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, "idk", { expiresIn: '24h'},
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    token
                })
            }    
        )
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
})

app.post('/api/login', [
    check("username", "Please enter a valid username.").not().isEmpty(),
    check("password", "Please enter a valid password.").isLength({
      min: 6
    }) 
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        })
    }
    const { username, password } = req.body
    try {
        let user = await User.findOne({ username })
        if (!user) return res.status(400).json({
            message: 'No such user.'
        })

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return res.status(400).json({ message: 'Incorrect password.'})

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, "idk", { expiresIn: '24h'},
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    token
                })
            }    
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error"
        })
    }
})

app.post('/api/isadmin', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (user.admin)
            res.json(user.admin)
        else
            res.status(400).json({
                message: 'User is not an admin.'
            })
    } catch (err) {
        res.send({ message: "Error in Fetching user" })
    }
})

app.post('/api/upload', auth, upload.single('image') , async (req, res) => {
    if (typeof req.file === 'undefined')
        res.status(400).send({error: 'no image selected'})
    const file = fs.readFileSync(req.file.path)
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: file,
            contentType: (await FileType.fromBuffer(file)).mime
        },
        user: req.user
    }
    console.log(obj);
    Image.create(obj, (err, item) => {
        if (err) console.log(err)
        else {
            item.save()
            res.status(200)
            res.send({message: 'success'})
        }        
    })
})

app.get('/api/user/:id', async (req, res) => {
    try {        
        const user = await User.findById(req.params.id)
        console.log(req.params.id);
        Image.find({user: { id: req.params.id}}).lean().exec((err, docs) => {
            res.send(docs)          
        })
    } catch (err) {
        res.send({ message: "Error in Fetching user" })
    }
})
app.get('/api/images', async(req, res) => {
    Image.find({}).lean().exec((err, docs) => {
        res.send(docs)
    })
})

app.get('/api/image/:id', async (req, res) => {
    const image = await Image.findById(req.params.id)
    res.send(image)
})

app.delete('/api/image/', auth, async (req, res) => {
    const image = await Image.findById(req.params.id)
    if (typeof image === 'undefined') {
        res.status(400)
        res.send({message: 'invalid id'})
    }
    if (req.user.admin || image.user.id == req.user.id) {
    Image.deleteOne({ _id: req.body.id}, (err) => {
        if(err) {
            res.status(400)
            res.send({message: 'invalid id'})
        }
        else {
            res.status(200)
            res.send({message: 'success'})
        }
    })
    } else {
        res.status(400)
        res.send({message: 'Can\'t perform that action.'})
    }
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})