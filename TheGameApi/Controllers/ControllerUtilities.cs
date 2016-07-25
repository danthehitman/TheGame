using System;
using System.Linq;
using System.Net.Http;

namespace TheGameApi.Controllers
{
    public class ControllerUtilities
    {
        public static Guid GetAuthToken(HttpRequestMessage request)
        {
            Guid result = Guid.Empty;
            Guid.TryParse(request.Headers.GetValues("auth").FirstOrDefault(), out result);
            return result;
        }
    }
}