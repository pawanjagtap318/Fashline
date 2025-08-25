import ProductChart from "./TotalProducts/ProductChart"
import TopRatedProductsChart from "./TotalProducts/TopRatedProductsChart";
import TopSellingProductsChart from "./TotalProducts/TopSellingProducts"

function Products() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 px-4">
  <div className="w-full xl:w-4/5">
    <ProductChart />
  </div>
  <div className="w-full xl:w-4/5">
    <TopSellingProductsChart />
  </div>
  <div className="w-full xl:w-4/5">
    <TopRatedProductsChart />
  </div>
</div>

  )
}

export default Products;