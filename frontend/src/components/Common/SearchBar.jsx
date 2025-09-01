import { useState, useEffect, useRef } from 'react';
import { HiMagnifyingGlass, HiMiniXMark, HiMicrophone } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSlice';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  }

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
    setIsOpen(false);
  };

  const handleVoiceSearch = () => {
    if (!recognition) {
      alert("Voice search not supported in this browser.");
      return;
    }

    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setListening(false);
      // Automatically search after voice input
      dispatch(setFilters({ search: transcript }));
      dispatch(fetchProductsByFilters({ search: transcript }));
      navigate(`/collections/all?search=${transcript}`);
      setIsOpen(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  }, [recognition, dispatch, navigate]);

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-500 ${isOpen
        ? "fixed top-0 left-0 w-full h-28 bg-white z-50 shadow-lg"
        : "w-auto"
        }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          {/* Search Input Box */}
          <div className="relative w-11/12 sm:w-3/4 md:w-1/2">
            <input
              type="text"
              ref={inputRef}
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-5 py-3 rounded-2xl shadow-md w-full 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 text-gray-800"
            />

            {/* Search Icon */}
            <button
              type="submit"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>

            {/* Voice Search Icon */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 
                ${listening ? "text-red-500 animate-pulse" : "text-gray-600 hover:text-indigo-600"} 
                transition`}
            >
              <HiMicrophone className="h-6 w-6" />
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-red-500 transition"
          >
            <HiMiniXMark className="h-7 w-7" />
          </button>
        </form>
      ) : (
        <button
          onClick={handleSearchToggle}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;