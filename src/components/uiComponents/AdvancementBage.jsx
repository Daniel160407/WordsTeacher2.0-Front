import { FaTrophy, FaLock } from 'react-icons/fa';

const AdvancementBadge = ({ text, icon, earned }) => {
  return (
    <div className={`advancement-badge ${earned ? 'earned' : 'locked'}`}>
      <div className="advancement-badge-icon">
        {icon || (earned ? <FaTrophy /> : <FaLock />)}
      </div>
      <div className="advancement-badge-text">{text}</div>
    </div>
  );
};

export default AdvancementBadge;
