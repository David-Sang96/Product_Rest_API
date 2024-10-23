import type { Request, Response } from "express";
import { prisma } from "../ultis/prisma";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    res.json({ data: categories });
  } catch (error) {
    console.log("Error in getCategories controller: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(422).json({ error: "Name is required" });
      return;
    }

    if (name.length > 60) {
      res
        .status(422)
        .json({ error: "Category name must be 60 characters or less." });
      return;
    }

    if (await prisma.category.findUnique({ where: { name } })) {
      res.status(409).json({ error: `${name} category already exists` });
      return;
    }

    const newCategory = await prisma.category.create({ data: { name } });
    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    console.log("Error in createCategory controller: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Id" });
      return;
    }

    if (!(await prisma.category.findUnique({ where: { id } }))) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    if (!name) {
      res.status(422).json({ error: "Name is required" });
      return;
    }

    if (await prisma.category.findUnique({ where: { name } })) {
      res.status(409).json({ error: `${name} category already exists` });
      return;
    }

    const updatedCategory = await prisma.category.update({
      data: { name },
      where: { id },
    });

    res.json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.log("Error in updateCategory controller: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Id" });
      return;
    }

    if (!(await prisma.category.findUnique({ where: { id } }))) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount) {
      res.status(409).json({
        error: `Category id is being use in ${productCount} product(s)`,
      });
      return;
    }

    await prisma.category.delete({ where: { id } });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCategory controller: ", error);
    if (error instanceof Error) {
      res.status(500).json({
        error: {
          message: error.message,
          stack: error.stack,
        },
      });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
