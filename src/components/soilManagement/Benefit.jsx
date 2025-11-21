export default function CallToAction() {
  return (
    <div 
  className="relative bg-[url('/benefit.jpg')] w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4">
  {/* Overlay for better text readability */}
  {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
  
  {/* Content */}
  <div className="relative z-10 my-20 text-center max-w-3xl sm:max-w-4xl">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 leading-snug sm:leading-tight">
      Leverage AgriERP benefits for maximum profitability!
    </h1>
    
    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
      Talk to Agent
    </button>
  </div>
</div>

  );
}