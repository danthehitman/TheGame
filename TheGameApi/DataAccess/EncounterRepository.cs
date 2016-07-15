using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class EncounterRepository : GeoRepository<Encounter>
    {
        public EncounterRepository()
        {
            _entities = _context.Encounters;
        }
    }
}