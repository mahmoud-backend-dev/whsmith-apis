import asyncHandler from 'express-async-handler';
import Section from '../models/HomePage.js'
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/notFound.js';
import fs from 'fs/promises';

export const addMainSection = asyncHandler(async (req, res) => {
  const mainSection = await Section.findOne({});
  if (!mainSection) {
    req.body.image = `${process.env.BASE_URL}/mainSection/${req.file.filename}`;
    const section = await Section.create({
      mainSection: req.body,
    });
    return res.status(StatusCodes.OK)
      .json({
        status: "Success",
        mainSection: section.mainSection,
      });
  };
  req.body.image = `${process.env.BASE_URL}/mainSection/${req.file.filename}`;
  if (mainSection.mainSection?.image) {
    await fs.unlink(`./uploads/mainSection/${mainSection.mainSection.image.split('/')[4]}`);
  }
  mainSection.mainSection = req.body;
  await mainSection.save();
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      mainSection: mainSection.mainSection,
    });
});

export const updateMainSection = asyncHandler(async (req, res) => {
  const mainSectionExits = await Section.findOne({});
  if (!mainSectionExits.mainSection) {
    await fs.unlink(req.file.path);
    throw new NotFoundError(`No main section please add main section first than update it`);
  };
  if (req.file) {
    const mainSection = await Section.findOne({}).select(`mainSection`);
    await fs.unlink(`./uploads/mainSection/${mainSection.mainSection?.image.split('/')[4]}`);
    req.body.image = `${process.env.BASE_URL}/mainSection/${req.file.filename}`;
  };
  const mainSection = await Section.findOne({});
  const { h1, h2, h3, image } = req.body;
  if (h1) mainSection.mainSection.h1 = h1;
  if (h2) mainSection.mainSection.h2 = h2;
  if (h3) mainSection.mainSection.h3 = h3;
  if (image) mainSection.mainSection.image = image;
  await mainSection.save();
  res.status(StatusCodes.OK).json({
    status: "Success",
    mainSection: mainSection.mainSection,
  })
});

export const getMainSection = asyncHandler(async (req, res) => { 
  const mainSection = await Section.findOne({}).select(`mainSection`);
  res.status(StatusCodes.OK).json({
    status: "Success",
    mainSection: mainSection?.mainSection ?? null,
  });
})

export const addSectionOne = asyncHandler(async (req, res) => {
  let sectionOne = await Section.findOne({});
  if (!sectionOne) {
    sectionOne = await Section.create({
      sectionOne: req.body,
    });
    return res.status(StatusCodes.OK)
      .json({
        status: "Success",
        sectionOne: sectionOne.sectionOne,
      });
  }
  sectionOne.sectionOne = req.body;
  await sectionOne.save();
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionOne: sectionOne.sectionOne,
    });
});

export const getSectionOne = asyncHandler(async (req, res) => {

  const sectionOne = await Section.findOne({}).populate({
    path: 'sectionOne.products',
    select: `images name author price priceAfterDiscount`
  }).select(`sectionOne.label sectionOne.description`);

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionOne: sectionOne?.sectionOne ?? null,
    })
});

export const addSectionTwo = asyncHandler(async (req, res) => {
  const sectionExits = await Section.findOne({})

  const updateSectionTwo = async (newData) => {
    return await Section.findOneAndUpdate(
      {},
      { sectionTwo: newData },
      { new: true, upsert: true },
    );
  };
  if (!sectionExits) {
    const images = req.files.map((image) => `${process.env.BASE_URL}/sectionTwo/${image.filename}`);
    const data = { ...req.body, images };
    const sectionTwo = await updateSectionTwo(data);
    return res.status(StatusCodes.OK)
      .json({
        status: "Success",
        sectionTwo: sectionTwo.sectionTwo,
      });
  } else {
    if (sectionExits.sectionTwo && sectionExits.sectionTwo.images) {
      await Promise.all(sectionExits.sectionTwo.images.map(async (image) => {
        await fs.unlink(`./uploads/sectionTwo/${image.split('/')[4]}`);
      }));
      const images = req.files.map((image) => {
        return `${process.env.BASE_URL}/sectionTwo/${image.filename}`;
      });
      const data = { ...req.body, images };
      const sectionTwo = await updateSectionTwo(data);
      return res.status(StatusCodes.OK)
        .json({
          status: "Success",
          sectionTwo: sectionTwo.sectionTwo,
        });
    }
  }
  const images = req.files.map((image) => {
    return `${process.env.BASE_URL}/sectionTwo/${image.filename}`;
  });
  const data = { ...req.body, images };
  const sectionTwo = await updateSectionTwo(data);
  return res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionTwo: sectionTwo.sectionTwo,
    });
});

