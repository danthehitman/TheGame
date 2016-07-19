using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Threading.Tasks;
using DotSpatial.Topology;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public class DiscoveryService
    {
        private ItemRepository _itemRepo;
        private DiscoveryRepository _discoveryRepo;

        public DiscoveryService()
        {
            _itemRepo = new ItemRepository();
            _discoveryRepo = new DiscoveryRepository();
        }

        public async Task<List<Discovery>> GenerateDiscoveriesAsync(GoogleLatLng point, Guid itemId, User user)
        {
            var item = await _itemRepo.FindAsync(itemId);
            var bufferBase = 0.01;
            var bufferMultiplier = item.Effectiveness * item.Type.ClassMultiplier;
            var buffer = bufferBase * bufferMultiplier;

            Point pt = new Point(point.Lat, point.Lng);
            Polygon pg = pt.Buffer(buffer) as Polygon;

            List<Discovery> discoveries = new List<Discovery>();

            Envelope env = pg.Envelope as Envelope;

            var sw = env.BottomLeft();
            var ne = env.TopRight();

            var rand = new Random();
            for (var i = 0; i < 100; i++)
            {
                var ptLat = rand.NextDouble() * (ne.X - sw.X) + sw.X;
                var ptLng = rand.NextDouble() * (ne.Y - sw.Y) + sw.Y;

                Point p = new Point(ptLat, ptLng);
                if (pg.Contains(p))
                {
                    var discovery = new Discovery()
                    {
                        Date = DateTime.UtcNow,
                        Discoverer = user,
                        Geometry = DbGeometry.FromText(p.ToText())
                    };
                    _discoveryRepo.InsertOrUpdate(discovery);
                    discoveries.Add(discovery);
                }
            }
            await _discoveryRepo.SaveAsync();
            return discoveries;
        }
    }
}