import React, { useState, useEffect } from "react";
import {
  Table, TableCell, TableRow, Card, MenuItem, DialogContent,
  Grid, Dialog, TextField, Button, Chip, Icon, Tooltip, TableHead, IconButton, Badge,
  TableBody
} from "@material-ui/core";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag"
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { availableLanguages } from "../../../../utils"
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import bc from 'app/services/breathecode';
import { PickKeywordModal } from './PickKeywordModal';
import tz from 'dayjs/plugin/timezone';
import history from "history.js";
import relativeTime from 'dayjs/plugin/relativeTime';
import DowndownMenu from '../../../components/DropdownMenu';
import { PickTechnologyModal } from './PickTechnologyModal';
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import HelpIcon from "../../../components/HelpIcon";
import ConfirmAlert from "app/components/ConfirmAlert";
import utc from 'dayjs/plugin/utc';
import slugify from "slugify";
import { MediaInput } from '../../../components/MediaInput';
import config from '../../../../config.js';
import API from "../../../services/breathecode"
dayjs.extend(relativeTime)


toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const useStyles = makeStyles(({ palette, ...theme }) => ({
  avatar: {
    border: "4px solid rgba(var(--body), 0.03)",
    boxShadow: theme.shadows[3],
  },
}));

const ThumbnailCard = ({ asset, onChange, onAction }) => {
  const [preview, setPreview] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    setPreview(asset.preview)
    setPreviewURL(asset.preview)
  }, [asset.preview])

  return <Card className="p-4 mb-4">
    {edit ?
      <div className="flex">
        <MediaInput
          size="small"
          placeholder="Image URL"
          value={previewURL}
          handleChange={(k, v) => setPreviewURL(v)}
          name="preview_url"
          fullWidth
          inputProps={{ style: { padding: '10px' } }}
        />
        <Button variant="contained" color="primary" size="small" onClick={() => onChange({ preview: previewURL }).then(() => setEdit(false))}>
          <Icon fontSize="small">check</Icon>
        </Button>
        <Button variant="contained" color="primary" size="small" onClick={() => setEdit(false)}>
          <Icon fontSize="small">cancel</Icon>
        </Button>
      </div>
      : preview ?
        <div className="flex">
          <div style={{
            height: "70px", width: "100px",
            backgroundPosition: "center center",
            backgroundSize: "contain",
            border: "1px solid #BDBDBD",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${preview})`
          }} className="text-center pt-5">
          </div>
          <Grid className="pl-3">
            <h5 className="m-0">
              Preview image
            </h5>
            <Tooltip title="Remove Thumbnail"><Icon className="pointer" fontSize="small" onClick={() => onChange({ preview: null })}>delete</Icon></Tooltip>
            <Tooltip title="Remove and generate thumbnail again">
              <Icon className="pointer" fontSize="small" onClick={() => {
                onChange({ preview: null })
                  .then(() => getAssetPreview(asset.slug))
                  .then(() => setPreview(`${config.REACT_APP_API_HOST}/v1/registry/asset/thumbnail/${asset.slug}`))
              }}>sync</Icon>
            </Tooltip>
            <Tooltip title="Open in new window"><Icon className="pointer" fontSize="small" onClick={() => window.open(preview)}>launch</Icon></Tooltip>
          </Grid>
        </div>
        :

        <div className="m-0">
          <h4 className="m-0 font-medium">Thumbnail</h4>
          No preview image has been generated for this asset.
          <a href="#" className="anchor text-primary underline" onClick={() => setEdit(true)}>Set one now</a> or
          <a href="#" className="anchor text-primary underline" onClick={() => bc.registry().getAssetPreview(asset.slug).then(() => setPreview(`${config.REACT_APP_API_HOST}/v1/registry/asset/thumbnail/${asset.slug}`))}>{' '}automatically generate it.</a>
        </div>
    }
  </Card>;
}

const CHARACTER_LIMIT = 200;

const DescriptionCard = ({ asset, onChange}) => {
  const [description, setDescription] = useState(null);
  const [makePublicDialog, setMakePublicDialog] = useState(false);
  const [editButton, setEditButton] = useState(false)

  const handleDescription = async () => {
    const resp = await API.registry().updateAsset(asset.slug, { description });
    if (resp.status == 201) {
      history.push(`./${resp.data.slug}`);
    }
    setEditButton(false);
  }

  useEffect(() => {
    setDescription(asset.description)
  }, [asset.description])

  const onClickUpdate = () => {description && setMakePublicDialog(true)};
  const onAccept = () => handleDescription();



  return <Card className="p-4 mb-4">
   <h4 className="m-0 font-medium">Description:</h4>
    <div>
        {editButton ? <>
          <TextField value={description} placeholder={"SEO optimized description of your asset"} variant="outlined" fullWidth multiline
              inputProps={{
                maxLength: CHARACTER_LIMIT
              }}
              onChange={(e) => setDescription(e.target.value)} 
              helperText={description ? `${description.length}/${CHARACTER_LIMIT}` : "0"}
           /> 
          <Button style={{ width: "50%" }} variant="contained" color="primary" size="small" onClick={onClickUpdate}>
            Update
          </Button>
          <Button style={{ width: "50%" }} variant="contained" color="grey" size="small" onClick={() => setEditButton(false)}>
            Cancel
          </Button>
          
          </>
       :
        description ? 
        <>
          <p>{description}</p>
          <small>{description.length}/{CHARACTER_LIMIT}</small>
          <Button style={{ width: "100%" }} variant="contained" color="primary" size="small" onClick={() => setEditButton(true)}>
            Edit
          </Button>
        </>
        :
        <>
          No description found for this asset, you can <a className="anchor text-primary underline pointer" onClick={() => setEditButton(true)}>manually set a description here</a>
        </> 
      }
    </div>
    <ConfirmAlert
      title={`Are you sure you want to update this description?`}
      isOpen={makePublicDialog}
      setIsOpen={setMakePublicDialog}
      onOpen={onAccept}
    />
  </Card >;
}



const LangCard = ({ asset, onAction, onChange }) => {
  const [addTranslation, setAddTranslation] = useState(null);
  const assetTranslations = asset.translations ? Object.keys(asset.translations) : [];
  const allLangs = Object.keys(availableLanguages);


  const handleAddTranslation = async () => {
    if(addTranslation.id){
      const updateResp = await onChange({
        all_translations: [addTranslation.slug, ...assetTranslations.map(t => asset.translations[t])]
      });
      if(updateResp && updateResp.status == 200) setAddTranslation(null);
    } 
    else{
      const resp = await API.registry().createAsset(addTranslation);
      if (resp.status == 201) {
        setAddTranslation(null);
        history.push(`./${resp.data.slug}`);
      }
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
        {!addTranslation?.lang ?
          <Button style={{ width: "100%", marginTop: "5px" }} variant="contained" color="grey" size="small" onClick={() => setAddTranslation(null)}>
            Cancel
          </Button>
          : <>
            <AsyncAutocomplete
              width="100%"
              className="my-2"
              onChange={(x) => {
                if (x.value === 'new_asset') setAddTranslation({
                  title: x.title.replace("New: ", ""),
                  asset_type: asset.asset_type,
                  lang: addTranslation.lang,
                  slug: slugify(x.title.replace("New: ", "")).toLowerCase(),
                  all_translations: [asset.slug, ...assetTranslations.map(t => asset.translations[t])]
                })
                else setAddTranslation(x)
              }}
              size="small"
              label="Search or create Asset"
              value={addTranslation.asset}
              getOptionLabel={(option) => option.title || `Start typing here...`}
              asyncSearch={async (searchTerm) => {
                const resp = await bc.registry().getAllAssets({ lang: addTranslation.lang, asset_type: asset.asset_type })
                if (resp.status === 200) {
                  resp.data = [{ title: 'New: ' + searchTerm, value: 'new_asset' }, ...resp.data]
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
        <h4 className="m-0 font-medium" style={{ width: '100%' }}>Other langs: </h4>
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
        <Chip className="ml-2" size="small" align="center" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddTranslation(true)} />
      </div>
    }
  </Card>;
}

const RevisionsCard = ({ asset, onAction, onChange }) => {

  const [addRevision, setAddRevision] = useState(null);
  const [isExpanded, setIsExpanded] = useState(null);
  const [ revisionHistory, setRevisionHistory] = useState({ supersedes: [], previous: [] });

  const closeAll = () => {
    setAddRevision(null);
    setIsExpanded(false);
  }

  const setSuperseder = async (slug, superseder) => {
    const resp = await API.registry().updateAsset(slug, { superseded_by: superseder?.id || superseder });
    if (resp.status == 200) {
      setAddRevision(null);
      loadAssetRevisionHistory();
    }
  }
  const handleSetRevision = async () => {
    if(addRevision.supersedes) setSuperseder(asset.slug, addRevision.supersedes.id);
    else if(addRevision.previous) setSuperseder(addRevision.previous.slug, asset.id);
  }

  const loadAssetRevisionHistory = async () => {
    const resp = await API.registry().getAssetSuperseders(asset.slug);
    if (resp.status == 200) setRevisionHistory(resp.data);
  }
  useEffect(() => {
    console.log("wele asset", asset)
    loadAssetRevisionHistory();
  }, [asset.id])

  return <Card className="p-4 mb-4">
    {!isExpanded ?
      <div className="flex justify-between items-center">
      <h4 className="m-0 font-medium" style={{ width: '100%' }}>Other versions:</h4>
      <IconButton
        onClick={() => setIsExpanded(true)}
      >
        <Badge color="secondary" badgeContent={revisionHistory.supersedes.length + revisionHistory.previous.length}>
          <Icon>device_hub</Icon>
        </Badge>
      </IconButton>
    </div>
      : !addRevision ?
      <div>
        <h4 className="m-0 font-medium" style={{ width: '100%' }}>Other versions: </h4>
        <h6 className="mt-2 flex items-center">
          <Icon fontSize="small">arrow_upward</Icon> 
          Superseders 
          <HelpIcon className="ml-2" message={"Newer versions of the current asset"} />
        </h6>
        <div>
          {revisionHistory.supersedes.length == 0 && <>
          <small>There are no newer versions of the current asset </small>
          <small className="anchor text-primary underline pointer" onClick={() => setAddRevision({ supersedes: true })}>you can add one here</small>
          </>}
        </div>
        <ul className="no-list-style p-0">
        {revisionHistory.supersedes.map(a => 
            <li key={a.slug}>
              <Link to={`./${a.slug}`}>{a.title}</Link> 
              <Chip
                className="ml-1" size="small"
                label={"Unlink"}
                icon={<Icon className="pointer" fontSize="small" 
                  onClick={() => setSuperseder(asset.slug, null)}
                >delete</Icon>}
              />
            </li>
          )}
        </ul>
        <h6 className="mt-2 flex items-center">
          <Icon fontSize="small">arrow_downward</Icon> 
          Previous 
          <HelpIcon className="ml-2" message={"Older versions of the current asset"} />
        </h6>
        <div>
          {revisionHistory.previous.length == 0 && <>
          <small>There are no older versions of the current asset </small>
          <small className="anchor text-primary underline pointer" onClick={() => setAddRevision({ previous: true })}>you can add more here</small>
          </>}
        </div>
        <ul className="no-list-style p-0">
          {revisionHistory.previous.map(a => 
            <li key={a.slug}>
              <Link to={`./${a.slug}`}>{a.title}</Link> 
              <Chip
                className="ml-1" size="small"
                label={"Unlink"}
                icon={<Icon className="pointer" fontSize="small" 
                  onClick={() => setSuperseder(a.slug, null)}
                >delete</Icon>}
              />
            </li>
          )}
        </ul>
      </div>
      : addRevision?.supersedes ?
      <div>
        <h3 className="m-0">Specify an newer version:</h3>
        <AsyncAutocomplete
          width="100%"
          className="my-2"
          onChange={(x) => setAddRevision({ supersedes: x })}
          size="small"
          label="Search Asset"
          value={addRevision.supersedes}
          getOptionLabel={(option) => option.title || `Start typing here...`}
          asyncSearch={async (searchTerm) => {
                                                        // get only assets without superseders
            const resp = await bc.registry().getAllAssets({ 
              asset_type: asset.asset_type, 
              previous_version: 'null', 
              language: asset.lang,
              like: searchTerm,
            })

            if (resp.status === 200) {
              return resp
            }
            else return resp
          }}
        />
        <Button style={{ width: "50%" }} variant="contained" color="primary" size="small" onClick={handleSetRevision}>
          See superseder
        </Button>
        <Button style={{ width: "50%" }} variant="contained" color="grey" size="small" onClick={() => closeAll()}>
          Cancel
        </Button>
      </div>
      : addRevision?.previous ?
      <div>
        <h3 className="m-0">Specify an older version:</h3>
        <AsyncAutocomplete
          width="100%"
          className="my-2"
          onChange={(x) => setAddRevision({ previous: x })}
          size="small"
          label="Search Asset"
          value={addRevision.previous}
          getOptionLabel={(option) => option.title || `Start typing here...`}
          asyncSearch={async (searchTerm) => {
                                                        // get only assets without superseders
            const resp = await bc.registry().getAllAssets({ 
              asset_type: asset.asset_type, 
              superseded_by: 'null', 
              language: asset.lang,
              like: searchTerm,
            })
            if (resp.status === 200) {
              return resp
            }
            else return resp
          }}
        />
        <Button style={{ width: "50%" }} variant="contained" color="primary" size="small" onClick={handleSetRevision}>
          Set older version
        </Button>
        <Button style={{ width: "50%" }} variant="contained" color="grey" size="small" onClick={() => closeAll()}>
          Cancel
        </Button>
      </div>
      : <></>
    }
  </Card>;
}


const SEOReport = ({ asset, onClose }) => {

  const [report, setReport] = useState({ results: [] });

  const getReport = async () => {
    const resp = await bc.registry().getAssetReport(asset.slug, {}, {
      limit: 5,
      offset: report.results.length
    });
    if (resp.ok) setReport({
      count: resp.data.count,
      next: resp.data.next,
      results: report.results.concat(resp.data.results)
    });
    else console.error("Error fetching report");
  }

  useEffect(() => getReport(), []);

  return <Dialog
    open={true}
    onClose={() => onClose()}
    aria-labelledby="form-dialog-title"
    fullWidth
  >
    <DialogContent className="p-0">

      <Table>
        <TableHead>
          <TableRow className="bg-default">
            <TableCell width="150" className="pl-sm-24">Analysis</TableCell>
            <TableCell width="80">Score</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {report.results.map((entry, index) => {
            return (
              <TableRow key={index}>
                <TableCell width="150" className="pl-sm-24 capitalize" align="left">
                  <p className="m-0 p-0">{entry.report_type}</p>
                  <small>{dayjs(entry.created_at).fromNow(true)} ago</small>
                </TableCell>
                <TableCell width="80" className="pl-0 capitalize" align="left">
                  <span className={`mr-1 ${entry.rating > 80 ? "green" : "red"}`}>{entry.rating}</span>
                  <HelpIcon message={entry.how_to_fix} />
                </TableCell>
                <TableCell className="pl-0 capitalize" align="left">
                  {Array.isArray(entry.log) && entry.log.length == 0 && "OK"}
                  {!Array.isArray(entry.log) ? entry.log : entry.log.map(l => <li style={{ listStyle: "none" }}>{l.rating}: {l.msg}</li>)}
                </TableCell>
              </TableRow>
            );
          })}
          {report.next &&
            <TableRow>
              <TableCell colspan="3" align="center">
                <small><a href="#" className="anchor" onClick={() => getReport()}>Load more</a></small>
              </TableCell>
            </TableRow>}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>;
}

const SEOCard = ({ asset, onAction, onChange }) => {
  const [addKeyword, setAddKeyword] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  const handleAddKeyword = async (keyword) => {
    if (keyword) onChange({ slug: asset.slug, seo_keywords: asset.seo_keywords.map(k => k.id || k).concat([keyword.id]) })
    setAddKeyword(false);
  }

  const getOptColor = (value) => {
    if (value > 80) return "text-success";
    else if (value > 70) return "text-warning";
    else return "text-error";
  }

  if (!asset.is_seo_tracked) {
    return <Card className="p-4 mb-4">
      This asset is not being SEO optimized, <small className="pointer underline text-primary" onClick={async () => onChange({ slug: asset.slug, is_seo_tracked: true })}>click here to activate it</small>.
    </Card>
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
              <small className="pointer underline text-primary" onClick={async () => setOpenReport(true)}>read report</small>
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
        <p className="p-0 m-0">Nothing assigned, <span className="underline text-primary pointer" onClick={() => setAddKeyword(true)}>add keywords</span> or <span className="pointer underline text-primary" onClick={async () => onChange({ slug: asset.slug, is_seo_tracked: false })}>disable SEO.</span></p>
        :
        <>
          {asset.seo_keywords.map(k => {
            return <Chip
              key={k.slug}
              className="mr-1" size="small"
              label={k.title || k}
              icon={<Icon className="pointer" fontSize="small" onClick={() => onChange({ seo_keywords: asset.seo_keywords.map(_k => _k.id || _k).filter(_k => (typeof (k) != "object") ? _k != k : _k != k.id) })}>delete</Icon>}
            />
          })}
          <Chip size="small" align="center" label="add" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddKeyword(true)} />
        </>
      }
    </Grid>

    {openReport && <SEOReport asset={asset} onClose={() => setOpenReport(false)} />}
    {addKeyword && <PickKeywordModal onClose={handleAddKeyword} lang={asset.lang} />}
  </Card>;
}

const OriginalityCard = ({ asset, onAction }) => {

  const getOptColor = (value) => {
    if(value > 80) return "text-success";
    else if(value > 70) return "text-warning";
    else return "text-error";
  }

  const [ report, setReport ] = useState(null);

  const getReport = async () => {
    
    const resp = await bc.registry().getAssetOriginalityReport(asset.slug, { silent: true }, {
      limit: 1, 
      offset: 0,
    });

    const _data = resp.data.results || resp.data;
    if(resp.ok && _data.length > 0) setReport({ 
      ..._data[0], 
      score_original: Math.round(_data[0].score_original * 100), 
      score_ai: Math.round(_data[0].score_ai * 100) 
    });
    else console.error("Error fetching originality report");

  }

  useEffect(() => getReport(), []);

  const originalColor = report && report.score_original > 50 ? "success" : "danger";
  const aiColor = report && report.score_ai < 50 ? "success" : "danger";

  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div>
        <div className="flex">
          <h4 className="m-0 font-medium">Originality</h4>
          {report && report.success ? <Icon color="success" className="mx-2" fontSize="small">sentiment_very_satisfied</Icon> : <Icon className=" mx-2" fontSize="small">sentiment_very_dissatisfied</Icon>}
          <HelpIcon message={`Originality API is used to detect how original the article, click on this icon to learn more about it`} link={'https://originality.ai/ai-content-detection-score-google/'} />
        </div>
        <div>
          {!report ? 
            <small>Never analyzed</small> 
            : 
            <p className="m-0 p-0">
              <small className="capitalize">{dayjs(report.created_at).fromNow()}</small>{" "}
            </p>
          }
        </div>
      </div>
      <Button variant="contained" color="primary" size="small" onClick={() => onAction('originality').then(()=> getReport())}>
        Analize
      </Button>
    </div>
    {report &&
      <Grid item className="flex" xs={12}>
          <Chip size="small" className={`bg-${originalColor}`} align="center" label={`Original:  ${report.score_original}% `} icon={<Icon fontSize="small">{report.score_original > 50 ? "sentiment_very_satisfied" : "sentiment_very_dissatisfied"}</Icon>} />
          <Chip size="small" className={`mx-2 bg-${aiColor}`} align="center" label={`AI:  ${report.score_ai}% `} icon={<Icon fontSize="small">{report.score_ai < 50 ? "sentiment_very_satisfied" : "sentiment_very_dissatisfied"}</Icon>} />
      </Grid>
    }
  </Card>;
}


const TechCard = ({ asset, onChange }) => {
  const [addTechnology, setAddTechnology] = useState(null);

  const handleAddTechnology = async (techonolgies) => {
    if (techonolgies && techonolgies.length > 0) onChange({ slug: asset.slug, technologies: asset.technologies.map(t => t.slug || t).concat(techonolgies.map(t => t.slug || t)) })
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
            icon={<Icon className="pointer" fontSize="small" onClick={() => onChange({ technologies: asset.technologies.map(_t => _t.id || _t).filter(_t => _t != t) })}>delete</Icon>}
          />
        )}
        <Chip size="small" align="center" label="add" icon={<Icon fontSize="small">add</Icon>} onClick={() => setAddTechnology(true)} />
      </>
    }
    {addTechnology && <PickTechnologyModal
      onClose={handleAddTechnology}
      lang={asset.lang}
      query={{ include_children: false }}
      hint="Only parent technologies will show here"
    />}
  </Card>;
}

const syncColor = {
  'ERROR': 'error',
  'WARNING': 'warning',
  'OK': 'success'
}


const GithubCard = ({ asset, onAction, onChange }) => {
  const [githubUrl, setGithubUrl] = useState(asset.readme_url);
  const [makePublicDialog, setMakePublicDialog] = useState(false);

  useEffect(() => setGithubUrl(asset.readme_url), [asset.readme_url])


  return <Card className="p-4 mb-4">
    <div className="mb-4 flex justify-between items-center">
      <div className="flex">
        {asset.sync_status != 'OK' &&
          <Tooltip title={`${asset.sync_status}: ${asset.status_text}`}><Icon color={syncColor[asset.sync_status]}>warning</Icon></Tooltip>
        }
        <h4 className="m-0 font-medium d-inline">Github</h4>
      </div>
      {asset.readme_url != githubUrl ?
        <Button variant="contained" color="primary" size="small" onClick={() => onChange({ readme_url: githubUrl })}>
          Save URL
        </Button>
        :
        <DowndownMenu
          options={[
            { label: 'Only content', value: 'only_content' },
            { label: 'Also override metainfo', value: 'override' }
          ]}
          icon="more_horiz"
          onSelect={({ value }) => {
            if (value == 'only_content') onAction('pull');
            else if (value == 'override') onAction('pull', { override_meta: true });
          }}
        >
          <Button variant="contained" color="primary" size="small">
            Pull
          </Button>

          <ConfirmAlert
    title={`Are you sure you want to Pull from GitHub? You will lose your changes`}
    isOpen={makePublicDialog}
    setIsOpen={setMakePublicDialog}
    onOpen={()=> onAction('pull')}
  />

        </DowndownMenu>

      }

    </div>

    <Grid item className="flex" xs={12}>
      <Grid item xs={4}>
        Status:
      </Grid>
      <Grid item xs={8}>
        <Chip size="small" label={asset.sync_status} className={`mr-2 bg-${syncColor[asset.sync_status]}`} />
        <small>{!asset.last_synch_at ? "Never synched" : dayjs(asset.last_synch_at).fromNow()}</small>
      </Grid>
    </Grid>
    <Grid item className="flex mt-2" xs={12}>
      <Grid item xs={4}>
        Markdown:
        <a href={asset.readme_url} target="_blank" className="small text-primary d-block">open</a>
      </Grid>
      <Grid item xs={8}>
        <TextField width="100%" value={githubUrl} variant="outlined" size="small" onChange={(e) => { setGithubUrl(e.target.value); }} />
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
  </div>

  <Grid className="flex mb-2">
    <div style={{ width: "100%" }}>
      <Chip size="small" label={`Test: ${asset.test_status}`} className={`bg-${syncColor[asset.test_status]} mr-1`} />
      <small>{!asset.last_test_at ? "never tested" : dayjs(asset.last_test_at).fromNow()}</small>
    </div>
    <div>
      <Button variant="contained" color="primary" size="small" onClick={() => onAction('test')}>
        Test
      </Button>
    </div>
  </Grid>
  <Grid className="flex mb-2">
    <div style={{ width: "100%" }}>
      <Chip size="small" label={`Cleanup: ${asset.cleaning_status}`} className={`bg-${syncColor[asset.cleaning_status]} mr-1`} />
      <small>{!asset.last_cleaning_at ? "never cleaned" : dayjs(asset.last_cleaning_at).fromNow()}</small>
    </div>
    <div>
      <Button variant="contained" color="primary" size="small" onClick={() => onAction('clean')}>
        Clean
      </Button>
    </div>
  </Grid>
</Card>;

const AssetMeta = ({ asset, onAction, onChange }) => {
  const classes = useStyles();

  return (
    <>
      <LangCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      <RevisionsCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      <TechCard asset={asset} onChange={a => onChange(a)} />
      <ThumbnailCard asset={asset} onChange={a => onChange(a)} onAction={(action) => onAction(action)} />
      <DescriptionCard asset={asset} onChange={a => onChange(a)} onAction={(action) => onAction(action)} />
      {asset.asset_type != 'QUIZ' && <>
        <SEOCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
        <OriginalityCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
      </>}
      <GithubCard key={asset.id} asset={asset} onAction={(action, payload=null) => onAction(action, payload)} onChange={a => onChange(a)} />
      <TestCard asset={asset} onAction={(action) => onAction(action)} onChange={a => onChange(a)} />
    </>
  );
};

export default AssetMeta;
