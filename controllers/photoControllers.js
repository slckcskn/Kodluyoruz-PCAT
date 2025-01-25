const Photo = require('../models/Photo')
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {

    // const photo = {
    //   id:1,
    //   name: "Photo name",
    //   description: "Photo description"
    // }
    // res.send(photo)

    //res.sendFile(path.resolve(__dirname, 'temp/index.html'))

    // const photos = await Photo.find({}).sort('-dateCreated')
    // res.render('index', {
    //     photos
    // })

    const page = req.query.page || 1;                        // Başlangıç sayfamız veya ilk sayfamız.
    const photosPerPage = 3;                                 // Her sayfada bulunan fotoğraf sayısı
    const totalPhotos = await Photo.find().countDocuments(); // Toplam fotoğraf sayısı

    const photos = await Photo.find({})                      // Fotoğrafları alıyoruz  
        .sort('-dateCreated')                                // Fotoğrafları sıralıyoruz
        .skip((page - 1) * photosPerPage)                    // Her sayfanın kendi fotoğrafları
        .limit(photosPerPage)                                // Her sayfada olmasını istediğimi F. sayısını sınırlıyoruz.

    res.render('index', {
        photos: photos,
        current: page,
        pages: Math.ceil(totalPhotos / photosPerPage)
    })
}

exports.getPhoto = async (req, res) => {

    const photo = await Photo.findById(req.params.id)
    res.render('photo', {
        photo
    })
}

exports.createPhoto = async (req, res) => {

    //console.log(req.files.image)
    //await Photo.create(req.body)

    const uploadDir = 'public/uploads'

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
    }

    let uploadAImage = req.files.image
    uploadPath = __dirname + '/../public/uploads/' + uploadAImage.name;

    uploadAImage.mv(uploadPath,

        async () => {
            await Photo.create({
                ...req.body,
                image: '/uploads/' + uploadAImage.name
            })
            res.redirect("/")
        })
}

exports.updatePhoto = async (req, res) => {
    // const photo = await Photo.findOne({ _id: req.params.id})
    const photo = await Photo.findById(req.params.id)
    photo.title = req.body.title
    photo.description = req.body.description
    photo.save()

    res.redirect(`/photos/${req.params.id}`)
}

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndDelete(req.params.id)

    res.redirect('/')
}