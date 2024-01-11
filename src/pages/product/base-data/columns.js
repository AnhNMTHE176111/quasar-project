const columns = [
  {
    name: "title",
    label: "Title",
    field: "title",
    required: true,
    align: "left",
    style: "min-width: 300px",
  },
  {
    name: "brand",
    label: "Brand",
    field: "brand",
    required: true,
    align: "left",
    style: "min-width: 200px",
  },
  {
    name: "category",
    label: "Category",
    field: "category",
    required: true,
    align: "left",
    style: "min-width: 120px",
  },
  {
    name: "price",
    label: "Price",
    field: "price",
    required: true,
    align: "center",
    format: (val, row) => val.toLocaleString("en-US"),
  },
  {
    name: "discountPercentage",
    label: "Discount",
    field: "discountPercentage",
    required: true,
    align: "center",
    format: (val, row) => {
      if (val) {
        return val.toFixed(1);
      }
    },
  },
  {
    name: "rating",
    label: "Rating",
    field: "rating",
    required: true,
    align: "center",
  },
  {
    name: "stock",
    label: "Stock",
    field: "stock",
    required: true,
    align: "center",
  },
  {
    name: "action",
    label: "Action",
    align: "center",
  },
];
export default columns;
