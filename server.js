require("dotenv").config()
const express=require('express')
const PORT=process.env.PORT 
const { S3Client } = require('@aws-sdk/client-s3')
const multer=require('multer')
const multerS3=require('multer-s3')


const app=express()



const s3=new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials:{
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
    
    
})
const BUCKET=process.env.S3_BUCKET_NAME

const upload=multer({
    storage:multerS3({
        bucket:BUCKET,
        s3:s3,
        
        metadata: function (req, file, cb) {
            cb(null, {
              fieldName: file.fieldname
            });
          },
        key:(req,file,cb)=>{
            cb(null,`simpleUpload/image-${Date.now()}.png`);//profileImage/.. ,that give the file path in the bucket s3
        }
    })
})

app.post('/upload',upload.single("image"),(req,res)=>{
    // console.log(req.file) 
    res.send("successful")
}) 

// upload multi images together /  in the postman in body -> form-data parm called images[] and then select files
app.post('/upload/images',upload.array("images"),(req,res)=>{
    console.log(req.files) 

    res.send("successful")
}) 

app.get('/',(req,res)=>{
    res.send("hello world")
})



app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
})