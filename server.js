const express = require('express')
const ConnectDb = require('./config/db')


const app = express()

//Connect Database
ConnectDb();

// Init Middele-Ware
app.use(express.json({ extended: false }))


app.get('/', (req, res)=> {res.send('Api Calling')})


// Define Routers
app.use('/api/user', require('./routers/api/users'))
app.use('/api/auth', require('./routers/api/auth'))
app.use('/api/profile', require('./routers/api/profile'))
app.use('/api/posts', require('./routers/api/posts'))



const PORT = process.env.PORT || 5000
app.listen(PORT, () => {console.log(`Server In Running ON ${PORT}`)})