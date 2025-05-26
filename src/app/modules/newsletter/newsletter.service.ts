import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { Newsletter } from "@prisma/client";

const GetNewslettersFromDB = async () => {
  const newsletter = await prisma.newsletter.findMany();
  if (newsletter.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No Newsletter Available");
  }
  return newsletter;
};

const GetNewsletterByEmailFromDB = async (email: string) => {
  const uniqueNewsletter = await prisma.newsletter.findFirst({
    where: {
      email
    },
  });
  if (uniqueNewsletter === null) {
    throw new ApiError(status.NOT_FOUND, "No Newsletter Available");
  }
  return uniqueNewsletter;
};

const CreateNewsletterIntoDB = async (payload: Newsletter) => {
  const { email } = payload;
  const isNewsletterExists = await prisma.newsletter.findFirst({
    where: {
      email,
    },
  });
  if (isNewsletterExists !== null) {
    throw new ApiError(status.BAD_REQUEST, "Newsletter already exists!");
  }
  const result = await prisma.newsletter.create({
    data: payload,
  });
  return result;
};

const DeleteNewsletterFromDB = async (id: string) => {
  const isNewsletterExists = await prisma.newsletter.findUnique({
    where: {
      id,
    },
  });
  if (isNewsletterExists=== null) {
    throw new ApiError(status.NOT_FOUND, "No Newsletter Available");
  }
  await prisma.newsletter.delete({
    where: {
      id,
    },
  });
  return null;
};

export const NewsletterServices = {
  GetNewslettersFromDB,
  GetNewsletterByEmailFromDB,
  CreateNewsletterIntoDB,
  DeleteNewsletterFromDB,
};
