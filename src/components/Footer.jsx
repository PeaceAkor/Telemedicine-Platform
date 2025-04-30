import React from "react";
import logo from "../assets/logo1.jpg";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[1.5fr_1fr_1fr] gap-5 my-10 mt-40 text-sm">
        {/*...left section*/}
        <div>
          <img className="mb-3 w-30" src={logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Connecting patients with trusted healthcare professionals anytime,
            anywhere. Our telemedicine platform ensures convenient, secure, and
            accessible virtual consultations for better health outcomes.
          </p>
        </div>
        {/*...middle section*/}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>HOME</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/*...right section*/}
        <div>
          <p className="text-xl font-medium mb-5">Get in Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+2347013963735</li>
            <li>raphealpeace85@gmail.com</li>
          </ul>
        </div>
      </div>
      {/*..copywritetext..*/}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copywrite 2025@ MedLink All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