export const updateSectionTwo = asyncHandler(async (req, res) => { 
  const sectionTwo = await Section.findOne({}).select(`sectionTwo`);
  sectionTwo.sectionTwo.label = req.body.label;
  sectionTwo.sectionTwo.description = req.body.description;
  sectionTwo.save();
  res.status(StatusCodes.OK).json({
    status: "Success",
    sectionTwo,
  });
})

export const updateImageSectionTwo = asyncHandler(async (req, res) => {
  const nameImg = req.body.nameImg;
  const imagesSectionTwo = await Section.findOne({}).select(`sectionTwo.images`);
  if (!imagesSectionTwo.sectionTwo.images.includes(nameImg)) {
    imagesSectionTwo.sectionTwo.images.push(`${process.env.BASE_URL}/sectionTwo/${req.file.filename}`);
    await imagesSectionTwo.save();
    return res.status(StatusCodes.OK).json({
      imagesSectionTwo,
    });
  }
  await fs.unlink(`./uploads/sectionTwo/${nameImg.split('/')[4]}`);
  imagesSectionTwo.sectionTwo.images.pull(nameImg);
  imagesSectionTwo.sectionTwo.images.push(`${process.env.BASE_URL}/sectionTwo/${req.file.filename}`);
  await imagesSectionTwo.save();
  res.status(StatusCodes.OK).json({
    imagesSectionTwo,
  })
});

export const deleteImageSectionTwo = asyncHandler(async (req, res) => {
  const nameImg = req.body.nameImg;
  const imagesSectionTwo = await Section.findOne({}).select(`sectionTwo.images`);
  if (!imagesSectionTwo.sectionTwo.images.includes(nameImg))
    throw new NotFoundError(`No image for this name: ${nameImg}`);
  await fs.unlink(`./uploads/sectionTwo/${nameImg.split('/')[4]}`);
  imagesSectionTwo.sectionTwo.images.pull(nameImg)
  await imagesSectionTwo.save();
  res.status(StatusCodes.OK).json({
    imagesSectionTwo,
  })
});

export const getSectionTwo = asyncHandler(async (req, res) => {
  const sectionTwo = await Section.findOne({})
    .select(`sectionTwo`);
    res.status(StatusCodes.OK)
      .json({
        status: "Success",
        sectionTwo: sectionTwo?.sectionTwo ?? null,
      });
});

export const addSectionThree = asyncHandler(async (req, res) => {
  let sectionThree = await Section.findOne({});
  if (!sectionThree) {
    sectionThree = await Section.create({
      sectionThree: req.body,
    });
    return res.status(StatusCodes.OK)
      .json({
        status: "Success",
        sectionThree: sectionThree.sectionThree,
      });
  };
  sectionThree.sectionThree = req.body;
  await sectionThree.save();
  return res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionThree: sectionThree.sectionThree,
    });
});

export const getSectionThree = asyncHandler(async (req, res) => {
  const sectionThree = await Section.findOne({}).populate({
    path: 'sectionThree.products',
    select: `images name author price priceAfterDiscount`
  }).select(`sectionThree.label sectionThree.description`);

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionThree: sectionThree?.sectionThree?? null,
    });
});

export const addSectionFour = asyncHandler(async (req, res) => {
  let sectionFour = await Section.findOne({});
  if (!sectionFour) {
    sectionFour = await Section.create({
      sectionFour: req.body,
    });
    return res.status(StatusCodes.OK)
      .json({
        status: "Success",
        sectionFour: sectionFour.sectionFour,
      });
  };
  sectionFour.sectionFour = req.body;
  await sectionFour.save();
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionFour: sectionFour.sectionFour,
    });
});

