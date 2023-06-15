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
const slugify = require("slugify");
import { toast } from "react-toastify";
import OpenInBrowser from "@material-ui/icons/OpenInBrowser";
import DowndownMenu from "../../../components/DropdownMenu";
import AssetMarkdown from "./AssetMarkdown";
import { useParams } from "react-router-dom";
import { Alert, AlertTitle } from "@material-ui/lab";
import AssetMeta from "./AssetMeta";
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
import { availableLanguages, unSlugifyCapitalize } from "../../../../utils"
import config from '../../../../config.js';
import dayjs from 'dayjs';

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

const githubUrlRegex =
  /https:\/\/github\.com\/[\w\-_]+\/[\w\-_]+\/blob\/\w+\/[\w\-\/]+(:?\.[a-z]{2})?\.md$/g;
const slugRegex = /[\w\-_]+$/g;

const ComposeAsset = () => {
  const { asset_slug } = useParams();
  const isCreating =
    asset_slug === undefined && (!asset || asset.id === undefined);
  const [asset, setAsset] = useState(defaultAsset);
  const [updateVisibility, setUpdateVisibility] = useState(false);
  const [updateCategory, setUpdateCategory] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [updateType, setUpdateType] = useState(false);
  const [updateLanguage, setUpdateLanguage] = useState(false);
  const [githubUrl, setGithubUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorDialog, setErrorDialog] = useState(false);
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
    } else {
      const resp = await bc
        .registry()
        .updateAsset(_slug, { ...newAsset, slug: newAsset.slug });
      if (resp.status >= 200 && resp.status < 300) {
        setAsset(resp.data);
        if (resp.data.slug != asset_slug) history.push(`./${resp.data.slug}`);
      }
    }
  };

  const getAssetContent = async () => {
    const resp = await bc
      .registry()
      .getAssetContent(asset_slug, { format: "raw" });
    if (resp.status >= 200 && resp.status < 300) {
      setContent(resp.data);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (isCreating) {
        setAsset(defaultAsset);
        setGithubUrl(defaultAsset.readme_url);
        setContent("Write your asset here, use `markdown` syntax");
      } else {
        try {
          const resp = await bc.registry().getAsset(asset_slug);
          if (resp.status >= 200 && resp.status < 300) {
            setAsset({ ...resp.data, lang: resp.data.lang || "us" });
            setGithubUrl(resp.data.readme_url);
          } else throw Error("Asset could not be retrieved");

          await getAssetContent();
        } catch (error) {
          console.log("Error log", error);
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
      await getAssetContent();
    }
  };

  const hasErrors = (_asset) => {
    let _errors = {};
    if (!githubUrlRegex.test(_asset.readme_url))
      _errors["readme_url"] =
        "The url must point to a markdown file on github usually starting with: https://github.com/[username]/[repo_name]/blob...";
    if (!slugRegex.test(_asset.slug))
      _errors[
        "slug"
      ] = `Invalid slug, it can only contain letters, numbers - and _`;
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

  const saveAsset = async (published_at = null) => {
    const readme_url = githubUrl || asset.readme_url;
    const _asset = {
      ...asset,
      readme_url,
      category:
        !asset.category || typeof asset.category !== "object"
          ? asset.category
          : asset.category.id,
      owner: asset.owner?.id,
      readme_raw: Base64.encode(content),
      url: !["PROJECT", "EXERCISE"].includes(asset.asset_type)
        ? readme_url
        : readme_url.substring(0, readme_url.indexOf("/blob/")),
    };

    if (published_at) _asset["published_at"] = published_at;

    const _errors = hasErrors(_asset);
    setErrors(_errors);

    if (Object.keys(_errors).length == 0) {
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
    } else return _errors;
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

  if (!asset) return <MatxLoading />;

  return (
    <div className="m-sm-30">
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
      {asset.readme_url === "" ? (
        <Card className="p-4 mt-4">
          <h1>Create a new asset</h1>
          <p className="p-0 py-2 m-0">
            Select an asset type:
            <Button
              size="small"
              variant="outlined"
              color="primary"
              className="ml-3"
              onClick={() => {
                setUpdateType(true);
                setErrors({ ...errors, asset_type: null });
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
                setErrors({ ...errors, category: null });
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
          <p>Please provied a Github URL to fetch the markdown file from:</p>
          <TextField
            variant="outlined"
            size="small"
            value={githubUrl}
            fullWidth={true}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              setErrors({ ...errors, readme_url: "" });
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
              setErrors({ ...errors, slug: "" });
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
          <Button
            className="mt-2"
            variant="contained"
            color="primary"
            onClick={() =>
              saveAsset().then(
                (_errors) =>
                  Object.keys(_errors).length > 0 && setErrorDialog(true)
              )
            }
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
                  {asset.visibility}
                </div>
                <div
                  className="px-3 text-11 py-3px border-radius-4 text-white bg-dark mr-3 pointer"
                  onClick={() => {
                    setUpdateType(true);
                    setErrors({ ...errors, asset_type: null });
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

            <Grid item xs={6} sm={4} align="right">
              <CommentBar
                asset={asset}
                iconName="comment"
                title="Tasks and Comments"
              />
              <IconButton
                onClick={() =>
                  window.open(
                    `${config.REACT_APP_API_HOST}/v1/registry/asset/preview/${asset.slug}`
                  )
                }
              >
                <Icon>
                  <OpenInBrowser />
                </Icon>
              </IconButton>
              <DowndownMenu
                options={
                  ["LESSON", "ARTICLE"].includes(asset.asset_type)
                    ? [
                        {
                          label: "Only save to 4Geeks.com",
                          value: "only_save",
                        },
                        {
                          label: "Also commit markdown to github",
                          value: "push",
                        },
                      ]
                    : [
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
                    if (Object.keys(_errors).length > 0) setErrorDialog(true);
                    else if (value === "push") handleAction("push");
                  } else {
                    const _errors = await saveAsset();
                    if (Object.keys(_errors).length > 0) setErrorDialog(true);
                    else if (value === "push") handleAction("push");
                  }
                }}
              >
                <Button variant="contained" color="primary">
                  {isCreating ? `Create asset` : `Update asset`}
                </Button>
              </DowndownMenu>

              <ConfirmAlert
                title={`Do you wish to update the asset published date?`}
                isOpen={makePublicDialog.isOpen}
                setIsOpen={setMakePublicDialog.isOpen}
                cancelText={"No,  don't update the published date"}
                acceptText={"Yes, update the published date"}
                onOpen={async () => {
                  const _errors = await saveAsset(formattedDate);
                  if (Object.keys(_errors).length > 0) setErrorDialog(true);
                  else if (makePublicDialog.action === "push") handleAction("push");
                  setMakePublicDialog({isOpen: false, action: null});
                }}
                onClose={async () => {
                  const _errors = await saveAsset();
                  if (Object.keys(_errors).length > 0) setErrorDialog(true);
                  else if (makePublicDialog.action === "push") handleAction("push");
                  setMakePublicDialog({isOpen: false, action: null});
                }}
              />

              <Grid item xs={6} sm={5} align="right">
                <small className="px-1 py-2px text-muted">
                  {asset.status == "DRAFT"
                    ? "Published at: Never"
                    : asset.published_at == null
                    ? "Published at: Missing publish date"
                    : "Published at:" + dayjs(asset.published_at).fromNow()}
                </small>
              </Grid>
              <Grid item xs={6} sm={4} align="right">
                <small className="px-1 py-2px text-muted">
                  Last update: {dayjs(updatedDate).fromNow()}
                </small>
              </Grid>
            </Grid>
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
              <AssetMarkdown
                asset={asset}
                value={content}
                onChange={(c) => {
                  handleMarkdownChange();
                  setContent(c);
                }}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <AssetMeta
                asset={asset}
                onAction={(action, payload = null) =>
                  handleAction(action, payload)
                }
                onChange={(a) => {
                  handleMarkdownChange();
                  partialUpdateAsset(asset_slug, a);
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
      <ConfirmationDialog
        open={errorDialog}
        noLabel="Close"
        maxWidth="md"
        onConfirmDialogClose={() => setErrorDialog(false)}
        title="We found some errors"
      >
        <List size="small">
          {Object.keys(errors).map((e, i) => (
            <ListItem key={i} size="small" className="p-0 m-0">
              <ListItemText className="capitalize" primary={errors[e]} />
            </ListItem>
          ))}
        </List>
      </ConfirmationDialog>
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
