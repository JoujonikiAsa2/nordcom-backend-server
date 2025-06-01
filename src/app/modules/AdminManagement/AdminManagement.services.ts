import { OrderStatus, UserStatus } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import httpStatus from "http-status";

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDayOfCurrentMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0,
  23,
  59,
  59,
  999
);

// Last Month (Previous Month)
const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const lastDayOfLastMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
  0,
  23,
  59,
  59,
  999
);

// Next Month
const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const lastDayOfNextMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 2,
  0,
  23,
  59,
  59,
  999
);
console.log({
  month,
  daysInMonth,
  firstDayOfCurrentMonth,
  lastDayOfCurrentMonth,
  firstDayOfLastMonth,
  lastDayOfLastMonth,
});

const ChangeUserStatusInDB = async (id: string, status: UserStatus) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!existingUser)
    throw new ApiError(httpStatus.NOT_FOUND, "User Not Found.");
  // Update user status
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  if (!updatedUser)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user status."
    );

  return updatedUser;
};

const GetAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return users;
};

const GetOrdersByStatusFromDB = async () => {
  const orders = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });
  const modifiedOrders = orders.map((order) => ({
    status: order.status,
    count: order._count,
  }));

  console.log("orders", modifiedOrders);
  return modifiedOrders;
};
const GetMonthlySalesFromDB = async () => {
  const sales =
    await prisma.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month, SUM("totalAmount") AS "revenue" FROM "orders" group by month`;
  console.log("sales", sales);
  return sales;
};
const GetTopSellingProductsFromDB = async () => {
  const productData = await prisma.product.findMany({
    select: {
      name: true,
      quantitySold: true,
    },
    orderBy: {
      quantitySold: "desc",
    },
    take: 3,
  });
  console.log("productData", productData);
  return productData;
};
const GetSalesByCategoryFromDB = async () => {
  const orderItems = await prisma.orderItem.findMany({
    // where: {
    //   order: {
    //     status: "COMPLETED", // Only completed orders
    //   },
    // },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });
  const categoryRevenue: Record<string, number> = {};

  orderItems.forEach((item) => {
    const categoryName = item.product.category.name;
    const itemPrice = Math.floor(item.price);
    if (categoryRevenue[categoryName]) {
      categoryRevenue[categoryName] += itemPrice;
    } else {
      categoryRevenue[categoryName] = itemPrice;
    }
  });
  const revenueByCategory = Object.entries(categoryRevenue).map(
    ([categoryName, revenue]) => ({ categoryName, revenue })
  );
  console.log(revenueByCategory);
  return revenueByCategory;
};
const GetUsersGrowthFromDB = async () => {
  const users =
    await prisma.$queryRaw`SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"),'Mon') as month, CAST(COUNT("id") AS INT) as "users" FROM "user" group by month`;
  console.log("users", users);
  return users;
};

// Use these in your database query

const numberOfNewUsers = async () => {
  const newUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: firstDayOfCurrentMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });

  const growthRate = ((newUsers.length / daysInMonth) * 100).toFixed(2);

  // console.log("newUsers", growthRate);
  return { newUsersCount: newUsers.length, growthRate };
};

const getOverallGrowth = async () => {
  const totalOrders = await prisma.order.count();
  const ordersGrowth = ((totalOrders / daysInMonth) * 100).toFixed(2);
  const currentMonthRevenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      // status: "COMPLETED",
      createdAt: {
        gte: firstDayOfCurrentMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });

  const lastMonthRevenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      // status: "COMPLETED",
      createdAt: {
        gte: firstDayOfLastMonth,
        lt: firstDayOfCurrentMonth,
      },
    },
  });

  const currentRevenue = currentMonthRevenue._sum?.totalAmount || 0;
  const previousRevenue = lastMonthRevenue._sum?.totalAmount || 0;
  console.log("currentRevenue", currentRevenue, previousRevenue);

  const revenueGrowth =
    previousRevenue === 0
      ? 100
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  console.log(`Revenue Growth: ${revenueGrowth.toFixed(2)}%`);
  const totalProductSold = await prisma.orderItem.count({
    where: {
      // order: {
      //   status: OrderStatus.COMPLETED,
      // },
    },
  });
  const productSalesGrowth = ((totalProductSold / daysInMonth) * 100).toFixed(
    2
  );
  // console.log("ordersGrowth", productSalesGrowth, totalProductSold);
  const { newUsersCount, growthRate } = await numberOfNewUsers();
  return {
    totalOrders,
    totalRevenue: productSalesGrowth,
    totalProductSold,
    newUsersCount,
    ordersGrowth,
    revenueGrowth: revenueGrowth.toFixed(2),
    productSalesGrowth,
    growthRate,
  };
};

const GetAnalyticsFromDB = async () => {
  const analytics: Record<string, unknown> = {};
  console.log("halloooooooooooooooooooooo");
  analytics.orderStatusData = await GetOrdersByStatusFromDB();
  analytics.monthlySalesData = await GetMonthlySalesFromDB();
  analytics.topSellingProducts = await GetTopSellingProductsFromDB();
  analytics.salesByCategory = await GetSalesByCategoryFromDB();
  analytics.usersGrowth = await GetUsersGrowthFromDB();
  analytics.overAllGrowth = await getOverallGrowth();
  const newUsers = console.log("analytics", analytics);
  return analytics;
};

export const AdminManagementServices = {
  GetAllUsersFromDB,
  ChangeUserStatusInDB,
  GetOrdersByStatusFromDB,
  GetMonthlySalesFromDB,
  GetTopSellingProductsFromDB,
  GetSalesByCategoryFromDB,
  GetUsersGrowthFromDB,
  GetAnalyticsFromDB,
};
