import { Database } from "https://deno.land/x/aloedb/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface ILabel {
  emoji: string;
  titel: string;
  uuid: string;
}

const labelDatabase = new Database<ILabel>(`./database/label.json`);

const addLabel = async ({ request, response }: { request: any; response: any }) => {
  const body = await request.body();
  const value = await body.value;
  const label = {
    uuid: v4.generate(),
    emoji: value.emoji,
    titel: value.title,
  }

  labelDatabase.insertOne(label);

  response.body = label;
  response.status = 200;
}

const getLabels = async ({ request, response }: { request: any; response: any }) => {
  const labels = await labelDatabase.findMany();

  if (labels) {
    response.status = 200;
    response.body = labels;
  } else {
    response.status = 404
  }
}

const deleteLabel = async ({ params, response }: { params: { uuid: string }; response: any }) => {
  const uuid = params.uuid;
  const result = await labelDatabase.deleteOne({ uuid });
 
  if (result) response.status = 204;
  else response.status = 404;
}

const updateLabel = async ({ params, request, response }: { params: { uuid: string }; request: any; response: any }) => {
  const uuid = params.uuid;
  const label: ILabel | null = await labelDatabase.findOne({ uuid });

  if (label) {
    const body = await request.body();
    const value = await body.value;
   
    await labelDatabase.updateOne({ uuid }, value);
    const label = await labelDatabase.findOne({ uuid });

    response.status = 200
    response.body = label
  } else {
    response.status = 404;
  }  
}

export { addLabel, getLabels, deleteLabel, updateLabel }