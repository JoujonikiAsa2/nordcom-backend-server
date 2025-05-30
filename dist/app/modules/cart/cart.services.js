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
const getCartFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { role, email } = user;
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    const userId = isUserExists.id;
    const data = yield prisma_1.default.cart.findFirst({
        where: {
            userId: isUserExists.id,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });
    console.log(data);
    const subtotal = (_a = data === null || data === void 0 ? void 0 : data.items) === null || _a === void 0 ? void 0 : _a.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);
    if (!data === null) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found.");
    }
    return { data, subtotal };
});
// new branch created
const addToCartInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, item } = payload;
    console.log(item, email);
    const isUserExists = yield prisma_1.default.user.findFirst({
        where: {
            email
        }
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User ID is required.");
    if (!item)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Items are required.");
    // Check cart already exists for the user
    const existingCart = yield prisma_1.default.cart.findFirst({
        where: {
            userId: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.id,
        },
    });
    if (!existingCart) {
        // add new cart and then add items to it
        if (item.quantity <= 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Quantity must be greater than 0.");
        }
        const addToCartTable = yield prisma_1.default.cart.create({
            data: {
                userId: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.id,
            },
        });
        // check if quantity is negative
        // add item to cart items table
        const addToCartItemsTable = yield prisma_1.default.cartItem.create({
            data: {
                cartId: addToCartTable.id,
                productId: item.productId,
                quantity: item.quantity,
            },
        });
        console.log(addToCartItemsTable);
        if (!addToCartTable || !addToCartItemsTable) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add to cart.");
        }
        return addToCartTable;
    }
    else {
        // find if the item is new to add
        const existingItem = yield prisma_1.default.cartItem.findFirst({
            where: {
                cartId: existingCart.id,
                productId: item.productId,
            },
        });
        if (existingItem) {
            // if item exists, update the quantity
            const udpatedQuantity = item.quantity;
            const updatedCartItem = yield prisma_1.default.cartItem.update({
                where: {
                    id: existingItem.id,
                    productId: existingItem.productId,
                },
                data: {
                    quantity: udpatedQuantity,
                },
            });
            if (!updatedCartItem) {
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update cart item.");
            }
            return updatedCartItem;
        }
        else {
            // if item does not exist, check if quantity is negative
            if (item.quantity <= 0) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Quantity must be greater than 0.");
            }
            // if item does not exist, add it to the cart items
            const addToCartItemsTable = yield prisma_1.default.cartItem.create({
                data: {
                    cartId: existingCart.id,
                    productId: item.productId,
                    quantity: item.quantity,
                },
            });
            console.log(addToCartItemsTable);
            if (!addToCartItemsTable) {
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add item to cart.");
            }
            return addToCartItemsTable;
        }
    }
});
const removeItemFromCartInDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findCartItem = yield prisma_1.default.cartItem.findUnique({
        where: { id },
    });
    if (!findCartItem) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart item not found.");
    }
    const deletedCartItem = yield prisma_1.default.cartItem.delete({
        where: { id },
        select: { product: true },
    });
    if (!deletedCartItem) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete cart item.");
    }
    return `${deletedCartItem.product.name} removed successfully.`;
});
const clearCartFromDB = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    const findCart = yield prisma_1.default.cart.findUnique({
        where: { id: cartId },
    });
    if (!findCart) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cart not found.");
    }
    const deletedCartItems = yield prisma_1.default.cartItem.deleteMany({
        where: { cartId },
    });
    if (!deletedCartItems) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete cart items.");
    }
    yield prisma_1.default.cart.delete({
        where: { id: cartId },
    });
    return "Cart cleared successfully.";
});
exports.cartServices = {
    getCartFromDB,
    addToCartInDB,
    removeItemFromCartInDB,
    clearCartFromDB,
};
