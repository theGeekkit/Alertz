
export interface IFeature {
  type: string;
  id: string;
  properties: {
    expires: string;
    status: string;
    messageType: string;
    urgency: string;
    severity: string;
    headline: string;
    description: string;
    event: string;
    references: { '@id': string }[];
  };
}
