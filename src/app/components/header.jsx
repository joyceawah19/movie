import React from "react";
import Image from "next/image";

function Header() {
  return (
    <div className="flex justify-between lg:px-20 px-6 py-6 fixed">
       <div className="flex justify-between   items-center lg:px-20 px-6   py-10">
        <div>
          <h1 className="">cineVerse</h1>
        </div>
        <div>
          <ul className="lg:flex hidden gap-8 text-white ">
            <li>Pricing</li>
            <li> Product</li>
            <li> About Us</li>
            <li> Careers</li>
            <li> Community</li>
          </ul>
        </div>
        <button className="bg-[hsl(12,88%,59%)] hidden lg:block  text-white px-10 py-4 rounded-[30px] ">
          Get Started
        </button>
        <Image
          src="/images/icon-hamburger.svg"
          alt=""
          width={30}
          height={30}
          className="cursor-pointer lg:hidden flex"
        />
      </div>
    </div>
  );
}

export default Header;
