import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { Prisma, Product } from "@prisma/client";

const GetProductsFromDB = async () => {
  const product = await prisma.product.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      brand: true,
      category: true,
      Review: true,
      
    },
  });
  if (product.length === 0) {
    throw new ApiError(status.NOT_FOUND, "No Product Found");
  }
  return product;
};

const GetProductByIdFromDB = async (id: string) => {
  const uniqueProduct = await prisma.product.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      brand: true,
      category: true,
      Review: true,
    },
  });
  if (uniqueProduct === null) {
    throw new ApiError(status.NOT_FOUND, "No Product Found");
  }
  return uniqueProduct;
};

const CreateProductIntoDB = async (
  payload: Product & { imageUrl?: string }
) => {
  const { sku, specification, seoInformation, imageUrl, ...rest } = payload;
  const isProductExists = await prisma.product.findFirst({
    where: { sku },
  });
  if (isProductExists !== null) {
    throw new ApiError(status.BAD_REQUEST, "Product already exists!");
  }
  const result = await prisma.product.create({
    data: {
      ...rest,
      images: imageUrl ? [imageUrl] : [],
      sku,
      specification: specification as Prisma.InputJsonValue[],
      seoInformation: seoInformation as Prisma.InputJsonValue[],
    },
  });
  return result;
};

const UpdateProductIntoDB = async (id: string, payload: Partial<Product>) => {
  const { specification, images, seoInformation, variants, ...rest } = payload;

  //cheking existing
  const isProductExists = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (isProductExists === null) {
    throw new ApiError(status.NOT_FOUND, "No Product Available");
  }

  //checking other field exist or not
  if (
    specification === null ||
    images === null ||
    seoInformation === null ||
    variants === null
  ) {
    await prisma.product.update({
      where: { id: isProductExists.id },
      data: rest,
    });
  }

  if (images !== undefined) {
    const imageArray = [...images, ...isProductExists.images];

    await prisma.product.update({
      where: { id: isProductExists.id },
      data: { images: imageArray },
    });
  }

  // checking for variant
  if (variants !== undefined) {
    const newVariants = variants as string[];
    const dbVariants = isProductExists.variants as string[];
    const mergedVariants = [...newVariants];

    dbVariants?.forEach((item) => {
      let found = mergedVariants.find((variant) => variant === item);
      if (!found) {
        mergedVariants.push(item);
      }
    });

    await prisma.product.update({
      where: { id: isProductExists.id },
      data: { variants: mergedVariants },
    });
  }

  // if specific exist
  if (specification !== undefined) {
    const newSpecifcation = specification as {
      label?: string;
      value?: string;
    }[];
    const dbSpecifcation = isProductExists.specification as {
      label: string;
      value: string;
    }[];
    const mergedSpecification = [...newSpecifcation];

    dbSpecifcation?.forEach((item) => {
      let found = mergedSpecification.find(
        (i) => i.label === item.label && i.value === item.value
      );
      if (!found) {
        mergedSpecification.push(item);
      }
    });

    await prisma.product.update({
      where: { id: isProductExists.id },
      data: { specification: mergedSpecification },
    });
  }

  if (seoInformation !== undefined) {
    const newSeoInformation = seoInformation as {
      title?: string;
      keyword?: string;
      description?: string;
    }[];
    const dbSeoInformation = isProductExists.seoInformation as {
      title: string;
      keyword: string;
      description: string;
    }[];
    const mergedSeoInformation = [...newSeoInformation];

    dbSeoInformation?.forEach((item) => {
      let found = mergedSeoInformation.find(
        (i) =>
          i.title === item.title &&
          i.keyword === item.keyword &&
          i.description === item.description
      );
      if (!found) {
        mergedSeoInformation.push(item);
      }
    });

    await prisma.product.update({
      where: { id: isProductExists.id },
      data: { seoInformation: mergedSeoInformation },
    });
  }

  const result = await prisma.product.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

const DeleteProductFromDB = async (id: string) => {
  const isProductExists = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (isProductExists === null) {
    throw new ApiError(status.NOT_FOUND, "No Product Available");
  }
  await prisma.product.update({
    where: { id },
    data: { isDeleted: true },
  });
  return null;
};

const PopularProductFromDB = async () => {
  const productGroup = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 10, // Top 10 most popular products
  });

  const popularProductId = productGroup.map((product) => product.productId);

  const popularProducts = await prisma.product.findMany({
    where: {
      id: {
        in: popularProductId,
      },
    },
    take: 10,
  });

  if (popularProducts.length === 0) {
    throw new ApiError(status.OK, "No Popular Product Found");
  }
  return popularProducts;
};

export const ProductServices = {
  GetProductsFromDB,
  GetProductByIdFromDB,
  CreateProductIntoDB,
  UpdateProductIntoDB,
  DeleteProductFromDB,
  PopularProductFromDB,
};
