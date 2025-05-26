import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CategoryServices } from "./category.service";

const GetCategorys = catchAsync(async (req, res) => {
  const result = await CategoryServices.GetCategorysFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Categorys Fetched Successfully.",
    data: result,
  });
});

const GetCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.GetCategoryByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Fetched Successfully.",
    data: result,
  });
});

const CreateCategory = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await CategoryServices.CreateCategoryIntoDB(data);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category Created Successfully.",
    data: result,
  });
});

const UpdateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CategoryServices.UpdateCategoryIntoDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Updated Successfully.",
    data: result,
  });
});

const DeleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.DeleteCategoryFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category Deleted Successfully.",
    data: result,
  });
});

export const CategoryControllers = {
  GetCategorys,
  GetCategoryById,
  CreateCategory,
  UpdateCategory,
  DeleteCategory
};
