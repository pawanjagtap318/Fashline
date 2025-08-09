import ProductChart from "./TotalProducts/ProductChart"
import TopSellingProductsChart from "./TotalProducts/TopSellingProducts"

function Products() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 px-4">
  <div className="w-full xl:w-3/5">
    <ProductChart />
  </div>
  <div className="w-full xl:w-3/5">
    <TopSellingProductsChart />
  </div>
</div>

  )
}

export default Products;