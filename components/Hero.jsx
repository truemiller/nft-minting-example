import Image from "next/image";

export const Hero = () => {
  return (
    <div className="flex p-5 py-40 bg-opacity-50  shadow-xl">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-5">
          <h1 className="my-auto">NFT Minting Example</h1>
          <Image
            src="https://www.thisiscolossal.com/wp-content/uploads/2018/04/agif2opt.gif"
            alt="Animated artwork"
            width={640}
            height={640}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
