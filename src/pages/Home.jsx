import SearchItem from "..//components/Client/SearchItem";
import Filter from "@/components/Client/Filter";
import OfferSlider from "@/components/Client/OfferSlider";
import Category from "@/components/Client/Category";
import OrderComplete from "@/components/Client/OrderComplete";
import FoodListing from "@/components/Client/FoodListing";

export default function Home() {
  return (
    <>
      <SearchItem />
      <Filter />
      <OfferSlider />
      <Category />
      <OrderComplete />
      <FoodListing />
    </>
  );
}
