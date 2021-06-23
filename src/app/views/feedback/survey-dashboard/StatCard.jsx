import React from "react";
import { Grid, Card, Avatar } from "@material-ui/core";

const StatCard = ({ score, imageUrl, label, className }) => {


  return (
    <Card elevation={3} className={`p-5 flex ${className}`}>
      {imageUrl && <Avatar className='w-48 h-48' src={imageUrl} />}
      <div className="ml-4">
        <h3 className={`mt-1 text-32 ${score < 7 ? "bg-danger" : score < 8 ? "bg-warning" : "bg-light"}`}>{score.toLocaleString()}</h3>
        <p className="m-0 text-muted">{label}</p>
      </div>
    </Card>
  );
};

export default StatCard;
