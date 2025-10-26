import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [activeSection, setActiveSection] = useState('');
  // Removed showInterviewModal state - now using separate page

  // Get user info from localStorage
  useEffect(() => {
    const name = localStorage.getItem('name') || 'Guest';
    const role = localStorage.getItem('role') || 'User';
    setUserInfo({ name, role });
  }, []);

  // Detect active section on scroll (only on home page)
  useEffect(() => {
    if (location.pathname !== '/home') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const sections = ['about', 'program', 'courses'];
      const navHeight = 80;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          const scrollPosition = window.scrollY + navHeight + 100; // Add some offset

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Navigation items
  const navigationItems = [
    {
      id: 'home',
      label: 'HOME',
      path: '/home',
      description: 'Dashboard and overview',
      category: 'main'
    },
    {
      id: 'upload',
      label: 'UPLOAD',
      path: '/uploader',
      description: 'Scroll to upload section',
      category: 'content'
    },
    {
      id: 'retrieve',
      label: 'RETRIEVE',
      path: '/retriever',
      description: 'Scroll to retrieve section',
      category: 'content'
    }
    
   
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    const targetItem = navigationItems.find(item => item.path === path);

    // Handle special case for Interview - redirect to preparation page
    if (path === '/interview') {
      navigate('/interview-prep');
      setIsMenuOpen(false);
      return;
    }

    // Handle special cases for Upload and Retrieve - scroll to sections on Home page
    if (path === '/uploader' || path === '/retriever') {
      const sectionId = path === '/uploader' ? 'program' : 'courses';
      const sectionName = path === '/uploader' ? 'Upload' : 'Retrieve';

      // If not on home page, navigate to home first then scroll
      if (location.pathname !== '/home') {
        navigate('/home');
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      } else {
        // Already on home page, just scroll
        scrollToSection(sectionId);
      }

      setNotificationText(`Scrolling to ${sectionName} section...`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      // Normal navigation for other items
      if (targetItem) {
        setNotificationText(`Navigating to ${targetItem.label}...`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }
      navigate(path);
    }

    setIsMenuOpen(false);
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Height of the fixed navigation
      const elementPosition = element.offsetTop - navHeight - 20; // Extra 20px padding

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // handleStartTest removed - now handled in InterviewPrep page

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Check if current path is active
  const isActivePath = (path) => {
    if (path.includes('/dashboard/')) {
      return location.pathname.includes('/dashboard/');
    }

    // Special handling for Upload and Retrieve - they're sections on Home page
    if (path === '/uploader') {
      return location.pathname === '/home' && activeSection === 'program';
    }
    if (path === '/retriever') {
      return location.pathname === '/home' && activeSection === 'courses';
    }

    return location.pathname === path;
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    if (location.pathname === '/home') {
      if (activeSection === 'program') return 'UPLOAD';
      if (activeSection === 'courses') return 'RETRIEVE';
      return 'HOME';
    }
    const currentItem = navigationItems.find(item => isActivePath(item.path));
    return currentItem ? currentItem.label : 'STUDCARE';
  };

  // Don't show navigation on login/signup pages and interview pages
  if (location.pathname === '/login' ||
      location.pathname.includes('/signup') ||
      location.pathname === '/' ||
      location.pathname === '/start') {
    return null;
  }

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo" onClick={() => handleNavigation('/home')}>
          <div className="logo-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <span className="logo-text">StudCare</span>
        </div>

        {/* Current Page Indicator */}
        <div className="current-page-indicator">
          <span className="page-title">{getCurrentPageTitle()}</span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-items-desktop">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
              title={item.description}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Info & Actions */}
        <div className="nav-user-section">
          <div className="user-info">
            <span className="user-name">{userInfo.name}</span>
            <span className="user-role">{userInfo.role}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-text">LOGOUT</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="mobile-user-details">
              <span className="mobile-user-name">{userInfo.name}</span>
              <span className="mobile-user-role">{userInfo.role}</span>
            </div>
          </div>
        </div>

        <div className="mobile-nav-items">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`mobile-nav-item ${isActivePath(item.path) ? 'active' : ''}`}
            >
              <div className="mobile-nav-content">
                <span className="mobile-nav-label">{item.label}</span>
                <span className="mobile-nav-description">{item.description}</span>
              </div>
              <span className="mobile-nav-arrow">→</span>
            </button>
          ))}
        </div>

        <div className="mobile-nav-footer">
          <button className="mobile-logout-btn" onClick={handleLogout}>
            <span className="mobile-logout-text">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Navigation Notification */}
      {showNotification && (
        <div className="nav-notification">
          <span className="notification-icon">🚀</span>
          <span className="notification-text">{notificationText}</span>
        </div>
      )}

      {/* 3D Interview experience now on separate page */}
    </nav>
  );
};

export default Navigation;
