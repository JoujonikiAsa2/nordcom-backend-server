import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ProductServices } from "./product.service";

const GetProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.GetProductsFromDB(
    req.query.admin ? (req.query.admin as string) : ""
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products Fetched Successfully.",
    data: result,
  });
});

const GetProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.GetProductByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product Fetched Successfully.",
    data: result,
  });
});

const CreateProduct = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await ProductServices.CreateProductIntoDB(data);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product Created Successfully.",
    data: result,
  });
});

const UpdateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ProductServices.UpdateProductIntoDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product Updated Successfully.",
    data: result,
  });
});

const DeleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.DeleteProductFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product Deleted Successfully.",
    data: result,
  });
});

const PopularProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.PopularProductFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Popular Products Fetched Successfully.",
    data: result,
  });
});


export const ProductControllers = {
  GetProducts,
  GetProductById,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  PopularProduct
};
