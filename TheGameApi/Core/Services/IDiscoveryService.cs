using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public interface IDiscoveryService
    {
        Task<List<Discovery>> GenerateDiscoveriesAsync(GoogleLatLng point, Guid itemId, User user);

        Task<ILoot> ConvertToLoot(Guid discoveryId, User user);
    }
}
