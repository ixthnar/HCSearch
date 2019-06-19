using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HCSearch.Models
{
    // Lowercase prop names to match json serialization
#pragma warning disable IDE1006 
    public class PersonSearchView
    {
        public int id { get; set; }
        public string nameFirst { get; set; }
        public string nameLast { get; set; }
    }
}
