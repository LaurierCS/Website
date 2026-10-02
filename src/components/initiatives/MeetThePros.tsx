import ScrapbookText from "../universal/ScrapbookText";
import ImageGallery from "../universal/ImageGallery";
import RevealOnScroll from "../universal/RevealOnScroll";

export default function MeetThePros() {
    // Image gallery data for Meet the Pros events
    const galleryImages = ["/assets/events/Meet_the_pros_F25.jpg", "/assets/events/MTP-W.jpg", "/assets/events/MTP-W2.jpg"];
    const galleryCaptions = [
        "Meet the Pros - Fall 2025: Industry professionals sharing their expertise",
        "Meet the Pros - Women Edition",
        "Look at all the people who came!!!!"
    ];

    return (
    <div className="w-full max-w-6xl mx-auto px-4 overflow-hidden" style={{ fontFamily: 'Dosis, sans-serif' }}>
        {/* Flex layout: Text on left, Gallery on right */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Text Content */}
            <div className="w-full lg:flex-1 lg:max-w-2xl">
                <ScrapbookText text="MEET THE PROFESSIONALS" letterSize={72} mobileLetterSize={45} className="justify-center lg:justify-start ml-0 lg:-ml-5" />

                <RevealOnScroll
                  visibleClassName="fadeSlideUpFast"
                  rootMargin="50px"
                  once={true}
                >
                  <div className="mt-6 text-left font-light text-white text-base md:text-lg lg:text-2xl leading-relaxed" style={{ fontFamily: 'Dosis, sans-serif' }}>
                    <p className="mb-4">
                        Our flagship event bringing together professionals from different fields to give students a first hand retelling of the field and provide them with advice.
                    </p>
                    <p>
                        We bring out the coolest guest speakers from the tech industry and giving you a chance to ask questions, hear their experience, and even make meaningful connections.
                    </p>
                  </div>
                </RevealOnScroll>
            </div>

            {/* Image Gallery */}
            <RevealOnScroll
              visibleClassName="fadeSlideUpFast"
              rootMargin="50px"
              once={true}
              className="w-full lg:flex-1 lg:mt-2"
            >
              <ImageGallery 
                  images={galleryImages} 
                  captions={galleryCaptions}
                  showCounter={false}
                  width="100%"
                  aspectRatio="4/3"
              />
            </RevealOnScroll>
        </div>
    </div>
    );
}