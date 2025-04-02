
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type Calculator = {
  name: string;
  path: string;
  category: "loan" | "investment" | "tax" | "personal";
}

const calculators: Calculator[] = [
  { name: "Mortgage", path: "/calculator/mortgage", category: "loan" },
  { name: "EMI", path: "/calculator/emi", category: "loan" },
  { name: "Down Payment", path: "/calculator/down-payment", category: "loan" },
  { name: "Lease", path: "/calculator/lease", category: "loan" },
  { name: "Simple Interest", path: "/calculator/simple-interest", category: "investment" },
  { name: "Compound Interest", path: "/calculator/compound-interest", category: "investment" },
  { name: "SIP", path: "/calculator/sip", category: "investment" },
  { name: "SWP", path: "/calculator/swp", category: "investment" },
  { name: "Mutual Fund", path: "/calculator/mutual-fund", category: "investment" },
  { name: "Retirement", path: "/calculator/retirement", category: "investment" },
  { name: "Salary", path: "/calculator/salary", category: "personal" },
  { name: "Tax Saving", path: "/calculator/tax-saving", category: "tax" },
];

const Header = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set theme based on localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Wealth Compass Hub
            </h1>
          </Link>

          {/* Current date and time */}
          <div className="hidden md:flex flex-col items-end text-xs md:text-sm">
            <p className="text-muted-foreground">{formatDate(currentTime)}</p>
            <p className="font-semibold text-primary">{formatTime(currentTime)}</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Loan Calculators</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {calculators
                        .filter((calc) => calc.category === "loan")
                        .map((calc) => (
                          <li key={calc.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={calc.path}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {calc.name}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Investment Calculators</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {calculators
                        .filter((calc) => calc.category === "investment")
                        .map((calc) => (
                          <li key={calc.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={calc.path}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {calc.name}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Other Calculators</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {calculators
                        .filter((calc) => calc.category === "personal" || calc.category === "tax")
                        .map((calc) => (
                          <li key={calc.path}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={calc.path}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {calc.name}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/contact" className="py-2 px-4 text-sm font-medium hover:text-primary transition-colors">
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="mr-2"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden py-4 px-4 bg-background border-t border-border/40 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Loan Calculators</h3>
              <ul className="space-y-2">
                {calculators
                  .filter((calc) => calc.category === "loan")
                  .map((calc) => (
                    <li key={calc.path}>
                      <Link
                        to={calc.path}
                        className="text-sm hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {calc.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">Investment Calculators</h3>
              <ul className="space-y-2">
                {calculators
                  .filter((calc) => calc.category === "investment")
                  .map((calc) => (
                    <li key={calc.path}>
                      <Link
                        to={calc.path}
                        className="text-sm hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {calc.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-primary">Other Calculators</h3>
            <ul className="space-y-2">
              {calculators
                .filter((calc) => calc.category === "personal" || calc.category === "tax")
                .map((calc) => (
                  <li key={calc.path}>
                    <Link
                      to={calc.path}
                      className="text-sm hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="mt-4">
            <Link
              to="/contact"
              className="text-sm font-medium text-primary hover:text-primary/80"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          
          {/* Mobile Date and Time */}
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-xs text-muted-foreground">{formatDate(currentTime)}</p>
            <p className="text-sm font-semibold text-primary">{formatTime(currentTime)}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
