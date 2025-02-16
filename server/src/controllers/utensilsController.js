import asyncHandler from "express-async-handler";
import Utensil from "../models/utensil.js";

// @desc    Create a new utensil
// @route   POST /utensils
// @access  Public
const createUtensil = asyncHandler(async (req, res) => {
  const { name, image, subImages, description, uses, material } = req.body;

  const utensil = new Utensil({
    name,
    image,
    subImages,
    description,
    uses,
    material,
  });

  const createdUtensil = await utensil.save();
  res.status(201).json(createdUtensil);
});

// @desc    Get all utensils
// @route   GET /utensils
// @access  Public
const getUtensils = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const offset = (page - 1) * limit;

  const total = await Utensil.countDocuments();
  const utensils = await Utensil.find().skip(offset).limit(limit);
  const totalPages = Math.ceil(total / limit);

  let nextPage = null;
  if (page < totalPages) {
    nextPage = page + 1;
  }

  res.status(200).json({
    page,
    limit,
    total,
    totalPages,
    nextPage,
    utensils,
  });
});

// @desc    Get a specific utensil by ID
// @route   GET /utensils/:id
// @access  Public
const getUtensilById = asyncHandler(async (req, res) => {
  const utensil = await Utensil.findById(req.params.id);

  if (utensil) {
    res.status(200).json(utensil);
  } else {
    res.status(404);
    throw new Error("Utensil not found");
  }
});

// @desc    Update a specific utensil by ID
// @route   PUT /utensils/:id
// @access  Public
const updateUtensil = asyncHandler(async (req, res) => {
  const { name, image, subImages, description, uses, material } = req.body;
  const utensil = await Utensil.findById(req.params.id);

  if (utensil) {
    utensil.name = name || utensil.name;
    utensil.image = image || utensil.image;
    utensil.subImages = subImages || utensil.subImages;
    utensil.description = description || utensil.description;
    utensil.uses = uses || utensil.uses;
    utensil.material = material || utensil.material;

    const updatedUtensil = await utensil.save();
    res.status(200).json(updatedUtensil);
  } else {
    res.status(404);
    throw new Error("Utensil not found");
  }
});

// @desc    Delete a specific utensil by ID
// @route   DELETE /utensils/:id
// @access  Public
const deleteUtensil = asyncHandler(async (req, res) => {
  const utensil = await Utensil.findById(req.params.id);

  if (utensil) {
    await utensil.deleteOne();
    res.status(200).json({ message: "Utensil removed" });
  } else {
    res.status(404);
    throw new Error("Utensil not found");
  }
});

export {
  createUtensil,
  getUtensils,
  getUtensilById,
  updateUtensil,
  deleteUtensil,
};
