import React, {useState} from "react";
import { Divider, Card, Avatar, Grid, TextField, Button, Chip, Icon, Tooltip } from "@material-ui/core";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag"
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import dayjs from 'dayjs';
import { AddKeywordModal } from './AddKeywordModal';
import tz from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime)


const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "4px solid rgba(var(--body), 0.03)",
    boxShadow: theme.shadows[3],
  },
}));

const LangCard = ({ asset, onAction }) => {
  //const [ keywords, setKeywords ] = useState(null);
  return <Card className="p-4 mb-4">
    <div className="flex justify-between items-center">
      <h4 className="m-0 font-medium">Languages: </h4>
      {Object.keys(asset.translations).map(t => 
        <Link to={`./${asset.translations[t]}`}>
          <ReactCountryFlag 
            countryCode={t.toUpperCase()} svg 
            style={{
              fontSize: t == asset.lang ? '2em' : '1.7em',
            }}
          />
        </Link>
      )}
    </div>
  </Card>;
}

const SEOCard = ({ asset, onAction, onChange }) => {
  const [ addKeyword, setAddKeyword ] = useState(null);

  const handleAddKeyword = async (keyword) => {
    if(keyword) onChange({ slug: asset.slug, seo_keywords: asset.seo_keywords.map(k => k.id || k).concat([keyword.id])})
    setAddKeyword(false);
  }

  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <h4 className="m-0 font-medium">SEO</h4>
      <Button variant="contained" color="primary" size="small" onClick={() => null}>
        Analize
      </Button>
    </div>

    <Grid className="flex" xs={12}>
      {asset.seo_keywords.length == 0 ? 
        <p className="p-0 m-0">No keywords assigned, <Link className="underline text-primary" onClick={() => setAddKeyword(true)}>add keywords</Link></p>
        : 
        <>
          {asset.seo_keywords.map(k => 
            <Chip 
              className="mr-1" size="small" 
              label={k.title || k} 
              icon={<Icon className="pointer" fontSize="small" onClick={() => onChange({ seo_keywords: asset.seo_keywords.map(_k => _k.id || _k).filter(_k => _k != k)})}>delete</Icon>} 
            />
          )}
          <Chip size="small" align="center" label="add" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddKeyword(true)}/>
        </>
      }
    </Grid>

    {addKeyword && <AddKeywordModal onClose={handleAddKeyword} />}
  </Card>;
}

const GithubCard = ({ asset, onAction, onChange }) => {
  const [ githubUrl, setGithubUrl ] = useState(asset.url);
  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div className="flex">
        {asset.sync_status && <Tooltip title={`${asset.sync_status}: ${asset.status_text}`}><Icon color="error">warning</Icon></Tooltip>}
        <h4 className="m-0 font-medium d-inline">Github</h4>
      </div>
      {asset.url!=githubUrl ?
        <Button variant="contained" color="primary" size="small" onClick={() => onChange({ url: githubUrl })}>
          Save URL
        </Button>
        :
        <Button variant="contained" color="primary" size="small" onClick={() => onAction('sync')}>
          Pull
        </Button>
      }
    </div>

    <Grid className="flex mb-2" xs={12}>
      <Grid item xs={4}>
        Status:
      </Grid>
      <Grid item xs={8}>
        <Chip size="small" label={asset.sync_status} className="mr-2"/> 
        <small>{!asset.last_synch_at ? "Never synched" : dayjs(asset.last_synch_at).fromNow()}</small>
      </Grid>
    </Grid>
    <Grid className="flex" xs={12}>
      <Grid item xs={4}>
        Source URL:
        <a href={asset.url} target="_blank" className="small text-primary d-block">open</a>
      </Grid>
      <Grid item xs={8}>
        <TextField value={githubUrl} variant="outlined" size="small" onChange={(e) => setGithubUrl(e.target.value)} />
        {!githubUrl.includes("https://github") && <small className="text-error">Must be github.com</small>}
      </Grid>
    </Grid>
  </Card>;
}

const TestCard = ({ asset, onAction }) => <Card className="p-4 mb-4">
  <div className="mb-4 flex justify-between items-center">
    <h4 className="m-0 font-medium">Integrity</h4>
    <Button variant="contained" color="primary" size="small" onClick={() => onAction('test')}>
      Test
    </Button>
  </div>

  <Grid className="flex mb-2" xs={12}>
    <Grid item xs={4}>
      Status:
    </Grid>
    <Grid item xs={8}>
      <Chip size="small" label={asset.test_status}/>
      <small>{!asset.last_test_at ? "Never tested" : dayjs(asset.last_test_at).fromNow()}</small>
    </Grid>
  </Grid>
</Card>;

const AssetMeta = ({ asset, onAction, onChange }) => {
  const classes = useStyles();

  return (
    <>
      <LangCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      <SEOCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      <GithubCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      <TestCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
    </>
  );
};

export default AssetMeta;