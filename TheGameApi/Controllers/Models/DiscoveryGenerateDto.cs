using System;
using TheGameApi.Models;

namespace TheGameApi.Controllers.Models
{
    public class DiscoveryGenerateDto
    {
        public GoogleLatLng Point { get; set; }
        public Guid ItemId { get; set; }
    }
}