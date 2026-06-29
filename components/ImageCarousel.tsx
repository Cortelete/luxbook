import React, { useState, useCallback, memo } from 'react';
import { ImageCarouselData } from '../lib/types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ImageCarouselProps {
    data: ImageCarouselData;
}

const ImageCarousel: React.FC<ImageCarouselProps> = memo(({ data }) => {
    const { caption, images } = data;
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, images]);

    if (!images || images.length === 0) {
        return (
            <div className="my-6 p-6 bg-light-hover dark:bg-dark-card border-2 border-dashed border-light-border dark:border-dark-border rounded-lg text-center">
                <p className="text-light-text-secondary dark:text-dark-text-secondary italic">
                    {caption || "Nenhuma imagem disponível."}
                </p>
            </div>
        );
    }
    
    return (
        <div className="my-6 w-full max-w-2xl mx-auto">
            <div className="relative group rounded-lg overflow-hidden shadow-lg bg-light-hover dark:bg-dark-card border border-light-border dark:border-dark-border">
                {images.length > 1 && (
                     <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
                        aria-label="Imagem Anterior"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                )}
                <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
                    <img 
                        src={images[currentIndex]} 
                        alt={`${caption} - Imagem ${currentIndex + 1}`} 
                        className="w-full h-full object-contain transition-transform duration-500 ease-in-out"
                    />
                </div>
                {images.length > 1 && (
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 focus:outline-none"
                        aria-label="Próxima Imagem"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                )}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                onClick={() => setCurrentIndex(slideIndex)}
                                className={`w-2 h-2 rounded-full transition-all ${currentIndex === slideIndex ? 'bg-gold scale-125' : 'bg-gray-400/70 hover:bg-white'}`}
                                aria-label={`Ir para a imagem ${slideIndex + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            {caption && (
                <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary mt-3 italic px-4">
                    {caption}
                </p>
            )}
        </div>
    );
});

export default ImageCarousel;