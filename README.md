# Sync Quickstart for C# (ASP.NET MVC)

This application should give you a ready-made starting point for writing your
own real-time apps with Sync. Before we begin, we need to collect
all the config values we need to run the application:

| Config Values  | Description |
| :-------------  |:------------- |
Service Instance SID | A [service](https://www.twilio.com/docs/api/sync/rest/services) instance where all the data for our application is stored and scoped. Generate one using the command below.
Account SID | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
API Key | Used to authenticate - [generate one here in the console](https://www.twilio.com/console/dev-tools/api-keys).
API Secret | Used to authenticate - [just like the above, you can use the console to generate one here](https://www.twilio.com/console/dev-tools/api-keys).

## Temporary: Generating a Service Instance

During the Sync developer preview, you will need to generate Sync service
instances via API until the Console GUI is available. Using the API key pair you
generated above, generate a service instance via REST API with this PowerShell command:

```powershell
Invoke-WebRequest https://preview.twilio.com/Sync/Services `
 -Method POST `
 -Body @{FriendlyName="MySyncServiceInstance"} `
 -Credential (Get-Credential)
```

When prompted, provide your API Key as the user and your API Secret as the password.

If you prefer to use `curl`, the command would be:

```bash
curl -X POST https://preview.twilio.com/Sync/Services \
 -d 'FriendlyName=MySyncServiceInstance' \
 -u 'SKXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_api_secret'
```

## A Note on API Keys

When you generate an API key pair at the URLs above, your API Secret will only
be shown once - make sure to save this in a secure location, 
or possibly your system environment variables.

## Setting Up The Application

After downloading the repo, copy the `TwilioSyncQuickstart/Web.config.example` to
`Web.config` in the same directory. Next, open up `TwilioSyncQuickstart.sln` in
Visual Studio.  Edit `Web.config` with the four values we obtained above:

```xml
<appSettings>
	<add key="TwilioAccountSid" value="ACxxx" />
	<add key="TwilioApiKey" value="SKxxx" />
	<add key="TwilioApiSecret" value="xxxxxxxx" />
	<add key="TwilioSyncServiceSid" value="ISxxxx" />
</appSettings>
```

You should now be ready to rock! Hit `F5` or the Play button, and you should 
land on the home page of our basic Sync application. Open it up in a few browser
tabs and play with the app!

![screenshot of chat app](https://s3.amazonaws.com/howtodocs/quickstart/ipm-browser-quickstart.png)

## License

MIT
