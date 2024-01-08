const columns = [
  {
    name: "cartID",
    label: "Cart ID",
    field: "id",
    align: "center",
  },
  {
    name: "userId",
    label: "User ID",
    field: "userId",
    align: "center",
  },
  {
    name: "totalProducts",
    label: "Total Products",
    field: "totalProducts",
    align: "center",
  },
  {
    name: "totalQuantity",
    label: "Total Quantity",
    field: "totalQuantity",
    align: "center",
  },
  {
    name: "total",
    label: "Total",
    field: "total",
    align: "center",
    format: (val, row) => val.toLocaleString("en-US"),
  },
  {
    name: "discountedTotal",
    label: "Discounted Total",
    field: "discountedTotal",
    align: "center",
    format: (val, row) => val.toLocaleString("en-US"),
  },

  {
    name: "action",
    label: "Action",
    align: "center",
  },
];

export default columns
