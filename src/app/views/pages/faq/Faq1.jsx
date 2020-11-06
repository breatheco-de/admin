import React, { useState, Fragment } from "react";
import { Breadcrumb } from "matx";
import {
  TextField,
  Icon,
  Button,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  coloredBorder: {
    border: "1px solid rgba(var(--primary), 1)",
  },
}));

const Faq1 = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const classes = useStyles();

  const handleExpansionClick = (ind) => {
    if (ind === expandedIndex) setExpandedIndex(-1);
    else setExpandedIndex(ind);
  };

  return (
    <div className="m-sm-30">
      <div className="mb-sm-30">
        <Breadcrumb
          routeSegments={[{ name: "Pages", path: "/faq" }, { name: "FAQ 1" }]}
        />
      </div>
      <div className="flex-column justify-center items-center  py-16">
        <h1 className="mt-0 mb-8 text-40 text-center font-medium">
          Hi, How can we help you?
        </h1>
        <TextField
          className="max-w-400"
          variant="outlined"
          placeholder="Search knowledge base"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <Icon fontSize="small" className="mr-2">
                search
              </Icon>
            ),
            endAdornment: (
              <Button className="bg-primary text-white px-7 rounded">
                Search
              </Button>
            ),
            style: {
              borderRadius: 300,
              paddingRight: 0,
            },
          }}
        />
      </div>
      <p className="text-center text-muted text-16 mb-16">
        Or Browse by category
      </p>
      <div className="mb-8">
        <div className="flex flex-wrap justify-center items-center m--2">
          {categoryList.map((item, ind) => (
            <Card
              key={ind}
              elevation={6}
              className={clsx({
                "flex-column justify-center items-center py-6 px-8 m-2 cursor-pointer": true,
                [classes.coloredBorder]: ind === tabIndex,
              })}
              onClick={() => setTabIndex(ind)}
            >
              <Icon
                className={clsx({
                  "text-40 mb-2": true,
                  "text-primary": ind === tabIndex,
                })}
              >
                {item.icon}
              </Icon>
              <h5 className="m-0">{item.title}</h5>
            </Card>
          ))}
        </div>
      </div>

      {/* {tabIndex === 0 && <div>put your options here</div>} */}

      <Fragment>
        {categoryList[tabIndex].questionList?.map((item, ind) => (
          <Accordion
            key={ind}
            elevation={0}
            expanded={expandedIndex === ind}
            onClick={() => handleExpansionClick(ind)}
          >
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              {item.question}
            </AccordionSummary>
            <AccordionDetails>{item.answer}</AccordionDetails>
          </Accordion>
        ))}
      </Fragment>
    </div>
  );
};

const categoryList = [
  {
    icon: "home",
    title: "Getting Started",
    questionList: [
      {
        question: "How to install?",
        answer:
          "Open command line in root directory of your project and type npm install",
      },
      {
        question: "How to debug?",
        answer:
          "Delete node_modules from your project folder. Open command line in root directory of your project and type npm install",
      },
    ],
  },
  {
    icon: "layers",
    title: "Plans & Pricing",
    questionList: [
      {
        question: "What's the price?",
        answer: "$2356",
      },
      {
        question: "How long will I get suppot?",
        answer: "Life time support",
      },
    ],
  },
  {
    icon: "contact_support",
    title: "Sales Questions",
    questionList: [
      {
        question: "When are you availabe?",
        answer: "Monday to Friday from 10:00am to 6pm EST",
      },
      {
        question: "When are you availabe?",
        answer: "Monday to Friday from 10:00am to 6pm EST",
      },
    ],
  },
  {
    icon: "360",
    title: "Usage Guide",
    questionList: [
      {
        question: "How to install in Mac?",
        answer:
          "Open command line in your project's root directory and type yarn and hit enter",
      },
      {
        question: "How to install in Mac?",
        answer:
          "Open command line in your project's root directory and type yarn and hit enter",
      },
    ],
  },
];

export default Faq1;
