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
exports.cartServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
// new branch created
const addToCartInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating order in DB with payload:", payload);
    const { userId, items } = payload;
    if (!userId)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User ID is required.");
    if (!items)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Items are required.");
    // Check cart already exists for the user
    const existingCart = yield prisma_1.default.cart.findFirst({
        where: {
            userId,
        },
    });
    if (existingCart) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cart already exists for this user.");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const addToCartTable = yield tx.cart.create({
            data: {
                userId,
            },
        });
        if (!addToCartTable) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add to cart.");
        }
        const addCartIdToItemsArray = items.map((item) => (Object.assign(Object.assign({}, item), { cartId: addToCartTable.id })));
        const addToCartItemsTable = yield tx.cartItem.createMany({
            data: addCartIdToItemsArray,
        });
        if (!addToCartItemsTable) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add to cart items.");
        }
        return addToCartTable;
    }));
    if (!result)
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add to cart.");
    return result;
});
const updateCartInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating cart in DB with ID:", id, "and payload:", payload);
    const { items } = payload;
    if (!id)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cart ID is required.");
    const findExsitingCart = yield prisma_1.default.cart.findUnique({
        where: {
            id,
        },
    });
    if (!findExsitingCart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found.");
    }
    if (!items || items.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Items are required to update cart.");
    }
    // Update the cart items
    const updatedItems = items.map((item) => (Object.assign(Object.assign({}, item), { cartId: id })));
    let updateCartItems;
    for (const item of updatedItems) {
        const existingItem = yield prisma_1.default.cartItem.findFirst({
            where: {
                cartId: id,
                productId: item.productId,
            },
        });
        if (existingItem) {
            const updatedQuantity = existingItem.quantity + item.quantity;
            if (updatedQuantity > 0) {
                yield prisma_1.default.cartItem.update({
                    where: {
                        id: existingItem.id,
                    },
                    data: {
                        quantity: updatedQuantity,
                    },
                });
            }
            else {
                yield prisma_1.default.cartItem.delete({
                    where: {
                        id: existingItem.id,
                    },
                });
            }
        }
        else {
            if (item.quantity > 0) {
                yield prisma_1.default.cartItem.create({
                    data: {
                        cartId: id,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }
        }
    }
    if (!updateCartItems) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update cart items.");
    }
    return {
        message: "Cart updated successfully",
        updatedItems,
    };
    // Implement the logic to update the cart in the database
    // For example, you might use Prisma to update a cart item
});
exports.cartServices = {
    addToCartInDB,
    updateCartInDB,
};
