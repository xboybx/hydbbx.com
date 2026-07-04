"use client";

import { useState, useEffect } from "react";
import { LuMicVocal } from "react-icons/lu";
import Image from "next/image";

export default function ImageCarousel() {
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<string[]>(["/home1.webp", "/home2.webp"]);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [isWildcardActive, setIsWildcardActive] = useState(false);

  useEffect(() => {
    const checkWildcard = async () => {
      try {
        const res = await fetch("/api/wildcard");
        const data = await res.json();
        if (data && data.isActive) {
          setIsWildcardActive(true);
        }
      } catch (err) {
        console.error("Error checking wildcard status in ImageCarousel:", err);
      }
    };
    checkWildcard();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/home-images");
        const data = await res.json();

        if (data && data.length > 0) {
          // Keep local images first for performance, then append DB images
          const dbImages = data.map((item: any) => item.image);
          setImages(["/home1.webp", "/home2.webp", ...dbImages]);
        }
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      } finally {
        setIsCarouselVisible(true);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div id="home" className="relative h-screen overflow-hidden bg-black">
      <div
        className={`absolute inset-0 transition-opacity duration-400 ${isCarouselVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="hero-gradient absolute inset-0" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 max-w-5xl mt-28 md:mt-36">
          <LuMicVocal className="w-16 h-16 mx-auto mb-6 text-white animate-pulse" />
          <h1 className="text-4xl md:text-8xl font-bold mb-8 text-gradient tracking-tight">
            Hyderabad Beatbox Community
          </h1>
          <p className="text-xl md:text-xl text-white/60 max-w-2xl mx-auto">
            Uniting rhythms, creating beats, building community
          </p>
          {isWildcardActive && (
            <button
              onClick={() => {
                window.location.href = "/wildcard";
              }}
              className="mt-8 px-6 sm:px-8 py-3.5 sm:py-4 text-white rounded-full font-bold text-xs sm:text-sm md:text-base hover:scale-105 transition-all duration-300 cursor-pointer inline-block font-sans max-w-full btn-wildcard-premium"
            >
              Submit Wildcards Now!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
