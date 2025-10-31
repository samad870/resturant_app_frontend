"use client";

import { useState, useEffect } from "react";
import { useGetMenuQuery, useGetRestaurantQuery } from "../redux/clientRedux/clientAPI";
import Header from "@/components/Client/Header";
import Filter from "@/components/Client/Filter";
import Category from "@/components/Client/Category";
import FoodListing from "@/components/Client/FoodListing";
import Copywright from "@/components/Client/Copywright";
import loader from "@/assets/loader.gif";

export default function Home() {
  const { data: menuData, isLoading: menuLoading, error: menuError } = useGetMenuQuery();
  const { data: restaurantData, isLoading: restaurantLoading, error: restaurantError } = useGetRestaurantQuery();

  const [showLoader, setShowLoader] = useState(true);
  const [filters, setFilters] = useState({ veg: false, nonVeg: false });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  const loading = menuLoading || restaurantLoading;
  const error = menuError || restaurantError;

  useEffect(() => {
    let timer;
    if (loading) {
      setShowLoader(true);
    } else {
      timer = setTimeout(() => setShowLoader(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (showLoader)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <img src={loader} alt="Loading..." className="h-60" />
      </div>
    );

  if (error) return <p>Error fetching data.</p>;

  const restaurant = restaurantData?.restaurant || {};
  const menu = Array.isArray(menuData?.menu) ? menuData.menu : [];

  // Apply filters (search + veg/non-veg + category)
  const filteredMenu = menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filters.veg && !filters.nonVeg && item.type !== "veg") return false;
    if (filters.nonVeg && !filters.veg && item.type !== "non-veg") return false;
    if (activeCategory && item.category !== activeCategory) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryClick = (category) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-20 border-b shadow-sm">
        <Header
          logo={restaurant.logo?.url}
          siteName={restaurant.restaurantName}
          search={search}
          onSearch={setSearch}
        />
        <Filter filters={filters} onChange={handleFilterChange} />
        <Category
          title="Food Categories"
          categories={menu}
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />
      </div>

      <FoodListing menu={filteredMenu} onQuantityChange={setTotal} />
      {/* <Copywright /> */}
    </>
  );
}
