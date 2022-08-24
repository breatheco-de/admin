import React, {useState, useEffect} from "react";
import { IconButton, Icon, Button, Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Card,
} from "@material-ui/core";
import { toast } from 'react-toastify';
import AssetMarkdown from "./AssetMarkdown";
import { useParams } from 'react-router-dom';
import AssetMeta from "./AssetMeta";
import { MatxLoading } from '../../../../matx';
import EditableTextField from '../../../components/EditableTextField';
import DialogPicker from '../../../components/DialogPicker';
import bc from 'app/services/breathecode';

const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const langs = {
  "us": "English",
  "es": "Spanish",
  "it": "Italian",
  "ge": "German",
  "po": "Portuguese",
}
const defaultAsset = {
  slug: "example-asset-slug",
  title: "Example asset title",
  seo_keywords: [],
  cluster: null,
  url: null,
  lang: "us",
  status: 'DRAFT',
  visibility: 'PRIVATE',
  asset_type: null,
}
const ComposeAsset = () => {

  const { asset_slug } = useParams();
  const isCreating = (asset_slug === undefined && (!asset || asset.id === undefined));
  const [ asset, setAsset ] = useState(defaultAsset);
  const [ updateVisibility, setUpdateVisibility ] = useState(false);
  const [ updateStatus, setUpdateStatus ] = useState(false);
  const [ updateType, setUpdateType ] = useState(false);
  const [ updateLanguage, setUpdateLanguage ] = useState(false);
  const [ githubUrl, setGithubUrl ] = useState(null);
  const [ content, setContent ] = useState(null);

  const partialUpdateAsset = async (newAsset) => {
    if(isCreating){
      toast.error("Please create the asset first", toastOption);
    }
    else{
      const resp = await bc.registry().updateAsset({ ...newAsset, slug: asset_slug });
      if (resp.status >= 200 && resp.status < 300) {
        setAsset(resp.data);
      }
    }
  }

  const getAssetContent = async () => {
    const resp = await bc.registry().getAssetContent(asset_slug);
    if (resp.status >= 200 && resp.status < 300) {
      setContent(resp.data);
    }
  }

  useEffect(async () => {

    if(isCreating) {
      setAsset(defaultAsset);
      setContent("Write your asset here, use `markdown` syntax");
    }
    else{
      try{
        const resp = await bc.registry().getAsset(asset_slug);
        if (resp.status >= 200 && resp.status < 300) {
          setAsset({ ...resp.data, lang: resp.data.lang || "us" });
        }
        else throw Error('Asset could not be retrieved');
        
        await getAssetContent();
      }
      catch(error){
        console.log("Error log", error)
      }
    }

  }, []);

  const handleAction = async (action) => {
    const resp = await bc.registry().assetAction(asset_slug, action, { silent: true });
    if(resp.status === 200){
      if((action=="sync" && resp.data.sync_status != 'OK') || (action=="test" && resp.data.test_status != 'OK')) toast.error(`${action} returned with problems`)
      await getAssetContent();
    }
  }

  const saveAsset = async () => {
    const action = isCreating ? "createAsset" : "updateAsset";
    const resp = await bc.registry()[action]({ ...asset, readme: btoa(content), url: githubUrl || asset.url });
    if(resp.status >= 200 && resp.status < 300){
      setAsset(resp.data)
    }
  }

  if(!asset) return <MatxLoading />
  return (
    <div className="m-sm-30">
      <div className="flex flex-wrap justify-between mb-6">
        <Grid item xs={12} sm={8}>
          <EditableTextField defaultValue={asset.title} onChange={(_v) => {
            if(!isCreating) partialUpdateAsset({ title: _v });
            else setAsset({ ...asset, title: _v })
          }}>
            <h3 className="my-0 font-medium text-28">{asset.title}</h3>
          </EditableTextField>
          <EditableTextField defaultValue={asset.slug} 
          onValidate={async () => (await bc.registry().getAsset(asset.slug, { silent: true })).status === 404}
          onChange={(_v) => {
            if(!isCreating) partialUpdateAsset({ slug: _v });
            else setAsset({ ...asset, slug: _v })
          }}>
            <p className="my-0">{asset.slug}</p>
          </EditableTextField>
          
          <div className="flex">
            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-green mr-3 pointer"
              onClick={() => setUpdateStatus(true)}>
              {asset.status}
            </div>
            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-secondary mr-3 pointer"
              onClick={() => setUpdateVisibility(true)}
            >
              {asset.visibility}
            </div>
            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-secondary mr-3 pointer"
              onClick={() => setUpdateType(true)}
            >
              {asset.asset_type ? asset.asset_type : "NOT TYPE SPECIFIED"}
            </div>
            <div className="px-3 text-11 py-3px border-radius-4 text-white bg-secondary mr-3 pointer"
              onClick={() => setUpdateLanguage(true)}
            >
              {langs[asset.lang].toUpperCase()}
            </div>
          </div>
        </Grid>

        <Grid item xs={6} sm={4} align="right">
          <IconButton className="mr-2">
            <Icon>more_horiz</Icon>
          </IconButton>
          <Button variant="contained" color="primary"
            onClick={() => saveAsset()}
          >
            {isCreating ? `Create asset` : `Update content`}
          </Button>
        </Grid>
      </div>
      
      {!asset.url ?
        <Card className="p-4">
          <p>Please provied a Github URL to fetch the asset from:</p>
          <TextField variant="outlined" size="small" value={githubUrl} fullWidth={true} onChange={(e) => setGithubUrl(e.target.value)}  />
          {githubUrl && !githubUrl.includes("https://github.com") && <small className="text-danger">The url must be from github</small>}
        </Card>
      : 
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <AssetMarkdown value={content} onChange={(c) => setContent(c)} />
          </Grid>
          <Grid item md={4} xs={12}>
            <AssetMeta asset={asset} onAction={action => handleAction(action)} onChange={a => partialUpdateAsset(a)} />
          </Grid>
        </Grid>
      }

      <DialogPicker
        onClose={opt => { 
          if(isCreating) setAsset({ ...asset, visibility: opt })
          else partialUpdateAsset({ visibility: opt });
          setUpdateVisibility(false)
        }}
        open={updateVisibility}
        title="Select a visibility"
        options={['PUBLIC', "UNLISTED", 'PRIVATE']}
      />
      <DialogPicker
        onClose={opt => { 
          if(isCreating) setAsset({ ...asset, asset_type: opt })
          else partialUpdateAsset({ asset_type: opt });
          setUpdateType(false)
        }}
        open={updateType}
        title="Select a type"
        options={['LESSON', "ARTICLE", 'PROJECT', 'EXERCISE', 'VIDEO', "QUIZ"]}
      />
      <DialogPicker
        onClose={opt => { 
          if(isCreating) setAsset({ ...asset, status: opt })
          else partialUpdateAsset({ status: opt });
          setUpdateStatus(false)
        }}
        open={updateStatus}
        title="Select a status"
        options={['UNASSIGNED', 'WRITING', 'DRAFT', 'PUBLISHED']}
      />
      <DialogPicker
        onClose={opt => { 
          if(isCreating) setAsset({ ...asset, lang: opt.value })
          else partialUpdateAsset({ lang: opt.value });
          setUpdateLanguage(false)
        }}
        open={updateLanguage}
        title="Select a language"
        options={Object.keys(langs).map(l => ({label: langs[l], value: l}))}
      />
    </div>
  );
};

export default ComposeAsset;