import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { Link } from 'react-router-dom';
import axios from 'axios';

function NewArrivals() {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchNewArrivals();
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft)
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const scroll = (direction) => {
        const scrollAmount = direction === "left" ? -350 : 350;
        scrollRef.current.scrollBy({ left: scrollAmount, behaviour: "smooth" });
    };

    // Update Scroll Buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current;

        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScroll = container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScroll);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, [newArrivals]);


    return (
        <section className="py-2 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">✨ Explore New Arrivals</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Discover the latest styles, freshly added to keep your wardrobe on
                    the cutting edge of fashion.
                </p>

                {/* Scroll Buttons */}
                <div className="absolute right-0 bottom-[-40px] flex space-x-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-3 rounded-full shadow-md transition ${canScrollLeft
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-3 rounded-full shadow-md transition ${canScrollRight
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative scroll-smooth no-scrollbar ${isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                {newArrivals.map((product) => (
                    <div
                        key={product._id}
                        className="min-w-[80%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%] relative group rounded-xl overflow-hidden shadow-lg"
                    >
                        <img
                            src={product.images[0].url}
                            alt={product.images[0].altText || product.name}
                            className="w-full h-[420px] object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
                            draggable="false"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end">
                            <div className="p-4 text-white w-full">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h4 className="font-semibold text-lg">{product.name}</h4>
                                    <p className="mt-1 text-gray-200">${product.price}</p>
                                </Link>
                                <Link
                                    to={`/product/${product._id}`}
                                    className="mt-3 inline-block bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default NewArrivals;