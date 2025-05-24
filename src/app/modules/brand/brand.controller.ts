import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { BrandServices } from "./brand.service";

const GetBrands = catchAsync(async (req, res) => {
  const result = await BrandServices.GetBrandsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brands Fetched Successfully.",
    data: result,
  });
});

const GetBrandById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BrandServices.GetBrandByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand Fetched Successfully.",
    data: result,
  });
});

const CreateBrand = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await BrandServices.CreateBrandIntoDB(data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand Created Successfully.",
    data: result,
  });
});

const UpdateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await BrandServices.UpdateBrandIntoDB(id, data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand Updated Successfully.",
    data: result,
  });
});

const DeleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BrandServices.DeleteBrandFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Brand Deleted Successfully.",
    data: result,
  });
});

export const BrandControllers = {
  GetBrands,
  GetBrandById,
  CreateBrand,
  UpdateBrand,
  DeleteBrand,
};
