import React from "react";
import { GoLocation } from "react-icons/go";
import { MdLocationOn } from "react-icons/md";

import "./style.scss";

const Destinations = () => {
   const list = [
      {
         name: "Miami River",
         image1:
            "https://www.conchovalleyhomepage.com/wp-content/uploads/sites/83/2021/03/GettyImages-643977897.jpg?strip=1",
         image2:
            "http://oneriverpoint.com/wp-content/uploads/2016/08/things-to-do-miami-river-1.jpg",
         description:
            "The Miami River is a 5.5-mile river flowing from the Miami Canal through the epicenter of Greater Downtown Miami to the beautiful blue waters of Biscayne Bay.",
      },
      {
         name: "Marine Stadium",
         image1:
            "https://sustainableconservation.ca/wp-content/uploads/2019/11/44582957551_8282f5a366_b.jpg",
         image2: "https://thenewtropic.com/miami-marine-stadium/people-a-few/",
         description:
            "First stadium purpose-built for powerboat racing in the United States. The venue also hosted concerts and boxing events but was declared unsafe and shut down in 1992.",
      },
      {
         name: "Miami Beach Ocean Side",
         image1:
            "https://a.cdn-hotels.com/gdcs/production2/d1821/71438820-8f10-11e8-b6b0-0242ac110007.jpg",
         image2:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvG4jtmXsEBgraQC_XOOogRJGYcUlQ6tFw9Q&usqp=CAU",
         description:
            "Located on a barrier island east of Miami and Biscayne Bay, it is home to a large number of beach resorts and is one of the most popular spring break party destinations in the world.",
      },
      {
         name: "Venetian Islands and Star Island",
         image1:
            "https://www.miawaterfront.com/wp-content/uploads/2017/02/shutterstock_567090886.jpg",
         image2:
            "https://t4.ftcdn.net/jpg/01/72/50/61/360_F_172506190_pWUN7DL3EIGeQcdKJ6vs5fqk0jbavfRb.jpg",
         description:
            "A chain of 6 man-made islands located in Biscayne Bay. From east to west, they are as follows: Belle Isle, Rivo Alto Island, Di Lido Island, San Marino Island, San Marco Island, and Biscayne Island.",
      },
      {
         name: "Star Island",
         image1:
            "https://lh3.googleusercontent.com/proxy/laGUzR8vGmsc2nLLFKINtEHUYn4wyOtKAK3XWgVACL7Wpzy7oFFa6ea_pDt3iYEGpG8OPLbedO3Bxb1O0epfJH-YnIsYG0NmxL78OE2wxGz1TSXdN2dWRGOE2ql3",
         image2: "https://i.ytimg.com/vi/51jOYclZZuE/maxresdefault.jpg",
         description:
            "Gated community located on an artificial island in between the main islands of Miami Beach and mainland Florida. From classical architectural wonders to modern mega-mansions, this luxurious neighborhood on the sea has seen its share of history, glamor, fame, and even drama.",
      },
   ];

   return (
      <section className="destinations row">
         <div className="row-item">
            <h2 className="heading heading-primary text-primary">
               Possible Destinations
            </h2>
            <ul className="destinations-list">
               {list.map((item, i) => {
                  if (i !== 4)
                     return (
                        <li className="destinations-list-item heading" key={i}>
                           <GoLocation className="icon" /> &nbsp; {item.name}
                        </li>
                     );
                  else return <></>;
               })}
            </ul>
         </div>
         <div className="row-item">
            <div className="destinations-img img">
               {list.map((item, i) => (
                  <div
                     key={`dest${i}`}
                     className={`destinations-item item-${i}`}
                  >
                     <MdLocationOn className="destinations-icon" />
                     <div className={`destinations-info item-${i}`}>
                        <h2 className="heading heading-secondary text-left text-primary">
                           {i === 3 ? "Venetian Islands" : item.name}
                        </h2>
                        <div
                           style={{ backgroundImage: `url(${item.image1})` }}
                           className="destinations-info-img img"
                        ></div>
                        <div
                           style={{ backgroundImage: `url(${item.image2})` }}
                           className="destinations-info-img img"
                        ></div>
                        <p className="destinations-info-desc">
                           {item.description}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default Destinations;
