import { useSearchParams } from 'react-router-dom'
import { HiAdjustmentsHorizontal } from "react-icons/hi2"

function SortOptions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  }

  return (
    <div className="mb-6 flex items-center justify-end">
      <div className="flex items-center gap-2 bg-white shadow-sm border rounded-lg px-3 py-2">
        <HiAdjustmentsHorizontal className="text-gray-600 w-5 h-5" />
        <label htmlFor="sort" className="text-sm font-medium text-gray-700 hidden sm:block">
          Sort by:
        </label>
        <select
          id="sort"
          value={searchParams.get("sortBy") || ""}
          onChange={handleSortChange}
          className="text-sm border-0 bg-transparent focus:ring-0 cursor-pointer"
        >
          <option value="">Default</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
    </div>
  )
}

export default SortOptions
