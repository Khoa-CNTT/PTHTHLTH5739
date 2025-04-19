import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SortBySelect = ({ sortOptions, selectedSort, setSelectedSort }) => {
  const handleChange = (event) => {
    setSelectedSort(event.target.value); // Cập nhật giá trị sắp xếp
  };

  // Kiểm tra sortOptions có phải là mảng không
  const safeSortOptions = Array.isArray(sortOptions) ? sortOptions : [];

  return (
    <FormControl fullWidth>
      <InputLabel id="sort-by-label">Sắp xếp theo</InputLabel>
      <Select
        labelId="sort-by-label"
        id="sort-by"
        value={selectedSort}
        onChange={handleChange}
        label="Sort By"
        MenuProps={MenuProps}
      >
        {safeSortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortBySelect;
