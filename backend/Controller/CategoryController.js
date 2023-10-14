const categoryModel = require("../models/CatgoryModel");
const slugify = require("slugify");
const { z } = require("zod");
const CategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category must be at least 1 characters" })
    .max(30, { message: "Category must be at less than 30 characters" }),
});

const createCategoryController = async (req, res) => {
  try {
    const parsedData = CategorySchema.safeParse(req.body);
    if (!parsedData.success) {
      const errormessages = parsedData.error.issues.map((obj) => obj.message);
      return res.status(200).send({ message: errormessages });
    }
    let name = parsedData.data.name;
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
};

//update category

const updateCategorySchema = z.object({
  name: z.string().min(1).max(30),
});
const updateCategoryController = async (req, res) => {
  try {
    const parsedData = updateCategorySchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(200).json({ message: parsedData.error });
    }
    let name = parsedData.data.name;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all cat
const categoryControlller = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
const deleteCategoryCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  categoryControlller,
  singleCategoryController,
  deleteCategoryCOntroller,
};
