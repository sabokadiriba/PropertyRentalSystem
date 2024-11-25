using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
namespace PROPERTYRENTALPORTALAPI.Models.Domain
{
    public class ApplicationUser:IdentityUser
    {
        [Required]  // Ensures that FullName is required
        [StringLength(100, ErrorMessage = "Full Name can't be longer than 100 characters.")]
        public string FullName { get; set; }    
        public DateTime CreatedDate { get; set; }
      

      


    }

}
