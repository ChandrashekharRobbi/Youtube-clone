import { error } from "console"
import express from "express"
import ffmpeg from "fluent-ffmpeg"

const app = express()
app.use(express.json());
app.post("/process-video", (req, res) => {
    // Get Path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // Handling of missing input
    if(!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missing File Path");
    }


    // convert / compress video by using ffmpeg
    ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360") //360p resolution
    .on("end" , () => {
        res.status(200).send("Processed Video Successfully")
    })
    .on("error", (err) => {
        console.log(`An error occurred ${err.message}`);
        res.status(500).send(`Internal Server Error ${err.message}`);
    })
    .save(outputFilePath)

})

// For safer side
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Video processing Service Listening at http://localhost:${port}`)
})