using System.Configuration;
using System.Web.Mvc;
using Faker;
using Twilio.Jwt.AccessToken;
using System.Collections.Generic;

namespace TwilioSyncQuickstart.Controllers
{
    public class TokenController : Controller
    {
        // GET: /token
        public ActionResult Index(string device)
        {
            // Load Twilio configuration from Web.config
            var accountSid = ConfigurationManager.AppSettings["TwilioAccountSid"];
            var apiKey = ConfigurationManager.AppSettings["TwilioApiKey"];
            var apiSecret = ConfigurationManager.AppSettings["TwilioApiSecret"];
            var syncServiceSid = ConfigurationManager.AppSettings["TwilioSyncServiceSid"];

            // Create a random identity for the client
            var identity = Internet.UserName();

            // Create a Sync grant for this token
            var grants = new HashSet<IGrant>
            {
                new SyncGrant
                {
                    EndpointId = $"TwilioSyncQuickstart:{identity}:{device}",
                    ServiceSid = syncServiceSid
                }
            };

            // Create an Access Token generator
            var token = new Token(accountSid, apiKey, apiSecret, identity, grants: grants);

            return Json(new
            {
                identity,
                token = token.ToJwt ()
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