export const getSectionFour = asyncHandler(async (req, res) => {
  const sectionFour = await Section.findOne({}).populate({
    path: `sectionFour.categories`,
    select: `name`
  }).select(`sectionFour.label`);

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionFour: sectionFour?.sectionFour ?? null,
    });
});

export const addSectionFive = asyncHandler(async (req, res) => {
  const sectionExits = await Section.findOne({});
  const updatedSection = async (newData) => {
    return await Section.findOneAndUpdate(
      {},
      { sectionFive: newData },
      { new: true, upsert: true }
    )
  };
  if (!sectionExits) {
    const images = req.files.map((img) => `${process.env.BASE_URL}/brands/${img.filename}`);
    const newData = { ...req.body, images };
    const sectionFive = await updatedSection(newData);
    return res.status(StatusCodes.OK)
      .json({
        status: "Success",
        sectionFive: sectionFive.sectionFive,
      });
  } else {
    if (sectionExits.sectionFive && sectionExits.sectionFive.images) {
      await Promise.all(sectionExits.sectionFive.images.map(async (img) => {
        await fs.unlink(`./uploads/brands/${img.split('/')[4]}`);
      }));
      const images = req.files.map((img) => `${process.env.BASE_URL}/brands/${img.filename}`);
      const newData = { ...req.body, images };
      const sectionFive = await updatedSection(newData);
      return res.status(StatusCodes.OK)
        .json({
          status: "Success",
          sectionFive: sectionFive.sectionFive,
        });
    }
  };
  const images = req.files.map((img) => `${process.env.BASE_URL}/brands/${img.filename}`);
  const newData = { ...req.body, images };
  const sectionFive = await updatedSection(newData);
  return res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionFive: sectionFive.sectionFive,
    });
});

export const updateSectionFive = asyncHandler(async (req, res) => {
  const sectionFive = await Section.findOne({}).select(`sectionFive`);
  sectionFive.sectionFive.label = req.body.label;
  sectionFive.save();
  res.status(StatusCodes.OK).json({
    status: "Success",
    sectionFive,
  });
});

export const addImageSectionFive = asyncHandler(async (req, res) => {
  const sectionFive = await Section.findOne({}).select(`sectionFive`);
  sectionFive.sectionFive.images.push(`${process.env.BASE_URL}/brands/${req.file.filename}`);
  sectionFive.save();
  res.status(StatusCodes.OK).json({
    status: "Success",
    sectionFive
  });
});

export const removeImageSectionFive = asyncHandler(async (req, res) => { 
  const sectionFive = await Section.findOne({}).select(`sectionFive`);
  const nameImg = req.body.nameImg;
  if (!sectionFive.sectionFive.images.includes(nameImg))
    throw new NotFoundError(`No image for this name: ${nameImg}`);
  await fs.unlink(`./uploads/brands/${nameImg.split('/')[4]}`);
  sectionFive.sectionFive.images.pull(nameImg);
  await sectionFive.save();
  res.status(StatusCodes.OK).json({
    status: 'Success',
    sectionFive
  })
})

export const getSectionFive = asyncHandler(async (req, res) => {
  const sectionFive = await Section.findOne({}).select(`sectionFive`);

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      sectionFive: sectionFive?.sectionFive ?? null,
    });
});

export const getAllSections = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const allSections = await Section.findOne({}).populate({
    path: 'sectionOne.products',
    select: `images name.${lang} author.${lang} price priceAfterDiscount`
  }).populate({
    path: 'sectionThree.products',
    select: `images name.${lang} author.${lang} price priceAfterDiscount`
  }).populate({
    path: `sectionFour.categories`,
    select: `name.${lang}`
  }).select(`mainSection.h1.${lang} mainSection.h2.${lang} mainSection.h3.${lang} mainSection.image sectionOne.label.${lang} sectionOne.description.${lang} sectionTwo.label.${lang} sectionTwo.images sectionTwo.description.${lang} sectionThree.label.${lang} sectionThree.description.${lang} sectionFour.label.${lang} sectionFive.label.${lang} sectionFive.images`)
  res.status(StatusCodes.OK).json({
    status: "Success",
    allSections
  })
});









