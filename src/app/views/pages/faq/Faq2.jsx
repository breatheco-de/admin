import React, { useState } from "react";
import {
  TextField,
  Icon,
  Button,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  card: {
    marginRight: "2rem",
    marginLeft: "2rem",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0.5rem",
      marginRight: "0.5rem"
    }
  }
}));

const Faq2 = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const classes = useStyles();

  const handleTabChange = (e, value) => {
    setTabIndex(value);
  };

  const handleExpansionClick = ind => {
    if (ind === expandedIndex) setExpandedIndex(-1);
    else setExpandedIndex(ind);
  };

  return (
    <div>
      <div className="flex-column justify-center items-center bg-primary pt-17 pb-25 px-4">
        <TextField
          className="max-w-600"
          variant="outlined"
          placeholder="Search knowledge base"
          fullWidth
          InputProps={{
            startAdornment: (
              <Icon fontSize="small" className="mr-2">
                search
              </Icon>
            ),
            endAdornment: (
              <Button className="bg-primary text-white px-7">Search</Button>
            ),
            style: {
              background: "white"
            }
          }}
        />
      </div>

      <Card className={clsx("px-4 py-2 mt--12", classes.card)}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab className="capitalize" value={0} label="Getting Started" />
          <Tab className="capitalize" value={1} label="Pricing" />
        </Tabs>

        {tabIndex === 0 && (
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              {questionList1.map((item, ind) => (
                <Accordion
                  key={ind}
                  elevation={0}
                  expanded={expandedIndex === ind}
                  onClick={() => handleExpansionClick(ind)}
                >
                  <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    {item.title}
                  </AccordionSummary>
                  <AccordionDetails>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee
                    nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably haven"t heard of them
                    accusamus labore sustainable VHS.
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            <Grid item md={6} sm={12}>
              {questionList1.map((item, ind) => (
                <Accordion
                  key={ind}
                  elevation={0}
                  expanded={expandedIndex === ind + 4}
                  onClick={() => handleExpansionClick(ind + 4)}
                >
                  <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    {item.title}
                  </AccordionSummary>
                  <AccordionDetails>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee
                    nulla assumenda shoreditch et. Nihil anim keffiyeh
                    helvetica, craft beer labore wes anderson cred nesciunt
                    sapiente ea proident. Ad vegan excepteur butcher vice lomo.
                    Leggings occaecat craft beer farm-to-table, raw denim
                    aesthetic synth nesciunt you probably haven"t heard of them
                    accusamus labore sustainable VHS.
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        )}

        {tabIndex === 1 && (
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              {questionList2.map((item, ind) => (
                <Accordion
                  key={ind}
                  elevation={0}
                  expanded={expandedIndex === ind}
                  onClick={() => handleExpansionClick(ind)}
                >
                  <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    {item.title}
                  </AccordionSummary>
                  <AccordionDetails>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee
                    nulla
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            <Grid item md={6} sm={12}>
              {questionList2.map((item, ind) => (
                <Accordion
                  key={ind}
                  elevation={0}
                  expanded={expandedIndex === ind + 4}
                  onClick={() => handleExpansionClick(ind + 4)}
                >
                  <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                    {item.title}
                  </AccordionSummary>
                  <AccordionDetails>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life
                    accusamus terry richardson ad squid. 3 wolf moon officia
                    aute, non cupidatat skateboard dolor brunch. Food truck
                    quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
                    sunt aliqua put a bird on it squid single-origin coffee
                    nulla
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        )}
      </Card>
    </div>
  );
};

const questionList1 = [
  {
    title: "How to install?"
  },
  {
    title: "How can I change colors?"
  },
  {
    title: "How to add page?"
  }
];

const questionList2 = [
  {
    title: "How would I get refund?"
  },
  {
    title: "How long will it take to reach product?"
  },
  {
    title: "What's the refund policy?"
  },
  {
    title: "What's the customer protection policy?"
  }
];
export default Faq2;
