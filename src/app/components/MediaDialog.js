import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Slide, Dialog, AppBar, Toolbar, IconButton, Typography, GridList,
    GridListTile, FormControl, InputLabel, Select, Chip, Input, MenuItem,
    TextField, InputAdornment, Icon
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useDispatch, useSelector } from "react-redux";
import {
    getProductList,
    getCategoryList,
    updateFileInfo,
    deleteFile,
    createCategory
} from "../redux/actions/MediaActions";
import { debounce } from "lodash";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    root: {
        display: 'flex',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
    appBar: {
        position: "relative"
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MediaDialog({ openDialog, onClose }) {
    const classes = useStyles();
    const { productList = [] } = useSelector((state) => state.ecommerce);
    const { categoryList = [] } = useSelector((state) => state.ecommerce);
    const { pagination } = useSelector((state) => state.ecommerce);
    const [category, setCategories] = useState([]);
    const [query, setQuery] = useState("");
    const [type, setType] = useState([]);
    const dispatch = useDispatch();

    const handleSearch = (query) => {
        setQuery(query);
        search(query);
    };

    const search = useCallback(
        debounce((query) => {
            if (query === "") {
                delete pagination['like']
                dispatch(getProductList(pagination))
            }
            else {
                dispatch(getProductList({
                    ...pagination,
                    like: query
                }))
            }
        }, 300),
        [productList]
    );

    const handleType = (value) => {
        setType(value);
        if (value === "all") {
            delete pagination['type']
            dispatch(getProductList(pagination));
            return;
        }
        dispatch(getProductList({ ...pagination, type: value }));
    }

    const handleCategory = (value) => {
        setCategories(value);
        if(value === "all"){
            delete pagination['categories'];
            dispatch(getProductList(pagination));
            return;
        }
        dispatch(getProductList({
            ...pagination, categories: value
        }));
    }

    useEffect(() => {
        dispatch(getProductList({ limit: 30, offset: 0 }));
        dispatch(getCategoryList());
    }, [])

    return (
        <Dialog
            fullScreen
            open={openDialog}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Media Gallery
                    </Typography>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            value={category}
                            onChange={(e) => handleCategory(e.target.value)}
                        >
                            {categoryList.map((c) => (
                                <MenuItem key={c.name} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                            <MenuItem value={"all"}>
                                All
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            value={type}
                            onChange={(e) => handleType(e.target.value)}
                        >
                            {["All","Image", "Video", "PDF"].map((type) => (
                                <MenuItem key={type} value={type.toLowerCase()}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            name="query"
                            placeholder="Search here..."
                            style={{ marginTop: "12px" }}
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                </Toolbar>
            </AppBar>
            <div >
                <GridList cellHeight={200}>
                    {productList.map((media) => (
                        <GridListTile key={media.img} style={{ width: "10%" }} rows={1} >
                            <img src={media.url} alt={media.name} />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
        </Dialog>
    );
}
