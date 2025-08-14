import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import path from 'path'
import { app, server } from './socket/socket.js';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js'
import userRouter from './routes/user.route.js'

import { connectToDatabase } from './db/connectDB.js';

const __dirname = path.resolve()

dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/users', userRouter);
app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "fronted", "dist", "index.html"))
})

server.listen(port, () => {
    connectToDatabase()
    console.log(`App listeing on port ${port}`)
})