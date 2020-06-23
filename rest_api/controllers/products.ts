import { Product } from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

let allProducts: Product[] = [
    {
        id: "1",
        name: "Sony Playstation 5",
        description: "Sony's Next Gen Gaming Console coming out on Holiday,2020",
        price: 499.0
    },
    {
        id: "2",
        name: "XBox Series X",
        description: "Microsoft's Next Gen Gaming Console coming out on Holiday,2020",
        price: 599.0
    }
]

const getProducts = ({ response }: { response: any }) => {
    response.body = {
        success: true,
        data: allProducts
    }
}

const getProduct = ({ params, response }: { params: { id: string }, response: any }) => {
    const product: Product | undefined = allProducts.find((p) => p.id === params.id);
    if (product) {
        response.status = 200;
        response.body = {
            success: true,
            data: product
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: "No Product Found"
        }
    }
}

const addProduct = async ({ request, response }: { request: any, response: any }) => {
    const body = await request.body();
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "No Data"
        }
    } else {
        var product: Product = body.value;
        product.id = v4.generate();
        allProducts.push(product);
        response.status = 201;
        response.body = {
            success: true,
            data: product
        }
    }
}

const updateProduct = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    const product: Product | undefined = allProducts.find((p) => p.id === params.id);
    if (product) {
        const body = await request.body();
        const updatedData: { name?: string; description?: string; price?: number } = body.value;
        allProducts = allProducts.map(p => p.id === params.id ? { ...p, ...updatedData } : p);
        response.status = 200
        response.body = {
            success: true,
            data: allProducts
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: "No Product Found"
        }
    }
}

const deleteProduct = async ({ params, response }: { params: { id: string }, response: any }) => {
    const product: Product | undefined = allProducts.find((p) => p.id === params.id);
    if (product) {
        allProducts = allProducts.filter(p => p.id !== params.id)
        response.status = 200
        response.body = {
            success: true,
            data: allProducts
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: "No Product Found"
        }
    }
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }