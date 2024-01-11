const columns = [
  {
    name: "fullname",
    label: "Full Name",
    field: (row) => `${row.firstName} ${row.lastName}`,
    align: "left",
  },
  {
    name: "age",
    label: "Age",
    field: "age",
    align: "center",
  },
  {
    name: "gender",
    label: "Gender",
    field: "gender",
    align: "center",
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    align: "left",
  },
  {
    name: "phone",
    label: "Phone",
    field: "phone",
    align: "left",
  },
  {
    name: "height",
    label: "Height (cm)",
    field: "height",
    align: "center",
  },
  {
    name: "weight",
    label: "Weight (kg)",
    field: "weight",
    align: "center",
  },
  {
    name: "university",
    label: "University",
    field: "university",
    align: "left",
  },
  {
    name: "birthDate",
    label: "Birth of Date",
    field: "birthDate",
    align: "left",
  },
  {
    name: "address",
    label: "Address",
    field: (row) => `${row.address.address}, ${row.address.city}`,
    align: "left",
  },
  {
    name: "company",
    label: "Company",
    field: (row) => `${row.company.name}`,
    align: "left",
  },
  {
    name: "action",
    label: "Action",
    align: "center",
  },
];

export default columns;
