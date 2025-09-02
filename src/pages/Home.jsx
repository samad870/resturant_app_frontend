"use client";

import { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import Header from "@/components/Client/Header";
import SearchItem from "@/components/Client/SearchItem";
import Filter from "@/components/Client/Filter";
import Category from "@/components/Client/Category";
// import OrderComplete from "@/components/Client/OrderComplete";
import FoodListing from "@/components/Client/FoodListing";

export default function Home() {
  const { data, loading, error } = useMenu();
  const [filters, setFilters] = useState({ veg: false, nonVeg: false });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error: {error}</p>;

  const restaurant = data?.restaurant;
  const menu = data?.menu || [];

  // Apply filters (search + veg/non-veg + category)
  const filteredMenu = menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filters.veg && !filters.nonVeg && item.type !== "veg") {
      return false;
    }
    if (filters.nonVeg && !filters.veg && item.type !== "non-veg") {
      return false;
    }

    if (activeCategory && item.category !== activeCategory) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryClick = (category) => {
    // toggle category selection (if same category clicked again, reset to show all)
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-20">
        <Header logo={restaurant?.logo?.url} siteName={restaurant?.name} />
        <SearchItem search={search} onSearch={setSearch} />
        <Filter filters={filters} onChange={handleFilterChange} />
        <Category
          title="Food Categories"
          categories={menu}
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory} // (optional: pass for UI highlighting)
        />
      </div>
      <FoodListing menu={filteredMenu} onQuantityChange={setTotal} />
      {/* <OrderComplete total={total} /> */}
    </>
  );
}
