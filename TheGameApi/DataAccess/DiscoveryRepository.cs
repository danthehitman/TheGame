using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class DiscoveryRepository : GeoRepository<Discovery>
    {
        public DiscoveryRepository()
        {
            _entities = _context.Discoveries;
        }
    }
}