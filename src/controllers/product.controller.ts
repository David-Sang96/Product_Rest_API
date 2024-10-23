import type { Request, Response } from "express";
import { prisma } from "../ultis/prisma";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
      include: { category: { select: { id: true, name: true } } },
      omit: { categoryId: true }, //exclude sensitive field
    });
    res.json({ data: products });
  } catch (error) {
    console.log("Error in getProducts controller: ", error);
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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Id" });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { name: true, id: true } } },
      omit: { categoryId: true },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ data: product });
  } catch (error) {
    console.log("Error in getProductById controller: ", error);
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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, categoryId } = req.body;
    if (!name) {
      res.status(422).json({ error: "Name is required" });
      return;
    }

    if (!price) {
      res.status(422).json({ error: "Price is required" });
      return;
    } else {
      if (typeof price !== "number" || price < 0) {
        res.status(422).json({ error: "Price must be a non-negative number" });
        return;
      }
    }

    if (!categoryId) {
      res.status(422).json({ error: "Category id is required" });
      return;
    } else {
      if (!(await prisma.category.findUnique({ where: { id: categoryId } }))) {
        res.status(404).json({ error: "Category id not found" });
        return;
      }
    }

    const newProduct = await prisma.product.create({
      data: req.body,
      include: { category: { select: { name: true, id: true } } },
      omit: { categoryId: true },
    });
    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (error) {
    console.log("Error in createProduct controller: ", error);
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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price, categoryId } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Id" });
      return;
    }

    if (!(await prisma.product.findUnique({ where: { id } }))) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (name !== undefined && name.trim() === "") {
      res.status(422).json({ error: "Name cannot be empty" });
      return;
    }

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      res.status(422).json({ error: "Price must be a non-negative number" });
      return;
    }

    if (
      categoryId !== undefined &&
      !(await prisma.category.findUnique({ where: { id: categoryId } }))
    ) {
      res.status(422).json({ error: "Category id not found" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      data: req.body,
      where: { id },
      include: { category: { select: { name: true, id: true } } },
      omit: { categoryId: true },
    });

    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.log("Error in updateProduct controller: ", error);
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

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid Id" });
      return;
    }
    if (!(await prisma.product.findUnique({ where: { id } }))) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller: ", error);
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

export const getProductsByCategoryId = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.categoryId);

    if (isNaN(categoryId)) {
      res.status(400).json({ error: "Invalid Id" });
      return;
    }

    if (
      !(await prisma.category.findUnique({
        where: { id: categoryId },
      }))
    ) {
      res.status(404).json({ error: "Category id not found" });
      return;
    }

    const products = await prisma.product.findMany({
      where: { categoryId },
      include: { category: { select: { name: true, id: true } } },
      omit: { categoryId: true },
      orderBy: { name: "asc" },
    });

    res.json({ data: products });
  } catch (error) {
    console.log("Error in getProductsByCategoryId controller: ", error);
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
