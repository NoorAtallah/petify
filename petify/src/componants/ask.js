import React from 'react';
import './ask.css';
import ask from '../images/ask/5.PNG';
import ask_2 from '../images/ask/2.png';
import ask_3 from '../images/ask/3.png';
import ask_4 from '../images/ask/4.png';
import { Link } from 'react-router-dom';

const Ask = () => {
  return (
    <section className="ask">
      <div className="wrapper">
        <div className="title_2">We're Here for Every Question Big or Small</div>
        <div className="subtitle">
          Our licensed veterinary team is here 7 days a week to provide their expertise via chat or video call.
        </div>
        <div className="services_2">
          <div className="service_2">
            <img src={ask} alt="Health Concerns" />
            <div className="service-content_2">
              <div className="service-title_2">Health concerns</div>
              <div className="service-description_2">
                Online vets and vet techs talk through your pet's symptoms and provide information about illnesses, allergies, injuries, and more.
              </div>
            </div>
          </div>
          <div className="service_2">
            <img src={ask_2} alt="Lifelong Well-being" />
            <div className="service-content_2">
              <div className="service-title_2">Lifelong well-being</div>
              <div className="service-description_2">
                Learn how to support your pet’s well-being at every age, from supplements to dental care.
              </div>
            </div>
          </div>
          <div className="service_2">
            <img src={ask_3} alt="Food & Nutrition" />
            <div className="service-content_2">
              <div className="service-title_2">Food & nutrition</div>
              <div className="service-description_2">
                We'll help take the guesswork out of food and treats for your cat or dog.
              </div>
            </div>
          </div>
          <div className="service_2">
            <img src={ask_4} alt="Behavior Questions" />
            <div className="service-content_2">
              <div className="service-title_2">Behavior questions</div>
              <div className="service-description_2">
                Find out how to bring out your pet's best behavior, plus tips for everything from potty training to walking on a leash.
              </div>
            </div>
          </div>
        </div>
        <div className="connect-button-container">
          <div className="as">Ask a Virtual Vet</div>
          <br /> <br />
          <Link to='/login'>
            <button className="connect-button_2">
              Connect Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Ask;
