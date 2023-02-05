import mailClient from "@sendgrid/mail";
import invariant from "tiny-invariant";
import { logger } from "../../../logger";

export const mails = {
  sendMail,
};

const MAIL_SENDER = "contact@atelierogre.org";
const MAIL_NAME = "L'Équipe OGRE";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: `${__dirname}/../../../../.env` });

const MAIL_API_KEY = process.env.SENDGRID_API_KEY;
invariant(MAIL_API_KEY, "SENDGRID_API_KEY must be set in env variables.");
mailClient.setApiKey(MAIL_API_KEY);

interface TemplateData {
  "login-magic-link": {
    url: string;
  };
}

const TEMPLATE_NAME_TO_CONFIG: {
  [k in TemplateName]: { templateId: string; asmGroupId?: number };
} = {
  "login-magic-link": {
    templateId: "d-a64abce41def4af0915688059ed632ac",
  },
};

type TemplateName = keyof TemplateData;

export async function sendMail<T extends TemplateName>(
  to: string,
  templateName: T,
  templateData: TemplateData[T]
) {
  const config = TEMPLATE_NAME_TO_CONFIG[templateName];

  if (!config) {
    throw new Error(`Could not find config for email ${templateName}`);
  }

  await doSendEmail({
    to,
    templateData,
    templateId: config.templateId,
    asmGroupId: config.asmGroupId,
  });
}

async function doSendEmail({
  to,
  templateId,
  templateData,
  asmGroupId,
}: {
  to: string;
  templateId: string;
  templateData: TemplateData[TemplateName];
  asmGroupId?: number;
}) {
  try {
    await mailClient.send({
      from: {
        email: MAIL_SENDER,
        name: MAIL_NAME,
      },
      templateId,
      ...(asmGroupId
        ? {
            asm: {
              groupId: asmGroupId,
            },
          }
        : {}),
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          dynamicTemplateData: templateData as any,
        },
      ],
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
