import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Grid,
  Icon,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { Formik } from "formik";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const usestyles = makeStyles(({ palette, ...theme }) => ({
  dropZone: {
    transition: "all 350ms ease-in-out",
    border: "2px dashed rgba(var(--body),0.3)",
    "&:hover": {
      background: "rgba(var(--body), 0.2) !important",
    },
  },
}));

const ProductForm = () => {
  const [imageList, setImageList] = useState([]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({ accept: "image/*" });
  const classes = usestyles();

  const handleSubmit = async (values, { isSubmitting }) => {
    console.log(values);
  };

  useEffect(() => {
    setImageList(acceptedFiles);
  }, [acceptedFiles]);

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "New Product" },
          ]}
        />
      </div>

      <Card elevation={3}>
        <div className="flex p-4">
          <h4 className="m-0">Add New Product</h4>
        </div>
        <Divider className="mb-6" />

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize={true}
          validationSchema={productSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setSubmitting,
            setFieldValue,
          }) => (
            <form className="px-4" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    className="mb-4"
                    name="name"
                    label="Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name || ""}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    className="mb-4"
                    name="description"
                    label="Description"
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    // rows={8}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description || ""}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <TextField
                    className="mb-4"
                    name="category"
                    label="Category"
                    variant="outlined"
                    size="small"
                    fullWidth
                    select
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.category || ""}
                    error={Boolean(touched.category && errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    {categoryList.sort().map((cat) => (
                      <MenuItem value={cat} key={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>

                  <div
                    className={clsx({
                      "border-radius-4 h-160 w-full flex justify-center items-center cursor-pointer mb-4": true,
                      [classes.dropZone]: true,
                      "bg-light-gray": !isDragActive,
                      "bg-gray": isDragActive,
                    })}
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <div className="flex-column items-center">
                      <Icon className="text-muted text-48">publish</Icon>
                      {imageList.length ? (
                        <span>{imageList.length} images were selected</span>
                      ) : (
                        <span>Drop product images</span>
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    className="mb-4"
                    name="productCode"
                    label="Product Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.productCode || ""}
                    error={Boolean(touched.productCode && errors.productCode)}
                    helperText={touched.productCode && errors.productCode}
                  />
                  <TextField
                    className="mb-4"
                    name="sku"
                    label="SKU"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sku || ""}
                    error={Boolean(touched.sku && errors.sku)}
                    helperText={touched.sku && errors.sku}
                  />
                  <TextField
                    className="mb-4"
                    name="price"
                    label="Price"
                    variant="outlined"
                    size="small"
                    type="number"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price || ""}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                  <TextField
                    className="mb-4"
                    name="salePrice"
                    label="Sale Price"
                    variant="outlined"
                    size="small"
                    type="number"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.salePrice || ""}
                    error={Boolean(touched.salePrice && errors.salePrice)}
                    helperText={touched.salePrice && errors.salePrice}
                  />
                  <TextField
                    className="mb-4"
                    name="quantity"
                    label="Quantity"
                    variant="outlined"
                    size="small"
                    type="number"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.quantity || ""}
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                  />
                  <TextField
                    className="mb-4"
                    name="minOrderAmount"
                    label="Minimum Order Amount"
                    variant="outlined"
                    size="small"
                    type="number"
                    fullWidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.minOrderAmount || ""}
                    error={Boolean(
                      touched.minOrderAmount && errors.minOrderAmount
                    )}
                    helperText={touched.minOrderAmount && errors.minOrderAmount}
                  />
                </Grid>
              </Grid>

              <Button
                className="mb-4 px-12"
                variant="contained"
                color="primary"
                type="submit"
              >
                Add Product
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

const productSchema = yup.object().shape({
  name: yup.string().required("${path} is required"),
  price: yup.number().required("${path} is required"),
  category: yup.string().required("${path} is required"),
  quantity: yup.number().required("${path} is required"),
});

const initialValues = {
  name: "",
  sku: "",
  price: "",
  category: "",
  quantity: "",
};

const categoryList = ["Electronics", "Clothes", "Toys", "Books", "Utensils"];
export default ProductForm;
