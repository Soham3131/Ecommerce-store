

// import React, { useMemo } from "react";
// import Slider from "rc-slider";
// import "rc-slider/assets/index.css";

// const FilterSidebar = ({
//   filters,
//   setFilters,
//   categories = [],
//   subCategories = [],
//   brands = [],
//   products = [],
// }) => {
//   // normalize helpers
//   const normalizeValue = (val) =>
//     typeof val === "string" ? val : val?.name || val?._id || "";

//   // compute global min/max from products (variants or top-level price)
//   const { minPrice, maxPrice } = useMemo(() => {
//     const prices = [];
//     (products || []).forEach((p) => {
//       if (Array.isArray(p.variants) && p.variants.length) {
//         p.variants.forEach((v) => {
//           const n = Number(v?.price ?? v?.amount);
//           if (!Number.isNaN(n)) prices.push(n);
//         });
//       } else if (p.price != null) {
//         const n = Number(p.price);
//         if (!Number.isNaN(n)) prices.push(n);
//       }
//     });
//     return {
//       minPrice: prices.length ? Math.min(...prices) : 0,
//       maxPrice: prices.length ? Math.max(...prices) : 100000,
//     };
//   }, [products]);

//   // ensure safe filters
//   const safeFilters = filters || {
//     price: [minPrice, maxPrice],
//     gender: [],
//     category: [],
//     subCategory: [],
//     size: [],
//     brand: [],
//   };

//   const priceRange = safeFilters.price ?? [minPrice, maxPrice];
//   const gender = safeFilters.gender ?? [];
//   const category = safeFilters.category ?? [];
//   const subCategory = safeFilters.subCategory ?? [];
//   const size = safeFilters.size ?? [];
//   const brand = safeFilters.brand ?? [];

//   // Build counts for category/subCategory/brand
//   const categoryCounts = useMemo(() => {
//     const counts = {};
//     (products || []).forEach((p) => {
//       const c = normalizeValue(p.category);
//       if (c) counts[c] = (counts[c] || 0) + 1;
//     });
//     return counts;
//   }, [products]);

//   const subCategoryCounts = useMemo(() => {
//     const counts = {};
//     (products || []).forEach((p) => {
//       const sc = normalizeValue(p.subCategory);
//       if (sc) counts[sc] = (counts[sc] || 0) + 1;
//     });
//     return counts;
//   }, [products]);

//   const brandCounts = useMemo(() => {
//     const counts = {};
//     (products || []).forEach((p) => {
//       const b = normalizeValue(p.brand);
//       if (b) counts[b] = (counts[b] || 0) + 1;
//     });
//     return counts;
//   }, [products]);

//   // final normalized options (only those with count > 0)
//   const normalizedCategories = Array.from(
//     new Set(categories.map(normalizeValue).filter((c) => categoryCounts[c] > 0))
//   ).sort();

//   const normalizedSubCategories = Array.from(
//     new Set(subCategories.map(normalizeValue).filter((sc) => subCategoryCounts[sc] > 0))
//   ).sort();

//   const normalizedBrands = Array.from(
//     new Set(brands.map(normalizeValue).filter((b) => brandCounts[b] > 0))
//   ).sort();

//   const handleChange = (key, value) => {
//     if (typeof setFilters !== "function") return;
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <aside className="w-full md:w-64 bg-white shadow-lg rounded-2xl p-6 mb-8 md:mb-0">
//       <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

//       {/* Price */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">
//           Price (₹{priceRange[0]} - ₹{priceRange[1]})
//         </h3>
//         <Slider
//           range
//           min={minPrice}
//           max={maxPrice}
//           step={50}
//           value={priceRange}
//           onChange={(val) => handleChange("price", val)}
//           trackStyle={[{ backgroundColor: "#7c3aed" }]}
//           handleStyle={[
//             { borderColor: "#7c3aed" },
//             { borderColor: "#7c3aed" },
//           ]}
//         />
//       </div>

