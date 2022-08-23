import React from "react";
import { Divider, Card, Avatar, Grid, TextField, Button, Chip } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import dayjs from 'dayjs';
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

const SEOCard = ({ asset, onAction }) => <Card className="p-4 mb-4">
  <div className="mb-4 flex justify-between items-center">
    <h4 className="m-0 font-medium">SEO</h4>
    <Button variant="contained" color="primary" size="small" onClick={() => onAction('analyze')}>
      Analize
    </Button>
  </div>

  <Grid className="flex mb-2" xs={12}>
    <Grid item xs={4}>
      Cluster:
    </Grid>
    <Grid item xs={8}>
      <Chip size="small" label={asset.topic_cluster}/>
    </Grid>
  </Grid>
  <Grid className="flex" xs={12}>
    <Grid item xs={4}>
      Keywords:
    </Grid>
    <Grid item xs={8}>
      {asset.seo_keywords.map(k => <Chip label={k} />)}
    </Grid>
  </Grid>
</Card>;

const GithubCard = ({ asset, onAction }) => <Card className="p-4 mb-4">
  <div className="mb-4 flex justify-between items-center">
    <h4 className="m-0 font-medium">Github</h4>
    <Button variant="contained" color="primary" size="small" onClick={() => onAction('sync')}>
      Pull
    </Button>
  </div>

  <Grid className="flex mb-2" xs={12}>
    <Grid item xs={4}>
      Status:
    </Grid>
    <Grid item xs={8}>
      <Chip size="small" label={asset.sync_status}/> <small>{dayjs(asset.last_synch_at).fromNow()}</small>
    </Grid>
  </Grid>
  <Grid className="flex" xs={12}>
    <Grid item xs={4}>
      Destination URL:
      <a href={asset.url} target="_blank" className="small text-primary d-block">open</a>
    </Grid>
    <Grid item xs={8}>
      <TextField value={asset.url} variant="outlined" size="small" />
    </Grid>
  </Grid>
</Card>;

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
      <Chip size="small" label={asset.test_status}/> <small>{dayjs(asset.last_test_at).fromNow()}</small>
    </Grid>
  </Grid>
</Card>;

const AssetMeta = ({ asset, onAction }) => {
  const classes = useStyles();

  return (
    <>
      <SEOCard asset={asset} onAction={(action) => onAction(action)} />
      <GithubCard asset={asset} onAction={(action) => onAction(action)} />
      <TestCard asset={asset} onAction={(action) => onAction(action)} />
    </>
  );
};

export default AssetMeta;