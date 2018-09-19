const multer = require('multer');
const moment = require('moment');

exports.paginate = (array, limit, page) => {
    //pagination props setup
    var limit = 20;
    var page = 1;
    if (limit) {
        limit = parseInt(limit);
        page = parseInt(page);
    }

    if (array.length > 0 && limit != -1) {
        page--;
        return array.slice(page * limit, (page + 1) * limit);
    } else if (limit == -1) {
        return array;
    } else {
        return [];
    }
}

exports.multerUpload = () => {
    //TODO: provide storge by minio
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'public/images/uploads')
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + moment().unix())
        }
    });
    return multer({ storage });
}