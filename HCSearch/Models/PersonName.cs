using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HCSearch.Models
{
    public class PersonName
    {
        // Strings stored as NVARCHAR(255) unless otherwise stated

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("PersonInfo")]
        public int PersonInfoFK { get; set; }

        [MaxLength(255), Required]
        public string NameFirst { get; set; }
        [MaxLength(255), Required]
        public string NameLast { get; set; }
    }
}
