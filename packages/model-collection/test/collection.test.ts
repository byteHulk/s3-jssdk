/**
 * @jest-environment s3network
 */

import { Composite } from "@composedb/devtools";

import { S3ModelCollectionModel } from "../src";

const collectionSchema = `
  type ModelCollection @createModel(accountRelation: LIST, description: "model collection of someone in us3r.network") {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    modelID: StreamID!
    notes: String @string(maxLength: 1000)
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
`;

describe("client", () => {
  let composite: Composite;
  let s3ModelCollection: S3ModelCollectionModel;
  beforeAll(async () => {
    composite = await Composite.create({
      ceramic,
      schema: collectionSchema,
    });
    s3ModelCollection = new S3ModelCollectionModel(
      ceramic,
      composite.toRuntime()
    );
  });

  test("create profile success", async () => {
    const resp = await s3ModelCollection.createCollection({
      modelID:
        "kjzl6hvfrbw6ca858e5ozptovebwts1bpq9vw8hzdqk5oi2y18g8u0fq1dxavrf",
    });

    expect(resp.errors).not.toBeDefined();
    expect(resp.data?.createModelCollection.document.id).not.toBeNull();
    const id = resp.data?.createModelCollection.document.id || "";

    const updateResp = await s3ModelCollection.updateCollection(id, {
      revoke: true,
    });
    expect(updateResp.errors).not.toBeDefined();
  });

  test("query personals success", async () => {
    const resp = await s3ModelCollection.queryPersonalCollections({
      first: 1000,
    });
    const modelCollectionList = resp.data?.viewer.modelCollectionList;
    expect(resp.errors).not.toBeDefined();
    expect(modelCollectionList).not.toBeNull();
    expect(modelCollectionList?.edges.length).toBe(1);
  });
});
