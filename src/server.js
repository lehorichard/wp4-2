const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs')
const path = require('path')
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const { check, validationResult, body } = require("express-validator")
const jwt = require("jsonwebtoken")
const auth = require('./middleware/auth')
const isAdmin = require('./middleware/isAdmin')
const User = require('./models/user')
const Image = require('./models/image')
const upload = require('./middleware/upload')
const FileType = require('file-type');
const user = require('./models/user')
const mongoose = require('mongoose')

require('dotenv').config()
app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true 
}))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.json({limit: '50mb'}))
app.use(express.static('build'))
mongoose.set('useFindAndModify', false)
app.use(cors())
app.options('*', cors())

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

        const id = user.id
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, "idk", { expiresIn: '24h'},
            (err, token) => {
                if (err) throw err
                res.status(200).json({
                    token,
                    id
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

app.post('/api/upload', auth, async (req, res) => {
    if (typeof req.body.image === 'undefined')
        res.status(400).send({error: 'no image selected'})

    const fileString = req.body.image.replace('data:image/png;base64','')
                                     .replace('data:image/jpeg;base64','')
                                     .replace('data:image/webp;base64','')
                                     .replace('data:image/gif;base64','')
    let type = 'image/'
    switch (fileString.charAt(0)) {
        case '/':
            type.concat('jpeg')
            break
        case 'i':
            type.concat('png')
            break
        case 'R':
            type.concat('gif')
            break
        case 'U':
            type.concat('webp')
            break
        default:
            type = 'application/octet-stream'
    }

    fs.writeFileSync('./images/image',fileString, 'base64', (err) => {
        console.log(err)
    })
    const file = fs.readFileSync('./images/image')
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: file,
            contentType: type
        },
        user: req.user
    }

    Image.create(obj, (err, item) => {
        if (err) {
            console.log(err)
            res.status(500).send({message: 'Couldn\'t upload image.'})
        }
        else {
            item.save()
            res.status(200)
            res.send({ id: item.id })
        }        
    })
})

app.get('/api/user/:id', async (req, res) => {
    try {        
        const user = await User.findById(req.params.id)
        if (typeof user === 'undefined')
            res.status(400).send({message: "Invalid ID."})
        console.log(req.params.id);
        Image.find({ user: { id: req.params.id }}).lean().exec((err, docs) => {
            res.status(200).send(docs)          
        })
    } catch (err) {
        res.send({ message: "Error while fetching user" })
    }
})
app.get('/api/images', async(req, res) => {
    Image.find({}).lean().exec((err, docs) => {
        res.send(docs)
    })
})

app.get('/api/image/:id', async (req, res) => {
    const image = await Image.findById(req.params.id)
    if (typeof image === 'undefined')
        res.status(400).send({message: "Invalid ID."})
    res.send(image)
})

app.put('/api/image/:id', auth, async (req, res) => {
    const image = await Image.findById(req.params.id)
    const user = await User.findById(req.user.id)
    if (typeof image === 'undefined') {
        res.status(400)
        res.send({message: 'invalid id'})
    }
    if (user.admin || image.user.id === req.user.id) {
        const data = {
            name: req.body.name,
            desc: req.body.desc
        }
        Image.findOneAndUpdate({_id: image._id}, data, (err, img) => {
            if (err) return res.send(500, {error: err})
            return res.status(200).send(img)
        })
    } else {
        res.status(401)
        res.send({message: 'Can\'t perform that action.'})
    }
})

app.get('/api/users/', async (req, res) => {
    let result = []
    const allUsers = await User.find({}).lean().exec()
           
    for (const u of allUsers) {
        const uid = u._id
        const imgs = await Image.find({ user: { id: '' + uid }}).lean().exec()
        const imgCount = Object.keys(imgs).length
        if (imgCount > 0) {
            result.push({
                id: u._id,
                username: u.username,
                imgCount: imgCount
            })
        }
    }
    res.status(200).send(result)
})

app.delete('/api/image/:id', auth, async (req, res) => {
    const image = await Image.findById(req.params.id)
    if (typeof image === 'undefined') {
        res.status(400)
        res.send({message: 'invalid id'})
    }
    if (req.user.admin || image.user.id == req.user.id) {
    Image.deleteOne({ _id: req.params.id}, (err) => {
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
        res.status(401)
        res.send({message: 'Can\'t perform that action.'})
    }
})

app.post('/api/verify/', async (req, res) => {
    const token = req.body.token
    if (!token) return res.status(401).json({ message: "No session token." })
    try {
        jwt.verify(token, "idk")
        res.status(200).send()    
    } catch (e) {
        // console.error(e);
        if (e instanceof jwt.TokenExpiredError)
            res.status(401).send({message: "Token expired"})
        else
            res.status(401).send({ message: "Invalid Token" });
    }
})

const root = require('app-root-path')
app.get('*', async (req, res) => {
    res.sendFile(root + '/build/index.html')
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})