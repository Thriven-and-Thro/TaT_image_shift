const Multer = require('koa-multer')
const Router = require('koa-router')
const Koa = require('koa')
const Jimp = require('jimp')

const path = require('path')

const app = new Koa()
const uploadRouter = new Router({ prefix: '/upload' })

const varity = (ctx, next) => {
  const { size } = ctx.query
  const file = ctx.req.file
  const destPath = path.join(file.destination, file.filename)
  Jimp.read(file.path).then(image => {
    image.resize(parseInt(size), Jimp.AUTO).write(`${destPath}-${size}.jpg`)
  })
  next()
}

const storage = Multer.diskStorage({
  // 目标文件夹
  destination: (req, file, cb) => {
    cb(null, "./uploads/")
  },
  // 文件名
  filename: (req, file, cb) => {
    // 此处修改图片后缀
    cb(null, `${file.originalname.split('.')[0]}.jpg`)
  }
})

const imageUpload = Multer({
  storage
})
// 上传单一
const imageHander = imageUpload.single('image')

app.use(uploadRouter.routes())

uploadRouter.post('/', imageHander, varity, (ctx, next) => {
  ctx.response.body = 'success'
})

app.listen(8000, () => {
  console.log('图片转换器');
})