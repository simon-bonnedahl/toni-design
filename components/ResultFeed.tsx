import ProductCard from "./ProductCard";

const ResultFeed: React.FC<{ products: any[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
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
          json={product.jsonURL}
        />
      ))}
    </div>
  );
};

export default ResultFeed;
