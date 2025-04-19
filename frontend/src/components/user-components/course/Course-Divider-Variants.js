import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { height } from "@mui/system";

const style = {
  width: "100%",
  borderRadius: 2,
  borderColor: "divider",
};

export default function DividerVariants({
  slotNumber,
  difficulty,
  price,
  category,
  discount,

}) {
  const discountedPrice = price - price * (discount / 100);

  return (
    <List sx={style} className="custom-list">
      <ListItem className="list-item">
        <ListItemText
          primary={
            <div className="list-text">
              <span className="label">Số bài tập: </span>
              <span className="value">{slotNumber}</span>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" className="divider" />
      <ListItem className="list-item">
        <ListItemText
          primary={
            <div className="list-text">
              <span className="label">Độ khó: </span>
              <span className="value">{difficulty || "Not specified"}</span>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" className="divider" />
      <ListItem className="list-item">
        <ListItemText
          primary={
            <div className="list-text">
              <span className="label">Giá tiền: </span>
              <span className="value">
                {discount > 0 ? (
                  <>
                    <s>{price?.toLocaleString() || "Not specified"}</s>{" "}
                    {/* Giá cũ bị gạch */}{" "}
                    <span className="discounted-price">
                      {discountedPrice?.toLocaleString() || "Not specified"} VNĐ
                    </span>
                  </>
                ) : (
                  `${price?.toLocaleString() || "Not specified"} VNĐ`
                )}
              </span>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" className="divider" />
      <ListItem className="list-item">
        <ListItemText
          primary={
            <div className="list-text">
              <span className="label">Danh mục: </span>
              <span className="value">{category}</span>
            </div>
          }
        />
      </ListItem>
      <Divider component="li" className="divider" />
    </List>
  );
}
