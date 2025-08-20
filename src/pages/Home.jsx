"use client";

import { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import Header from "@/components/Client/Header";
import SearchItem from "@/components/Client/SearchItem";
import Filter from "@/components/Client/Filter";
// import OfferSlider from "@/components/Client/OfferSlider";
import Category from "@/components/Client/Category";
import OrderComplete from "@/components/Client/OrderComplete";
import FoodListing from "@/components/Client/FoodListing";
// import HelperData from "@/components/Client/HelperData";

export default function Home() {
  const { data, loading, error } = useMenu();
  const [filters, setFilters] = useState({ veg: false, nonVeg: false });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error: {error}</p>;

  const restaurant = data?.restaurant;
  const menu = data?.menu || [];

  // Apply filters
  const filteredMenu = menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filters.veg && !filters.nonVeg) {
      return item.type === "veg";
    }
    if (filters.nonVeg && !filters.veg) {
      return item.type === "non-veg";
    }
    return true; // if both or none are selected → show all
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryClick = (category) => {
    const el = document.getElementById(`category-${category}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <>
      <Header logo={restaurant?.logo?.url} siteName={restaurant?.name} />
      {/* <HelperData /> */}
      <SearchItem search={search} onSearch={setSearch} />
      {/* <OfferSlider /> */}
      <Filter filters={filters} onChange={handleFilterChange} />
      <Category
        title="Food Categories"
        categories={menu}
        onCategoryClick={handleCategoryClick}
      />
      <FoodListing menu={filteredMenu} onQuantityChange={setTotal} />
      <OrderComplete total={total} />
    </>
  );
}
