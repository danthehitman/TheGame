using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Threading.Tasks;
using DotSpatial.Topology;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public class DiscoveryService : IDiscoveryService
    {
        private IItemRepository _itemRepo;
        private IJunkRepository _junkRepo;
        private IItemTypeRepository _itemTypeRepo;
        private IJunkTypeRepository _junkTypeRepo;
        private IDiscoveryRepository _discoveryRepo;

        public DiscoveryService(IItemRepository itemRepo, IJunkRepository junkRepo, IDiscoveryRepository discoveryRepo, 
            IJunkTypeRepository junkTypeRepo, IItemTypeRepository itemTypeRepo)
        {
            _itemRepo = itemRepo;
            _junkRepo = junkRepo;
            _itemTypeRepo = itemTypeRepo;
            _junkTypeRepo = junkTypeRepo;
            _discoveryRepo = discoveryRepo;
        }

        public async Task<List<Discovery>> GenerateDiscoveriesAsync(GoogleLatLng point, Guid itemId, User user)
        {
            var item = await _itemRepo.All.Include(i => i.Type).SingleOrDefaultAsync(i => i.Id.Value == itemId);
            var bufferBase = 0.002;
            var bufferMultiplier = item.Effectiveness * item.Type.ClassMultiplier;
            var buffer = bufferBase * bufferMultiplier;

            Point pt = new Point(point.Lat, point.Lng);
            Polygon pg = pt.Buffer(buffer) as Polygon;

            List<Discovery> discoveries = new List<Discovery>();

            Envelope env = pg.Envelope as Envelope;

            var sw = env.BottomLeft();
            var ne = env.TopRight();

            var rand = new Random();

            var max = GetMaxForScannerRadiusAndEffectiveness(bufferMultiplier, item.Effectiveness);
            for (var i = 0; i <= max; i++)
            {
                var ptLat = rand.NextDouble() * (ne.X - sw.X) + sw.X;
                var ptLng = rand.NextDouble() * (ne.Y - sw.Y) + sw.Y;

                Point p = new Point(ptLat, ptLng);
                if (pg.Contains(p))
                {
                    var discovery = new Discovery()
                    {
                        Date = DateTime.UtcNow,
                        DiscovererId = user.Id,
                        Geometry = DbGeometry.FromText(p.ToText())
                    };
                    _discoveryRepo.InsertOrUpdate(discovery);
                    discoveries.Add(discovery);
                }
            }
            await _discoveryRepo.SaveAsync();
            return discoveries;
        }

        public async Task<ILoot> ConvertToLoot(Guid discoveryId, User user)
        {
            ILoot  loot;
            var random = new Random();
            var chance = random.NextDouble();
            if (chance < 0.90)
            {
                loot = await ConvertToJunk(random, user);
            }
            else if (chance < 0.95)
            {
                var ammount = random.Next(1, 10);
                user.Gold += ammount;
                loot = new GoldLoot { Ammount = ammount };
            }
            else
            {
                loot = await ConvertToItem(random, user);
            }

            await _discoveryRepo.DeleteAsync(discoveryId);
            return loot;
        }

        private async Task<Item> ConvertToItem(Random random, User user)
        {
            ItemType itemType = null;
            var rarity = getWeightedRandomRarity(random);
            while (rarity > 0)
            {
                itemType = _itemTypeRepo.All.Where(i => i.Rarity == rarity).OrderBy(r => Guid.NewGuid()).Take(1).FirstOrDefault();
                if (itemType == null)
                    rarity -= 1;
                else
                    break;
            }
            var randomEffectiveness = random.Next(itemType.MinEffectiveness, itemType.MaxEffectiveness);
            var randomUses = random.Next(itemType.MinUses, itemType.MaxUses);
            var theItem = new Item() {
                Description = itemType.Description,
                Name = itemType.Description,
                OwnerId = user.Id,
                TypeId = itemType.Id.Value,
                Uses = randomUses,
                Effectiveness = randomEffectiveness,
                Quality = GetRandomQuality(random)
            };
            _itemRepo.InsertOrUpdate(theItem);
            await _itemRepo.SaveAsync();
            theItem.Type = itemType;
            return theItem;
        }

        private async Task<Junk> ConvertToJunk(Random random, User user)
        {
            JunkType junkType = null;
            var rarity = getWeightedRandomRarity(random);
            while (rarity > 0)
            {
                junkType = _junkTypeRepo.All.Where(i => i.Rarity == rarity).OrderBy(r => Guid.NewGuid()).Take(1).FirstOrDefault();
                if (junkType == null)
                    rarity -= 1;
                else
                    break;
            }

            var theJunk = new Junk()
            {
                OwnerId = user.Id,
                TypeId = junkType.Id.Value,
                Quality = GetRandomQuality(random)
            };
            _junkRepo.InsertOrUpdate(theJunk);
            await _junkRepo.SaveAsync();
            theJunk.Type = junkType;
            return theJunk;
        }

        private int getWeightedRandomRarity(Random random)
        {
            var chance = random.NextDouble();
            if (chance < 0.50)
                return 1;
            else if (chance < 0.80)
                return 2;
            else if (chance < 0.92)
                return 3;
            else if (chance < 0.97)
                return 4;
            else
                return 5;
        }

        private Quality GetRandomQuality(Random random)
        {
            Array values = Enum.GetValues(typeof(Quality));
            //Cannot be new so -1 on values length.
            return (Quality)values.GetValue(random.Next(values.Length -1));
        }

        private int GetMaxForScannerRadiusAndEffectiveness(int multiplier, int effectiveness)
        {
            var maxBase = 5;
            return (int)Math.Round((maxBase * (effectiveness * .5)) * multiplier);
        }
    }
}