import React, { useState } from "react";
import {
  MessageSquare,
  FileText,
  Users,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function onNavigateToAuth() {
  const navigate = useNavigate();
  navigate("/auth");
}

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock Navbar component matching the theme
  const  Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 bg-[#0F172A]/95 backdrop-blur-sm border-b border-[#06B6D4] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#06B6D4]/20 rounded-lg">
              <FileText className="w-6 h-6 text-[#06B6D4]" />
            </div>
            <span className="text-xl font-bold text-blue-200">DocHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[#E2E8F0] hover:text-blue-200 transition-colors">
              Features
            </a>
            <a href="#about" className="text-[#E2E8F0] hover:text-blue-200 transition-colors">
              About
            </a>
            <a href="#pricing" className="text-[#E2E8F0] hover:text-blue-200 transition-colors">
              Pricing
            </a>
           <Link to="/auth">
            <button className="bg-[#06B6D4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0891b2] transition-colors">
              Get Started
            </button>
           </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#E2E8F0] hover:text-blue-200 hover:bg-[#1E293B] transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#06B6D4]/30">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-[#E2E8F0] hover:text-blue-200 transition-colors px-2 py-1">
                Features
              </a>
              <a href="#about" className="text-[#E2E8F0] hover:text-blue-200 transition-colors px-2 py-1">
                About
              </a>
              <a href="#pricing" className="text-[#E2E8F0] hover:text-blue-200 transition-colors px-2 py-1">
                Pricing
              </a>
              <Link to="/auth">
              <button className="bg-[#06B6D4] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0891b2] transition-colors mt-2">
                Get Started
              </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const features = [
    {
      icon: MessageSquare,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with instant messaging, file sharing, and live document editing.",
      color: "text-blue-400"
    },
    {
      icon: FileText,
      title: "Rich Document Editor",
      description: "Create beautiful documents with our powerful editor featuring formatting, tables, and media support.",
      color: "text-green-400"
    },
    {
      icon: Users,
      title: "Team Workspaces",
      description: "Organize your team into dedicated workspaces with channels, direct messages, and project management.",
      color: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing fast performance with real-time updates and seamless synchronization.",
      color: "text-yellow-400"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption and advanced privacy controls.",
      color: "text-red-400"
    },
    {
      icon: Globe,
      title: "Access Anywhere",
      description: "Work from anywhere with cloud sync, mobile apps, and offline support.",
      color: "text-indigo-400"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Documents Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      content: "DocHub has revolutionized how our team collaborates. The real-time editing and chat features are game-changers.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Engineering Lead",
      company: "StartupXYZ",
      content: "The seamless integration of documents and communication makes DocHub indispensable for our remote team.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Design Director",
      company: "CreativeStudio",
      content: "Finally, a platform that understands that collaboration is more than just sharing files. Love the workspace organization!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              The Future of
              <span className="block bg-gradient-to-r from-[#06B6D4] to-blue-400 bg-clip-text text-transparent">
                Team Collaboration
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#94A3B8] mb-8 max-w-3xl mx-auto leading-relaxed">
              Unite your team's communication and documentation in one powerful platform. 
              Create, collaborate, and communicate like never before.
            </p>

            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <button className="bg-[#06B6D4] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#0891b2] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Free Trial
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </Link>
              <Link to="/auth">
              <button className="flex items-center space-x-2 text-[#E2E8F0] hover:text-blue-200 transition-colors">
                <div className="p-2 bg-white/10 rounded-full">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#06B6D4] mb-2">
                  {stat.number}
                </div>
                <div className="text-[#94A3B8] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block text-[#06B6D4]">Work Together</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
              Powerful features designed to enhance productivity and streamline collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-[#06B6D4]/30 transition-all duration-300 group hover:transform hover:scale-105">
                <div className={`p-3 rounded-xl bg-slate-700/30 w-fit mb-6 group-hover:bg-slate-700/50 transition-colors`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Built for Modern Teams
              </h2>
              <p className="text-lg text-[#94A3B8] mb-6 leading-relaxed">
                DocHub was born from the frustration of juggling multiple tools for communication, 
                documentation, and collaboration. We believe teams shouldn't have to choose between 
                good communication and powerful document creation.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-[#E2E8F0]">Unified workspace for all team activities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-[#E2E8F0]">Real-time collaboration without complexity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-[#E2E8F0]">Enterprise-grade security and reliability</span>
                </div>
              </div>
              <button className="bg-[#06B6D4] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#0891b2] transition-colors">
                Learn More About Us
              </button>
            </div>
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-8 border border-slate-600/30">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#06B6D4] mb-2">2024</div>
                <div className="text-[#94A3B8] mb-6">Founded with a vision</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">15+</div>
                    <div className="text-sm text-[#94A3B8]">Team Members</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">5+</div>
                    <div className="text-sm text-[#94A3B8]">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-[#94A3B8]">
              See what our users have to say about DocHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#E2E8F0] mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-[#94A3B8] text-sm">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#06B6D4]/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Team's Workflow?
          </h2>
          <p className="text-xl text-[#94A3B8] mb-8 max-w-2xl mx-auto">
            Join thousands of teams who have already revolutionized their collaboration with DocHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onNavigateToAuth}
              className="bg-[#06B6D4] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#0891b2] transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Your Free Trial
            </button>
            <button className="border border-[#06B6D4] text-[#06B6D4] px-8 py-4 rounded-xl font-semibold hover:bg-[#06B6D4] hover:text-black transition-all duration-200">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-[#06B6D4]/20 rounded-lg">
                  <FileText className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <span className="text-xl font-bold text-blue-200">DocHub</span>
              </div>
              <p className="text-[#94A3B8] mb-6 max-w-md">
                The ultimate platform for team collaboration, combining powerful document editing 
                with seamless communication.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li><a href="#" className="hover:text-blue-200 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-200 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-200 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-blue-200 transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-[#94A3B8]">
                <li><a href="#" className="hover:text-blue-200 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-200 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-200 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-200 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-[#94A3B8]">
            <p>&copy; 2024 DocHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}