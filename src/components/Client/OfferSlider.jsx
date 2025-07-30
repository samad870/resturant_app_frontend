// import { Search } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
} from "@/components/ui/carousel";

export default function OfferSlider() {
  return (
    <>
      <Carousel className="my-4">
        <CarouselContent>
          <CarouselItem>
            <img
              className="h-52 w-full rounded-xl"
              src="https://cdn.grabon.in/gograbon/images/merchant/1610000375685.png"
              alt=""
            />
          </CarouselItem>
          <CarouselItem>
            <img
              className="h-52 w-full rounded-xl"
              src="https://cdn.grabon.in/gograbon/images/web-images/uploads/1618575517942/food-coupons.jpg"
              alt=""
            />
          </CarouselItem>
          <CarouselItem>
            <img
              className="h-52 w-full rounded-xl"
              src="https://images.examples.com/wp-content/uploads/2017/11/discount-voucher-1024x681.jpg"
              alt=""
            />
          </CarouselItem>
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </>
  );
}
