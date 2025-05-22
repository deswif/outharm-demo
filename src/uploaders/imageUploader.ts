import multer from "multer"

const storage = multer.memoryStorage()

const imageUploader = multer({ storage: storage })

export default imageUploader;