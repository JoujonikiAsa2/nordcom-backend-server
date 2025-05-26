import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { NewsletterServices } from "./newsletter.service";

const GetNewsletters = catchAsync(async (req, res) => {
  const result = await NewsletterServices.GetNewslettersFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Newsletters Fetched Successfully.",
    data: result,
  });
});

const GetNewsletterByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await NewsletterServices.GetNewsletterByEmailFromDB(email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Newsletter Fetched Successfully.",
    data: result,
  });
});

const CreateNewsletter = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await NewsletterServices.CreateNewsletterIntoDB(data);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Newsletter Created Successfully.",
    data: result,
  });
});

const DeleteNewsletter = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NewsletterServices.DeleteNewsletterFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Newsletter Deleted Successfully.",
    data: result,
  });
});

export const NewsletterControllers = {
  GetNewsletters,
  GetNewsletterByEmail,
  CreateNewsletter,
  DeleteNewsletter,
};
