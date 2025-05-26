import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentServices } from "./payment.services";

const CreateCheckoutSession = catchAsync(async (req, res) => {
  const result = await PaymentServices.CreateChechoutSession(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Checkout Session Created Successfully.",
    data: result,
  });
});

const CreatePayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.CreatePaymentInDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment Created Successfully.",
    data: result,
  });
});

const GetMyPayments = catchAsync(async (req, res) => {
  const { email, orderId } = req.params;
  const result = await PaymentServices.GetPaymentsByUserEmail(
    email as string,
    orderId as string
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments Fetched Successfully.",
    data: result,
  });
});

const GetPaymentByTransId = catchAsync(async (req, res) => {
  const { transId } = req.params;
  const result = await PaymentServices.GetPaymentsByTransId(transId as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment Fetched Successfully.",
    data: result,
  });
});

const GetPaymentById = catchAsync(async (req, res) => {
  const result = await PaymentServices.GetPaymentById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment Fetched Successfully.",
    data: result,
  });
});

const GetAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.GetAllPaymentsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments Fetched Successfully.",
    data: result,
  });
});

export const PayementControllers = {
  CreateCheckoutSession,
  CreatePayment,
  GetMyPayments,
  GetPaymentByTransId,
  GetPaymentById,
  GetAllPayments,
};
