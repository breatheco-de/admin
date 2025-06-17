import React from "react";
import { Card, Button } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Breadcrumb } from "matx";
import { toast } from "react-toastify";
import bc from "app/services/breathecode";
import { getSession } from "../../../redux/actions/SessionActions";

const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

/**
 * AssetAcademyGuard - A wrapper component that validates academy ownership
 * and blocks access to asset editing when asset.academy is null
 */
const AssetAcademyGuard = ({ asset, isCreating, onAssetUpdate, children }) => {
  const session = getSession();
  const currentAcademy = session?.academy;
  const assetHasNoAcademy = !isCreating && asset?.academy === null;

  const handleClaimAsset = async () => {
    try {
      const resp = await bc.registry().assetAction(asset.slug, { 
        action_slug: "claim_asset",
        academy: currentAcademy?.id 
      });
      if (resp.status >= 200 && resp.status < 300) {
        onAssetUpdate(resp.data);
        toast.success(`Asset successfully claimed for ${currentAcademy?.name}`, toastOption);
      }
    } catch (error) {
      toast.error("Error claiming asset", toastOption);
      console.error("Error claiming asset:", error);
    }
  };

  // If asset doesn't belong to any academy, show blocking alert
  if (assetHasNoAcademy) {
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <div className="flex flex-wrap justify-between mb-6">
            <div>
              <Breadcrumb
                routeSegments={[
                  { name: "Assets", path: "/media/asset" },
                  { name: `Single Asset ${asset?.id || ""}` },
                ]}
              />
            </div>
          </div>
        </div>
        <Card className="p-4 mt-4">
          <Alert severity="warning">
            <AlertTitle>This asset doesn't belong to any academy</AlertTitle>
            This asset has to be claimed by an academy before it can be updated or published.{' '}
            {currentAcademy && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                className="ml-2"
                onClick={handleClaimAsset}
              >
                Click here to claim the asset for this academy: {currentAcademy.name}
              </Button>
            )}
          </Alert>
        </Card>
      </div>
    );
  }

  // Asset has academy ownership or is being created, render children
  return children;
};

export default AssetAcademyGuard; 