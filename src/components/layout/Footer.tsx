
import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Wealth Compass Hub
            </h3>
            <p className="text-muted-foreground text-sm">
              A comprehensive suite of financial calculators to help you make informed decisions
              for your financial future.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Calculator Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">Loans</h4>
                <ul className="space-y-1">
                  <li>
                    <Link to="/calculator/mortgage" className="text-xs text-muted-foreground hover:text-primary">
                      Mortgage
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculator/emi" className="text-xs text-muted-foreground hover:text-primary">
                      EMI
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculator/down-payment" className="text-xs text-muted-foreground hover:text-primary">
                      Down Payment
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">Investments</h4>
                <ul className="space-y-1">
                  <li>
                    <Link to="/calculator/sip" className="text-xs text-muted-foreground hover:text-primary">
                      SIP
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculator/mutual-fund" className="text-xs text-muted-foreground hover:text-primary">
                      Mutual Fund
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculator/retirement" className="text-xs text-muted-foreground hover:text-primary">
                      Retirement
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:noel.regis04@gmail.com" 
                  className="text-muted-foreground hover:text-primary"
                >
                  noel.regis04@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a 
                  href="tel:+917319546900" 
                  className="text-muted-foreground hover:text-primary"
                >
                  +91 7319546900
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <a 
                  href="https://www.google.com/maps/place/Asansol,+West+Bengal,+India"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Asansol, West Bengal, India
                </a>
              </li>
            </ul>
            
            <div className="flex items-center space-x-3 mt-4">
              <a
                href="https://www.linkedin.com/in/noel-regis-aa07081b1/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="h-4 w-4 text-primary" />
              </a>
              <a
                href="https://github.com/noelregis18"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
              >
                <Github className="h-4 w-4 text-primary" />
              </a>
              <a
                href="https://x.com/NoelRegis8"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
              >
                <Twitter className="h-4 w-4 text-primary" />
              </a>
              <a
                href="http://topmate.io/noel_regis"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Topmate"
                className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors"
              >
                <span className="text-xs font-semibold text-primary">TM</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-6 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Wealth Compass Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
