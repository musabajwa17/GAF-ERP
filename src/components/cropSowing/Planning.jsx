import Image from "next/image";

export default function Planning() {
  return (
    <section className="w-full bg-white py-16">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side - Text Content */}
        <div className="w-full lg:w-1/2 space-y-6 px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            Future-Proof Your <br />
            Profitability with <br />
            Accurate Planning
          </h2>
          <p className="text-md text-gray-600 leading-relaxed">
            Farmers face complex challenges in managing their operations, from
            balancing crop schedules to ensuring timely procurement of resources.
            With shrinking margins, farmers need accurate planning to ensure
            their profitability.
          </p>
          <p className="text-md text-gray-600 leading-relaxed">
            Built on the robust foundation of Microsoft Dynamics 365 ERP, AgriERP
            leverages Material Requirements Planning (MRP) to transform how you
            manage your farm. By integrating production, inventory, and
            procurement processes, our solution empowers you to anticipate
            demand, optimize resource allocation, and make data-driven decisions.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image
            src="/sowing.jpg" // <-- put your image in public folder (e.g. public/sowing.jpg)
            alt="Sowing"
            width={600}
            height={400}
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
