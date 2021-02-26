// Import packages local
import { Taxonomy } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

const taxonomyDatabase = globalDatabase.collection<Taxonomy>("taxonomy");

const addTaxonomy = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;
  const title = value.title;

  // Validate string property
  if (title.length === 0) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  // Insert the taxononmy and return to the user
  const _id = await taxonomyDatabase.insertOne({ title });
  response.body = { _id, title };
  response.status = 200;
};

const getTaxonomies = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Get every taxonomy
  const taxonomies = await taxonomyDatabase.find();

  // Return results to the user
  if (taxonomies) {
    response.body = taxonomies;
    response.status = 200;
  } else {
    response.status = 404;
  }
};

const deleteTaxonomy = async (
  { params, response }: { params: { _id: string }; response: Response },
) => {
  // Delete the taxonomy
  const result = await taxonomyDatabase.deleteOne({ _id: ObjectId(params._id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

const updateTaxonomy = async (
  { params, request, response }: {
    params: { _id: string };
    request: Request;
    response: Response;
  },
) => {
  const _id = ObjectId(params._id);

  // Get the stored taxonomy
  const taxonomy: Taxonomy | null = await taxonomyDatabase.findOne({ _id });

  // If no taxononmy has been found
  if (!taxonomy) {
    response.status = 404;
    return;
  }

  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;
  const title = value.title;

  // Validate string property
  if (title.length === 0) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  // Update taxonomy value
  await taxonomyDatabase.updateOne({ _id: ObjectId(params._id) }, {
    title,
  });

  // Return results to the user 
  response.body = { _id, title };
  response.status = 200;
};

export { addTaxonomy, deleteTaxonomy, getTaxonomies, updateTaxonomy };
