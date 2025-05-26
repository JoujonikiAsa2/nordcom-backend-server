import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { FavoriteProductServices } from "./favoriteProduct.service";

const GetFavoriteProducts = catchAsync(async (req, res) => {
  const result = await FavoriteProductServices.GetFavoriteProductsFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "FavoriteProducts Fetched Successfully.",
    data: result,
  });
});

const GetFavoriteProductByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await FavoriteProductServices.GetFavoriteProductByUserIdFromDB(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "FavoriteProduct Fetched Successfully.",
    data: result,
  });
});

const CreateFavoriteProduct = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await FavoriteProductServices.CreateFavoriteProductIntoDB(data);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "FavoriteProduct Created Successfully.",
    data: result,
  });
});

const DeleteFavoriteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FavoriteProductServices.RemoveFavoriteProductFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "FavoriteProduct Deleted Successfully.",
    data: result,
  });
});

export const FavoriteProductControllers = {
  GetFavoriteProducts,
  GetFavoriteProductByUserId,
  CreateFavoriteProduct,
  DeleteFavoriteProduct,
};
