import { Layers } from "lucide-react";

export default function Category({
  categories = [],
  title = "Category",
  onCategoryClick,
  activeCategory, // ✅ added for highlighting active category
}) {
  // ✅ Remove duplicates by category name
  const uniqueCategories = categories.filter(
    (item, index, self) =>
      index === self.findIndex((cat) => cat.category === item.category)
  );

  return (
    <div className="my-4 flex flex-col pl-2">
      <div className="flex items-center gap-2 font-normal">
        <Layers className="text-primary" size={24} strokeWidth={2.5} />
        <span className="text-lg">{title}</span>
      </div>

      <div className="overflow-x-scroll scroll-hidden py-2 mr-2">
        <div className="flex items-center gap-4 font-light">
          {/* ✅ All Button */}
          <div
            onClick={() => onCategoryClick?.(null)} // null = show all
            className={`flex items-center border h-14 w-14 p-4 shadow-md rounded-full cursor-pointer hover:shadow-lg transition ${
              activeCategory === null
                ? "bg-primary text-white"
                : "bg-white text-black"
            }`}
          >
            All
          </div>

          {/* ✅ Category Buttons */}
          {uniqueCategories.map((item, index) => (
            <div
              key={index}
              onClick={() => onCategoryClick?.(item.category)}
              className={`flex items-center border px-2 py-2 shadow-md rounded-3xl cursor-pointer hover:shadow-lg transition ${
                activeCategory === item.category
                  ? "bg-primary text-white"
                  : "bg-white text-black"
              }`}
            >
              <div className="w-10 h-10 overflow-hidden rounded-full mr-2">
                <img
                  className="w-full h-full object-cover object-center"
                  src={item?.image?.url}
                  alt={item?.category}
                />
              </div>
              {item?.category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
