import React from "react";
import { richDocument } from "@/lib/content";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { renderContenfulOptions } from "../NewsAndActivities/NewsBody";

const HiringBody = ({ content }: { content: any }) => {
  return (
    <div className=" contentful-container">
      {documentToReactComponents(richDocument(content), renderContenfulOptions)}
    </div>
  );
};

export default HiringBody;
