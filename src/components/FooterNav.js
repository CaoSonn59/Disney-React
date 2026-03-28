import React from "react";
import "/src/styles/FooterNav.css";

import { ReactComponent as LogoSVG } from "/src/images/Disney+_logo.svg";

function FooterNav() {
  return (
    <div className="dplus-footer">
      <a href="#home" className="dplus-nav-logo-link">
        <LogoSVG className="logo" />
      </a>
      <div className="dplus-footer-nav">
        <div className="footer-link">
          <a href="#top">Disney Terms of Use</a>
          <a href="#top">Subscriber Agreement</a>
          <a href="#top">Privacy Policy</a>
          <a href="#top">Supplemental Privacy</a>
          <a href="#top">Legal Notation</a>
          <a href="#top">Help</a>
          <a href="#top">Supported Devices</a>
          <a href="#top">About Us</a>
          <a href="#top">Interest-based Ads</a>
        </div>
        <p> © Disney. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default FooterNav;
