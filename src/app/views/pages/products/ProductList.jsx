import React from "react";
import { Breadcrumb } from "matx";
import MUIDataTable from "mui-datatables";
import { Grow, Icon, IconButton, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

const ProductList = () => {
  const columns = [
    {
      name: "name", // field name in the row object
      label: "Name", // column title that will be shown in table
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let user = productList[dataIndex];

          return (
            <div className="flex items-center">
              <img
                className="h-32 border-radius-4"
                src={user?.imgUrl}
                alt="user"
              />
              <div className="ml-3">
                <h5 className="my-0 text-15">{user?.name}</h5>
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "description",
      label: "Details",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <span className="ellipsis">{productList[dataIndex].description}</span>
        ),
      },
    },
    {
      name: "quantity",
      label: "Invenotry",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          let quantity = productList[dataIndex].quantity;

          if (quantity === 0)
            return (
              <small className="text-white bg-error border-radius-4 px-2 py-2px">
                Out of Stock
              </small>
            );
          else if (quantity >= 30)
            return (
              <small className="text-white bg-green border-radius-4 px-2 py-2px">
                Available
              </small>
            );
          else if (quantity < 30)
            return (
              <small className="bg-secondary border-radius-4 px-2 py-2px">
                Limited Stock
              </small>
            );
        },
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <span>${productList[dataIndex].price.toFixed(2)}</span>
        ),
      },
    },
    {
      name: "action",
      label: " ",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => (
          <div className="flex items-center">
            <div className="flex-grow"></div>
            <Link to="/pages/new-customer">
              <IconButton>
                <Icon>edit</Icon>
              </IconButton>
            </Link>
            <Link to="/pages/view-customer">
              <IconButton>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Link>
          </div>
        ),
      },
    },
  ];

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "Product List" },
          ]}
        />
      </div>
      <div className="overflow-auto">
        <div className="min-w-750">
          <MUIDataTable
            title={"All Products"}
            data={productList}
            columns={columns}
            options={{
              filterType: "textField",
              responsive: "standard",
              // selectableRows: "none", // set checkbox for each row
              // search: false, // set search option
              // filter: false, // set data filter option
              // download: false, // set download option
              // print: false, // set print option
              // pagination: true, //set pagination option
              // viewColumns: false, // set column option
              elevation: 0,
              rowsPerPageOptions: [10, 20, 40, 80, 100],
              customSearchRender: (
                searchText,
                handleSearch,
                hideSearch,
                options
              ) => {
                return (
                  <Grow appear in={true} timeout={300}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      onChange={({ target: { value } }) => handleSearch(value)}
                      InputProps={{
                        style: {
                          paddingRight: 0,
                        },
                        startAdornment: (
                          <Icon className="mr-2" fontSize="small">
                            search
                          </Icon>
                        ),
                        endAdornment: (
                          <IconButton onClick={hideSearch}>
                            <Icon fontSize="small">clear</Icon>
                          </IconButton>
                        ),
                      }}
                    />
                  </Grow>
                );
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const productList = [
  {
    imgUrl: "/assets/images/products/headphone-2.jpg",
    name: "Earphone",
    price: 100,
    quantity: 15,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting",
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Earphone",
    price: 1500,
    quantity: 30,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting",
  },
  {
    imgUrl: "/assets/images/products/iphone-2.jpg",
    name: "iPhone x",
    price: 1900,
    quantity: 35,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting",
  },
  {
    imgUrl: "/assets/images/products/iphone-1.jpg",
    name: "iPhone x",
    price: 100,
    quantity: 0,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting",
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Head phone",
    price: 1190,
    quantity: 5,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting",
  },
];

export default ProductList;
