import * as core from '@actions/core';
import { serviceClients, Session } from '@yandex-cloud/nodejs-sdk';

import { SetAccessBindingsRequest } from '@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/access/access';

const run = async (): Promise<void> => {
  try {
    core.info('start');
    const ycSaCredentials = JSON.parse(
      core.getInput('yc-sa-json-credentials', {
        required: true,
      }),
    );

    const containerId = core.getInput('container-id', { required: true });

    const session = new Session({
      serviceAccountJson: {
        accessKeyId: ycSaCredentials.id,
        privateKey: ycSaCredentials.private_key,
        serviceAccountId: ycSaCredentials.service_account_id,
      },
    });

    const client = session.client(serviceClients.ContainerServiceClient);

    await client.setAccessBindings(
      SetAccessBindingsRequest.fromPartial({
        resourceId: containerId,
        accessBindings: [
          {
            roleId: 'serverless.containers.invoker',
            subject: {
              id: 'allUsers',
              type: 'system',
            },
          },
        ],
      }),
    );

    core.info(`Container ${containerId} is public now`);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
};

run();