//       {/* Gender */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Gender</h3>
//         {["male", "female", "unisex", "boys", "girls"].map((g) => (
//           <label key={g} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={gender.includes(g)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...gender, g]
//                   : gender.filter((x) => x !== g);
//                 handleChange("gender", newVal);
//               }}
//               className="mr-2 accent-purple-600"
//             />
//             {g.charAt(0).toUpperCase() + g.slice(1)}
//           </label>
//         ))}
//       </div>

//       {/* Category */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Category</h3>
//         {normalizedCategories.map((c) => (
//           <label key={c} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={category.includes(c)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...category, c]
//                   : category.filter((x) => x !== c);
//                 handleChange("category", newVal);
//               }}
//               className="mr-2 accent-purple-600"
//             />
//             {c} <span className="text-gray-500">({categoryCounts[c]})</span>
//           </label>
//         ))}
//       </div>

//       {/* SubCategory */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Sub Category</h3>
//         {normalizedSubCategories.map((sc) => (
//           <label key={sc} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={subCategory.includes(sc)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...subCategory, sc]
//                   : subCategory.filter((x) => x !== sc);
//                 handleChange("subCategory", newVal);
//               }}
//               className="mr-2 accent-purple-600"
//             />
//             {sc} <span className="text-gray-500">({subCategoryCounts[sc]})</span>
//           </label>
//         ))}
//       </div>

//       {/* Size */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Size</h3>
//         {["6", "7", "8", "9", "10", "11"].map((s) => (
//           <label key={s} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={size.includes(s)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...size, s]
//                   : size.filter((x) => x !== s);
//                 handleChange("size", newVal);
//               }}
//               className="mr-2 accent-purple-600"
//             />
//             {s}
//           </label>
//         ))}
//       </div>

//       {/* Brands */}
//       <div>
//         <h3 className="font-semibold mb-2">Brand</h3>
//         {normalizedBrands.map((b) => (
//           <label key={b} className="flex items-center mb-2">
//             <input
//               type="checkbox"
//               checked={brand.includes(b)}
//               onChange={(e) => {
//                 const newVal = e.target.checked
//                   ? [...brand, b]
//                   : brand.filter((x) => x !== b);
//                 handleChange("brand", newVal);
//               }}
//               className="mr-2 accent-purple-600"
//             />
//             {b} <span className="text-gray-500">({brandCounts[b]})</span>
//           </label>
//         ))}
//       </div>
//     </aside>
//   );
// };

// export default FilterSidebar;


