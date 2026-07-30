import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiGrid } from 'react-icons/fi';

export default function Hero() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let rafId = null;

    const updateVideo = () => {
      if (!video.duration) {
        rafId = requestAnimationFrame(updateVideo);
        return;
      }

      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      const totalScroll = sectionHeight + windowHeight;
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));

      video.currentTime = progress * video.duration;
      rafId = requestAnimationFrame(updateVideo);
    };

    rafId = requestAnimationFrame(updateVideo);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="nf-hero" ref={sectionRef}>
      <div className="nf-container">
        <div className="nf-hero-grid">
          <motion.div
            className="nf-hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              className="nf-hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              100% Organic & Fresh
            </motion.span>
            <h1 className="nf-hero-title">
              Natural <span className="nf-text-gradient">Foods</span>
            </h1>
            <h2 className="nf-hero-subtitle">Healthy Organic Foods Delivered Fresh Every Day</h2>
            <p className="nf-hero-desc">
              Fresh fruits, vegetables and nutrition products directly from farms. We bring you the goodness of nature with no preservatives, no chemicals — just pure, wholesome food.
            </p>
            <div className="nf-hero-btns">
              <Link to="/products" className="nf-btn nf-btn-primary nf-btn-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products" className="nf-btn nf-btn-outline nf-btn-lg">
                <FiGrid /> Explore Categories
              </Link>
            </div>

            <div className="nf-hero-stats">
              <div className="nf-stat">
                <strong>500+</strong>
                <span>Products</span>
              </div>
              <div className="nf-stat-divider" />
              <div className="nf-stat">
                <strong>10K+</strong>
                <span>Happy Customers</span>
              </div>
              <div className="nf-stat-divider" />
              <div className="nf-stat">
                <strong>100%</strong>
                <span>Organic</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="nf-hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="nf-hero-video-wrapper">
              <div className="nf-hero-image-placeholder">
                <video
                  ref={videoRef}
                  className="nf-hero-video"
                  src="/images/videoclip.mp4"
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
              <div className="nf-hero-float-card nf-float-1">
                <span className="nf-float-emoji">🌿</span>
                <div>
                  <strong>Fresh</strong>
                  <small>100% Organic</small>
                </div>
              </div>
              <div className="nf-hero-float-card nf-float-2">
                <span className="nf-float-emoji">🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <small>On orders above Rs. 500</small>
                </div>
              </div>
              <div className="nf-hero-float-card nf-float-3">
                <span className="nf-float-emoji">⭐</span>
                <div>
                  <strong>4.9 Rating</strong>
                  <small>From 10K+ customers</small>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
