import { contactInfo, footerSections, socials } from "@/lib/constant";
import { Stethoscope } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-black to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md ring-1 ring-blue-400/30 hover:scale-105 transition-transform duration-200">
                <Stethoscope className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ArogyaLink+
              </div>
            </div>
            <p className="text-white mb-6 text-lg leading-relaxed">
              Your trusted healthcare partner providing quality medical consultation with certified doctors online, anytime, anywhere.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-white/80">
                  <item.icon className="w-5 h-5 text-white/70" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8 mt-10 lg:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-white/70 mb-4 text-lg">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 text-sm hover:underline"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-white/20 mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-white text-lg mb-1">Stay Updated</h4>
              <p className="text-white/70 text-sm">Get health tips and product updates delivered to your inbox</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-black text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[200px]"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

     {/* Footer Bottom with Socials */}
<div className="mt-8 border-t border-white/20 pt-4">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
    
    {/* Copyright */}
    <div className="text-white/50 text-sm text-center md:text-left">
      &copy; {new Date().getFullYear()} ArogyaLink+. All rights reserved.
    </div>

    {/* Socials */}
    <div className="flex items-center space-x-3 justify-center md:justify-start">
      <span className="text-white font-semibold text-sm">Follow us:</span>
      {socials.map(({ name, icon: Icon, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 bg-blue-700/50 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
          aria-label={`Follow us on ${name}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </a>
      ))}
    </div>

  </div>
</div>



      </div>
    </footer>
  );
}

export default Footer;
