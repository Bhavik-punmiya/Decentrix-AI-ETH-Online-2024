require('dotenv').config()

import {spawn} from 'child_process';

const TIMEOUT_SECONDS: number = 60 * 60

const getTimestamp = (): string => {
  return new Date().toISOString()
}

async function main(): Promise<void> {
  const command = 'npx';
  const contractAddress = process.env.TEST_CONTRACT_ADDRESS
  const oracleAddress = process.env.TEST_ORACLE_ADDRESS
  const network = process.env.TEST_NETWORK
  const slackWebHookUrl = process.env.TEST_SLACK_WEBHOOK_URL
  if (!contractAddress) {
    console.log(getTimestamp(), ".env is missing TEST_CONTRACT_ADDRESS")
    return
  }
  if (!oracleAddress) {
    console.log(getTimestamp(), ".env is missing ORACLE_ADDRESS")
    return
  }
  if (!network) {
    console.log(getTimestamp(), ".env is missing TEST_NETWORK")
    return
  }
  if (!slackWebHookUrl) {
    console.log(getTimestamp(), ".env is missing TEST_SLACK_WEBHOOK_URL")
    return
  }
  const args: string[] = [
    "hardhat",
    "e2e",
    "--contract-address", contractAddress,
    "--oracle-address", oracleAddress,
    "--network", network
  ];

  let previousResult = false;
  while (true) {
    console.log(getTimestamp(), `Running e2e tests with `)
    previousResult = await runTests(command, args, slackWebHookUrl, previousResult)
    console.log(getTimestamp(), `Run done, sleeping for ${TIMEOUT_SECONDS} seconds`)
    await new Promise((resolve) => setTimeout(resolve, TIMEOUT_SECONDS * 1000));
  }
}

async function runTests(
  command: string,
  args: string[],
  slackWebHookUrl: string,
  previousResult: boolean
): Promise<boolean> {
  let isSuccess = false;
  let stdoutData = '';
  let stderrData = '';
  try {
    isSuccess = await new Promise((resolve) => {
      const childProcess = spawn(command, args, { shell: true });

      childProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
        console.log(data.toString());
      });

      childProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error(getTimestamp(), data.toString());
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  } catch (e: any) {
    console.error(getTimestamp(), e.message);
    await postSlackMessage(
      e.message,
      slackWebHookUrl,
    );
  }

  // If isSuccess is false, you might want to send a message to Slack here as well
  if (!isSuccess || (isSuccess && !previousResult)) {
    await postSlackMessage(
      stdoutData.length > 0 ? stdoutData : stderrData,
      slackWebHookUrl,
    );
  }

  return isSuccess;
}

async function postSlackMessage(
  output: string,
  webhookUrl: string,
) {
  try {
    await fetch(
      webhookUrl,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "```" + output +"```"
              }
            }
          ]
        })
      }
    )
  } catch (e: any) {
    console.error(getTimestamp(), "Failed to post msg to slack", e.message)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(getTimestamp(), error);
    process.exit(1);
  });