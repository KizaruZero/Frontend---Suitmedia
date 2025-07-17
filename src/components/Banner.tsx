import React, { useState, useEffect } from "react";

interface BannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({
  title = "Ideas",
  subtitle = "Where all our great things begin",
  backgroundImage = "/api/placeholder/1200/600",
  className = "",
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={`relative h-[500px] overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${scrollY * 0.5}px)`,
          filter: "brightness(0.4)",
        }}
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div
          className="text-center text-white px-4"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wide">
            {title}
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-white transform origin-bottom-left -skew-y-3  translate-y-3/4" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
    </section>
  );
};

export default Banner;
