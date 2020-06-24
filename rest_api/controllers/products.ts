import { Product } from "../types.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { dbCredentials } from "../config.ts";

const client = new Client(dbCredentials);

let allProducts: Product[] = [
  {
    id: "1",
    name: "Sony Playstation 5",
    description: "Sony's Next Gen Gaming Console coming out on Holiday,2020",
    price: 499.0,
  },
  {
    id: "2",
    name: "XBox Series X",
    description:
      "Microsoft's Next Gen Gaming Console coming out on Holiday,2020",
    price: 599.0,
  },
];

const getProducts = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    var result = await client.query("SELECT * FROM products");
    const products = new Array();
    result.rows.map((row) => {
      let obj: any = new Object();
      result.rowDescription.columns.map((el, i) => {
        obj[el.name] = row[i];
      });
      products.push(obj);
    });
    response.body = {
      success: true,
      data: products,
    };
  } catch (err) {
    response.status = 500;
    response.body = {
      success: false,
      msg: err.toString(),
    };
  } finally {
    await client.end();
  }
};

const getProduct = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  try {
    await client.connect();
    var result = await client.query(
      "SELECT * FROM products where id = $1",
      params.id,
    );
    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        success: false,
        msg: "Product not found",
      };
    } else {
      var product: Object = new Object();
      result.rows.map((row) => {
        let obj: any = new Object();
        result.rowDescription.columns.map((el, i) => {
          obj[el.name] = row[i];
        });
        product = obj;
      });
      response.body = {
        success: true,
        data: product,
      };
    }
  } catch (err) {
    response.status = 500;
    response.body = {
      success: false,
      msg: err.toString(),
    };
  } finally {
    await client.end();
  }
};

const addProduct = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const product = body.value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No Data",
    };
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO products(name,description,price) VALUES($1,$2,$3)",
        product.name,
        product.description,
        product.price,
      );
      response.status = 201;
      response.body = {
        success: true,
        data: product,
      };
    } catch (error) {
      console.log(error);
      response.status = 500;
      response.body = {
        success: false,
        msg: error.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

const updateProduct = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },
) => {
  await getProduct({ params: { "id": params.id }, response });
  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      msg: "Product not found",
    };
  } else {
    try {
      const body = await request.body();
      const product = body.value;
      await client.connect();
      const result = await client.query(
        "UPDATE products SET name=$1, description=$2, price=$3 WHERE id = $4",
        product.name,
        product.description,
        product.price,
        params.id,
      );
      response.status = 200;
      response.body = {
        success: true,
        data: product,
      };
    } catch (error) {
      console.log(error);
      response.status = 500;
      response.body = {
        success: false,
        msg: error.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

const deleteProduct = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  await getProduct({ params: { "id": params.id }, response });
  if (response.status === 404) {
    response.status = 404;
    response.body = {
      success: false,
      msg: "Product not found",
    };
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "DELETE FROM products WHERE id = $1",
        params.id,
      );
      response.status = 200;
      response.body = {
        success: true,
        msg: "Deleted Successfully",
      };
    } catch (error) {
      console.log(error);
      response.status = 500;
      response.body = {
        success: false,
        msg: error.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
