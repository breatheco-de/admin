import React, {useState, useEffect} from "react";
import { IconButton, Icon, Button, Grid } from "@material-ui/core";
import AssetMarkdown from "./AssetMarkdown";
import { useParams } from 'react-router-dom';
import AssetMeta from "./AssetMeta";
import { MatxLoading } from '../../../../matx';
import bc from 'app/services/breathecode';


const ComposeAsset = () => {

  const { asset_slug } = useParams();
  const [ asset, setAsset ] = useState(null);
  const [ content, setContent ] = useState(null);

  const getAssetContent = async () => {
    const resp = await bc.registry().getAssetContent(asset_slug);
    if (resp.status >= 200 && resp.status < 300) {
      setContent(resp.data);
    }
    else throw Error('Asset could not be retrieved');
  }

  useEffect(async () => {

    try{
      const resp = await bc.registry().getAsset(asset_slug);
      if (resp.status >= 200 && resp.status < 300) {
        setAsset(resp.data);
      }
      else throw Error('Asset could not be retrieved');
      
      await getAssetContent();
    }
    catch(error){
      console.log("Error log", error)
    }

  }, []);

  const handleAction = async (action) => {
    const resp = await bc.registry().assetAction(asset_slug, action);
    if(resp.status === 200) await getAssetContent();
  }

  if(!asset) return <MatxLoading />
  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <div>
          <h3 className="my-0 font-medium text-28">{asset.title}</h3>
          <p className="my-0">{asset.slug}</p>
          <div className="flex">
            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3">
              {asset.status}
            </div>
            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-secondary">
              {asset.visibility}
            </div>
          </div>
        </div>

        <div className="">
          <IconButton className="mr-2">
            <Icon>more_horiz</Icon>
          </IconButton>
          <Button variant="contained" color="primary">
            Fulfill Order
          </Button>
        </div>
      </div>

      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <AssetMarkdown value={content} />
        </Grid>
        <Grid item md={4} xs={12}>
          <AssetMeta asset={asset} onAction={action => handleAction(action)} />
        </Grid>
      </Grid>
    </div>
  );
};

export default ComposeAsset;