import type { FastifyPluginAsync } from "fastify";
import { findActiveProductById, listActiveProducts, listFormatsForProduct } from "../../db/repositories/products.js";
import { HttpError } from "../../lib/http/exceptions.js";
import { formatSuccessResponse } from "../../lib/http/response.js";

export const productsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    const items = await listActiveProducts(app.db);

    return formatSuccessResponse({ items });
  });

  app.get<{ Params: { id: string } }>("/:id", async (request) => {
    const product = await findActiveProductById(app.db, request.params.id);

    if (!product) {
      throw new HttpError(404, "PRODUCT_NOT_FOUND", "Product not found");
    }

    const availableFormats = await listFormatsForProduct(app.db, product.id);

    return formatSuccessResponse({
      product: {
        ...product,
        availableFormats
      }
    });
  });
};
