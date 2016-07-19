using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class DiscoveryRepository : GeoRepository<Discovery>, IDiscoveryRepository
    {
        public DiscoveryRepository()
        {
            _entities = _context.Discoveries;
        }

        public DiscoveryRepository(TheGameContext context) : base(context) 
        {
            _entities = _context.Discoveries;
        }
    }
}