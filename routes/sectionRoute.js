import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';
import { allowTo } from "../controller/authController.js";

import { uploadArrayOfImages, uploadSingleImage } from '../middleware/uploadImageMiddleWare.js';

import {
  addImageSectionFiveValidator,
  addMainSectionValidator,
  addOneSectionValidator,
  addSectionFiveValidator,
  addSectionFourValidator,
  addSectionThreeValidator,
  addTwoSectionValidator,
  removeImageSectionFiveValidator,
  updateSectionFiveValidator,
  updateSectionTwoImageValidator,
  updateSectionTwoValidator,
} from "../utils/validators/homePageValidator.js";

import {
  addImageSectionFive,
  addMainSection,
  addSectionFive,
  addSectionFour,
  addSectionOne,
  addSectionThree,
  addSectionTwo,
  deleteImageSectionTwo,
  getAllSections,
  getMainSection,
  getSectionFive,
  getSectionFour,
  getSectionOne,
  getSectionThree,
  getSectionTwo,
  removeImageSectionFive,
  updateImageSectionTwo,
  updateMainSection,
  updateSectionFive,
  updateSectionTwo,
} from "../controller/sectionsController.js";

router.post(
  '/add/mainSection',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  uploadSingleImage('image', 'mainSection'),
  addMainSectionValidator,
  addMainSection
);

router.patch(
  '/update/mainSection',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  uploadSingleImage('image', 'mainSection'),
  updateMainSection
);

router.get('/mainSection', getMainSection);

router.post(
  '/add/sectionOne',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  addOneSectionValidator,
  addSectionOne
);
router.get('/sectionOne', getSectionOne);

router.post(
  '/add/sectionTwo',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  uploadArrayOfImages('images',`sectionTwo`),
  addTwoSectionValidator,
  addSectionTwo
);
router.patch(
  '/sectionTwo/update',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  updateSectionTwoValidator,
  updateSectionTwo,
);

router.patch(
  '/sectionTwo/edit/image',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  uploadSingleImage('image', `sectionTwo`),
  updateSectionTwoImageValidator,
  updateImageSectionTwo,
);
router.get('/sectionTwo', getSectionTwo);
router.patch(
  '/sectionTwo/delete/image',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  deleteImageSectionTwo,
)

router.post(
  '/add/sectionThree',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  addSectionThreeValidator,
  addSectionThree
);
router.get('/sectionThree', getSectionThree);

router.post(
  '/add/sectionFour',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  addSectionFourValidator,
  addSectionFour
);
router.get('/sectionFour', getSectionFour);

router.post(
  '/add/sectionFive',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  uploadArrayOfImages('images','brands'),
  addSectionFiveValidator,
  addSectionFive
);
router.get('/sectionFive', getSectionFive);
router.get('/all', getAllSections);

router.patch(
  '/sectionFive/update',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  updateSectionFiveValidator,
  updateSectionFive
);

router.post(
  '/sectionFive/add/image',
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  uploadSingleImage('image', `brands`),
  addImageSectionFiveValidator,
  addImageSectionFive,
)

router.patch(
  "/sectionFive/remove/image",
  productRoute,
  allowTo('owner', 'admin', 'manage home setting'),
  removeImageSectionFiveValidator,
  removeImageSectionFive,
)


export default router;