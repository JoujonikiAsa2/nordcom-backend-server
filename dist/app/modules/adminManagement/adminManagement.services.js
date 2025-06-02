"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminManagementServices = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
// Last Month (Previous Month)
const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// Next Month
const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const ChangeUserStatusInDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!existingUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    // Update user status
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    if (!updatedUser)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update user status.");
    return updatedUser;
});
const GetAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return users;
});
const GetOrdersByStatusFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma_1.default.order.groupBy({
        by: ["status"],
        _count: true,
    });
    const modifiedOrders = orders.map((order) => ({
        status: order.status,
        count: order._count,
    }));
    console.log("orders", modifiedOrders);
    return modifiedOrders;
});
const GetMonthlySalesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const sales = yield prisma_1.default.$queryRaw `SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month, SUM("totalAmount") AS "revenue" FROM "orders" group by month`;
    console.log("sales", sales);
    return sales;
});
const GetTopSellingProductsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const productData = yield prisma_1.default.product.findMany({
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
});
const GetSalesByCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const orderItems = yield prisma_1.default.orderItem.findMany({
        where: {
            order: {
                status: "COMPLETED",
            },
        },
        include: {
            product: {
                include: {
                    category: true,
                },
            },
        },
    });
    const categoryRevenue = {};
    orderItems.forEach((item) => {
        const categoryName = item.product.category.name;
        const itemPrice = Math.floor(item.price);
        if (categoryRevenue[categoryName]) {
            categoryRevenue[categoryName] += itemPrice;
        }
        else {
            categoryRevenue[categoryName] = itemPrice;
        }
    });
    const revenueByCategory = Object.entries(categoryRevenue).map(([categoryName, revenue]) => ({ categoryName, revenue }));
    console.log(revenueByCategory);
    return revenueByCategory;
});
const GetUsersGrowthFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.$queryRaw `SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"),'Mon') as month, CAST(COUNT("id") AS INT) as "users" FROM "user" group by month`;
    console.log("users", users);
    return users;
});
// Use these in your database query
const numberOfNewUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const newUsers = yield prisma_1.default.user.findMany({
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
});
const getOverallGrowth = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const totalOrders = yield prisma_1.default.order.count();
    const ordersGrowth = ((totalOrders / daysInMonth) * 100).toFixed(2);
    const currentMonthRevenue = yield prisma_1.default.order.aggregate({
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
    const lastMonthRevenue = yield prisma_1.default.order.aggregate({
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
    const currentRevenue = ((_a = currentMonthRevenue._sum) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0;
    const previousRevenue = ((_b = lastMonthRevenue._sum) === null || _b === void 0 ? void 0 : _b.totalAmount) || 0;
    console.log("currentRevenue", currentRevenue, previousRevenue);
    const revenueGrowth = previousRevenue === 0
        ? 100
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    console.log(`Revenue Growth: ${revenueGrowth.toFixed(2)}%`);
    const totalProductSold = yield prisma_1.default.orderItem.count({
        where: {
            order: {
                status: client_1.OrderStatus.COMPLETED,
            },
        },
    });
    const productSalesGrowth = ((totalProductSold / daysInMonth) * 100).toFixed(2);
    // console.log("ordersGrowth", productSalesGrowth, totalProductSold);
    const { newUsersCount, growthRate } = yield numberOfNewUsers();
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
});
const GetAnalyticsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const analytics = {};
    console.log("halloooooooooooooooooooooo");
    analytics.orderStatusData = yield GetOrdersByStatusFromDB();
    analytics.monthlySalesData = yield GetMonthlySalesFromDB();
    analytics.topSellingProducts = yield GetTopSellingProductsFromDB();
    analytics.salesByCategory = yield GetSalesByCategoryFromDB();
    analytics.usersGrowth = yield GetUsersGrowthFromDB();
    analytics.overAllGrowth = yield getOverallGrowth();
    const newUsers = console.log("analytics", analytics);
    return analytics;
});
exports.AdminManagementServices = {
    GetAllUsersFromDB,
    ChangeUserStatusInDB,
    GetOrdersByStatusFromDB,
    GetMonthlySalesFromDB,
    GetTopSellingProductsFromDB,
    GetSalesByCategoryFromDB,
    GetUsersGrowthFromDB,
    GetAnalyticsFromDB,
};