import React, { useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FilterSidebar = ({
  filters,
  setFilters,
  categories = [],
  subCategories = [],
  brands = [],
  products = [],
}) => {
  // normalize helpers
  // const normalizeValue = (val) =>
  //   typeof val === "string" ? val : val?.name || val?._id || "";

  // inside FilterSidebar
const normalizeValue = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.name || "";   // ✅ never fallback to _id for UI
};


  // compute global min/max from products (variants or top-level price)
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = [];
    (products || []).forEach((p) => {
      if (Array.isArray(p.variants) && p.variants.length) {
        p.variants.forEach((v) => {
          const n = Number(v?.price ?? v?.amount);
          if (!Number.isNaN(n)) prices.push(n);
        });
      } else if (p.price != null) {
        const n = Number(p.price);
        if (!Number.isNaN(n)) prices.push(n);
      }
    });
    return {
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 100000,
    };
  }, [products]);

  // 🌟 FIX: Compute unique sizes from all product variants 🌟
  const allUniqueSizes = useMemo(() => {
    const sizes = new Set();
    (products || []).forEach((p) => {
      if (Array.isArray(p.variants)) {
        p.variants.forEach((v) => {
          if (v.size) {
            sizes.add(v.size.toString()); // Ensure it's a string for consistency
          }
        });
      }
    });
    // Convert Set to Array and sort
    return Array.from(sizes).sort((a, b) => {
      // Sort numerically if possible, otherwise by string
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [products]);

  // ensure safe filters
  const safeFilters = filters || {
    price: [minPrice, maxPrice],
    gender: [],
    category: [],
    subCategory: [],
    size: [],
    brand: [],
  };

  const priceRange = safeFilters.price ?? [minPrice, maxPrice];
  const gender = safeFilters.gender ?? [];
  const category = safeFilters.category ?? [];
  const subCategory = safeFilters.subCategory ?? [];
  const size = safeFilters.size ?? [];
  const brand = safeFilters.brand ?? [];

  // Build counts for category/subCategory/brand
  const categoryCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const c = normalizeValue(p.category);
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [products]);

  const subCategoryCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const sc = normalizeValue(p.subCategory);
      if (sc) counts[sc] = (counts[sc] || 0) + 1;
    });
    return counts;
  }, [products]);

  const brandCounts = useMemo(() => {
    const counts = {};
    (products || []).forEach((p) => {
      const b = normalizeValue(p.brand);
      if (b) counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [products]);

  // final normalized options (only those with count > 0)
  const normalizedCategories = Array.from(
    new Set(categories.map(normalizeValue).filter((c) => categoryCounts[c] > 0))
  ).sort();

  const normalizedSubCategories = Array.from(
    new Set(subCategories.map(normalizeValue).filter((sc) => subCategoryCounts[sc] > 0))
  ).sort();

  const normalizedBrands = Array.from(
    new Set(brands.map(normalizeValue).filter((b) => brandCounts[b] > 0))
  ).sort();

  const handleChange = (key, value) => {
    if (typeof setFilters !== "function") return;
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="w-full md:w-64 bg-white shadow-lg rounded-2xl p-6 mb-8 md:mb-0">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Price (₹{priceRange[0]} - ₹{priceRange[1]})
        </h3>
        <Slider
          range
          min={minPrice}
          max={maxPrice}
          step={50}
          value={priceRange}
          onChange={(val) => handleChange("price", val)}
          trackStyle={[{ backgroundColor: "#7c3aed" }]}
          handleStyle={[
            { borderColor: "#7c3aed" },
            { borderColor: "#7c3aed" },
          ]}
        />
      </div>

      {/* Gender */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Gender</h3>
        {["male", "female", "unisex", "boys", "girls"].map((g) => (
          <label key={g} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={gender.includes(g)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...gender, g]
                  : gender.filter((x) => x !== g);
                handleChange("gender", newVal);
              }}
              className="mr-2 accent-purple-600"
            />
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </label>
        ))}
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        {normalizedCategories.map((c) => (
          <label key={c} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={category.includes(c)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...category, c]
                  : category.filter((x) => x !== c);
                handleChange("category", newVal);
              }}
              className="mr-2 accent-purple-600"
            />
            {c} <span className="text-gray-500">({categoryCounts[c]})</span>
          </label>
        ))}
      </div>

      {/* SubCategory */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Sub Category</h3>
        {normalizedSubCategories.map((sc) => (
          <label key={sc} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={subCategory.includes(sc)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...subCategory, sc]
                  : subCategory.filter((x) => x !== sc);
                handleChange("subCategory", newVal);
              }}
              className="mr-2 accent-purple-600"
            />
            {sc} <span className="text-gray-500">({subCategoryCounts[sc]})</span>
          </label>
        ))}
      </div>

      {/* Size */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Size</h3>
        {allUniqueSizes.map((s) => (
          <label key={s} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={size.includes(s)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...size, s]
                  : size.filter((x) => x !== s);
                handleChange("size", newVal);
              }}
              className="mr-2 accent-purple-600"
            />
            {s}
          </label>
        ))}
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-2">Brand</h3>
        {normalizedBrands.map((b) => (
          <label key={b} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={brand.includes(b)}
              onChange={(e) => {
                const newVal = e.target.checked
                  ? [...brand, b]
                  : brand.filter((x) => x !== b);
                handleChange("brand", newVal);
              }}
              className="mr-2 accent-purple-600"
            />
            {b} <span className="text-gray-500">({brandCounts[b]})</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;

