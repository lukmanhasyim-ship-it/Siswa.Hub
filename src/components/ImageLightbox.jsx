import { useState, useEffect, useCallback } from 'react';

export default function ImageLightbox({ images, initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Sync index with initialIndex when lightbox opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, goToPrev, goToNext]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentUrl = images[currentIndex];
  const driveIdMatch = currentUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || currentUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const driveId = driveIdMatch ? driveIdMatch[1] : null;
  
  // Use a more reliable thumbnail URL for Drive files in lightbox to avoid scan warnings
  const fullSizeUrl = driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200` : currentUrl;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-full max-h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={fullSizeUrl}
          alt={`Bukti ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          onError={(e) => { 
            // Fallback if the thumbnail API fails
            if (driveId && !e.target.src.includes('uc?export=view')) {
                e.target.src = `https://drive.google.com/uc?export=view&id=${driveId}`;
            } else {
                e.target.src = currentUrl; 
            }
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-[-50px] md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-all border border-white/20"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-[-50px] md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md transition-all border border-white/20"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase px-4 py-1.5 rounded-full border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-[-50px] md:top-4 right-0 md:right-4 bg-white/10 hover:bg-rose-500/80 text-white rounded-full p-3 backdrop-blur-md transition-all border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
