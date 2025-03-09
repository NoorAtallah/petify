
"use client";

import { Footer } from "flowbite-react";
import logo from '../images/logo/2.png'

export function Foot() {
  return (
    <Footer container>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="#"
            src={logo}
            alt="Logo"
            name="Petify"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Jobs</Footer.Link>
            {/* <Footer.Link href="#">Licensing</Footer.Link> */}
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="/" by="Petify™" year={2024} />
      </div>
    </Footer>
  );
}
