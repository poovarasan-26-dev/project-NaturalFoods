import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuthContext();

  if (!user) return null;

  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            My Profile
          </motion.h1>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          <motion.div
            className="nf-profile-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="nf-profile-avatar-lg">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2>{user.username}</h2>
            <div className="nf-profile-details">
              <div className="nf-profile-detail-item">
                <FiUser />
                <span>{user.username}</span>
              </div>
              <div className="nf-profile-detail-item">
                <FiMail />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="nf-profile-detail-item">
                  <FiPhone />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.date_joined && (
                <div className="nf-profile-detail-item">
                  <FiCalendar />
                  <span>Member since {new Date(user.date_joined).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
