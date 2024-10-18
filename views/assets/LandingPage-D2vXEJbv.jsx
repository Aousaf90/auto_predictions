import { useEffect, useState } from "react";
import Helpers from "../Helpers/Helpers";
import Marquee from "react-fast-marquee";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export function LandingPage() {
  const navigate = new useNavigate();
  const { isToggle, setIsToggle } = useOutletContext();
  console.log("kdjkdjkdjkd", isToggle);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle collapse
  };

  useEffect(() => {
    const in_session = localStorage.getItem("forcastToken");
    if (in_session) {
      navigate("/dashboard");
    }
  });

  useEffect(() => {
    Helpers.loadScript("assets/js/vendor/jquery-3.7.0.min.js")
      .then(() =>
        Helpers.loadScript("assets/js/vendor/jquery-migrate-3.3.0.min.js")
      )
      .then(() =>
        Helpers.loadScript("assets/js/vendor/bootstrap.bundle.min.js")
      )
      .then(() => Helpers.loadScript("assets/js/plugins/magnific-popup.js"))
      .then(() =>
        Helpers.loadScript("assets/js/plugins/perfect-scrollbar.min.js")
      )
      .then(() => Helpers.loadScript("assets/js/plugins/swiper-bundle.min.js"))
      .then(() => Helpers.loadScript("assets/js/plugins/slick.js"))
      .then(() =>
        Helpers.loadScript("assets/js/plugins/jquery.carouselTicker.js")
      )
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
      <div
        className="mobile-header-wrapper-style perfect-scrollbar"
        style={{
          visibility: isToggle ? "visible" : "",
          opacity: isToggle ? 1 : 0,
        }}
      >

        <div className="mobile-header-wrapper-inner">
          <div
            className="burger-icon burger-icon-white"
            style={{ marginTop: "10px" }}
            onClick={() => {
              setIsToggle(!isToggle);
            }}
          >
            <span className="burger-icon-top" />
            <span className="burger-icon-mid" />
            <span className="burger-icon-bottom" />
          </div>
          <div className="mobile-header-top"></div>
          <div className="mobile-header-content-area">
            <div className="perfect-scroll">
              <div className="mobile-search mobile-header-border mb-30"></div>
              <div className="mobile-menu-wrap mobile-header-border">
                <nav>
                  <ul className="mobile-menu font-heading">
                    <li className="has-children">
                      <a className="active" href="#home">
                        Home Pages
                      </a>
                    </li>
                    <li className="has-children">
                      <a href="#feature">Features</a>
                      <ul className="sub-menu"></ul>
                    </li>
                    <li className="has-children">
                      <a href="#use-case">Use Cases</a>
                      <ul className="sub-menu"></ul>
                    </li>
                    <li className="has-children">
                      <a href="#about-us">About US</a>
                      <ul className="sub-menu"></ul>
                    </li>
                    <li className="has-children">
                      <a className="active" href="/login">
                        Login
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="main">
        <section id="home" className="section-box">
          <div className="banner-hero hero-5">
            <div className="banner-image-main">
              <div className="img-bg" />
              <div className="blur-bg blur-move" />
            </div>
            <div className="banner-inner-top">
              <div className="container">
                <div className="box-banner-left">
                  <a className="btn btn-brand-5-new" href="#">
                    <span>Forecasting</span> & Inventory Management
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={22}
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M22 11.0003L18.4791 7.47949V10.3074H0V11.6933H18.4791V14.5213L22 11.0003Z"
                        fill=""
                      />
                    </svg>
                  </a>
                  <h1 className="display-2 mb-30 mt-25 neutral-0">
                    Unlock Cashflow with AI Predictive Demand Forecasting
                  </h1>
                  <p className="text-lg neutral-500 mb-55">
                    Driving cost efficiency and customer happiness with
                    Predictive AI Inventory management.
                  </p>
                  <div className="d-flex mb-60">
                    <a
                      className="btn btn-brand-4-medium hover-up mr-30"
                      href="https://wa.me/+971553105633"
                    >
                      Request a Demo
                    </a>
                    <a
                      className="btn btn-brand-4-medium sales hover-up"
                      style={{
                        background: "transparent",
                        borderColor: "#683999",
                      }}
                      href="https://wa.me/+971553105633"
                    >
                      Contact Sales
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="banner-inner-bottom">
              <div className="container">
                <div className="box-joined">
                  <div className="box-authors"></div>
                  <span className="text-lg d-inline-block">
                    <br className="d-none d-md-block" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="mb-15">
              In Collabaration With
              <br className="d-none d-lg-block" />
            </h2>
          </div>
        </section>
        <section className="section-box wow animate__animated animate__fadeIn box-logos-2">
          <div className="container">
            <div
              className="carouselTickerLogos2 carouselTicker_vertical"
              id="slide-logos"
            >
              <ul className="carouselTicker__list list-logos">
                <Marquee>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/dubai.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/fitch.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/meta.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/startupbootcamp.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/chalhoub.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>

                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/dubai.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/fitch.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/meta.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/startupbootcamp.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                  <li className="carouselTicker__item">
                    <div className="item-logo">
                      <img
                        src="img/landing_page_img/companies-logos/chalhoub.png"
                        alt="Nivia"
                      />
                    </div>
                  </li>
                </Marquee>
              </ul>
            </div>
          </div>
        </section>
        <section
          id="about-us"
          className="section-box wow animate__animated animate__fadeIn box-our-track"
        >
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 text-center mb-40">
                <img src="img/landing_page_img/img-track 1.png" alt="Nivia" />
              </div>
              <div className="col-lg-6 mb-40">
                <div className="box-padding-left-50">
                  <h2 className="heading-2 mb-20">About Us</h2>
                  <p className="text-lg neutral-700">
                    At FocastIQ, we are dedicated to revolutionizing inventory
                    management by addressing the core challenges businesses
                    face: excessive operational costs due to overstocks
                    stockouts, and the difficulty of balancing supply with
                    unpredictable demand.
                  </p>
                  {/* <div className="row mt-50">
                    <div className="col-lg-6 col-sm-6">
                      <div className="card-feature-2">
                        <div className="card-image">
                          <img src="assets/imgs/page/homepage3/marketing.svg" />
                        </div>
                        <div className="card-info">
                          <a href="#">
                            <h3 className="text-22-bold">
                              AI-Powered Forecasting
                            </h3>
                          </a>
                          <p className="text-md neutral-700">
                            Real-time inventory adjustments minimize overstock
                            and stockout risks.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="card-feature-2">
                        <div className="card-image">
                          <img src="assets/imgs/page/homepage3/digital.svg" />
                        </div>
                        <div className="card-info">
                          <a href="#">
                            <h3 className="text-22-bold">Cost Efficiency</h3>
                          </a>
                          <p className="text-md neutral-700">
                            Reduce operational costs by optimizing stock levels
                            based on demand.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="card-feature-2">
                        <div className="card-image">
                          <img src="assets/imgs/page/homepage3/product.svg" />
                        </div>
                        <div className="card-info">
                          <a href="#">
                            <h3 className="text-22-bold">Business Growth</h3>
                          </a>
                          <p className="text-md neutral-700">
                            Focus on scaling your business with AI managing your
                            inventory.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6">
                      <div className="card-feature-2">
                        <div className="card-image">
                          <img src="assets/imgs/page/homepage3/social.svg" />
                        </div>
                        <div className="card-info">
                          <a href="#">
                            <h3 className="text-22-bold">
                              Enhanced Customer Satisfaction
                            </h3>
                          </a>
                          <p className="text-md neutral-700">
                            Always have the right products available for your
                            customers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="feature"
          className="section-box wow animate__animated animate__fadeIn box-preparing-2"
        >
          <div className="container">
            <div className="text-center">
              <h2 className="mb-15">Why Focast IQ</h2>
              {/* <br className="d-none d-lg-block" />
                We Provide Truly Prominent IT Solutions
              <p className="text-lg neutral-700">
                Keeps your operations efficient and your customers satisfied
                <br />
                Say goodbye to stockouts, overstocks, and reactive inventory
                strategies
              </p> */}
            </div>
            <div className="row mt-90">
              <div className="col-lg-4 col-md-6">
                <div className="card-preparing">
                  <div className="card-image">
                    <img
                      className="wow fadeInUp"
                      src="img/landing_page_img/illustraters/Group 2.png"
                      alt="Nivia"
                    />
                  </div>
                  <div className="card-info">
                    <h5>Real-Time Demand Forecasting</h5>
                    <p className="text-lg neutral-700 w-85 mx-auto">
                      Our AI-driven forecasting model predicts inventory needs
                      in real time, helping you optimize stock levels based on
                      current and future demand trends
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card-preparing">
                  <div className="card-image">
                    <img
                      className="wow fadeInUp"
                      src="img/landing_page_img/illustraters/Group 3.png"
                      alt="Nivia"
                    />
                  </div>
                  <div className="card-info">
                    <h5>Predictive Analytics Across Channels</h5>
                    <p className="text-lg neutral-700 w-85 mx-auto">
                      Monitor sales data, customer demand, and inventory levels
                      across all your sales channels simultaneously.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card-preparing">
                  <div className="card-image">
                    <img
                      className="wow fadeInUp"
                      src="img/landing_page_img/illustraters/Group 4.png"
                      alt="Nivia"
                    />
                  </div>
                  <div className="card-info">
                    <h5>Dynamic Inventory Adjustments</h5>
                    <p className="text-lg neutral-700 w-85 mx-auto">
                      FocastIQ dynamically adjusts inventory distribution based
                      on live demand and supply trends,
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card-preparing">
                  <div className="card-image">
                    <img
                      className="wow fadeInUp"
                      src="img/landing_page_img/illustraters/Group 5.png"
                      alt="Nivia"
                    />
                  </div>
                  <div className="card-info">
                    <h5>Seamless ERP and CRM Integration</h5>
                    <p className="text-lg neutral-700 w-85 mx-auto">
                      FocastIQ integrates effortlessly with existing ERP, CRM,
                      and ecommerce systems, allowing your business to harness
                      the power of predictive analytics
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card-preparing">
                  <div className="card-image">
                    <img
                      className="wow fadeInUp"
                      src="img/landing_page_img/illustraters/Group 6.png"
                      alt="Nivia"
                    />
                  </div>
                  <div className="card-info">
                    <h5>Trend Analysis</h5>
                    <p className="text-lg neutral-700 w-85 mx-auto">
                      Simulate and model how various factors will impact future
                      demand such as pricing changes, promotions, market trends,
                      or external factors like seasonality or economic
                      conditions.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card-preparing">
                  <div className="card-image">
                    <img
                      className="wow fadeInUp"
                      src="img/landing_page_img/illustraters/Group 7.png"
                      alt="Nivia"
                    />
                  </div>
                  <div className="card-info">
                    <h5>AI-Powered Inventory Optimization</h5>
                    <p className="text-lg neutral-700 w-85 mx-auto">
                      Automatically balance inventory levels across multiple
                      locations. FocastIQ uses machine learning algorithms to
                      optimize inventory distribution,
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box wow animate__animated animate__fadeIn box-our-track-2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-40">
                <div className="strate-icon">
                  <span /> AI-Powered Solutions for Inventory Management
                </div>
                <h2 className="heading-2 mb-20">
                Get Ahead of Demand. Optimize Your Inventory.
                  
                </h2>
                <p className="text-lg neutral-700">
                Start your journey to smarter inventory management today with ForecastIQ.
                Let AI transform your operations and boost customer satisfaction.
                </p>
                <div className="row mt-50">
                  <div className="col-lg-12">
                    <div className="card-feature-2">
                      <div className="card-image">
                        <img src="assets/imgs/page/homepage3/discover.svg" />
                      </div>
                      <div className="card-info">
                        <a href="#">
                          <h3 className="text-22-bold">
                          Real-Time Demand Forecasting
                          </h3>
                        </a>
                        <p className="text-md neutral-700">
                        Our AI-driven forecasting model predicts inventory needs in real time, helping you optimize stock levels based on current and future demand trends.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card-feature-2">
                      <div className="card-image">
                        <img src="assets/imgs/page/homepage3/keep.svg" />
                      </div>
                      <div className="card-info">
                        <a href="#">
                          <h3 className="text-22-bold">
                          Predictive Analytics Across Multiple Channels                          </h3>
                        </a>
                        <p className="text-md neutral-700">
                        Monitor sales data, customer demand, and inventory levels across all your sales channels simultaneously. Gain a 360-degree view of your inventory at all times.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card-feature-2">
                      <div className="card-image">
                        <img src="assets/imgs/page/homepage3/digital.svg" />
                      </div>
                      <div className="card-info">
                        <a href="#">
                          <h3 className="text-22-bold">
                          Dynamic Inventory Adjustments                        </h3>
                        </a>
                        <p className="text-md neutral-700">
                        ForecastIQ dynamically adjusts inventory distribution based on live demand and supply trends, ensuring your stock levels are always optimal.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card-feature-2">
                      <div className="card-image">
                        <img src="assets/imgs/page/homepage3/social.svg" />
                      </div>
                      <div className="card-info">
                        <a href="#">
                          <h3 className="text-22-bold">
                          Trend Analysis                       </h3>
                        </a>
                        <p className="text-md neutral-700">
                        Simulate and model how various factors will impact future demand such as pricing changes, promotions, market trends, or external factors like seasonality or economic conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card-feature-2">
                      <div className="card-image">
                        <img src="assets/imgs/page/homepage3/keep.svg" />
                      </div>
                      <div className="card-info">
                        <a href="#">
                          <h3 className="text-22-bold">
                          Seamless ERP and CRM Integration                   </h3>
                        </a>
                        <p className="text-md neutral-700">
                        ForecastIQ integrates effortlessly with existing ERP, CRM, and ecommerce systems, allowing your business to harness the power of predictive analytics without disrupting your current workflows.                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-buttons-feature-4">
                  <a
                    className="btn btn-brand-4-medium mr-20"
                    href="https://wa.me/+971553105633"
                  >
                    Contact Us
                    {/* <svg
                      width={22}
                      height={8}
                      viewBox="0 0 22 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 3.99934L18.4791 0.478516V3.30642H0V4.69236H18.4791V7.52031L22 3.99934Z"
                        fill="white"
                      />
                    </svg> */}
                  </a>
                  <a
                    className="btn btn-learmore-2"
                    href="https://www.fitchtechnologies.com"
                  >
                    <span>
                      <svg
                        width={39}
                        height={38}
                        viewBox="0 0 39 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="0.5"
                          width={38}
                          height={38}
                          rx={19}
                          fill="#191919"
                        />
                        <g clipPath="url(#clip0_1_376)">
                          <path
                            d="M24.1537 16.8139L15.218 25.7497L13.75 24.2817L22.6847 15.3459H14.81V13.2695H26.2301V24.6897H24.1537V16.8139Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_376">
                            <rect
                              width={13}
                              height={13}
                              fill="white"
                              transform="translate(13.5 13)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                    Learn More
                  </a>
                </div>
              </div>

              <div className="col-lg-6 text-center mb-40">
                <div className="box-border-image">
                  <div className="box-image-line-1">
                    <div className="wow fadeInDown img-1" data-wow-delay={0}>
                      <img
                        src="img/landing_page_img/img-track2-1_updated.png"
                        alt="Nivia"
                      />
                    </div>
                    <div className="wow fadeInDown img-1" data-wow-delay="0.3s">
                      <img
                        src="img/landing_page_img/img-track2-2.png"
                        alt="Nivia"
                      />
                    </div>
                  </div>
                  <div className="box-image-line-2">
                    <div className="wow fadeInLeft img-1" data-wow-delay={0}>
                      <img
                        src="assets/imgs/page/homepage1/img-track2-3.png"
                        alt="Nivia"
                      />
                    </div>
                    <div
                      className="wow fadeInRight img-1"
                      data-wow-delay="0.2s"
                    >
                      <img
                        src="assets/imgs/page/homepage1/img-track2-4.png"
                        alt="Nivia"
                      />
                    </div>
                  </div>
                  <div className="box-image-line-3">
                    <div className="wow fadeInUp img-3" data-wow-delay="0.4s">
                      <img
                        src="img/landing_page_img/img-track2-7 1.png"
                        alt="Nivia"
                      />
                    </div>
                    <div className="wow fadeInUp img-1" data-wow-delay={0}>
                      <img
                        src="img/landing_page_img/focast illustration card 7.png"
                        alt="Nivia"
                      />
                    </div>
                    {/* <div className="wow fadeInUp img-2" data-wow-delay="0.2s">
                      <img
                        src="assets/imgs/page/homepage1/img-track2-6.png"
                        alt="Nivia"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="use-case"
          className="section-box wow animate__animated animate__fadeIn box-preparing-3"
        >
          <div className="container">
            <div className="text-center">
              <h2 className="neutral-0 mb-20">
                Preparing for Business Success,
                <br className="d-none d-lg-block" />
                FocastIQ Provides Intelligent Inventory Solutions
              </h2>
              <p className="text-lg neutral-700">
                With our AI-driven system, FocastIQ helps businesses optimize
                inventory management by minimizing overstock and stockout
                situations, ensuring operational efficiency, and reducing costs.
              </p>
            </div>
            <div className="row mt-90">
              <div className="col-lg-3 col-md-6">
                <div
                  className="card-preparing-2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="img/landing_page_img/warehouse 1.png"
                    alt=""
                    width={50}
                    style={{ marginBottom: "20px" }}
                  />
                  <div className="card-info">
                    <a href="#">
                      <h5 className="text-22-bold">Real-Time Forecasting</h5>
                    </a>
                    <p className="text-md neutral-700">
                      Our AI continuously forecasts and adjusts stock levels to
                      meet real-time demand, reducing risks of overstock and
                      stockout.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div
                  className="card-preparing-2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="img/landing_page_img/warehouse 2.png"
                    alt=""
                    width={50}
                    style={{ marginBottom: "20px" }}
                  />
                  <div className="card-info">
                    <a href="#">
                      <h5 className="text-22-bold">Cost Efficiency</h5>
                    </a>
                    <p className="text-md neutral-700">
                      Reduce operational costs by optimizing inventory, ensuring
                      you only stock what you need, when you need it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div
                  className="card-preparing-2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="img/landing_page_img/warehouse 3.png"
                    alt=""
                    width={50}
                    style={{ marginBottom: "20px" }}
                  />
                  <div className="card-info">
                    <a href="#">
                      <h5 className="text-22-bold">Business Growth Focus</h5>
                    </a>
                    <p className="text-md neutral-700">
                      Let FocastIQ manage your inventory while you focus on
                      expanding your business and increasing customer
                      satisfaction.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div
                  className="card-preparing-2"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <img
                    src="img/landing_page_img/warehouse 4.png"
                    alt=""
                    width={50}
                    style={{ marginBottom: "20px" }}
                  />
                  <div className="card-info">
                    <a href="#">
                      <h5 className="text-22-bold">Optimized Supply Chain</h5>
                    </a>
                    <p className="text-md neutral-700">
                      Ensure a seamless supply chain by leveraging intelligent
                      predictions and automated stock adjustments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why-forecasIQ" className="section-box box-faqs-3">
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <div className="box-faq-left">
                  <a
                    className="btn btn-brand-4-sm"
                    href="https://wa.me/+971553105633"
                    style={{ color: "white" }}
                  >
                    Frequently Asked Questions
                  </a>
                  <h2 className="heading-2 mb-20 mt-20">
                    Do you have any questions about FocastIQ?
                  </h2>
                  <p className="text-lg neutral-700">
                    Below you’ll find answers to the most common questions you
                    may have on how FocastIQ optimizes your inventory management
                    and streamlines your operations. If you still can’t find the
                    answer you’re looking for, feel free to
                    <a
                      className="text-18-bold brand-1-1"
                      href="https://wa.me/+971553105633"
                    >
                      Contact us
                    </a>
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <div
                  className="accordion accordion-flush accordion-style-2"
                  id="accordionFAQS"
                >
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                      <button
                        className={`accordion-button ${
                          activeIndex === 1 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(1)}
                      >
                        How does FocastIQ help prevent overstock and stockouts?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse  ${
                        activeIndex === 1 ? "" : "collapse"
                      }`}
                      id="flush-collapseOne"
                      aria-labelledby="flush-headingOne"
                    >
                      <div className="accordion-body">
                        <p>
                          FocastIQ uses real-time time series data analysis and
                          AI-driven forecasting to accurately predict demand,
                          helping businesses maintain optimal stock levels and
                          avoid costly overstock and stockout situations
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingTwo">
                      <button
                        className={`accordion-button ${
                          activeIndex === 2 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(2)}
                      >
                        How accurate are the demand forecasts provided by
                        FocastIQ?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${
                        activeIndex === 2 ? "" : "collapse"
                      }`}
                      id="flush-collapseTwo"
                      aria-labelledby="flush-headingTwo"
                    >
                      <div className="accordion-body">
                        FocastIQ achieves accuracy of 95%+. It uses advanced
                        algorithms and historical sales data to deliver highly
                        accurate demand forecasts, allowing businesses to
                        confidently plan their inventory and avoid unnecessary
                        disruptions.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingThree">
                      <button
                        className={`accordion-button ${
                          activeIndex === 3 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(3)}
                      >
                        Can FocastIQ integrate with my existing ERP system?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${
                        activeIndex === 3 ? "" : "collapse"
                      }`}
                      id="flush-collapseThree"
                      aria-labelledby="flush-headingThree"
                    >
                      <div className="accordion-body">
                        Yes, FocastIQ is designed to seamlessly integrate with
                        most ERP and CRM systems, allowing for easy data
                        transfer and real-time inventory updates. You can also
                        upload flat files and generates forecasts for your
                        planning purposes.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingFour">
                      <button
                        className={`accordion-button ${
                          activeIndex === 4 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(4)}
                      >
                        How does FocastIQ improve operational efficiency?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${
                        activeIndex === 4 ? "" : "collapse"
                      }`}
                      id="flush-collapseFour"
                      aria-labelledby="flush-headingFour"
                    >
                      <div className="accordion-body">
                        FocastIQ optimizes stock management by automating
                        replenishment processes, forecasting demand, and
                        reducing human errors, allowing businesses to streamline
                        operations and focus on growth.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingFour">
                      <button
                        className={`accordion-button ${
                          activeIndex === 5 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(5)}
                      >
                        Who can benefit from using FocaseIQ?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${
                        activeIndex === 5 ? "" : "collapse"
                      }`}
                      id="flush-collapseFour"
                      aria-labelledby="flush-headingFour"
                    >
                      <div className="accordion-body">
                        FocastIQ is designed for businesses of all sizes across
                        various industries that face challenges in managing
                        inventory. Retailers, manufacturers, wholesalers, and
                        e-commerce businesses can use FocaseIQ to optimize their
                        stock levels, reduce inventory costs, and ensure
                        products are always available when customers need them.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingFour">
                      <button
                        className={`accordion-button ${
                          activeIndex === 6 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(6)}
                      >
                        What type of data does FocaseIQ use for forecasting?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${
                        activeIndex === 6 ? "" : "collapse"
                      }`}
                      id="flush-collapseFour"
                      aria-labelledby="flush-headingFour"
                    >
                      <div className="accordion-body">
                        FocastIQ analyzes a variety of data, including
                        historical sales records, product trends, seasonal
                        demand, promotions, and external factors such as market
                        conditions. It also incorporates real-time data to
                        adjust forecasts dynamically.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingFour">
                      <button
                        className={`accordion-button ${
                          activeIndex === 7 ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleAccordion(7)}
                      >
                        How often are demand forecasts updated?
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse ${
                        activeIndex === 7 ? "" : "collapse"
                      }`}
                      id="flush-collapseFour"
                      aria-labelledby="flush-headingFour"
                    >
                      <div className="accordion-body">
                        FocastIQ provides real-time forecasting, which means
                        your demand predictions are constantly updated as new
                        data comes in. This ensures that your business is always
                        using the most up-to-date forecasts to make inventory
                        decisions.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
