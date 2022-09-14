const path = require('path')
const { v4: uuidv4 } = require('uuid')
const upload = (req, res, next) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.')
  }

  return new Promise((resolve, reject) => {
    const extension = req.files.image.mimetype.split('/')[1]
    const newName = uuidv4() + '.' + extension
    const file = req.files.image
    const uploadPath = path.join(__dirname, '../uploads/products/', newName)

    file.mv(uploadPath, err => {
      if (err) {
        reject(
          res.status(400).send('não foi possível fazer o upload da imagem.')
        )
      }
    })
    req.image = file
    next()
  })
}

module.exports = upload
