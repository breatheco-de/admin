import React, {useState} from "react";
import { Table, TableCell, TableRow, Card, DialogTitle, DialogContent, 
  Grid, Dialog, TextField, Button, Chip, Icon, Tooltip, TableHead,
  TableBody } from "@material-ui/core";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag"
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { PickKeywordModal } from './PickKeywordModal';
import tz from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import DowndownMenu from '../../../components/DropdownMenu';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime)


const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "4px solid rgba(var(--body), 0.03)",
    boxShadow: theme.shadows[3],
  },
}));

const RequirementsCard = ({ asset, onAction }) => {
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

const LangCard = ({ asset, onAction }) => {
  //const [ keywords, setKeywords ] = useState(null);
  return <Card className="p-4 mb-4">
    <div className="flex justify-between items-center">
      <h4 className="m-0 font-medium">Languages: </h4>
      {Object.keys(asset.translations).map(t => 
        <Link to={`./${asset.translations[t]}`} key={t}>
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

const SEOReport = ({ log=[], isOpened, onClose }) => {
  
  return <Dialog
      open={isOpened}
      onClose={() => onClose()}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
    <DialogContent className="p-0">

      <Table className="mb-4">
        <TableHead>
          <TableRow className="bg-default">
            <TableCell className="pl-sm-24">Score</TableCell>
            <TableCell className="px-0">Details</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {log.map((entry, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="pl-sm-24 capitalize" align="left">
                  {entry.rating}
                </TableCell>

                <TableCell className="pl-0 capitalize" align="left">
                  {entry.msg}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>;
}

const SEOCard = ({ asset, onAction, onChange }) => {
  const [ addKeyword, setAddKeyword ] = useState(null);
  const [ openReport, setOpenReport ] = useState(false);

  const handleAddKeyword = async (keyword) => {
    if(keyword) onChange({ slug: asset.slug, seo_keywords: asset.seo_keywords.map(k => k.id || k).concat([keyword.id])})
    setAddKeyword(false);
  }

  const getOptColor = (value) => {
    if(value > 80) return "text-success";
    else if(value > 70) return "text-warning";
    else return "text-error";
  }

  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h4 className="m-0 font-medium">SEO: <span className={getOptColor(asset.optimization_rating)}>{asset.optimization_rating || 0}/100</span></h4>
        <div>
          {!asset.last_seo_scan_at ? 
            <small>Never analyzed</small> 
            : 
            <p className="m-0 p-0">
              <small className="capitalize">{dayjs(asset.last_seo_scan_at).fromNow()}</small>{" "}
              <small className="pointer underline text-primary" onClick={() => setOpenReport(true)}>read report</small>
            </p>
          }
        </div>
      </div>
      <Button variant="contained" color="primary" size="small" onClick={() => onAction('analyze_seo')}>
        Analize
      </Button>
    </div>

    <Grid item className="flex" xs={12}>
      {asset.seo_keywords.length == 0 ? 
        <p className="p-0 m-0">No keywords assigned, <span className="underline text-primary pointer" onClick={() => setAddKeyword(true)}>add keywords</span></p>
        : 
        <>
          {asset.seo_keywords.map(k => 
            <Chip 
              key={k.slug}
              className="mr-1" size="small" 
              label={k.title || k} 
              icon={<Icon className="pointer" fontSize="small" onClick={() => onChange({ seo_keywords: asset.seo_keywords.map(_k => _k.id || _k).filter(_k => _k != k)})}>delete</Icon>} 
            />
          )}
          <Chip size="small" align="center" label="add" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddKeyword(true)}/>
        </>
      }
    </Grid>

    <SEOReport log={asset?.seo_json_status?.log} isOpened={openReport} onClose={() => setOpenReport(false)} />
    {addKeyword && <PickKeywordModal onClose={handleAddKeyword} />}
  </Card>;
}

const syncColor = {
  'ERROR': 'error',
  'WARNING': 'warning',
  'OK': 'success'
}
const GithubCard = ({ asset, onAction, onChange }) => {
  const [ githubUrl, setGithubUrl ] = useState(asset.url);
  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div className="flex">
        {asset.sync_status != 'OK' && 
          <Tooltip title={`${asset.sync_status}: ${asset.status_text}`}><Icon color={syncColor[asset.sync_status]}>warning</Icon></Tooltip>
        }
        <h4 className="m-0 font-medium d-inline">Github</h4>
      </div>
      {asset.url!=githubUrl ?
        <Button variant="contained" color="primary" size="small" onClick={() => onChange({ url: githubUrl })}>
          Save URL
        </Button>
        :
        <DowndownMenu
          options={[
            { label: 'Only content', value: 'only_content'},
            { label: 'Also override metainfo', value: 'override'}
          ]}
          icon="more_horiz"
          onSelect={({ value }) => {
            if(value == 'only_content') onAction('sync');
            else if(value == 'override') onAction('sync', { override_meta: true });
          }}
        >
          <Button variant="contained" color="primary" size="small">
            Pull
          </Button>
        </DowndownMenu>
      }
    </div>

    <Grid item className="flex" xs={12}>
      <Grid item xs={4}>
        Status:
      </Grid>
      <Grid item xs={8}>
        <Chip size="small" label={asset.sync_status} className={`mr-2 bg-${syncColor[asset.sync_status]}`}/> 
        <small>{!asset.last_synch_at ? "Never synched" : dayjs(asset.last_synch_at).fromNow()}</small>
      </Grid>
    </Grid>
    <Grid item className="flex mt-2" xs={12}>
      <Grid item xs={4}>
        Source URL:
        <a href={asset.readme_url} target="_blank" className="small text-primary d-block">open</a>
      </Grid>
      <Grid item xs={8}>
        <TextField value={githubUrl} variant="outlined" size="small" onChange={(e) => setGithubUrl(e.target.value)} />
        {!githubUrl || !githubUrl.includes("https://github") && <small className="text-error">Must be github.com</small>}
      </Grid>
    </Grid>
    <Grid item className="flex mt-2" xs={12}>
      <Grid item xs={4}>
        Owner:
      </Grid>
      <Grid item xs={8}>
        <AsyncAutocomplete
            width="100%"
            size="small"
            onChange={(owner) => onChange({ owner: owner?.id || null })}
            label="Search among users"
            value={asset.owner}
            getOptionLabel={(option) => `${option.first_name || "No name"} ${option.last_name || "No last"}`}
            asyncSearch={(searchTerm) => bc.auth().getAllUsers({ github: true, like: searchTerm })}
        />
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

  <Grid item className="flex mb-2" xs={12}>
    <Grid item xs={4}>
      Status:
    </Grid>
    <Grid item xs={8}>
      <Chip size="small" label={asset.test_status} className={`bg-${syncColor[asset.test_status]}`}/>
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
      <GithubCard asset={asset} onAction={(action, payload=null) => onAction(action, payload)} onChange={a => onChange(a)} />
      <TestCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
    </>
  );
};

export default AssetMeta;