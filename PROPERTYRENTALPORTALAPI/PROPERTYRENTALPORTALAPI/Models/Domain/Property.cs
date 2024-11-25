using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace PROPERTYRENTALPORTALAPI.Models.Domain
{
    public class Property
    {
        [Key]
        public int PropertyId { get; set; }

        [Required]  // Ensures that OwnerId is not null or empty
        public string OwnerId { get; set; }

        public ApplicationUser Owner { get; set; } // Navigational property

        [Required]  // Title is required
        [StringLength(100, ErrorMessage = "Title can't be longer than 100 characters.")]
        public string Title { get; set; }

        [StringLength(500, ErrorMessage = "Description can't be longer than 500 characters.")]
        public string Description { get; set; }

        [Required]  // PropertyType is required
        [StringLength(50, ErrorMessage = "PropertyType can't be longer than 50 characters.")]
        public string PropertyType { get; set; } // Apartment, House

        [StringLength(100, ErrorMessage = "County can't be longer than 100 characters.")]
        public string County { get; set; }

        [Required]  // City is required
        [StringLength(100, ErrorMessage = "City can't be longer than 100 characters.")]
        public string City { get; set; }

        [Required]  // State is required
        [StringLength(50, ErrorMessage = "State can't be longer than 50 characters.")]
        public string State { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive value.")]
        [Precision(18, 2)]  // Specify precision and scale for decimal values
        public decimal Price { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Bedrooms must be at least 1.")]
        public int Bedrooms { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Bathrooms must be at least 1.")]
        public int Bathrooms { get; set; }

        [Required]
        public bool ParkingIncluded { get; set; } // New field for parking availability

        [Required]
        public bool PetsAllowed { get; set; } // New field for pets allowance

        [Required]
        [StringLength(50, ErrorMessage = "Furnishing status can't be longer than 50 characters.")]
        public string Furnished { get; set; } // New field for furnishing status (None, Semi, Fully)

        [StringLength(500, ErrorMessage = "Additional Notes can't be longer than 500 characters.")]
        public string AdditionalNotes { get; set; } // New field for additional notes

        public bool IsAvailable { get; set; }

        public DateTime CreatedDate { get; set; }

        // Requests related to this property can be added as needed
    }
}
