import React, { useState, useEffect, useCallback } from "react";
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from "matx";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductList,
  getCategoryList,
  updateFileInfo
} from "app/redux/actions/MediaActions";
import {openDialog, closeDialog} from '../../redux/actions/DialogActions';
import Dialog from '../../components/Dialog';
import SideNav from "./SideNav";
import GalleryContainer from "./GalleryContainer";
import { debounce } from "lodash";

// Dropzone depency for drag and drop

const Gallery = () => {
  const [open, setOpen] = useState(true);
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [orderBy, setOrderBy] = useState("default");
  const [sliderRange, setSliderRange] = useState([0, 100]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [shipping, setShipping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);

  const dispatch = useDispatch();
  const { productList = [] } = useSelector((state) => state.ecommerce);
  const { categoryList = [] } = useSelector((state) => state.ecommerce);
  const { show, value } = useSelector(state => state.dialog)

  const toggleSidenav = () => {
    setOpen(!open);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderRange(newValue);
    filterProductOnPriceRange(newValue[0] * 10, newValue[1] * 10);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const toggleView = (view) => setView(view);

  const handleSearch = (query) => {
    setQuery(query);
    search(query);
  };

  const search = useCallback(
    debounce((query) => {
      let tempList = productList.filter((product) =>
        product.slug.toLowerCase().match(query.toLowerCase())
      );
      setFilteredProductList(tempList);
    }, 200),
    [productList]
  );

  const handleTypeChange = (event) => {
    console.log(event.target.value)
    let eventValue = event.target.value;
    setType(eventValue);

    if (eventValue === "all") {
      setFilteredProductList(productList);
      return;
    }
    let tempList = productList.filter((product) => product.mime.includes(eventValue));
    setFilteredProductList(tempList);

  };

  const handleCategoryChange = (event) => {
    let target = event.target;
    let tempCategories = [];
    if (target.checked) {
      tempCategories = [...categories, target.name];
    } else {
      tempCategories = categories.filter((item) => item !== target.name);
    }
     console.log(tempCategories)
    setCategories(tempCategories);
    setFilteredProductList(filterProductOnCategory(tempCategories));
  };

  const filterProductOnProperty = (property, value = []) => {
    if (value.length === 0) {
      return productList;
    }
    return productList.filter((product) => value.includes(product[property]));
  };

  const filterProductOnCategory= (values = []) => {
    if (values.length === 0) {
      return productList;
    }
    return productList.filter((product) => {
      for(let item of product.categories) return values.includes(item.id.toString())
    });
  };

  const filterProductOnPriceRange = (lowestPrice, highestPrice) => {
    let tempList = productList.filter(
      (product) => product.price >= lowestPrice && product.price <= highestPrice
    );
    setFilteredProductList(tempList);
  };

  const handleClearAllFilter = () => {
    setSliderRange([0, 100]);
    setQuery("");
    setType("all");
    setShipping(false);
    setCategories([]);
    setFilteredProductList(productList);
  };

  useEffect(() => {
    dispatch(getProductList());
    dispatch(getCategoryList());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProductList(productList);
  }, [productList]);

  return (
    <div className="shop m-sm-30">
      <MatxSidenavContainer>
        <Dialog 
          title='Edit Media File'
          onClose={() => dispatch(closeDialog())}
          open={show}
          formInitialValues={{
            name:'',
            slug:'',
            categories: []
          }}
          onSubmit={(values)=> dispatch(updateFileInfo(value, values))}
        />
        <MatxSidenav width="288px" open={open} toggleSidenav={toggleSidenav}>
          <SideNav
            query={query}
            categories={categories}
            type={type}
            categoryList={categoryList}
            toggleSidenav={toggleSidenav}
            handleSearch={handleSearch}
            handleTypeChange={handleTypeChange}
            handleSliderChange={handleSliderChange}
            handleCategoryChange={handleCategoryChange}
            handleClearAllFilter={handleClearAllFilter}
          ></SideNav>
        </MatxSidenav>
        <MatxSidenavContent>
          <GalleryContainer
            orderBy={orderBy}
            view={view}
            productList={filteredProductList}
            page={page}
            rowsPerPage={rowsPerPage}
            toggleView={toggleView}
            toggleSidenav={toggleSidenav}
            handleChange={(e) => setOrderBy(e.target.value)}
            handleChangePage={handleChangePage}
            setRowsPerPage={(e) => setRowsPerPage(e.target.value)}
            onOpenDialog={(value)=> dispatch(openDialog(value))}
          ></GalleryContainer>
        </MatxSidenavContent>
      </MatxSidenavContainer>
    </div>
  );
};

export default Gallery;