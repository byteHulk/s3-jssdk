import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { S3Model } from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as collectionDefinition } from "./collection-runtime-composite";
export type Creator = {
  id: string;
};

export type DateTime = string;

export type Collection = {
  creator?: Creator;
  modelID: string;
  notes?: string;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};

export class S3ModelCollectionModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (collectionDefinition as RuntimeCompositeDefinition)
    );
  }

  public async createCollection(collection: Collection) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation CreateModelCollection($input: CreateModelCollectionInput!) {
        createModelCollection(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      createModelCollection: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: { ...collection, createAt: new Date().toISOString() },
      },
    });

    return res;
  }

  public async updateCollection(id: string, collection: Partial<Collection>) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation UpdateModelCollection($input: UpdateModelCollectionInput!) {
        updateModelCollection(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      updateModelCollection: { document: { id: string } };
    }>(createMutation, {
      input: {
        id,
        content: { ...collection, modifiedAt: new Date().toISOString() },
      },
    });

    return res;
  }

  public async queryPersonalCollections({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const modelCollectionListData = await composeClient.executeQuery<{
      viewer: {
        modelCollectionList: Page<Collection>;
      };
    }>(`
      query {
        viewer {
          modelCollectionList(first: ${first}, after: "${after}") {
            edges {
              node {
                notes
                revoke
                modelID
                createAt
                modifiedAt
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return modelCollectionListData;
  }
}
