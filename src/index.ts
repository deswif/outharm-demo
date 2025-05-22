import express from "express";
import "express-async-errors"
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser"
import bodyParser from "body-parser";
import uploadFeed from "./handers/uploadFeed";
import extractImage from "./middlewares/extractImage";
import getFeed from "./handers/getFeed";
import reportFeed from "./handers/reportFeed";
import handleErrors from "./errors/handler";
import appealFeed from "./handers/appealUpploadFeed";
import outharmWebhook from "./handers/outharmWebhook";

const app = express()

app.use(cors({
    credentials: true
}))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

app.post('/api/feed/upload', extractImage, uploadFeed)

app.post('/api/feed/$feedId/appeal', appealFeed)

app.get('/api/feed', getFeed)
app.post('/api/feed/$feedId/report', reportFeed)
app.post('/webhook/outharm', outharmWebhook)

app.use(handleErrors)

app.listen(8080, () => {
    console.log(`Server running on http://localhost:8080/`)
})