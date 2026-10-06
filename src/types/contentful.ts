/* types.ts */
import type {
  Asset,
  Entry,
  EntryFields,
  EntryFieldTypes,
  EntriesQueries,
} from "contentful";

export type INewsFields = {
  title: EntryFields.Text;
  slug: EntryFields.Text;
  date: EntryFields.Date;
  content: EntryFields.RichText;
  coverImage?: Asset | { sys: { type: string; linkType: string; id: string } };
  description: EntryFields.RichText;
};

export type INewsSkeleton = {
  contentTypeId: "news";
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    date: EntryFieldTypes.Date;
    content: EntryFieldTypes.RichText;
    coverImage: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.RichText;
  };
};

export type INewsQueryResult = ReadonlyArray<INewsSkeleton>;

export type INewsItem = Entry<INewsSkeleton, undefined, string>;
export type INewItems = Entry<INewsSkeleton, undefined, string>[];

export type IHiringJobFields = {
  jobTitle: EntryFields.Text;
  jobDescription: EntryFields.RichText;
  jobSalary: EntryFields.Text;
  jobRequirement: EntryFields.RichText;
  jobBenefit: EntryFields.RichText;
  employmentStatus: EntryFields.Text;
  slug: EntryFields.Text;
  expiredDate: EntryFields.Date;
};

export type IHiringJobSkeleton = {
  contentTypeId: "hiring";
  fields: {
    jobTitle: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    jobDescription: EntryFieldTypes.RichText;
    jobSalary: EntryFieldTypes.Symbol;
    jobRequirement: EntryFieldTypes.RichText;
    jobBenefit: EntryFieldTypes.RichText;
    employmentStatus: EntryFieldTypes.Symbol;
    expiredDate: EntryFieldTypes.Date;
  };
};

export type IHiringJobQueryResult = ReadonlyArray<IHiringJobSkeleton>;
