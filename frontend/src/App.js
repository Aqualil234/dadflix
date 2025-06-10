import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Heart, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Plus, 
  Volume2, 
  VolumeX, 
  ZoomIn, 
  X,
  Moon,
  Sun,
  Grid3X3,
  Clock,
  Star
} from 'lucide-react';
import './App.css';

// Mock Data
const photoCollections = {
  popular: [
    {
      id: 1,
      title: "Epic Dad BBQ Sessions",
      thumbnail: "https://images.pexels.com/photos/8522771/pexels-photo-8522771.jpeg",
      photos: [
        "https://images.pexels.com/photos/8522771/pexels-photo-8522771.jpeg",
        "https://images.unsplash.com/photo-1535923987804-b43cb426f2ee",
        "https://images.pexels.com/photos/8522771/pexels-photo-8522771.jpeg"
      ],
      description: "Dad's legendary grilling adventures and BBQ masterpieces"
    },
    {
      id: 2,
      title: "Family Adventure Chronicles",
      thumbnail: "https://images.pexels.com/photos/39691/family-pier-man-woman-39691.jpeg",
      photos: [
        "https://images.pexels.com/photos/39691/family-pier-man-woman-39691.jpeg",
        "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9",
        "https://images.pexels.com/photos/32447390/pexels-photo-32447390.jpeg"
      ],
      description: "Unforgettable family moments and vacation memories"
    },
    {
      id: 3,
      title: "Workshop Wisdom",
      thumbnail: "https://images.pexels.com/photos/4482035/pexels-photo-4482035.jpeg",
      photos: [
        "https://images.pexels.com/photos/4482035/pexels-photo-4482035.jpeg",
        "https://images.unsplash.com/photo-1704249087698-5b80d6393d98",
        "https://images.pexels.com/photos/7491193/pexels-photo-7491193.jpeg"
      ],
      description: "Teaching the next generation valuable life skills"
    }
  ],
  recent: [
    {
      id: 4,
      title: "Lawn Care Champions",
      thumbnail: "https://images.pexels.com/photos/4933609/pexels-photo-4933609.jpeg",
      photos: [
        "https://images.pexels.com/photos/4933609/pexels-photo-4933609.jpeg",
        "https://images.pexels.com/photos/3933227/pexels-photo-3933227.jpeg"
      ],
      description: "Dad and junior tackling yard work together"
    },
    {
      id: 5,
      title: "Cooking Adventures",
      thumbnail: "https://images.unsplash.com/photo-1709869430224-76d56a7047d2",
      photos: [
        "https://images.unsplash.com/photo-1709869430224-76d56a7047d2",
        "https://images.pexels.com/photos/8522771/pexels-photo-8522771.jpeg"
      ],
      description: "Kitchen experiments and culinary discoveries"
    }
  ],
  favorites: [
    {
      id: 6,
      title: "Best Friend Bonds",
      thumbnail: "https://images.pexels.com/photos/2958113/pexels-photo-2958113.jpeg",
      photos: [
        "https://images.pexels.com/photos/2958113/pexels-photo-2958113.jpeg",
        "https://images.unsplash.com/photo-1615592704797-3f3e0498b958"
      ],
      description: "Dad and pet companionship moments"
    }
  ]
};

