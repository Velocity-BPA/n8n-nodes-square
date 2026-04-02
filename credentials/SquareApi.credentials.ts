import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SquareApi implements ICredentialType {
	name = 'squareApi';
	displayName = 'Square API';
	documentationUrl = 'https://developer.squareup.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
				{
					name: 'Production',
					value: 'production',
				},
			],
			default: 'sandbox',
			description: 'The Square environment to connect to',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The Client ID from your Square application',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The Client Secret from your Square application',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The OAuth2 access token for Square API access',
		},
		{
			displayName: 'Refresh Token',
			name: 'refreshToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The OAuth2 refresh token for renewing access',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://connect.squareup.com/v2',
			description: 'The base URL for Square API requests',
		},
	];
}