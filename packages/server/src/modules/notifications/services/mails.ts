import mailClient, { MailDataRequired } from "@sendgrid/mail";
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

interface TemplateConfig {
  templateId: string;
  asmGroupId?: number;
  trackingSettings?: MailDataRequired["trackingSettings"];
}

const TEMPLATE_NAME_TO_CONFIG: {
  [k in TemplateName]: TemplateConfig;
} = {
  "login-magic-link": {
    templateId: "d-a64abce41def4af0915688059ed632ac",
    trackingSettings: {
      clickTracking: {
        enable: false,
        enableText: false,
      },
    },
  },
};

type TemplateName = keyof TemplateData;

export async function sendMail<T extends TemplateName>(
  to: string,
  templateName: T,
  templateData: TemplateData[T]
) {
  const templateConfig = TEMPLATE_NAME_TO_CONFIG[templateName];

  if (!templateConfig) {
    throw new Error(`Could not find config for email ${templateName}`);
  }

  await doSendEmail({
    to,
    templateConfig,
    templateData,
  });
}

async function doSendEmail({
  to,
  templateConfig,
  templateData,
}: {
  to: string;
  templateConfig: TemplateConfig;
  templateData: TemplateData[TemplateName];
}) {
  try {
    await mailClient.send({
      from: {
        email: MAIL_SENDER,
        name: MAIL_NAME,
      },
      templateId: templateConfig.templateId,
      ...(templateConfig.asmGroupId
        ? {
            asm: {
              groupId: templateConfig.asmGroupId,
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
      ...(templateConfig.trackingSettings || {}),
    });
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
