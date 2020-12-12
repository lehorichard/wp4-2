const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    name: String,
    desc: {
        type: String,
        default: 'No description'
    },
    uploadedAt: {
        type: Date,
        default: Date.now()
    },    
    img: {
        data: Buffer,
        contentType: String
    },
    user: { 
        id: String    
    }
})

module.exports = new mongoose.model('Image', imageSchema)