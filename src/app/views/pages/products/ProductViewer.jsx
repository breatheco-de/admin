import React, { useState } from "react";
import { Card, Divider, Grid, Icon } from "@material-ui/core";
import { AddToCartButton, Breadcrumb } from "matx";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const usestyles = makeStyles(({ palette, ...theme }) => ({
  imageBorder: {
    border: "2px solid rgba(var(--primary), 0.67)",
  },
}));

const ProductViewer = () => {
  const [selectedImage, setSelectedImage] = useState(
    "/assets/images/laptop-2.png"
  );
  const classes = usestyles();

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[
            { name: "Pages", path: "/pages" },
            { name: "View Product" },
          ]}
        />
      </div>

      <Card className="px-4 py-6" elevation={3}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <div className="flex-column justify-center items-center">
              <img
                className="max-w-full mb-4 max-h-400"
                src={selectedImage}
                alt="laptop"
              />
              <div className="flex justify-center items-center">
                {imageList.map((imgUrl) => (
                  <img
                    className={clsx({
                      "w-80 mx-2 p-2 border-radius-4": true,
                      [classes.imageBorder]: selectedImage === imgUrl,
                    })}
                    src={imgUrl}
                    alt="laptop"
                    key={imgUrl}
                    onClick={() => setSelectedImage(imgUrl)}
                  />
                ))}
              </div>
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <h4 className="mt-0 mb-4">
              Asus VivoBook X512FL-EJ723T 10th Gen Intel Core i5
            </h4>
            <p className="text-muted mt-0 mb-2">SKU: 0X50F0D</p>
            <p className="mt-0 mb-4">
              <span className="text-muted">BRAND: </span>
              <span className="text-primary">ASUS | More Laptop from ASUS</span>
            </p>

            <Divider className="mb-4" />
            <AddToCartButton className="mb-4" amount={0} />

            <Divider className="mb-4" />
            <p className="mt-0 mb-2 font-medium text-muted">
              Have questions about this product (SKU: 0X2E615)
            </p>
            <div className="flex items-center mb-4">
              <Icon className="mr-2" fontSize="small" color="primary">
                call
              </Icon>
              <h5 className="text-primary m-0">019638111777</h5>
            </div>
            <Divider className="mb-4" />

            <h4 className="mt-0 mb-4">Specification</h4>
            <p>
              Brand ASUS Processor Intel Core i5-10210U 10th Gen CPU Cache 6MB
              Ram 4GB DDR4 Ram Details 1 x 4 GB Non-Removable Expansion Ram Slot
              1 Storage 512GB PCIE G3 SSD Display 15.6 FHD Antiglare LED Display
              Resolution 1920×1080 (WxH) FHD Optical Device No Graphics Chipset
              Nvidia MX250 Graphics Graphics Memory 2GB Networking WiFi,
              Bluetooth, Card Reader USB Port 1x USB 3.2 Gen 1 Type-A, 1x USB
              3.2 Gen 1 Type-C Video Port HDMI Audio Port Combo Finger Print Yes
              Keyboard Back-lit Yes Operating System Win-10 Home Battery 2 Cell
              Li-Ion Power Adapter 65 W AC power adapter Specialty Finger Print
              Sensor, Backlit Keyboard, Voice control with Cortana support, BIOS
              Booting User Password Protection, Fingerprint sensor intergrated
              with Touchpad Others Backlit: LED Backlit, OLED: LCD, Brightness:
              200nits, Aspect ratio: 16:9, Color gamut NTSC: 45%, Screen-to-body
              ratio: 88%, Output: 19V DC, 3.42A, 65W, Input: 100-240V AC 50/60Hz
              universal Warranty 2 years
            </p>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

const imageList = [
  "/assets/images/laptop-1.png",
  "/assets/images/laptop-2.png",
  "/assets/images/laptop-3.png",
];
export default ProductViewer;
