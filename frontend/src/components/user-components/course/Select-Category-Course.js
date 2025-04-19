import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CategorySelect = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const handleChange = (event) => {
    setSelectedCategory(event.target.value); // Cập nhật danh mục
  };

  // Kiểm tra categories có phải là mảng không
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <FormControl fullWidth>
      <InputLabel id="category-select-label">Danh mục</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory}
        onChange={handleChange}
        label="Category"
      >
        <MenuItem value="">Tất cả</MenuItem>
        {safeCategories.map((category, index) => (
          <MenuItem key={index} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
