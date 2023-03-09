using System.ComponentModel.DataAnnotations;
using SantaWeb.Domain;

namespace SantaWeb.Features.NaughtyNiceList
{
    public class NewNaughtyNice
    {
        [Required]
        [StringLength(100, MinimumLength = 3)] 
        public string Name { get; set; }
        
        public NaughtyNiceType? Status { get; set; }
    }
}