import { Layers } from "lucide-react";

// import { SlidersHorizontal } from "lucide-react";

const categories = [
  {
    name: "Burger",
    image:
      "https://media.istockphoto.com/id/520410807/photo/cheeseburger.jpg?s=612x612&w=0&k=20&c=fG_OrCzR5HkJGI8RXBk76NwxxTasMb1qpTVlEM0oyg4=",
  },
  {
    name: "Pizza",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzDD6L0Knn_LqF0Z8YyHt5eVbfDVpx993bgQ&s",
  },
  {
    name: "Fries",
    image:
      "https://www.awesomecuisine.com/wp-content/uploads/2009/05/french-fries.jpg",
  },
  {
    name: "Pasta",
    image:
      "https://www.yummytummyaarthi.com/wp-content/uploads/2022/11/red-sauce-pasta-1.jpg",
  },
  {
    name: "Biryani",
    image:
      "https://www.cookwithnabeela.com/wp-content/uploads/2025/01/ChickenBiryani.webp",
  },
];

export default function Category() {
  return (
    <div className="my-4 flex flex-col">
      <div className="flex items-center gap-2 font-normal">
        <Layers className="text-primary" size={24} strokeWidth={2.5} />
        <span className="text-lg">Category</span>
      </div>
      <div className="overflow-x-scroll scroll-hidden py-2 mr-2">
        <div className="flex items-center gap-4 font-light">
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex items-center border px-2 py-2 shadow-md rounded-3xl"
            >
              <div className="w-10 h-10 overflow-hidden rounded-full mr-2">
                <img
                  className="w-full h-full object-cover object-center"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