// Main App Component
function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSection, setCurrentSection] = useState('home');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedCollection) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            navigatePhoto('prev');
            break;
          case 'ArrowRight':
            e.preventDefault();
            navigatePhoto('next');
            break;
          case 'Escape':
            closeSlideshow();
            break;
          case ' ':
            e.preventDefault();
            toggleAutoPlay();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCollection, currentPhotoIndex]);

  // Auto-play slideshow
  useEffect(() => {
    let interval;
    if (isPlaying && selectedCollection) {
      interval = setInterval(() => {
        navigatePhoto('next');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedCollection, currentPhotoIndex]);

  const navigatePhoto = (direction) => {
    if (!selectedCollection) return;
    
    const photos = selectedCollection.photos;
    if (direction === 'next') {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
    } else {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const openSlideshow = (collection) => {
    setSelectedCollection(collection);
    setCurrentPhotoIndex(0);
    setIsPlaying(false);
  };

  const closeSlideshow = () => {
    setSelectedCollection(null);
    setCurrentPhotoIndex(0);
    setIsPlaying(false);
    setIsZoomed(false);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DadflixHome 
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              photoCollections={photoCollections}
              openSlideshow={openSlideshow}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            />
          } />
        </Routes>
      </BrowserRouter>

      {/* Slideshow Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <SlideshowModal
            collection={selectedCollection}
            currentPhotoIndex={currentPhotoIndex}
            navigatePhoto={navigatePhoto}
            closeSlideshow={closeSlideshow}
            isPlaying={isPlaying}
            toggleAutoPlay={toggleAutoPlay}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isZoomed={isZoomed}
            setIsZoomed={setIsZoomed}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Home Component
const DadflixHome = ({ 
  isDarkMode, 
  toggleTheme, 
  photoCollections, 
  openSlideshow,
  searchQuery,
  setSearchQuery,
  currentSection,
  setCurrentSection
}) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar 
        isDarkMode={isDarkMode}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        {/* Hero Section */}
        <HeroSection isDarkMode={isDarkMode} />
        
        {/* Content Sections */}
        <div className="px-8 pb-8 space-y-8">
          <PhotoCarousel
            title="Popular Photo Collections"
            collections={photoCollections.popular}
            onCollectionClick={openSlideshow}
            isDarkMode={isDarkMode}
          />
          
          <PhotoCarousel
            title="Recently Added Memories"
            collections={photoCollections.recent}
            onCollectionClick={openSlideshow}
            isDarkMode={isDarkMode}
          />
          
          <PhotoCarousel
            title="Dad's Favorites"
            collections={photoCollections.favorites}
            onCollectionClick={openSlideshow}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isDarkMode, currentSection, setCurrentSection }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'recent', label: 'Recently Added', icon: Clock },
    { id: 'favorites', label: "Dad's Favorites", icon: Heart },
    { id: 'collections', label: 'Photo Albums', icon: Grid3X3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full w-64 p-6 z-30 ${
        isDarkMode ? 'bg-black' : 'bg-white border-r border-gray-200'
      }`}
    >
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-600">DADFLIX</h1>
      </div>
      
      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentSection === item.id
                  ? 'bg-red-600 text-white'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

// Header Component
const Header = ({ isDarkMode, toggleTheme, searchQuery, setSearchQuery }) => {
  return (
    <div className={`flex items-center justify-between p-6 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    } border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search photo collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
        </div>
      </div>
      
      {/* User Profile & Theme Toggle */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
        
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1641034189433-d2e405da28de"
            alt="Dad's Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">Dad's Profile</span>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ isDarkMode }) => {
  return (
    <div className="relative h-96 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1641034189433-d2e405da28de')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
      </div>
      
      <div className="relative z-10 flex items-center h-full px-8">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4"
          >
            Dad Life Chronicles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 mb-6"
          >
            Capturing the epic moments, dad jokes, and family adventures that make life extraordinary.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <Play size={20} />
            <span>Start Viewing</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Photo Carousel Component
const PhotoCarousel = ({ title, collections, onCollectionClick, isDarkMode }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const carouselRef = React.useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 400;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const handleFavoriteClick = (e, collectionId) => {
    e.stopPropagation();
    console.log('Added to favorites:', collectionId);
    // Add favorite logic here
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      <div 
        className="relative"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        {/* Left Arrow */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showArrows ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('left')}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full ${
            isDarkMode ? 'bg-black/80 text-white' : 'bg-white/90 text-gray-900'
          } shadow-lg transition-all duration-200 hover:scale-110`}
          style={{ pointerEvents: showArrows ? 'auto' : 'none' }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCollectionClick(collection)}
              className="relative flex-shrink-0 w-80 h-48 rounded-lg overflow-hidden cursor-pointer group"
            >
              <img
                src={collection.thumbnail}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                <h4 className="text-white font-semibold text-lg mb-1">{collection.title}</h4>
                <p className="text-gray-300 text-sm">{collection.description}</p>
              </div>
              
              {/* Play Button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-red-600 rounded-full p-3">
                  <Play className="text-white" size={24} />
                </div>
              </div>
              
              {/* Add to Favorites */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleFavoriteClick(e, collection.id)}
                className="absolute top-3 right-3 p-2 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 z-10"
              >
                <Heart size={18} fill="currentColor" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showArrows ? 1 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scroll('right')}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full ${
            isDarkMode ? 'bg-black/80 text-white' : 'bg-white/90 text-gray-900'
          } shadow-lg transition-all duration-200 hover:scale-110`}
          style={{ pointerEvents: showArrows ? 'auto' : 'none' }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
};

// Slideshow Modal Component
const SlideshowModal = ({
  collection,
  currentPhotoIndex,
  navigatePhoto,
  closeSlideshow,
  isPlaying,
  toggleAutoPlay,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  isZoomed,
  setIsZoomed,
  isDarkMode
}) => {
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Controls Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black via-black/50 to-transparent z-20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{collection.title}</h2>
            <p className="text-gray-300">{currentPhotoIndex + 1} of {collection.photos.length}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Zoom Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.8)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsZoomed(!isZoomed)}
              className={`p-3 rounded-full text-white transition-all duration-200 ${
                isZoomed ? 'bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
              title="Zoom"
            >
              <ZoomIn size={20} />
            </motion.button>
            
            {/* Play/Pause */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleAutoPlay}
              className={`p-3 rounded-full text-white transition-all duration-200 ${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-red-600'
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-1 h-4 bg-white mr-1"></div>
                  <div className="w-1 h-4 bg-white"></div>
                </div>
              ) : (
                <Play size={20} />
              )}
            </motion.button>
            
            {/* Volume Control */}
            <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleMuteToggle}
                className="p-1 text-white hover:text-red-400 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </motion.button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                title="Volume"
              />
            </div>
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.8)" }}
              whileTap={{ scale: 0.9 }}
              onClick={closeSlideshow}
              className="p-3 bg-white/20 rounded-full text-white hover:bg-red-600 transition-all duration-200"
              title="Close"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Photo Display */}
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.img
          key={currentPhotoIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: isZoomed ? 1.5 : 1 
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          src={collection.photos[currentPhotoIndex]}
          alt={`${collection.title} - Photo ${currentPhotoIndex + 1}`}
          className="max-w-full max-h-full object-contain cursor-pointer select-none"
          onClick={() => setIsZoomed(!isZoomed)}
          onDragStart={(e) => e.preventDefault()}
        />
        
        {/* Navigation Arrows */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigatePhoto('prev')}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 p-4 bg-black/60 rounded-full text-white transition-all duration-200 z-10"
          title="Previous photo"
        >
          <ChevronLeft size={32} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigatePhoto('next')}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 bg-black/60 rounded-full text-white transition-all duration-200 z-10"
          title="Next photo"
        >
          <ChevronRight size={32} />
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 z-20">
        <div className="flex space-x-2 mb-4">
          {collection.photos.map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                // Navigate to specific photo
                const photos = collection.photos;
                const photoIndex = index;
                // This would need to be connected to the parent state
              }}
              className={`h-2 flex-1 rounded cursor-pointer transition-all duration-200 ${
                index === currentPhotoIndex ? 'bg-red-600' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Keyboard Shortcuts Info */}
        <div className="text-center text-gray-400 text-sm">
          <span>Use ← → arrow keys to navigate • Space to play/pause • ESC to close</span>
        </div>
      </div>
    </motion.div>
  );
};

export default App;