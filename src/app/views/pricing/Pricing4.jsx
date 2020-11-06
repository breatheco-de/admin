import React from "react";
import { Card, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  table: {
    minWidth: 600,
    "& td": {
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
    },
  },
}));

const Pricing4 = () => {
  const classes = useStyles();

  return (
    <div className="m-sm-30 relative">
      <Card className="px-6 py-14" elevation={3}>
        <h1 className="mt-0 mb-12 text-32 font-medium text-center">
          Simple Pricing
        </h1>
        <div className="overflow-auto">
          <table className={classes.table}>
            <tbody>
              <tr>
                <td>
                  <div className="text-center"></div>
                </td>
                {["Essential", "Premium", "Enterprise"].map((item, ind) => (
                  <td key={ind}>
                    <div className="text-center">
                      <h5 className="font-medium text-14">{item}</h5>
                      <p className="text-muted">
                        All the basics for event &amp; team crowdfunding
                      </p>
                      <Button
                        className="rounded px-6 mb-5"
                        variant="contained"
                        color="primary"
                      >
                        Get Started
                      </Button>
                      <Link className="text-muted block" to="/">
                        Learn More
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="pt-8">
                  <h5 className="font-medium text-14 mb-0">Pricing</h5>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Plan Cost</td>
                <td className="text-muted text-center">Free</td>
                <td className="text-center">
                  <Button className="rounded text-small text-green font-medium bg-light-green hover-bg-green px-4 py-2px">
                    Contact Us
                  </Button>
                </td>
                <td className="text-center">
                  <Button className="rounded text-small text-green font-medium bg-light-green hover-bg-green px-4 py-2px">
                    Contact Us
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Platform fee</td>
                <td className="text-muted text-center">5%</td>
                <td className="text-muted text-center">3%</td>
                <td className="text-center">
                  <Button className="rounded text-small text-green font-medium bg-light-green hover-bg-green px-4 py-2px">
                    Contact Us
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Payment processing</td>
                <td className="text-muted text-center">2.9%</td>
                <td className="text-muted text-center">2.4%</td>
                <td className="text-center">
                  <Button className="rounded text-small text-green font-medium bg-light-green hover-bg-green px-4 py-2px">
                    Contact Us
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <h5 className="font-medium text-14 mb-0">Features</h5>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Unlimited Fundraising campaigns</td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Easy access to funds</td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Mobile Optimized</td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Basic donor data</td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Team fundraising</td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Unlimited Fundraising events</td>
                <td className="text-center"></td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
              <tr>
                <td className="text-muted">Comphensive donor data</td>
                <td className="text-center"></td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
                <td className="text-center">
                  <i className="material-icons text-green text-20">
                    check_circle
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Pricing4;
