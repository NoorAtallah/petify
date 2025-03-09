import '../App.css';
// import { Header } from '../components/header';
import { Hero } from '../componants/hero';
import WhyUs from '../componants/whyus';
import Help from '../componants/help';
import Ask from '../componants/ask';
import Pricing from '../componants/pricing';
// import Slider from '../componants/slider';
import Vet from '../componants/vet';
import Approved from '../componants/approved';
import {Acco} from '../componants/accord';

const Home =() =>{
    return(
        <>
  
   <Hero />
   <WhyUs />
   <Help />
   <Ask />
   <Pricing />
   {/* <Slider /> */}
   <Vet />.
   <Approved />
   <Acco />
   </>
    )
}

export default Home;