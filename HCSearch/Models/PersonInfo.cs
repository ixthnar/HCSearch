using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HCSearch.Models
{
    public class PersonInfo
    {
        // Strings stored as NVARCHAR(255) unless otherwise stated

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Address would be normalized into a separate table for a more sophisticated application
        [MaxLength(255)]
        public string AddressStreet { get; set; }
        [MaxLength(255)]
        public string AddressCity { get; set; }
        [MaxLength(255)]
        public string AddressState { get; set; }
        [MaxLength(255)]
        public string AddressCountry { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }   // Yields age

        [MaxLength(4000)]
        public string Interests { get; set; }       // Stored as JSON array in NVARCHAR(4000)

        [Column(TypeName = "varbinary(Max)")]
        public byte[] Picture { get; set; }         // Stored as VARBINARY(MAX)
    }
}
