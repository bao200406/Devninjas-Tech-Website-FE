import TableProduct from "../../../components/products/TableProducts";
import { getAllProducts } from "../../../services/productService";
export default async function ProductPage() {
  return (
    <>
      <TableProduct />
    </>
  );
}
