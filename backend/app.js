const express = require('express')
const connectDB = require('./config/db'
)
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(express.json())
app.use(morgan("tiny"))
app.use(require('cors')())
app.use('/', userRoutes)
const PORT = process.env.PORT || 8000

app.listen(PORT, async () => {
    try {
        await connectDB()
        console.log(`Server is running on port ${PORT}`)
    } catch (error) {
        console.log(error)
    }
})