import React, { useState, useEffect } from "react";
import {
  IconButton,
  Icon,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Card,
  MenuItem,
} from "@material-ui/core";
import { Base64 } from "js-base64";
import { Breadcrumb } from "matx";
import ReactCountryFlag from "react-country-flag";
const _slugify = require("slugify");
import { toast } from "react-toastify";
import OpenInBrowser from "@material-ui/icons/OpenInBrowser";
import DowndownMenu from "../../../components/DropdownMenu";
import AssetMarkdown from "./AssetMarkdown";
import { useParams } from "react-router-dom";
import { Alert, AlertTitle } from "@material-ui/lab";
import AssetMeta from "./AssetMeta";
import { AssetAliases } from "./AssetAliases";
import { MatxLoading } from "../../../../matx";
import { ConfirmationDialog } from "../../../../matx";
import EditableTextField from "../../../components/EditableTextField";
import DialogPicker from "../../../components/DialogPicker";
import StatCard from "../components/StatCard";
import ConfirmAlert from "app/components/ConfirmAlert";
import { PickCategoryModal } from "../components/PickCategoryModal";
import bc from "app/services/breathecode";
import history from "history.js";
import { AsyncAutocomplete } from '../../../components/Autocomplete';
import CommentBar from "./CommentBar"
import QuizBuilder from "./QuizBuilder"
import { availableLanguages, unSlugifyCapitalize } from "../../../../utils"
import { RepositorySubscriptionIcon } from "./RepositorySubscriptions";
import config from '../../../../config.js';
import dayjs from 'dayjs';

function slugify(text) {
  let slug = _slugify(text, { lower: true, strict: true });
  if (text.endsWith(' ') || text.endsWith('-')) slug += '-';
  return slug;
}

const createButtonLabel = {
  "LESSON": {
    "label": "Save Markdown",
    "options": [
      {
        label: "Only save to 4Geeks.com",
        value: "only_save",
      },
      {
        label: "Also commit markdown to github",
        value: "push",
      },
    ]
  },
  "ARTICLE": {
    "label": "Save Markdown",
    "options": [
      {
        label: "Only save to 4Geeks.com",
        value: "only_save",
      },
      {
        label: "Also commit markdown to GitHub",
        value: "push",
      },
    ]
  },
  "QUIZ": {
    "label": "Save to Github",
    "options": [
      {
        label: "Commit JSON to GitHub",
        value: "push",
      },
    ]
  },
}

// Example: https://github.com/4GeeksAcademy/machine-learning-content/blob/master/06-ml_algos/exploring-k-nearest-neighbors.ipynb
const githubUrlRegex =
/https:\/\/github\.com\/[\w\-_\/]+blob\/[\w\-\/]+\/([\w\-]+)(\.[a-z]{2})?\.(txt|ipynb|json|md)/gm;
  //.     /^https:\/\/github\.com\/.*\/([^\/]+)\.(txt|ipynb|md)(?:\?lang=[a-zA-Z]{2})?$
function getSlugFromGithubURL(url){
  let matches;
  let pieces = [];
  while ((matches = githubUrlRegex.exec(url)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matches.index === githubUrlRegex.lastIndex) {
        githubUrlRegex.lastIndex++;
      }
      
      // The result can be accessed through the `m`-variable.
      for (let m of matches) if(!m?.includes("http")) pieces.push(m?.replace(".", ""));
      if(pieces.length > 0) return pieces;
  }
  return ["invalid-url"]
}

