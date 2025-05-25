import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AnalyticServices } from "./analytic.service";

const OverView = catchAsync(async (req, res) => {
  const result = await AnalyticServices.OverviewFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Popular Products Fetched Successfully.",
    data: result,
  });
});

export const AnalyticController = {
OverView,
}