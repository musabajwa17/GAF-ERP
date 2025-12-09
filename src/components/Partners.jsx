import Image from 'next/image';

const Partners = () => {
  const partners = [
    {
      name: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png',
      alt: 'Google Logo',
    },
    {
      name: 'IBM',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/512px-IBM_logo.svg.png',
      alt: 'IBM Logo',
    },
    {
      name: 'Oracle',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/512px-Oracle_logo.svg.png',
      alt: 'Oracle Logo',
    },
    {
      name: 'SAP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/512px-SAP_2011_logo.svg.png',
      alt: 'SAP Logo',
    },
  ];

  return (
    // <section className="py-16 px-4 bg-white">
    //   <div className="max-w-6xl mx-auto">
    //     {/* Header */}
    //     <div className="text-center mb-12">
    //       <h2 className="text-3xl font-bold text-gray-900">
    //         Our Partners and Affiliations
    //       </h2>
    //     </div>

    //     {/* Partners Logos in a single responsive row */}
    //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 place-items-center">
    //       {partners.map((partner) => (
    //         <div key={partner.name} className="flex items-center justify-center p-2">
    //           <div className="relative w-32 h-16 md:w-40 md:h-20">
    //             <Image
    //               src={partner.logo}
    //               alt={partner.alt}
    //               fill
    //               className="object-contain"
    //               sizes="(max-width: 768px) 128px, 160px"
    //             />
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </section>
    <></>
  );
};

export default Partners;
