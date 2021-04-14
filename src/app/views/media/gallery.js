import React, { useState, useEffect, useCallback } from "react";
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from "matx";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductList,
  getCategoryList,
} from "app/redux/actions/MediaActions";

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
  const [multilevel, setMultilevel] = useState("all");
  const [shipping, setShipping] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);

  const dispatch = useDispatch();
  const { productList = [] } = useSelector((state) => state.ecommerce);
  const { categoryList = [] } = useSelector((state) => state.ecommerce);

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
        product.title.toLowerCase().match(query.toLowerCase())
      );
      setFilteredProductList(tempList);
    }, 200),
    [productList]
  );

  const handleMultilevelChange = (event) => {
    let eventValue = event.target.value;
    let range = eventValue.split(",");

    setMultilevel(eventValue);

    if (eventValue === "all") {
      setFilteredProductList(productList);
      return;
    }

    range = range.map((value) => parseInt(value));

    if (range.length === 2) {
      filterProductOnPriceRange(range[0], range[1]);
    } else {
      let tempList = productList.filter((product) => product.price >= range[0]);
      setFilteredProductList(tempList);
    }
  };

  const handleCategoryChange = (event) => {
    let target = event.target;
    let tempCategories = [];
    if (target.checked) {
      tempCategories = [...categories, target.name];
    } else {
      tempCategories = categories.filter((item) => item !== target.name);
    }

    setCategories(tempCategories);
    setFilteredProductList(filterProductOnProperty("category", tempCategories));
  };

  const handleFreeShippingClick = () => {
    setShipping(!shipping);
    setFilteredProductList(filterProductOnProperty("freeShipping", [shipping]));
  };

  const filterProductOnProperty = (property, value = []) => {
    if (value.length === 0) {
      return productList;
    }
    return productList.filter((product) => value.includes(product[property]));
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
    setMultilevel("all");
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
        <MatxSidenav width="288px" open={open} toggleSidenav={toggleSidenav}>
          <SideNav
            query={query}
            categories={categories}
            multilevel={multilevel}
            categoryList={categoryList}
            shipping={shipping}
            toggleSidenav={toggleSidenav}
            handleSearch={handleSearch}
            handleMultilevelChange={handleMultilevelChange}
            handleSliderChange={handleSliderChange}
            handleCategoryChange={handleCategoryChange}
            handleFreeShippingClick={handleFreeShippingClick}
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
          ></GalleryContainer>
        </MatxSidenavContent>
      </MatxSidenavContainer>
    </div>
  );
};

export default Gallery;