const hasErrors = (_asset, isCreating=true) => {
  const [slug, lang, extension] = getSlugFromGithubURL(_asset.readme_url);

  let _errors = {};
  if (!slug || (slug === 'invalid-url')){
    _errors["readme_url"] =
    `The url ${slug} must point to a markdown, txt or notebook file starting with: https://github.com...`;
  }
  if (!_asset.owner) _errors["owner"] = "Please pick a github owner";
  if (!_asset.asset_type) _errors["asset_type"] = "Choose an asset type";
  if (!_asset.category) _errors["category"] = "Choose a category";
  if (
    !isCreating &&
    !["LESSON", "ARTICLE"].includes(_asset.asset_type) &&
    !["OK", "WARNING"].includes(_asset.sync_status)
  )
    _errors["sync_status"] = "Sync with github before saving";
  if (!isCreating && !["OK", "WARNING"].includes(_asset.test_status))
    _errors["test_status"] = "Integrity tests failed";

  return _errors;
};

const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const statusColors = {
  DRAFT: "bg-error",
  NOT_STARTED: "bg-error",
  WRITING: "bg-warning",
  OPTIMIZED: "bg-warning",
  PUBLISHED: "bg-primary",
};

const visibilityColors = {
  PRIVATE: "bg-error",
  UNLISTED: "bg-warning",
  PUBLIC: "bg-primary",
};
const defaultAsset = {
  slug: "",
  title: "Example asset title",
  seo_keywords: [],
  cluster: null,
  url: "",
  readme_url: "",
  lang: "",
  status: "DRAFT",
  visibility: "PRIVATE",
  asset_type: null,
  owner: null,
  new: true,
};

