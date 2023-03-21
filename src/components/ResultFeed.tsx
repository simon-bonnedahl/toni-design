import ProductCard from "./ProductCard";

const ResultFeed: React.FC<{ products: any[] }> = ({ products }) => {
  return (
    <div className="grid gap-4  p-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          title={product.title}
          image={product.image}
          price={product.price}
          width={product.width}
          height={product.height}
          type={product.productType}
          material={product.material}
          json={product.JSON}
          id={product._id}
        />
      ))}
    </div>
  );
};

export default ResultFeed;
