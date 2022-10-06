import React, {useState, useEffect} from "react";
import { Table, TableCell, TableRow, Card, MenuItem, DialogContent, 
  Grid, Dialog, TextField, Button, Chip, Icon, Tooltip, TableHead,
  TableBody } from "@material-ui/core";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag"
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import {availableLanguages} from "../../../../utils"
import dayjs from 'dayjs';
import bc from 'app/services/breathecode';
import { PickKeywordModal } from './PickKeywordModal';
import tz from 'dayjs/plugin/timezone';
import history from "history.js";
import relativeTime from 'dayjs/plugin/relativeTime';
import DowndownMenu from '../../../components/DropdownMenu';
import { PickTechnologyModal } from './PickTechnologyModal';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import utc from 'dayjs/plugin/utc';
import slugify from "slugify";
import API from "../../../services/breathecode"
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
      <h4 className="m-0 font-medium" style={{ width: '100%'}}>Languages: </h4>
      {Object.keys(asset.translations).map(t => 
        <Link to={`./${asset.translations[t]}`}>
          <ReactCountryFlag 
            countryCode={t.toUpperCase()} svg 
            style={{
              fontSize: t == asset.lang ? '2em' : '1.7em',
              marginLeft: "5px"
            }}
          />
        </Link>
      )}
    </div>
  </Card>;
}

const LangCard = ({ asset, onAction }) => {
  const [ addTranslation, setAddTranslation ] = useState(null);
  const assetTranslations = Object.keys(asset.translations);
  const allLangs = Object.keys(availableLanguages);

  const handleAddTranslation = async () => {
    const resp = await API.registry().createAsset(addTranslation);
    console.log("resppppp", resp)
    if(resp.status == 201){
      setAddTranslation(null);
      history.push(`./${resp.data.slug}`);
    }
  }

  return <Card className="p-4 mb-4">
    {addTranslation ? 
      <div>
        <h3 className="m-0">Add translation:</h3>
        <small className="p-0 mb-1">Select a language and lesson, you can also type the title for a new lesson on he dropdown:</small>
        <TextField
          className="m-0"
          label="Language"
          style={{ width: '100%' }}
          data-cy="language"
          size="small"
          variant="outlined"
          value={addTranslation.lang}
          onChange={(e) => setAddTranslation({ lang: e.target.value })}
          select
        >
          {allLangs.filter(t => !assetTranslations.includes(t)).map((langCode) => (
            <MenuItem value={langCode} key={langCode}>
              {availableLanguages[langCode]}
            </MenuItem>
          ))}
        </TextField>
      {addTranslation?.lang && <>
          <AsyncAutocomplete
            width="100%"
            className="my-2"
            onChange={(x) => {
                if(x.value === 'new_asset') setAddTranslation({ 
                  title: x.title.replace("New: ", ""), 
                  asset_type: asset.asset_type,
                  lang: addTranslation.lang,
                  slug: slugify(x.title.replace("New: ", "")),
                  all_translations: [asset.slug, ...assetTranslations.map(t=> asset.translations[t])]
                })
                else setAddTranslation(x)
            }}
            size="small"
            label="Search or create Asset"
            value={addTranslation.asset}
            getOptionLabel={(option) => option.title || `Start typing here...`}
            asyncSearch={async (searchTerm) => {
                const resp = await bc.registry().getAllAssets({ lang: addTranslation.lang, asset_type: asset.asset_type })
                if(resp.status === 200){
                    resp.data = [{title: 'New: '+searchTerm, value: 'new_asset'}, ...resp.data]
                    return resp
                }
                else return resp
            }}
          />
          <Button style={{ width: "50%" }} variant="contained" color="primary" size="small" onClick={handleAddTranslation}>
            Add
          </Button>
          <Button style={{ width: "50%" }} variant="contained" color="grey" size="small" onClick={() => setAddTranslation(null)}>
            Cancel
          </Button>
        </>}
      </div>
      :
      <div className="flex justify-between items-center">
        <h4 className="m-0 font-medium" style={{ width: '100%'}}>Other langs: </h4>
        {assetTranslations.filter(t => t != asset.lang).map(t => 
          <Link to={`./${asset.translations[t]}`} key={t}>
            <ReactCountryFlag 
              countryCode={t.toUpperCase()} svg 
              style={{
                fontSize: '1.7em',
                height: 'auto',
                border: t == asset.lang ? '2px solid black' : null,
                marginLeft: "5px"
              }}
            />
          </Link>
        )}
        <Chip className="ml-2" size="small" align="center" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddTranslation(true)}/>
      </div>
      }
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
    {addKeyword && <PickKeywordModal onClose={handleAddKeyword} lang={asset.lang} />}
  </Card>;
}


const TechCard = ({ asset, onChange }) => {
  const [ addTechnology, setAddTechnology ] = useState(null);

  const handleAddTechnology = async (techonolgies) => {
    if(techonolgies && techonolgies.length>0) onChange({ slug: asset.slug, technologies: asset.technologies.map(t => t.slug || t).concat(techonolgies.map(t => t.slug || t))})
    setAddTechnology(false);
  }

  return <Card className="p-4 mb-4">
      <h4 className="m-0 font-medium">Technologies</h4>
      {asset.technologies.length == 0 ? 
        <small className="p-0 m-0">No technologies assigned, <span className="underline text-primary pointer" onClick={() => setAddTechnology(true)}>add technologies</span></small>
        : 
        <>
          {asset.technologies.map(t => 
            <Chip 
              key={t.slug}
              className="mr-1" size="small" 
              label={t.title || t} 
              icon={<Icon className="pointer" fontSize="small" onClick={() => onChange({ technologies: asset.technologies.map(_t => _t.id || _t).filter(_t => _t != t)})}>delete</Icon>} 
            />
          )}
          <Chip size="small" align="center" label="add" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddTechnology(true)}/>
        </>
      }
    {addTechnology && <PickTechnologyModal onClose={handleAddTechnology} lang={asset.lang} query={{ include_children: false }} />}
  </Card>;
}

const syncColor = {
  'ERROR': 'error',
  'WARNING': 'warning',
  'OK': 'success'
}
const GithubCard = ({ asset, onAction, onChange }) => {
  const [ githubUrl, setGithubUrl ] = useState(asset.readme_url);

  useEffect(() => setGithubUrl(asset.readme_url), [asset.readme_url])
  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div className="flex">
        {asset.sync_status != 'OK' && 
          <Tooltip title={`${asset.sync_status}: ${asset.status_text}`}><Icon color={syncColor[asset.sync_status]}>warning</Icon></Tooltip>
        }
        <h4 className="m-0 font-medium d-inline">Github</h4>
      </div>
      {asset.readme_url!=githubUrl ?
        <Button variant="contained" color="primary" size="small" onClick={() => onChange({ readme_url: githubUrl })}>
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
            if(value == 'only_content') onAction('pull');
            else if(value == 'override') onAction('pull', { override_meta: true });
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
        Markdown:
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
    <div className="flex">
      {asset.test_status != 'OK' && 
        <Tooltip title={`${asset.test_status}: ${asset.status_text}`}><Icon color={syncColor[asset.test_status]}>warning</Icon></Tooltip>
      }
      <h4 className="m-0 font-medium  d-inline">Integrity</h4>
    </div>
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
      <TechCard asset={asset} onChange={a => onChange(a)} />
      <SEOCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      <GithubCard key={asset.id} asset={asset} onAction={(action, payload=null) => onAction(action, payload)} onChange={a => onChange(a)} />
      <TestCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
    </>
  );
};

export default AssetMeta;