
import React from 'react';
import { Accordion } from "flowbite-react";

export function Acco() {
  return (
    <div className=' flex justify-center mt-20  m-auto mb-4 border-light'>
    <Accordion className='ms-70 mt-4 w-90  self-center text-black' style={{width:'1000px'}}>
        <h1 className='text-center font-bold text-2xl ml-5 mb-4 mt-4'>FAQ's</h1>
      <Accordion.Panel className='border-black focus:ring-transparent  '>
        <Accordion.Title className='text-black text-sm  hover:bg-light focus:ring-transparent '>What is Petify?</Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-black text-sm">
          Petify is an online platform that connects pet owners with certified veterinarians for virtual consultations. It aims to revolutionize pet care by making it more accessible and convenient, providing a reliable resource for pet health advice and support.
          </p>
          
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel className='border-black focus:ring-transparent'>
        <Accordion.Title className='text-black text-sm  hover:bg-light focus:ring-transparent '>How does Petify work?</Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-black text-sm">
          Petify offers two primary services: live chat with and video chat consultations scheduled. Users can create an account, select their preferred type of consultation, and connect with a vet for immediate assistance or book an appointment for a more detailed consultation.
          </p>
          
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel className='border-black focus:ring-transparent'>
        <Accordion.Title className='text-black text-sm  hover:bg-light focus:ring-transparent '>How do I create an account on Petify?</Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-black text-sm">
          To create an account, click on the "Sign Up" button on the homepage. You’ll be prompted to enter your email address, create a password, and provide some basic information about yourself. Once you complete the sign-up process, you’ll receive a confirmation email, and you’ll be ready to start booking consultations.
          </p>
          
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel className='border-black focus:ring-transparent' >
        <Accordion.Title className='text-black text-sm  hover:bg-light focus:ring-transparent '>What types of consultations are available?</Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-black text-sm">
          Petify offers two main consultation options:

Live Chat - Connect instantly with a vet through text chat for quick advice on minor concerns.
Video Consultation - Book a video consultation for in-depth discussions about your pet’s health, suitable for more complex issues requiring the vet’s full attention.
          </p>
         
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
    </div>
  );
}
