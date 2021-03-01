// Import packages local
import { Label, Mark } from "../interface.ts";
import { globalDatabase } from "../database.ts";

// Import packages from URL
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/ts/types.ts";
import { Request, Response } from "https://deno.land/x/oak/mod.ts";

const labelDatabase = globalDatabase.collection<Label>("labels");
const markDatabase = globalDatabase.collection<Mark>("marks");

const addLabel = async (
  { request, response }: { request: Request; response: Response },
) => {
  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const emoji = value.emoji;
  const title = value.title;
  const offset = value.offset;
  const divider = value.divider;

  if (emoji.length === 0) {
    response.body = `Invalid 'emoji' property`;
    response.status = 400;
    return;
  }

  if (title.length === 0) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  if (isNaN(+divider!)) {
    response.body = `Invalid 'divider' property`;
    response.status = 400;
    return;
  }

  if (isNaN(+offset!)) {
    response.body = `Invalid 'offset' property`;
    response.status = 400;
    return;
  }

  // Insert the label and return to the user
  const _id = await labelDatabase.insertOne({ emoji, title, divider, offset });
  response.body = { _id, emoji, title, divider, offset };
  response.status = 200;
};

const getLabels = async (
  { request, response }: { request: Request; response: Response },
) => {
  let limit = request.url.searchParams.get(`limit`)
    ? request.url.searchParams.get(`limit`)
    : 5;

  let offset = request.url.searchParams.get(`offset`)
    ? request.url.searchParams.get(`offset`)
    : 0;

  // Validate limit is a number
  if (isNaN(+offset!)) {
    response.body = `Invalid 'limit' property`;
    response.status = 400;
    return;
  }

  // Validate offset is a number
  if (isNaN(+offset!)) {
    response.body = `Invalid 'offset' property`;
    response.status = 400;
    return;
  }

  // Transform the strings into numbers
  limit = Number(limit);
  offset = Number(offset);

  // Get every label
  const labels = await labelDatabase.find().limit(limit).skip(offset);
  const total = await labelDatabase.count();

  // Return results to the user
  if (labels) {
    response.status = 200;
    response.body = {
      labels,
      offset,
      total,
    };
  }

  response.status = 404;
};

const deleteLabel = async (
  { params, response }: { params: { _id: string }; response: Response },
) => {
  // Delete marks with refrences to the label
  await markDatabase.find({ label: ObjectId(params._id) });

  // Delete the label
  const result = await labelDatabase.deleteOne({ _id: ObjectId(params._id) });

  // Return results to the user
  response.status = result ? 204 : 404;
};

const updateLabel = async (
  { params, request, response }: {
    params: { _id: string };
    request: Request;
    response: Response;
  },
) => {
  const _id = ObjectId(params._id);

  // Get the stored label
  const label: Label | null = await labelDatabase.findOne({ _id });

  // If no label has been found
  if (!label) {
    response.status = 404;
    return;
  }

  // Fetch the body parameters
  const body = await request.body();
  const value = await body.value;

  const emoji = value.emoji;
  const title = value.title;
  const offset = value.offset;
  const divider = value.divider;

  if (emoji.length === 0) {
    response.body = `Invalid 'emoji' property`;
    response.status = 400;
    return;
  }

  if (title.length === 0) {
    response.body = `Invalid 'title' property`;
    response.status = 400;
    return;
  }

  if (isNaN(+divider!)) {
    response.body = `Invalid 'divider' property`;
    response.status = 400;
    return;
  }

  if (isNaN(+offset!)) {
    response.body = `Invalid 'offset' property`;
    response.status = 400;
    return;
  }

  // Update label value
  await labelDatabase.updateOne({ _id }, {
    emoji,
    title,
    divider,
    offset,
  });

  // Return results to the user
  response.body = { _id, emoji, title, divider, offset };
  response.status = 200;
};

export { addLabel, deleteLabel, getLabels, updateLabel };
