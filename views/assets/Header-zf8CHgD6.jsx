import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import Helpers from "../Helpers/Helpers";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Header = ({ selectedTab, setSelectedTab, isToggle, setIsToggle }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [headerColor, setHeaderColor] = useState("transparent"); // State for header color

  useEffect(() => {
    // Set initial header color based on current URL
    const initialColor = location.pathname === "/" ? "transparent" : "black";
    setHeaderColor(initialColor);

    const handleScroll = () => {
      const header = document.getElementById("header");
      if (window.scrollY > 100) {
        setHeaderColor("black");
      } else {
        setHeaderColor(initialColor); // Reset to initial color when scrolling back up
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]); // Add location.pathname to dependency array

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    navigate(tab);
  };

  const toggleMobileMenu = () => {
    setIsToggle(!isToggle);
  };

  useEffect(() => {
    Helpers.loadScript("assets/js/vendor/jquery-3.7.0.min.js")
      .then(() => Helpers.loadScript("assets/js/vendor/jquery-migrate-3.3.0.min.js"))
      .then(() => Helpers.loadScript("assets/js/vendor/bootstrap.bundle.min.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/magnific-popup.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/perfect-scrollbar.min.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/swiper-bundle.min.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/slick.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/jquery.carouselTicker.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/masonry.min.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/scrollup.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/wow.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/waypoints.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/counterup.js"));
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/style.css" />
        </Helmet>
      </HelmetProvider>
      <header
        className={`header sticky-bar ${isToggle ? "mobile-menu-open" : ""}`}
        style={{ padding: "0", backgroundColor: headerColor, color: "black" }}
        id="header"
      >
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <a className="d-flex" href="/" onClick={() => handleTabClick("/")}>
                  <img
                    alt="focastIQ"
                    src="img/landing_page_img/companies-logos/focast1-ezgif.com-gif-maker.gif"
                    width={200}
                  />
                </a>
              </div>
              <div className="header-nav">
                <nav className="nav-main-menu d-none d-xl-block">
                  <ul className="main-menu">
                    <li className="has-children">
                      <a
                        href="#home"
                        className={selectedTab === "/" ? "active" : ""}
                        onClick={() => handleTabClick("/")}
                      >
                        Home
                      </a>
                    </li>
                    <li className="has-children">
                      <a
                        onClick={() => handleTabClick("/")}
                        href="#feature"
                        className={selectedTab === "/" ? "active" : ""}
                      >
                        Features
                      </a>
                    </li>
                    <li className="has-children">
                      <a
                        onClick={() => handleTabClick("/")}
                        href="#use-case"
                        className={selectedTab === "/" ? "active" : ""}
                      >
                        Use Cases
                      </a>
                    </li>
                    <li className="mega-li has-children">
                      <a
                        onClick={() => handleTabClick("/")}
                        href="#about-us"
                      >
                        About US
                      </a>
                      <div className="mega-menu"></div>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="header-right">
              <a className="" href="#login" />
              <a className="btn btn-brand-4-medium hover-up" href="/login">
                Get Started
              </a>
              <div
                className="burger-icon burger-icon-white"
                onClick={toggleMobileMenu}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