const ComposeAsset = () => {
  const { asset_slug } = useParams();
  const isCreating = window.location.pathname.includes("/media/asset/new");
  const [asset, setAsset] = useState({ ...defaultAsset, slug: asset_slug || "" });
  const [updateVisibility, setUpdateVisibility] = useState(false);
  const [updateCategory, setUpdateCategory] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [updateType, setUpdateType] = useState(false);
  const [updateLanguage, setUpdateLanguage] = useState(false);
  const [errors, setErrors] = useState({});

  const [errorDialog, setErrorDialog] = useState(false);
  const [openAliases, setOpenAliases] = useState(null);
  const [content, setContent] = useState(null);
  const [makePublicDialog, setMakePublicDialog] = useState({
    isOpen: false,
    action: null,
  });
  const updatedDate = asset.updated_at;

  const now = new Date();
  const formattedDate =
    now.toISOString().replace("Z", "").padEnd(23, "0") + "Z";

  const [dirty, setDirty] = useState(false);

  const handleMarkdownChange = () => {
    if (asset.updated_at != asset.last_synched_at) {
      setDirty(true);
    }
  };

  const partialUpdateAsset = async (_slug, newAsset) => {
    if (isCreating) {
      toast.error("Please create the asset first", toastOption);
      return false;
    } else {
      const resp = await bc
        .registry()
        .updateAsset(_slug, { ...newAsset, slug: newAsset.slug });
      if (resp.status >= 200 && resp.status < 300) {
        setAsset(resp.data);
        if (resp.data.slug != asset.slug) history.push(`./${resp.data.slug}`);
      }
      return resp;
    }
  };

  const getAssetContent = async (_slug) => {
    const resp = await bc
      .registry()
      .getAssetContent(_slug, { format: "raw" });
    if (resp.status >= 200 && resp.status < 300) {
      setContent(resp.data);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (isCreating) {
        setAsset({ ...defaultAsset, slug: asset_slug });
        setContent("Write your asset here, use `markdown` syntax");
      } else {
        try {
          const resp = await bc.registry().getAsset(asset_slug);
          if (resp.status >= 200 && resp.status < 300) {
            setAsset({ ...resp.data, lang: resp.data.lang || "us" });
          } else throw Error("Asset could not be retrieved");

          await getAssetContent(asset_slug);
        } catch (error) {
          console.error("Error log", error);
        }
      }
    };
    load();
  }, [asset_slug]);

  const handleAction = async (action, payload = null) => {
    const resp = await bc
      .registry()
      .assetAction(asset?.slug, {
        ...payload,
        silent: true,
        action_slug: action,
      });
    if (resp.status === 200) {
      if (["pull", "push"].includes(action) && resp.data.sync_status != "OK") {
        toast.error(`Sync returned with problems: ${resp.data.status_text}`);
      } else if (action == "test" && resp.data.test_status != "OK") {
        toast.error(
          `Integrity test returned with problems: ${resp.data.status_text}`
        );
      } else if (action == "analyze_seo") {
        // do nothing
      } else toast.success(`${action} completed successfully`);
      setAsset(resp.data);
      setDirty(false);
      await getAssetContent(resp.data.slug);
      return resp.data;
    } else {
      toast.error(
        `Integrity test returned with problems: ${resp.data.detail}`
      );
    }
  }

  const saveAsset = async (published_at = null) => {
    const _asset = {
      ...asset,
      assessment: asset.assessment?.id || asset.assessment,
      category:
        !asset.category || typeof asset.category !== "object"
          ? asset.category
          : asset.category.id,
      owner: asset.owner?.id,
      readme_raw: Base64.encode(content),
      url: !["PROJECT", "EXERCISE"].includes(asset.asset_type)
        ? asset.readme_url
        : asset.readme_url.substring(0, asset.readme_url.indexOf("/blob/")),
    };

    if (published_at) _asset["published_at"] = published_at;

    const resp = isCreating ?
      await bc.registry().createAsset({..._asset, 
        lang: asset.category?.lang.toLowerCase(),
        title: unSlugifyCapitalize(_asset.slug)})
      :
      await bc.registry().updateAsset(_asset.slug, {
        ..._asset,
        author: undefined,
        seo_keywords: undefined,
      });

    if (resp.ok) {
      if (isCreating) history.push(`./${resp.data.slug}`);
      else setAsset(resp.data);
      return true;
    } else if (resp.status >= 400 && resp.status < 500) {
      return { details: resp.data.details };
    } else return { details: "There was an error saving the asset" };
  };

  const handleUpdateCategory = async (category) => {
    if (category) {
      if (isCreating) setAsset({ ...asset, category });
      else
        partialUpdateAsset(asset.slug, { category: category.id || category });
    }
    setUpdateCategory(false);
    setDirty(true);
  };

  if (!asset || (!isCreating && !asset.id)) return <MatxLoading />;
  
  return (
    <div className="m-sm-30">
      {openAliases && <AssetAliases asset={asset} onClose={() => setOpenAliases(false)} />}
      <div className="mb-sm-30">
        <div className="flex flex-wrap justify-between mb-6">
          <div>
            <Breadcrumb
              routeSegments={[
                { name: "Assets", path: "/media/asset" },
                { name: "Single Asset" },
              ]}
            />
          </div>
        </div>
      </div>
      {isCreating ? (
        <Card className="p-4 mt-4">
          <h1>Create a new asset</h1>
          <p>Please provide a Github URL to fetch the markdown/notebook file from:</p>
          <TextField
            variant="outlined"
            size="small"
            value={asset.readme_url}
            fullWidth={true}
            onChange={(e) => {
              const [slug, lang, extension] = getSlugFromGithubURL(e.target.value);
              setAsset({ ...asset, 
                lang, 
                readme_url: e.target.value,
                asset_type: extension == 'json' ? 'QUIZ' : undefined,
                slug: (!asset.slug || asset.slug === "") ? slug : asset.slug,
              });
            }}
            placeholder="https://github.com/"
          />
          {errors["readme_url"] && (
            <small className="text-error">{errors["readme_url"]}</small>
          )}
          <p>Choose a slug for the asset</p>
          <TextField
            variant="outlined"
            size="small"
            value={asset.slug}
            fullWidth={true}
            onChange={(e) => {
              setAsset({
                ...asset,
                slug: slugify(e.target.value.toLowerCase()),
              });
            }}
          />
          {errors["slug"] && (
            <small className="text-error">{errors["slug"]}</small>
          )}
          <p>Github Owner (with read permissions on the repository):</p>
          <AsyncAutocomplete
            width="100%"
            size="small"
            onChange={(owner) => setAsset({ ...asset, owner })}
            label="Search among users"
            value={asset.owner}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            asyncSearch={(searchTerm) =>
              bc.auth().getAllUsers({ github: true, like: searchTerm })
            }
          />
          {errors["owner"] && (
            <small className="text-error">{errors["owner"]}</small>
          )}

          <p className="p-0 py-2 m-0">
            Select an asset type:
            <Button
              size="small"
              variant="outlined"
              color="primary"
              className="ml-3"
              onClick={() => {
                setUpdateType(true);
              }}
            >
              {asset && asset.asset_type ? asset.asset_type : `Click to select`}
            </Button>
          </p>
          {errors["asset_type"] && (
            <small className="text-error">{errors["asset_type"]}</small>
          )}
          <p className="p-0 m-0">
            Select an asset category:
            <Button
              size="small"
              variant="outlined"
              color="primary"
              className="ml-3"
              onClick={() => {
                setUpdateCategory(true);
              }}
            >
              {asset && asset.category
                ? asset.category.title || asset.category.slug
                : `Click to select`}
            </Button>
          </p>
          {errors["category"] && (
            <small className="text-error">{errors["category"]}</small>
          )}

          <Button
            className="mt-2"
            variant="contained"
            color="primary"
            onClick={() => {
              const _errors = hasErrors(asset, true);
              if(Object.keys(_errors).length == 0) {
                saveAsset();
              }
              else {
                setErrors(_errors);
                setErrorDialog(_errors)
              }
            }}
          >
            Create asset
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap justify-between mb-6">
            <Grid item xs={12} sm={8}>
              <EditableTextField
                defaultValue={asset.title}
                onChange={(_v) => {
                  if (!isCreating)
                    partialUpdateAsset(asset.slug, { title: _v }),
                      setDirty(true);
                  else setAsset({ ...asset, title: _v });
                }}
              >
                <h3 className="my-0 font-medium text-28">{asset.title}</h3>
              </EditableTextField>
              <EditableTextField
                defaultValue={asset.slug}
                key={asset.slug}
                onValidate={async (_val) => {
                  const available =
                    (
                      await bc
                        .registry()
                        .getAsset(slugify(_val), { silent: true })
                    ).status === 404;
                  setErrors({
                    ...errors,
                    slug: available ? null : "Slug already taken",
                  });
                  return available;
                }}
                onChange={(_v) => {
                  if (!isCreating)
                    partialUpdateAsset(asset.slug, { slug: slugify(_v) }),
                      setDirty(true);
                  else
                    setAsset({ ...asset, slug: slugify(_v) }), setDirty(true);
                }}
              >
                <p className="my-0">{asset.slug}</p>
                <IconButton size="small" variant="outlined" onClick={() => setOpenAliases(true)}>
                    <Icon>link</Icon>
                </IconButton>
              </EditableTextField>

              <div className="flex">
                <div
                  className={`px-3 text-11 py-3px border-radius-4 text-white ${
                    statusColors[asset.status]
                  } mr-3 pointer`}
                  onClick={() => setUpdateStatus(true)}
                >
                  {asset.status}
                </div>
                <div
                  className={`px-3 text-11 py-3px border-radius-4 text-white ${
                    visibilityColors[asset.visibility]
                  } mr-3 pointer`}
                  onClick={() => setUpdateVisibility(true)}
                >
                  Internally {asset.visibility}
                </div>
                <div
                  className="px-3 text-11 py-3px border-radius-4 text-white bg-dark mr-3 pointer"
                  onClick={() => {
                    setUpdateType(true);
                  }}
                >
                  {asset.asset_type ? asset.asset_type : "NOT TYPE SPECIFIED"}
                </div>
                <div
                  className="px-3 text-11 py-3px border-radius-4 text-white bg-dark mr-3 pointer"
                  onClick={() => setUpdateCategory(true)}
                >
                  {asset.category
                    ? asset.category.slug || asset.category.title
                    : "Category"}
                </div>
                <div
                  className="px-3 text-11 py-3px border-radius-4 text-dark bg-white mr-3 pointer"
                  onClick={() => setUpdateLanguage(true)}
                >
                  {availableLanguages[asset.lang] ? (
                    <>
                      <ReactCountryFlag
                        className="mr-2"
                        countryCode={asset.lang}
                        svg
                      />
                      {availableLanguages[asset.lang].toUpperCase()}
                    </>
                  ) : (
                    `Uknown language ${asset.lang}`
                  )}
                </div>
              </div>
              {errors["asset_type"] && (
                <small className="text-error">{errors["asset_type"]}</small>
              )}
            </Grid>
            <div>
              <Grid item align="right">
                <CommentBar
                  asset={asset}
                  iconName="comment"
                  title="Tasks and Comments"
                />
                <IconButton
                  onClick={() =>
                    asset.asset_type === 'QUIZ' ?
                      window.open(asset.url)
                      :
                      window.open(
                        `${config.REACT_APP_API_HOST}/v1/registry/asset/preview/${asset.slug}`
                      )
                  }
                >
                  <Icon>
                    <OpenInBrowser />
                  </Icon>
                </IconButton>
                <RepositorySubscriptionIcon repo_url={asset.readme_url} />
                <DowndownMenu
                  options={
                    createButtonLabel[asset.asset_type]?.options ||
                    [
                      {
                        label:
                          "Only lessons and articles can be saved. For other types of assets you need to update the markdown or learn.json file directoly on Github and pull from here",
                        style: { width: "200px" },
                        value: null,
                      },
                    ]
                  }
                  icon="more_horiz"
                  onSelect={async ({ value }) => {
                    if (!value) return null;
                    if (asset.status == "PUBLISHED" && asset.published_at != null) setMakePublicDialog({ isOpen: true, action: value });
                    else if (asset.status == "PUBLISHED") {
                      const _errors = await saveAsset(formattedDate);
                      if (Object.keys(_errors).length > 0) setErrorDialog(_errors);
                      else if (value === "push") handleAction("push");
                    } else {
                      const _errors = await saveAsset();
                      if (Object.keys(_errors).length > 0) setErrorDialog(_errors);
                      else if (value === "push") handleAction("push");
                    }
                  }}
                >
                {createButtonLabel[asset.asset_type] && <Button variant="contained" color="primary">
                    {isCreating ? `Create asset` : createButtonLabel[asset.asset_type].label}
                  </Button>}
                </DowndownMenu>

                <ConfirmAlert
                  title={`Do you wish to update the asset published date?`}
                  isOpen={makePublicDialog.isOpen}
                  setIsOpen={setMakePublicDialog.isOpen}
                  cancelText={"No,  don't update the published date"}
                  acceptText={"Yes, update the published date"}
                  onOpen={async () => {
                    const _errors = await saveAsset(formattedDate);
                    if (Object.keys(_errors).length > 0) setErrorDialog(_errors);
                    else if (makePublicDialog.action === "push") handleAction("push");
                    setMakePublicDialog({isOpen: false, action: null});
                  }}
                  onClose={async () => {
                    const _errors = await saveAsset();
                    if (Object.keys(_errors).length > 0) setErrorDialog(_errors);
                    else if (makePublicDialog.action === "push") handleAction("push");
                    setMakePublicDialog({isOpen: false, action: null});
                  }}
                />
              </Grid>
              <Grid item align="right">
                  <small style={{ minWidth: "200px" }} className="px-1 py-2px text-muted">
                    {asset.status == "DRAFT"
                      ? "Never Published"
                      : asset.published_at == null
                      ? "Published at: Missing publish date"
                      : "Published " + dayjs(asset.published_at).fromNow()}
                  </small>
                </Grid>
                <Grid item align="right">
                  <small className="px-1 py-2px text-muted">
                    Last update {dayjs(updatedDate).fromNow()}
                  </small>
                </Grid>
              </div>
          </div>

          <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
              {dirty ? (
                <Grid item md={12} sm={12} xs={12}>
                  <Alert severity="warning">
                    <AlertTitle>Asset has been modified</AlertTitle>
                    Remember to push your changes before pulling or executing
                    any action or they will be lost.
                  </Alert>
                </Grid>
              ) : (
                ""
              )}
              {asset.asset_type.toLowerCase() == "quiz" ? 
                <><QuizBuilder asset={asset} onChange={async (a) => {
                    const resp = await bc.registry().updateAsset(a.slug, { 
                      status: asset.status,
                      visibility: asset.visibility,
                      assessment: a.assessment.id 
                    });
                    if (resp.ok) setAsset(resp.data);
                }} /></>
                :
                <AssetMarkdown
                  asset={asset}
                  value={content}
                  onChange={(c) => {
                    handleMarkdownChange();
                    setContent(c);
                  }}
                />
              }
            </Grid>
            <Grid item md={4} xs={12}>
              <AssetMeta
                key={asset.id}
                asset={asset}
                onAction={(action, payload = null) =>
                  handleAction(action, payload)
                }
                onChange={async (a) => {
                  handleMarkdownChange();
                  return await partialUpdateAsset(asset.slug, a);
                }}
              />
            </Grid>
          </Grid>
        </>
      )}
      <DialogPicker
        onClose={(opt) => {
          if (opt) {
            if (isCreating) setAsset({ ...asset, visibility: opt });
            else partialUpdateAsset(asset.slug, { visibility: opt });
            setDirty(true);
          }
          setUpdateVisibility(false);
        }}
        open={updateVisibility}
        title="Select a visibility"
        options={["PUBLIC", "UNLISTED", "PRIVATE"]}
        s
      />
      <DialogPicker
        onClose={(opt) => {
          if (opt) {
            if (isCreating) setAsset({ ...asset, asset_type: opt });
            else
              partialUpdateAsset(asset.slug, { asset_type: opt }),
                setDirty(true);
          }
          setUpdateType(false);
        }}
        open={updateType}
        title="Select a type"
        options={["LESSON", "ARTICLE", "PROJECT", "EXERCISE", "VIDEO", "QUIZ"]}
      />
      <DialogPicker
        onClose={(opt) => {
          if (opt) {
            if (isCreating) setAsset({ ...asset, status: opt });
            else partialUpdateAsset(asset.slug, { status: opt });
            setDirty(true);
          }
          setUpdateStatus(false);
        }}
        open={updateStatus}
        title="Select a status"
        options={["NOT_STARTED", "WRITING", "DRAFT", "OPTIMIZED", "PUBLISHED"]}
      />
      <DialogPicker
        onClose={(opt) => {
          if (opt) {
            if (isCreating) setAsset({ ...asset, lang: opt.value });
            else partialUpdateAsset(asset.slug, { lang: opt.value });
            setDirty(true);
          }
          setUpdateLanguage(false);
        }}
        open={updateLanguage}
        title="Select a language"
        options={Object.keys(availableLanguages).map((l) => ({
          label: availableLanguages[l],
          value: l,
        }))}
      />
      {errorDialog && <ConfirmationDialog open={true}
        noLabel="Close"
        maxWidth="md"
        onConfirmDialogClose={() => setErrorDialog(false)}
        title="We found some errors"
      >
        <List size="small">
          {Object.keys(errorDialog).map((e, i) => (
            <ListItem key={i} size="small" className="p-0 m-0">
              <ListItemText className="capitalize" primary={errors[e]} />
            </ListItem>
          ))}
        </List>
      </ConfirmationDialog>}
      {updateCategory && (
        <PickCategoryModal
          onClose={handleUpdateCategory}
          lang={asset.lang}
          defaultCategory={asset.category}
        />
      )}
    </div>
  );
};

export default ComposeAsset;
