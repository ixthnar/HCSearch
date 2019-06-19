using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HCSearch.Models
{
    // Lowercase prop names to match json serialization
#pragma warning disable IDE1006 
    public class PersonDetailView
    {
        public int id { get; set; }
        public string nameFirst { get; set; }
        public string nameLast { get; set; }
        public string addressStreet { get; set; }
        public string addressCity { get; set; }
        public string addressState { get; set; }
        public string addressZip { get; set; }
        public string addressCountry { get; set; }
        public DateTime dateOfBirth { get; set; }
        public int age { get; set; }
        public string interests { get; set; }
        public string pictureBase64 { get; set; }
    }
}
