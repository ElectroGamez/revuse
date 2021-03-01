import { Router } from "https://deno.land/x/oak/mod.ts";

import { addMark, deleteMark, getMarks } from "./controller/mark.ts";
import {
  addLabel,
  deleteLabel,
  getLabels,
  updateLabel,
} from "./controller/label.ts";
import {
  addTaxonomy,
  deleteTaxonomy,
  getTaxonomies,
  updateTaxonomy,
} from "./controller/taxonomy.ts";

const router = new Router();

// Add the label endpoints
router.get("/label", getLabels);
router.put("/label/:_id", updateLabel);
router.post("/label", addLabel);
router.delete("/label/:_id", deleteLabel);

// Add the taxonomy endpoints
router.get("/taxonomy", getTaxonomies);
router.put("/taxonomy/:_id", updateTaxonomy);
router.post("/taxonomy", addTaxonomy);
router.delete("/taxonomy/:_id", deleteTaxonomy);

// Add the label endpoints
router.get("/mark", getMarks);
router.post("/mark", addMark);
router.delete("/mark/:_id", deleteMark);

export default router;
