import { useState, useEffect } from 'react';
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

  // Check for browser speech recognition support
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false; // stop after one sentence
    recognition.interimResults = false; // only final results
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
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full bg-white h-28 z-50"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            {/* Search Icon */}
            <button
              type="submit"
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>

            {/* Voice Search Icon */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                listening ? "text-red-500" : "text-gray-600"
              } hover:text-gray-800`}
            >
              <HiMicrophone className="h-6 w-6" />
            </button>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;