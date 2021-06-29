import React from "react";
import { Grid, Card, Avatar } from "@material-ui/core";

const StatCard = ({ score, imageUrl, label, className }) => {


  return (
    <Card elevation={3} className={`p-3 flex-column justify-center items-center ${className}`}>
      <h3 className={`mt-1 text-32 ${score < 7 ? "bg-danger" : score < 8 ? "bg-warning" : "bg-light"}`}>{score.toLocaleString()}/10</h3>
      <p className="m-0 text-muted">{label}</p>
    </Card>
  );
};

export default StatCard;
