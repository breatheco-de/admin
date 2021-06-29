import React, { useState, useEffect } from "react";
import {
  Card,
  MenuItem,
  Divider,
  IconButton,
  Icon,
  Hidden,
  useMediaQuery,
} from "@material-ui/core";
import { MatxSidenavContainer, MatxSidenav, MatxSidenavContent } from "matx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  headerBG: {
    height: 200,
    background: palette.primary.main,
    backgroundImage: "url('/assets/images/home-bg-black.png')",
    backgroundSize: "contain",
  },
  sidenavHolder: {
    marginTop: -200,
  },
  sidenav: {
    background: "transparent !important",
    [theme.breakpoints.down("sm")]: {
      background: "var(--bg-default) !important",
    },
  },
  sidenavHeader: {
    color: "rgba(255,255,255,0.87) !important",
    [theme.breakpoints.down("sm")]: {
      color: "inherit !important",
    },
  },
}));

const LeftSidebarCard = () => {
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidenav = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (isMobile) setOpen(false);
    else setOpen(true);
  }, [isMobile]);

  return (
    <div className="relative">
      <div className={classes.headerBG} />
      <div className={classes.sidenavHolder}>
        <MatxSidenavContainer>
          <MatxSidenav
            width="320px"
            bgClass="bg-transparent"
            open={open}
            toggleSidenav={toggleSidenav}
          >
            <div className={classes.sidenav}>
              <Hidden mdUp>
                <div className="flex justify-end">
                  <IconButton onClick={toggleSidenav}>
                    <Icon>clear</Icon>
                  </IconButton>
                </div>
              </Hidden>
              <h6 className={clsx("pl-9 p-6", classes.sidenavHeader)}>
                Sidebar header
              </h6>
              <div className="py-17" />
              <div className="bg-default">
                <MenuItem className="pl-8">List 1</MenuItem>
                <MenuItem className="pl-8">List 1</MenuItem>
                <MenuItem className="pl-8">List 1</MenuItem>
                <MenuItem className="pl-8">List 1</MenuItem>
                <MenuItem className="pl-8">List 1</MenuItem>
                <MenuItem className="pl-8">List 1</MenuItem>
                <MenuItem className="pl-8">List 1</MenuItem>
              </div>
            </div>
          </MatxSidenav>
          <MatxSidenavContent>
            <h5 className="text-white pl-6 p-6">Left sidebar card</h5>
            <div className="py-5" />
            <div className="pb-6px" />
            <Card className="content-card m-4" elevation={2}>
              <div className="card-header flex flex-wrap items-center ml-2">
                <Hidden mdUp>
                  <IconButton onClick={toggleSidenav}>
                    <Icon>short_text</Icon>
                  </IconButton>
                </Hidden>
                <Hidden mdDown>
                  <div className="pl-4"></div>
                </Hidden>
                <div className="py-4">Card toolbar</div>
              </div>
              <Divider />
              <p className="whitespace-pre-wrap p-6 m-0">
                {`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima sapiente earum aspernatur quia officia eaque beatae rem molestiae fuga tempora, architecto doloremque facilis, illum, soluta ducimus dolorum tempore nemo inventore! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima sapiente earum aspernatur quia officia eaque beatae rem molestiae fuga tempora, architecto doloremque facilis, illum, soluta ducimus dolorum tempore nemo inventore! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima sapiente earum aspernatur quia officia eaque beatae rem molestiae fuga tempora, architecto doloremque facilis, illum, soluta ducimus dolorum tempore nemo inventore! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima sapiente earum aspernatur quia officia eaque beatae rem molestiae fuga tempora, architecto doloremque facilis, illum, soluta ducimus dolorum tempore nemo inventore! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima sapiente earum aspernatur quia officia eaque beatae rem molestiae fuga tempora, architecto doloremque facilis, illum, soluta ducimus dolorum tempore nemo inventore!
Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.

Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam commodi omnis consequuntur sint quos deleniti, accusantium iusto earum quia pariatur, quasi ea expedita fuga libero! Porro nisi dicta nemo laudantium.`}
              </p>
            </Card>
          </MatxSidenavContent>
        </MatxSidenavContainer>
      </div>
    </div>
  );
};

export default LeftSidebarCard;
