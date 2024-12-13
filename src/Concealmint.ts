import { ponder } from "ponder:registry";

ponder.on("Concealmint:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Concealmint:ApprovalForAll", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Concealmint:BatchMetadataUpdate", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Concealmint:MetadataUpdate", async ({ event, context }) => {
  console.log(event.args);
});
