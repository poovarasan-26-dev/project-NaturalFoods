import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiShield, FiTruck } from 'react-icons/fi';

export default function About() {
  const features = [
    { icon: <FiTarget />, title: 'Our Mission', desc: 'To make healthy eating accessible, affordable, and convenient for everyone.' },
    { icon: <FiHeart />, title: 'Quality First', desc: 'Every product is carefully selected to ensure the highest quality and nutritional value.' },
    { icon: <FiShield />, title: '100% Organic', desc: 'We partner only with certified organic farms that follow sustainable practices.' },
    { icon: <FiTruck />, title: 'Fresh Delivery', desc: 'From farm to your doorstep within 24 hours, ensuring maximum freshness.' },
  ];

  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            About Natural Foods
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Our story of bringing fresh, organic food to your table
          </motion.p>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          <div className="nf-about-grid">
            <motion.div
              className="nf-about-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Fresh From The Farm</h2>
              <p>
                Natural Foods was founded with a simple vision — to bridge the gap between local
                organic farmers and health-conscious consumers. We believe that everyone deserves
                access to fresh, nutritious food free from harmful chemicals and preservatives.
              </p>
              <p>
                Our journey started in the lush farmlands of Tamil Nadu, where we work directly
                with over 200 local farmers who practice organic and sustainable agriculture.
                By eliminating middlemen, we ensure fair prices for farmers and the freshest
                produce for our customers.
              </p>
              <p>
                From crisp vegetables to nutritious grains, from pure honey to farm-fresh dairy —
                every product in our catalog tells a story of care, quality, and commitment to
                your health.
              </p>
            </motion.div>
            <motion.div
              className="nf-about-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="nf-about-image-placeholder">
                <span>🥦</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="nf-section nf-section-alt">
        <div className="nf-container">
          <motion.div
            className="nf-section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Why Choose Us</h2>
            <p>We are committed to your health and satisfaction</p>
          </motion.div>
          <div className="nf-features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="nf-feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="nf-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
