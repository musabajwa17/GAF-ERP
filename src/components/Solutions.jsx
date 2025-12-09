'use client'

import { useState, useEffect } from 'react'
import { 
  Tractor, 
  DollarSign, 
  Wheat, 
  Package, 
  Handshake, 
  Truck,
  Settings,
  Users,
  BarChart3,
  ClipboardCheck,
  CreditCard,
  TrendingUp,
  Receipt,
  FileText,
  Sprout,
  Search,
  Zap,
  Satellite,
  TestTube,
  Wrench,
  Bell,
  Briefcase,
  UserCheck,
  Coins,
  PackageOpen,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const FarmSolutions = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isHovering) {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isHovering])

  const tabContent = {
    0: {
      title: "Planning & Preparation",
      description: "Manage everything planning, scheduling and work order management.",
      image: "https://images.pexels.com/photos/2889442/pexels-photo-2889442.jpeg",
      gradient: "from-emerald-500/20 to-teal-500/20",
      features: [
        { icon: Settings, text: "Resource Management", color: "emerald" },
        { icon: Users, text: "Labor Management", color: "teal" },
        { icon: BarChart3, text: "Marketing and Sales", color: "cyan" },
        { icon: ClipboardCheck, text: "Regulatory Compliance", color: "green" }
      ]
    },
    1: {
      title: "Operations & Monitoring",
      description: "Farmers must balance irrigation, labor, inventory, pest control, and weather risks with precision",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-blue-500/20 to-indigo-500/20",
      features: [
        { icon: CreditCard, text: "Budget Planning", color: "blue" },
        { icon: TrendingUp, text: "Profit Analysis", color: "indigo" },
        { icon: Receipt, text: "Expense Tracking", color: "violet" },
        { icon: FileText, text: "Financial Reports", color: "purple" }
      ]
    },
    2: {
      title: "Inventory Management",
      description: "Purchases and usage are directly linked to crop operations, ensuring zero wastage and complete traceability.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-amber-500/20 to-orange-500/20",
      features: [
        { icon: Sprout, text: "Crop Planning", color: "amber" },
        { icon: Search, text: "Growth Monitoring", color: "orange" },
        { icon: Zap, text: "Yield Optimization", color: "yellow" },
        { icon: Satellite, text: "Precision Agriculture", color: "lime" }
      ]
    },
    3: {
      title: "Weather Forecasting",
      description: "Accurate weather insights are critical for protecting crops and planning operations.",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-sky-500/20 to-blue-500/20",
      features: [
        { icon: Sprout, text: "Seed Tracking", color: "sky" },
        { icon: TestTube, text: "Fertilizer Management", color: "blue" },
        { icon: Wrench, text: "Equipment Tracking", color: "cyan" },
        { icon: Bell, text: "Automated Alerts", color: "teal" }
      ]
    },
    4: {
      title: "Contract Farming & Agreements",
      description: "Contract farming connects growers with buyers under clear terms of price, quantity, and quality.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-rose-500/20 to-pink-500/20",
      features: [
        { icon: Briefcase, text: "Sales Pipeline", color: "rose" },
        { icon: Zap, text: "Contract Management", color: "pink" },
        { icon: UserCheck, text: "Customer Relations", color: "fuchsia" },
        { icon: Coins, text: "Revenue Tracking", color: "purple" }
      ]
    },
    5: {
      title: "Shipping & Packing Management",
      description: "Efficient logistics, packaging, and distribution management for your agricultural products.",
      image: "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      gradient: "from-violet-500/20 to-purple-500/20",
      features: [
        { icon: PackageOpen, text: "Package Management", color: "violet" },
        { icon: Truck, text: "Logistics Tracking", color: "purple" },
        { icon: MapPin, text: "Distribution Routes", color: "fuchsia" },
        { icon: Clock, text: "Delivery Scheduling", color: "pink" }
      ]
    }
  }

  const tabs = [
    { icon: Tractor, title: "Planning & Preparation", shortTitle: "Planning & Preparation" },
    { icon: TrendingUp, title: "Operations & Monitoring", shortTitle: "Operations & Monitering" },
    { icon: Wheat, title: "Inventory Management", shortTitle: "Inventory Management" },
    { icon: Package, title: "Weather Forecasting", shortTitle: "Weather Forecasting" },
    { icon: Handshake, title: "Sales & Contracting", shortTitle: "Sales & Contracting" },
    { icon: Truck, title: "Shipping & Packing", shortTitle: "Shipping & Packing" }
  ]

  const currentContent = tabContent[activeTab]

  const getFeatureDescription = (featureText) => {
    const descriptions = {
      "Resource Management": "Efficiently allocate and track farm resources including equipment, tools, and materials across all operations.",
      "Labor Management": "Optimize workforce scheduling, track productivity, and manage payroll for seasonal and permanent staff.",
      "Marketing and Sales": "Develop strategic marketing campaigns and manage sales channels to maximize revenue potential.",
      "Regulatory Compliance": "Stay compliant with agricultural regulations, certifications, and reporting requirements.",
      "Budget Planning": "Create comprehensive budgets with seasonal adjustments and expense forecasting.",
      "Profit Analysis": "Analyze profitability by crop, field, and operation to optimize financial performance.",
      "Expense Tracking": "Monitor all farm expenses with categorization and automated reporting.",
      "Financial Reports": "Generate detailed financial reports for stakeholders and tax preparation.",
      "Crop Planning": "Plan crop rotations, planting schedules, and field management strategies.",
      "Growth Monitoring": "Track crop development stages with real-time monitoring and alerts.",
      "Yield Optimization": "Use data analytics to maximize crop yields and quality.",
      "Precision Agriculture": "Implement GPS-guided farming and variable rate applications.",
      "Seed Tracking": "Monitor seed inventory, varieties, and planting records.",
      "Fertilizer Management": "Track fertilizer application rates, timing, and effectiveness.",
      "Equipment Tracking": "Monitor equipment usage, maintenance schedules, and costs.",
      "Automated Alerts": "Receive notifications for low inventory, maintenance due, and critical updates.",
      "Sales Pipeline": "Manage customer relationships and track sales opportunities.",
      "Contract Management": "Create, manage, and track agricultural contracts and agreements.",
      "Customer Relations": "Maintain customer database with purchase history and preferences.",
      "Revenue Tracking": "Monitor revenue streams and payment status across all sales.",
      "Package Management": "Organize packaging operations with labeling and quality control.",
      "Logistics Tracking": "Track shipments and delivery status in real-time.",
      "Distribution Routes": "Optimize delivery routes for efficiency and cost reduction.",
      "Delivery Scheduling": "Schedule deliveries and coordinate with customers and carriers."
    }
    return descriptions[featureText] || "Comprehensive management solution designed to streamline your agricultural operations."
  }

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:bg-emerald-500/20' },
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-200', hover: 'hover:bg-teal-500/20' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:bg-cyan-500/20' },
      green: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-500/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-500/20' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-200', hover: 'hover:bg-indigo-500/20' },
      violet: { bg: 'bg-violet-500/10', text: 'text-violet-600', border: 'border-violet-200', hover: 'hover:bg-violet-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-500/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200', hover: 'hover:bg-amber-500/20' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-500/20' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', border: 'border-yellow-200', hover: 'hover:bg-yellow-500/20' },
      lime: { bg: 'bg-lime-500/10', text: 'text-lime-600', border: 'border-lime-200', hover: 'hover:bg-lime-500/20' },
      sky: { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-200', hover: 'hover:bg-sky-500/20' },
      rose: { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-200', hover: 'hover:bg-rose-500/20' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-500/20' },
      fuchsia: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-600', border: 'border-fuchsia-200', hover: 'hover:bg-fuchsia-500/20' }
    }
    return colors[color] || colors.emerald
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">Next-Gen Farm Management</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
            Expand Your Business With Our
            <br />Farm Management Solution
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Want to get rid of manual tasks and automate processes to maximize yields? 
            <span className="font-semibold text-green-600"> CropERP</span> is here to help.
          </p>

          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-2 border border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon
              const isActive = activeTab === index
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`relative p-4 rounded-2xl transition-all duration-500 group ${
                    isActive 
                      ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg scale-105' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : 'bg-white group-hover:bg-green-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 transition-colors ${
                        isActive ? 'text-white' : 'text-green-600'
                      }`} />
                    </div>
                    <span className="text-sm font-semibold text-center leading-tight">
                      {tab.shortTitle}
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10 animate-pulse"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              {/* <div className={`inline-block px-4 py-2 bg-gradient-to-r ${currentContent.gradient} rounded-full backdrop-blur-sm`}>
                <span className="text-sm font-semibold text-slate-700">Feature Spotlight</span>
              </div> */}
              
              <h2 className="text-2xl md:text-33xl font-bold text-slate-900 leading-tight">
                {currentContent.title}
              </h2>
              
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentContent.description}
              </p>
            </div>
            
            {/* Features List */}
            <div className="space-y-3">
              {currentContent.features.map((feature, index) => {
                const IconComponent = feature.icon
                const colorClasses = getColorClasses(feature.color)
                const isOpen = openDropdown === index
                
                return (
                  <div 
                    key={index}
                    className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? `${colorClasses.border} shadow-xl scale-102` 
                        : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : index)}
                      className={`w-full flex items-center justify-between p-5 transition-all duration-300 ${
                        isOpen ? colorClasses.hover : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isOpen 
                            ? `${colorClasses.bg} scale-110` 
                            : 'bg-slate-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 transition-colors ${
                            isOpen ? colorClasses.text : 'text-slate-600'
                          }`} />
                        </div>
                        <span className="text-lg font-bold text-slate-900">
                          {feature.text}
                        </span>
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen 
                          ? `${colorClasses.bg} rotate-180` 
                          : 'bg-slate-100'
                      }`}>
                        <span className={`text-lg font-bold ${
                          isOpen ? colorClasses.text : 'text-slate-600'
                        }`}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </div>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className={`px-5 pb-5 ${colorClasses.bg}`}>
                        <div className="pl-16 pr-4">
                          <p className="text-slate-700 leading-relaxed">
                            {getFeatureDescription(feature.text)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column - Image */}
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="sticky top-8">
              <div className="relative group">
                {/* Animated gradient background */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${currentContent.gradient} rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Main image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={currentContent.image}
                    alt={currentContent.title}
                    className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">98%</div>
                          <div className="text-xs text-slate-600">Efficiency</div>
                        </div>
                        <div className="text-center border-x border-slate-200">
                          <div className="text-2xl font-bold text-blue-600">24/7</div>
                          <div className="text-xs text-slate-600">Monitoring</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">100+</div>
                          <div className="text-xs text-slate-600">Features</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-slate-700">Live Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Farm?
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already experiencing the future of agriculture
            </p>
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-green-600 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Schedule a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmSolutions