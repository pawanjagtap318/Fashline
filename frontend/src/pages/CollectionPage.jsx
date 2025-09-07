import { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa"
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

function CollectionPage() {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleClicksOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  }

  useEffect(() => {
    // Add EventListener for clicks
    document.addEventListener("mousedown", handleClicksOutside);

    // Clean event listener
    return () => {
      document.removeEventListener("mousedown", handleClicksOutside);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-0 z-40 bg-white p-3 border-b shadow-sm flex items-center justify-between">
        <h2 className="text-xl font-extrabold uppercase tracking-wide">
          {"All Collections"}
        </h2>
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 
        lg:w-96 w-52 bg-white shadow-2xl overflow-y-auto transition-transform duration-300
        lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:bg-gray-100`}
      >
        <FilterSidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 lg:p-6">
        {/* Header & Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide uppercase">
            {"All Collections"}
          </h2>
          <div className="mt-3 lg:mt-0">
            <SortOptions />
          </div>
        </div>

        {/* Product Grid */}
        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>
    </div>
  )
}

export default CollectionPage;
