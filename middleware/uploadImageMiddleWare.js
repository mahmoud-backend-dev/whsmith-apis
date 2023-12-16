import multer from 'multer';
import BadRequest from '../errors/badRequest.js';
import {v4 as uuid} from 'uuid'

const multerOptions = (path) => {
    // 1) DisStorage engine
    const multerStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${path}`)
        },
        filename: function (req, file, cb) {
            // category-{id}-Date.now().jpeg
            const ext = file.mimetype.split('/')[1];
            const filename = `${path}-${uuid()}.${ext}`;
            cb(null, filename);
        }
    });
    const fileFilter = async (req, file, cb) => {
        if (file.mimetype.startsWith("image"))
            cb(null, true)
        else
            cb(new BadRequest("Only Images allowed"), false);
    };
    
    return multer({ storage: multerStorage, fileFilter });
    
}

export function uploadSingleImage(fieldName, path) { return multerOptions(path).single(fieldName); }


export function uploadArrayOfImages(arrayOfImages, path) { return multerOptions(path).array(arrayOfImages); } 